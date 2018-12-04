"use strict";

/**
 * TransWorker - Inter thread method invocation helper class for the WebWorker.
 *
 * This class offers different implementations for its role on the context.
 *
 * In the main thread, It creates WebWorker instance and creates wrapper
 * functions for all the methods declared in the prototypes of the class given
 * in the parameters.
 *
 * The wrapper method sends a message to the worker with the method name and
 * all the parameter.
 *
 * When the worker side instance received the message, it invokes the method
 * specified by the name in the message with the parameters.
 * The return value will be notified by the message to the main thread
 * instance from the worker.
 *
 * The main thread instance that received the notification notifies the value
 * to the callback function given at first invocation.
 *
 * LICENSE
 *
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2017 Koji Takami(vzg03566@gmail.com)
 *
 * @constructor
 */
function TransWorker(){}

const globalContext = (Function("return this;")());
let globalContextName = globalContext.constructor.name;
if(!globalContextName) {
    // Browser is NOT webkit, perhaps IE11
    if(globalContext == "[object Window]") {
        globalContextName = "Window";
    } else if(globalContext == "[object WorkerGlobalScope]") {
        globalContextName = "DedicatedWorkerGlobalScope";
    }
}

TransWorker.context = globalContextName;

/**
 * Create for UI-thread
 *
 * @param {string} urlDerivedWorker url to Worker process.
 *      It must be a sub-class of worker-side TransWorker.
 * @param {Function} clientCtor client-class constructor.
 * @param {object} thisObject this object for callback function.
 * @param {object} notifyHandlers notify handlers hash:
 *      key: name of notify, value: function object
 * @returns {Transworker} The created Transworker instance.
 */
TransWorker.createInvoker = function(
        urlDerivedWorker, clientCtor,
        thisObject, notifyHandlers)
{
    const transworker = new TransWorker();
    transworker.createInvoker(
        urlDerivedWorker, clientCtor,
        thisObject, notifyHandlers);
    return transworker;
};

/**
 * Create for UI-thread
 *
 * @param {string} urlDerivedWorker url to Worker process.
 *      It must be a sub-class of worker-side TransWorker.
 * @param {Function} clientCtor client-class constructor.
 * @param {object} thisObject this object for callback function.
 * @param {object} notifyHandlers notify handlers hash:
 *      key: name of notify, value: function object
 * @returns {undefined}
 */
TransWorker.prototype.createInvoker = function(
        urlDerivedWorker, clientCtor,
        thisObject, notifyHandlers)
{
    // Load dedicated worker
    this.worker = new Worker(urlDerivedWorker);

    // Create prototype entries same to the client
    this.createWrappers(Object.keys(clientCtor.prototype));

    // Receive message from worker thread
    this.callbacks = {};
    this.queryId = 0;
    this.onNotify = {};
    this.worker.onmessage = (function(wkr) {
        return function(e) {
            switch(e.data.type) {
            case 'response':
                try {
                    wkr.callbacks[e.data.queryId].apply(
                            thisObject, e.data.param);
                } catch(ex) {
                    console.warn("*** exception: ", ex,
                        "in method", e.data.method, "params:",
                        JSON.stringify(e.data.param));
                }
                delete wkr.callbacks[e.data.queryId];
                break;
            case 'notify':
                try {
                    wkr.onNotify[e.data.name](
                            e.data.param);
                } catch(ex) {
                    console.warn("*** exception: ", ex,
                        "in notify", e.data.name, "params:",
                        JSON.stringify(e.data.param));
                }
                break;
            }
        };
    }(this));

    // Entry the handlers to receive notifies
    notifyHandlers = notifyHandlers || {};
    Object.keys(notifyHandlers).forEach(function (key) {
        this.onNotify[key] = function() {
            notifyHandlers[key].apply(
                    thisObject, arguments);
        };
    }, this);

};

