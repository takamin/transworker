"use strict";
const { v4: uuidv4 } = require("uuid");

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
//
// `globalContextName` takes one of following value:
//
// * "Window"
// * "DedicatedWorkerGlobalScope"
// * "SharedWorkerGlobalScope"
// * "ServiceWorkerGlobalScope"
// * "DedicatedWorkerGlobalScope"
//

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
function TransWorker(){
    if(globalContextName == "Window") {
        // fields for the main thread
        this.callbacks = {};
        this._uuid = uuidv4();
        this.queryId = 0;
        this._onNotify = {};
        this._callbacker = null;
    } else {
        // fields for the worker thread
        this.worker = globalContext;
        this.client = null;
        this.messagePort = null;
        this._txObjReceiver = {};
    }
}

TransWorker.context = globalContextName;

/**
 * A literal for the interface methods to synchronize with a callback.
 * @type {Function}
 */
TransWorker.SyncTypeCallback = Function;

/**
 * A literal for the interface methods to synchronize with a Promise.
 * @type {Function}
 */
TransWorker.SyncTypePromise = Promise;

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
    this._callbacker = thisObject;

    // Create prototype entries same to the client
    const methodNames = Object.getOwnPropertyNames(clientCtor.prototype);
    if(this._syncType === TransWorker.SyncTypePromise) {
        for(const methodName of methodNames) {
            this[methodName] = this.createPromiseWrapper(methodName).bind(this);
        }
    } else {
        for(const methodName of methodNames) {
            this[methodName] = this.createCallbackWrapper(methodName).bind(this);
        }
    }

    // Entry the handlers to receive notifies
    notifyHandlers = notifyHandlers || {};
    Object.keys(notifyHandlers).forEach(key => {
        if(!(name in this._onNotify)) {
            this._onNotify[key] = [];
        }
        this._onNotify[key].push((...args) => {
            notifyHandlers[key].apply(this._callbacker, args);
        });
    });

    this.subscribeWorkerConsole();

    return this.connectWorker(workerUrl);
};

