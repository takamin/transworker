/*
 * TransWorker - Yields the interfaces for the main thread to
 * communicate with a class instance running in WebWorker by
 * peeping the prototypes.
 *
 * DESCRIPTION
 *
 * The implementation of this class is different between
 * main and sub thread.
 *
 * The instance created in the main thread is the interface to
 * invoke methods of the instance running in the sub thread.
 *
 * The return value of the remote method will be
 * notified to the callback function as parameter
 *
 * LICENSE
 *
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2017 Koji Takami(vzg03566@gmail.com)
 *
 */
"use strict";

/**
 * Transworker
 * @constructor
 */
function TransWorker(){};

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
 * Create wrapper methods to send message to the worker
 * @param {Array<string>} method_names An array of method names to override.
 * @returns {undefined}
 */
TransWorker.prototype.createWrappers = function(
        method_names)
{
    method_names.forEach(function(m) {
        TransWorker.prototype[m] = this.wrapper(m);
    }, this);
};

/**
 * Create client method wrapper
 * @param {string} method_names An array of method names to override.
 * @returns {Function} A wrapper function.
 */
TransWorker.prototype.wrapper = function(
        method)
{
    return function() {
        let callback = function(){};
        let param = [];
        if(arguments.length > 0) {
            callback = Array.prototype.slice.call(
                    arguments, -1)[0] || function(){};
            param = Array.prototype.slice.call(
                    arguments, 0, arguments.length - 1);
        }
        const queryId = this.queryId++;
        this.callbacks[queryId] = callback;
        this.worker.postMessage({
            method: method,
            param: param,
            queryId: queryId });
    };
};

/**
 * Create Worker side TransWorker instance.
 * (designed to be invoked from sub-class constructor)
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
 * (designed to be invoked from sub-class constructor)
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

// Notify to the UI-thread version TransWorker instance
// from derived class instance.
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
}
