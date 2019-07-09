"use strict";
const TransWorker = require("./transworker.js");
function SharedTransWorker() {
}
SharedTransWorker.prototype = new TransWorker();
SharedTransWorker.prototype.subscribeWorkerConsole = function() {
    this.subscribe("TransWorker.post_log", msg => console.log(msg));
    this.subscribe("TransWorker.post_error", msg => console.err(msg));
    this.subscribe("TransWorker.post_warn", msg => console.warn(msg));
};

SharedTransWorker.prototype.connectWorker = function(workerUrl) {
    this.worker = new SharedWorker(workerUrl);
    this.messagePort = this.worker.port;
    this.messagePort.onmessage =
        this.onReceiveWorkerMessage.bind(this);
    this.messagePort.start();
};
SharedTransWorker.prototype.publishWorkerConsole = function() {
    const originalConsole = {
        "log": this.worker.console.log,
        "warn": this.worker.console.warn,
        "error": this.worker.console.error,
    };
    const writeConsole = (method, args) => {
        if(this.messagePort) {
            this.postNotify(`TransWorker.post_${method}`, args.join(" "));
        } else {
            originalConsole[method].apply(this.worker, args);
        }
    };
    this.worker.console = {
        "log"  : (...args) => writeConsole("log", args),
        "error": (...args) => writeConsole("error", args),
        "warn" : (...args) => writeConsole("warn", args),
    };
};
SharedTransWorker.prototype.setupOnConnect = function() {
    this.worker.onconnect = e => {
        this.messagePort = e.ports[0];
        this.messagePort.addEventListener(
            "message", this.onReceiveClientMessage.bind(this));
        this.messagePort.start();
    }
};
module.exports = SharedTransWorker;
