"use strict";
const TransWorker = require("./lib/transworker.js");
const DedicatedTransWorker = TransWorker;
const SharedTransWorker = require("./lib/shared-transworker.js");
TransWorker.Options = require("./lib/transworker-options.js");

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

    const transworker = options.shared ? 
        new SharedTransWorker() : new DedicatedTransWorker();
    transworker._shared = options.shared;
    transworker._syncType = options.syncType;
    transworker.createInvoker(workerUrl, clientCtor);
    return transworker;
};

/**
 * Create a main thread instance for dedicated worker.
 *
 * @deprecated Use the `TransWorker.createInterface` with setting
 * `options.shared` false and setting `options.syncType`
 * `TransWorker.SyncTypeCallback`.
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
    const transworker = new DedicatedTransWorker();
    transworker._syncType = TransWorker.SyncTypeCallback;
    transworker.createInvoker(
        workerUrl, clientCtor,
        thisObject, notifyHandlers);
    return transworker;
};

/**
 * Create a main thread instance for shared worker.
 *
 * @deprecated Use the `TransWorker.createInterface` with setting
 * `options.shared` true and setting `options.syncType`
 * `TransWorker.SyncTypeCallback`.
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
    const transworker = new SharedTransWorker();
    transworker._syncType = TransWorker.SyncTypeCallback;
    transworker.createInvoker(
        workerUrl, clientCtor,
        thisObject, notifyHandlers);
    return transworker;
};

/**
 * Create a worker side instance of DedicatedTransWorker.
 *
 * @param {object|Function} client An instance of the client class.
 * @param {TransWorker.Options} options Options to create a worker.
 * @returns {TransWorker} an instance of TransWorker.
 */
TransWorker.createWorker = function(client, options) {
    options = options || new TransWorker.Options();

    const transworker = (options.shared) ?
        new SharedTransWorker() : new DedicatedTransWorker();
    if(typeof(client) == 'function') {
        client = new client();
    }
    transworker.createWorker(client);
    return transworker;
};

/**
 * Create a worker side instance of SharedTransWorker.
 *
 * @deprecated Use the `TransWorker.createWorker` with setting
 * `options.shared` true.
 *
 * @param {object|Function} client An instance of the client class.
 * @returns {TransWorker} an instance of TransWorker.
 */
TransWorker.createSharedWorker = function(client) {
    const transworker = new SharedTransWorker();
    if(typeof(client) == 'function') {
        client = new client();
    }
    transworker.createWorker(client);
    return transworker;
};

module.exports = TransWorker;
