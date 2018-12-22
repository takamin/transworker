"use strict";
const uuidv4 = require("uuid/v4");

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
 * Create instance for main thread.
 *
 * @param {string} workerUrl A worker url. It must use TransWorker.
 * @param {Function} clientCtor client-class constructor.
 * @param {object} thisObject (Optional) A caller of callback and notification.
 * @param {object} notifyHandlers A map a notification name to the handler.
 * @returns {Transworker} The created Transworker instance.
 */
TransWorker.createInvoker = function(
        workerUrl, clientCtor,
        thisObject, notifyHandlers)
{
    const transworker = new TransWorker();
    transworker._shared = false;
    transworker.createInvoker(
        workerUrl, clientCtor,
        thisObject, notifyHandlers);
    return transworker;
};

/**
 * Create instance for main thread.
 *
 * @param {string} workerUrl A worker url. It must use TransWorker.
 * @param {Function} clientCtor client-class constructor.
 * @param {object} thisObject (Optional) A caller of callback and notification.
 * @param {object} notifyHandlers A map a notification name to the handler.
 * @returns {Transworker} The created Transworker instance.
 */
TransWorker.createSharedInvoker = function(
        workerUrl, clientCtor,
        thisObject, notifyHandlers)
{
    const transworker = new TransWorker();
    transworker._shared = true;
    transworker.createInvoker(
        workerUrl, clientCtor,
        thisObject, notifyHandlers);
    return transworker;
};

/**
 * Create instance for main thread.
 *
 * @param {string} workerUrl A worker url. It must use TransWorker.
 * @param {Function} clientCtor client-class constructor.
 * @param {object} thisObject (Optional) A caller of callback and notification.
 * @param {object} notifyHandlers A map a notification name to the handler.
 * @returns {undefined}
 */
TransWorker.prototype.createInvoker = function(
        workerUrl, clientCtor,
        thisObject, notifyHandlers)
{
    // Receive message from worker thread
    this.callbacks = {};
    this._uuid = uuidv4();
    this.queryId = 0;
    console.log(`uuid:${this._uuid}`);
    this.onNotify = {};
    this._callbacker = thisObject;

    const onReceiveMessage = (e => {
        switch(e.data.type) {
        case 'response':
            try {
                if(e.data.uuid !== this._uuid) {
                    console.log(`unknwon uuid:${e.data.uuid}`);
                    break;
                }
                this.callbacks[e.data.queryId].apply(
                        this._callbacker, e.data.param);
            } catch(ex) {
                console.warn("*** exception: ", ex,
                    "in method", e.data.method, "params:",
                    JSON.stringify(e.data.param));
            }
            delete this.callbacks[e.data.queryId];
            break;
        case 'notify':
            try {
                this.onNotify[e.data.name](e.data.param);
            } catch(ex) {
                console.warn("*** exception: ", ex,
                    "in notify", e.data.name, "params:",
                    JSON.stringify(e.data.param));
            }
            break;
        }
    });
    if(!this._shared) {
        // Load dedicated worker
        this.worker = new Worker(workerUrl);
        this.worker.onmessage = onReceiveMessage;
    } else {
        this.worker = new SharedWorker(workerUrl);
        this.worker.port.onmessage = onReceiveMessage;
        this.worker.port.start();
    }

    // Create prototype entries same to the client
    this.createWrappers(Object.keys(clientCtor.prototype));

    // Entry the handlers to receive notifies
    notifyHandlers = notifyHandlers || {};
    Object.keys(notifyHandlers).forEach(key => {
        this.onNotify[key] = ((...args) => {
            notifyHandlers[key].apply(this._callbacker, args);
        });
    });

    if(this._shared) {
        this.subscribe("TransWorker.post_log", msg => console.log(msg));
        this.subscribe("TransWorker.post_error", msg => console.err(msg));
        this.subscribe("TransWorker.post_warn", msg => console.warn(msg));
    }
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
    const port = (this._shared ? this.worker.port : this.worker);
    return (...param) => {
        const queryId = this.queryId++;
        if(param.length > 0 && typeof(param.slice(-1)[0]) === "function") {
            this.callbacks[queryId] = param.splice(-1, 1)[0];
        } else {
            this.callbacks[queryId] = (()=>{});
        }
        port.postMessage({
            method: methodName,
            param: param,
            uuid: this._uuid,
            queryId: queryId
        });
    };
};

/**
 * Create a Worker side TransWorker instance.
 *
 * @param {object} client An instance of the client class.
 * @returns {TransWorker} an instance of TransWorker.
 */
TransWorker.createWorker = function(client) {
    const transworker = new TransWorker();
    transworker._shared = false;
    if(typeof(client) == 'function') {
        client = new client();
    }
    transworker.createWorker(client);
    return transworker;
};

/**
 * Create a TransWorker having SharedWorker on the worker side.
 *
 * @param {object} client An instance of the client class.
 * @returns {TransWorker} an instance of TransWorker.
 */
TransWorker.createSharedWorker = function(client) {
    const transworker = new TransWorker();
    transworker._shared = true;
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
    this.port = null;

    // Make the client to be able to use this module
    this.client._transworker = this;

    if(this._shared) {
        globalContext.console = {
            "post" : (method, args) => this.postNotify(
                `TransWorker.post_${method}`, args.join(" ")),
            "log"  : (...args) => console.post("log", args),
            "error": (...args) => console.post("error", args),
            "warn" : (...args) => console.post("warn", args),
        };
    }

    // Override subclas methods by this context
    Object.keys(this.constructor.prototype)
    .forEach(m => {
        this.client[m] = ((...args) => {
            this.constructor.prototype[m].apply(this, args);
        });
    });

    // On receive a message, invoke the client
    // method and post back its value.
    const onReceiveMessage = (e => {
        try {
            //return the value to UI-thread
            console.log(`Worker receives a uuid:${e.data.uuid}`);
            this.port.postMessage({
                type:'response',
                uuid: e.data.uuid,
                queryId: e.data.queryId,
                method: e.data.method,
                param: [
                    this.client[e.data.method].apply(
                        this.client, e.data.param)
                ]
            });
        } catch(ex) {
            console.warn("*** exception: ", ex,
                "in method", e.data.method, "params:",
                JSON.stringify(e.data.param));
        }
    });

    if(this._shared) {
        this.worker.onconnect = e => {
            this.port = e.ports[0];
            this.port.addEventListener("message", onReceiveMessage);
            this.port.start();
        }
    } else {
        this.port = this.worker;
        this.port.onmessage = onReceiveMessage;
    }
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
    this.port.postMessage({
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
