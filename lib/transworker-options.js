"use strict";
const assert = require("assert");
const TransWorker = require("./transworker.js");

/**
 * Options fot a TransWorker object.
 * @constructor
 * @param {object} options an option object
 */
function TransWorkerOptions(options) {
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
}

module.exports = TransWorkerOptions;
