"use strict";
const assert = require("assert");
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
 * Options fot a TransWorker object.
 * @constructor
 * @param {object} options an option object
 */
TransWorker.Options = function(options) {
    options = options || {
        shared: false,
        syncType: TransWorker.SyncTypeCallback,
    };
    options.shared = (options.shared != null ? options.shared : false);
    options.syncType = (options.syncType != null ? options.syncType :
        TransWorker.SyncTypeCallback);
    assert.ok(typeof(options.shared) === "boolean" && (
        options.syncType === TransWorker.SyncTypeCallback ||
        options.syncType === TransWorker.SyncTypePromise));
    this.shared = options.shared;
    this.syncType = options.syncType;
};

/**
 * Create a worker and an interface instance for the thread.
 *
 * @param {string} workerUrl A worker url. It must use TransWorker.
 * @param {Function} clientCtor client-class constructor.
 * @param {TransWorker.Options} options Options to create a wrapper object for
 *      the main thread.
 * @returns {Transworker} The created TransWorker instance.
 */
TransWorker.createInterface = function(workerUrl, clientCtor, options) {
    options = options || new TransWorker.Options();
    if(workerUrl.constructor !== TransWorker.Options) {
        options = new TransWorker.Options(options);
    }

    const transworker = new TransWorker();
    transworker._shared = options.shared;
    transworker._syncType = options.syncType;
    transworker.createInvoker(workerUrl, clientCtor);
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
TransWorker.createInvoker = function(
        workerUrl, clientCtor,
        thisObject, notifyHandlers)
{
    const transworker = new TransWorker();
    transworker._shared = false;
    transworker._syncType = TransWorker.SyncTypeCallback;
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
    transworker._syncType = TransWorker.SyncTypeCallback;
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
    this.onNotify = {};
    this._callbacker = thisObject;

    const onReceiveMessage = (e => {
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
        this.messagePort = this.worker;
        this.messagePort.onmessage = onReceiveMessage;
    } else {
        this.worker = new SharedWorker(workerUrl);
        this.messagePort = this.worker.port;
        this.messagePort.onmessage = onReceiveMessage;
        this.messagePort.start();
    }

    // Create prototype entries same to the client
    const methodNames = Object.keys(clientCtor.prototype)
    if(this._syncType === TransWorker.SyncTypePromise) {
        for(const methodName of methodNames) {
            TransWorker.prototype[methodName] =
                this.createPromiseWrapper(methodName);
        }
    } else {
        for(const methodName of methodNames) {
            TransWorker.prototype[methodName] =
                this.createCallbackWrapper(methodName);
        }
    }

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
 * Create client method wrapper
 * @param {string} methodName A method name to override.
 * @returns {Function} A wrapper function.
 */
TransWorker.prototype.createCallbackWrapper = function(methodName)
{
    return (...param) => {
        const queryId = this.queryId++;
        if(param.length > 0 && typeof(param.slice(-1)[0]) === "function") {
            this.callbacks[queryId] = param.splice(-1, 1)[0];
        } else {
            this.callbacks[queryId] = (()=>{});
        }
        this.messagePort.postMessage({
            method: methodName,
            param: param,
            uuid: this._uuid,
            queryId: queryId
        });
    };
};

/**
 * Create client method wrapper that returns a promise that will be resolved
 * by a value that remote method returns.
 * @param {string} methodName A method name to override.
 * @returns {Function} A wrapper function.
 */
TransWorker.prototype.createPromiseWrapper = function(methodName)
{
    return (...param) => {
        return new Promise((resolve, reject) => {
            try {
                const queryId = this.queryId++;
                this.callbacks[queryId] = (result => resolve(result));
                this.messagePort.postMessage({
                    method: methodName,
                    param: param,
                    uuid: this._uuid,
                    queryId: queryId
                });
            } catch(err) {
                reject(err);
            }
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
    this.messagePort = null;

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

        const returnResult = value => {
            this.messagePort.postMessage({
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
            const result = client[e.data.method].apply(client, e.data.param);
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
    });

    if(this._shared) {
        this.worker.onconnect = e => {
            this.messagePort = e.ports[0];
            this.messagePort.addEventListener("message", onReceiveMessage);
            this.messagePort.start();
        }
    } else {
        this.messagePort = this.worker;
        this.messagePort.onmessage = onReceiveMessage;
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
    this.messagePort.postMessage({
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