TransWorker.prototype.onReceiveWorkerMessage = function(e) {
    switch(e.data.type) {
    case 'response':
        try {
            if(e.data.uuid !== this._uuid) {
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
            this._onNotify[e.data.name].forEach(
                notify => notify(e.data.param));
        } catch(ex) {
            console.warn("*** exception: ", ex,
                "in notify", e.data.name, "params:",
                JSON.stringify(e.data.param));
        }
        break;
    }
};

/**
 * @virtual
 * @param {string} workerURL A URL for the worker or server.
 * @returns {undefined}
 */
TransWorker.prototype.connectWorker = function(workerURL) {
    // Load dedicated worker
    this.worker = new Worker(workerURL);
    this.messagePort = this.worker;
    this.messagePort.onmessage =
        this.onReceiveWorkerMessage.bind(this);
};

/**
 * @virtual
 * @returns {undefined}
 */
TransWorker.prototype.subscribeWorkerConsole = function() {
    // NO IMPLEMENTATION on this class
};

/**
 * Register a notification to receive a message from the worker thread.
 * @param {string} name A notification name.
 * @param {Function} handler A notification handler.
 * @returns {undefined}
 */
TransWorker.prototype.subscribe = function(name, handler) {
    if(!handler || typeof(handler) !== "function") {
        throw new Error(
            `Could not subscribe to '${name}' with the handler of non-function`);
    }
    if(!(name in this._onNotify)) {
        this._onNotify[name] = [];
    }
    this._onNotify[name].push((...args) => handler.apply(this, args));
};

/**
 * Create client method wrapper
 * @param {string} methodName A method name to override.
 * @returns {Function} A wrapper function.
 */
TransWorker.prototype.createCallbackWrapper = function(methodName)
{
    return (...param) => {
        try {
            const queryId = this.queryId++;
            if(param.length > 0 && typeof(param.slice(-1)[0]) === "function") {
                this.callbacks[queryId] = param.splice(-1, 1)[0];
            } else {
                this.callbacks[queryId] = (()=>{});
            }
            this.postMessage({
                method: methodName,
                param: param,
                uuid: this._uuid,
                queryId: queryId
            });
        } catch(err) {
            console.error(err.stack);
        }
    };
};

/**
 * Post message.
 * @param {object} message a message object.
 * @param {Array<TransferableObject>|null}  transObjList An array of
 *      objects to be transfered
 * @returns {undefined}
 */
TransWorker.prototype.postMessage = function(message, transObjList) {
    this.messagePort.postMessage(message, transObjList);
};

/**
 * Invoke a remote method and returns a promise object that will resolved with
 * its return value.
 * (for only UI thread)
 * @param {string}  methodName  A name of the object to be transfered
 * @param {Array<any>}  paramList   An array of parameters
 * @param {Array<TransferableObject>|null}  transObjList An array of
 *      objects to be transfered
 * @returns {Promise<any>}  A promise object. The fulfillment value is the return
 *      value of the remote method
 */
TransWorker.prototype.invokeMethod = function(
    methodName, paramList, transObjList)
{
    return new Promise((resolve, reject) => {
        try {
            const queryId = this.queryId++;
            this.callbacks[queryId] = (result => resolve(result));
            this.postMessage({
                method: methodName,
                param: paramList,
                uuid: this._uuid,
                queryId: queryId
            }, transObjList);
        } catch(err) {
            reject(err);
        }
    });
}

/**
 * Create client method wrapper that returns a promise that will be resolved
 * by a value that remote method returns.
 * @param {string} methodName A method name to override.
 * @returns {Function} A wrapper function.
 */
TransWorker.prototype.createPromiseWrapper = function(methodName)
{
    return (...param) => {
        return this.invokeMethod(methodName, param);
    };
};

/**
 * Transfer an object to the worker.
 * (for only UI thread)
 * @param {string}  objName A name of the object to be transfered
 * @param {Transferable}  transferableObj An object to be transfered
 * @returns {Promise<any>} A promise to be resolved a value returned by worker
 *      side method
 */
TransWorker.prototype.transferObject = function(objName, transferableObj)
{
    return this.invokeMethod(
        "onTransferableObject",
        [objName, transferableObj],
        [transferableObj]);
}

/**
 * Create Worker side TransWorker instance.
 *
 * @param {object} client A instance of the client class.
 * @returns {undefined}
 */
TransWorker.prototype.createWorker = function(client) {
    this.client = client;

    // Make the client to be able to use this module
    this.client._transworker = this;

    this.publishWorkerConsole();

    // Override subclass methods by this context
    this.injectSubClassMethod();

    this.setupOnConnect();
};

TransWorker.prototype.injectSubClassMethod = function() {
    Object.getOwnPropertyNames(this.constructor.prototype)
    .forEach(m => {
        this.client[m] = ((...args) => {
            this.constructor.prototype[m].apply(this, args);
        });
    });
};

/**
 * @virtual
 * @returns {undefined}
 */
TransWorker.prototype.publishWorkerConsole = function() {
    // NO IMPLEMENTATION on this class
};

/**
 * @virtual
 * @returns {undefined}
 */
TransWorker.prototype.setupOnConnect = function() {
    this.messagePort = this.worker;
    this.messagePort.onmessage = this.onReceiveClientMessage.bind(this);
};

// On receive a message, invoke the client
// method and post back its value.
TransWorker.prototype.onReceiveClientMessage = function(e) {
    const returnResult = value => {
        this.postMessage({
            type:'response',
            uuid: e.data.uuid,
            queryId: e.data.queryId,
            method: e.data.method,
            param: [ value ],
        });
    };

    const onError = ex => {
        console.warn("*** exception: ", ex,
            "in method", e.data.method, "params:",
            JSON.stringify(e.data.param));
    };

    try {
        const result = this.client[e.data.method].apply(
            this.client, e.data.param);
        if(result && result.constructor === Promise) {
            result.then( fulfillment => {
                returnResult(fulfillment);
            }).catch(ex => {
                onError(ex);
            });
        } else {
            returnResult(result);
        }
    } catch(ex) {
        onError(ex);
    }
};

/**
 * Post a notify to the UI-thread TransWorker instance
 * @param {string} name A message name.
 * @param {any} param A message parameters.
 * @param {Transferable[]|null} transObjList A list of transferable objects.
 * @returns {undefined}
 */
TransWorker.prototype.postNotify = function(name, param, transObjList) {
    this.postMessage({
        type:'notify',
        name: name,
        param: param
    }, transObjList);
};

/**
 * A primary receiver for a transferable object.
 * (for only Worker instance)
 * @param {string}  objName A name of the object to be transfered
 * @param {Transferable}  transferableObj An object to be transfered
 * @returns {undefined}
 */
TransWorker.prototype.onTransferableObject = function(objName, transferableObj)
{
    this._txObjReceiver[objName](transferableObj);
}

/**
 * Enter a handler to receive a transferable object.
 * (for only Worker instance)
 * @param {string}  objName A name of the object to receive
 * @param {Function} handler A callback function to receive the object
 * @returns {undefined}
 */
TransWorker.prototype.listenTransferableObject = function(objName, handler)
{
    this._txObjReceiver[objName] = handler;
}

// Exports
if(TransWorker.context == 'Window') {
    TransWorker.prototype.create = TransWorker.prototype.createInvoker;
    TransWorker.create = TransWorker.createInvoker;
}
else if( TransWorker.context == 'DedicatedWorkerGlobalScope'
        || TransWorker.context == 'WorkerGlobalScope')
{
    TransWorker.prototype.create = TransWorker.prototype.createWorker;
    TransWorker.create = TransWorker.createWorker;
}

globalContext.TransWorker = TransWorker;
module.exports = TransWorker;