/**
 * Register a notification to receive a message from the worker thread.
 * @param {string} name A notification name.
 * @param {Function} handler A notification handler.
 * @returns {undefined}
 */
TransWorker.prototype.subscribe = function(name, handler) {
    if(!handler || typeof(handler) !== "function") {
        throw new Error(`Could not subscribe to '${name}' with the handler of non-function`);
    }
    if(name in this.onNotify) {
        throw new Error(`Could not subscribe to '${name}' because it already exists`);
    }
    this.onNotify[name] = (...args) => handler.apply(this, args);
};

/**
 * Create wrapper methods to send message to the worker
 * @param {Array<string>} methodNames An array of method names to override.
 * @returns {undefined}
 */
TransWorker.prototype.createWrappers = function(
        methodNames)
{
    for(const methodName of methodNames) {
        TransWorker.prototype[methodName] = this.wrapper(methodName);
    }
};

/**
 * Create client method wrapper
 * @param {string} methodName A method name to override.
 * @returns {Function} A wrapper function.
 */
TransWorker.prototype.wrapper = function(
        methodName)
{
    return function() {
        const queryId = this.queryId++;
        let param = Array.from(arguments);
        if(param.length > 0 && typeof(param.slice(-1)[0]) === "function") {
            this.callbacks[queryId] = param.splice(-1, 1)[0];
        } else {
            this.callbacks[queryId] = (()=>{});
        }
        this.worker.postMessage({
            method: methodName,
            param: param,
            queryId: queryId
        });
    };
};

/**
 * Create Worker side TransWorker instance.
 *
 * @param {object} client An instance of the client class.
 * @returns {TransWorker} an instance of TransWorker.
 */
TransWorker.createWorker = function(client) {
    const transworker = new TransWorker();
    if(typeof(client) == 'function') {
        client = new client();
    }
    transworker.createWorker(client);
    return transworker;
};

/**
 * Create Worker side TransWorker instance.
 *
 * @param {object} client A instance of the client class.
 * @returns {undefined}
 */
TransWorker.prototype.createWorker = function(client) {
    this.worker = globalContext;
    this.client = client;

    // Make the client to be able to use this module
    this.client._transworker = this;

    (function(wkr) {

        // Override subclas methods by this context
        Object.keys(wkr.constructor.prototype)
        .forEach(function(m) {
            wkr.client[m] = function() {
                wkr.constructor.prototype[m].apply(
                    wkr, arguments);
            };
        });

        // On receive a message, invoke the client
        // method and post back its value.
        wkr.worker.onmessage = function(e) {
            try {
                //return the value to UI-thread
                wkr.worker.postMessage({
                    type:'response',
                    queryId: e.data.queryId,
                    method: e.data.method,
                    param: [
                        wkr.client[e.data.method]
                        .apply(
                            wkr.client,
                            e.data.param)
                    ]
                });
            } catch(ex) {
                console.warn("*** exception: ", ex,
                    "in method", e.data.method, "params:",
                    JSON.stringify(e.data.param));
            }
        };
    }(this));
};

/**
 * Post a notify to the UI-thread TransWorker instance
 * @param {string} name A message name.
 * @param {any} param A message parameters.
 * @returns {undefined}
 */
TransWorker.prototype.postNotify = function(
        name, param)
{
    this.worker.postMessage({
        type:'notify',
        name: name,
        param: param
    });
};

// Exports
if(TransWorker.context == 'Window') {

    TransWorker.create = TransWorker.createInvoker;
    TransWorker.prototype.create = TransWorker.prototype.createInvoker;
}
else if( TransWorker.context == 'DedicatedWorkerGlobalScope'
        || TransWorker.context == 'WorkerGlobalScope')
{
    TransWorker.create = TransWorker.createWorker;
    TransWorker.prototype.create = TransWorker.prototype.createWorker;
}

globalContext.TransWorker = TransWorker;
try {
    module.exports = TransWorker;
} catch(err) {
    // none
}
