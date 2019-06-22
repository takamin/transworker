"use strict";
const TransWorker = require("./transworker.js");
function DedicatedTransWorker() {}
DedicatedTransWorker.prototype = new TransWorker();
DedicatedTransWorker.prototype.connectWorker = function(workerUrl) {
    // Load dedicated worker
    this.worker = new Worker(workerUrl);
    this.messagePort = this.worker;
    this.messagePort.onmessage =
        this.onReceiveWorkerMessage.bind(this);
};
DedicatedTransWorker.prototype.setupOnConnect = function() {
    this.messagePort = this.worker;
    this.messagePort.onmessage = this.onReceiveClientMessage.bind(this);
};
module.exports = DedicatedTransWorker;
