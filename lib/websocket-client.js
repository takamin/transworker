"use strict";
const TransWorker = require("./transworker.js");
TransWorker.Options = require("./transworker-options.js");

/**
 * @class
 */
class WebSocketClient extends TransWorker {
    /**
     * Create a worker and an interface instance for the thread.
     *
     * @param {string} wssUrl A WebSocket server url.
     * @param {Function} clientCtor client-class constructor.
     * @param {TransWorker.Options} options Options to create a wrapper object for
     *      the main thread.
     * @returns {Promise<Transworker>} The created TransWorker instance.
     */
    static createInterface(wssUrl, clientCtor, options) {
        options = options || new TransWorker.Options();
        if(options.constructor !== TransWorker.Options) {
            options = new TransWorker.Options(options);
        }

        const transworker = new TransWorker.WebSocketClient();
        transworker._shared = false;
        transworker._syncType = options.syncType;
        return transworker.createInvoker(wssUrl, clientCtor).then(() => {
            return transworker;
        });
    }

    /**
     * Connect to a WebSocket server.
     * @param {string} url WebSocket server end point.
     * @returns {Promise} A promise that is resolved when the connection is
     * establish.
     */
    connectWorker(url) {
        return new Promise((resolve, reject) => {
            try {
                const ws = new WebSocket(url);
                this.worker = null;
                this.messagePort = ws;
                this.messagePort.onmessage = e => {
                    const data = JSON.parse(e.data);
                    this.onReceiveWorkerMessage({data});
                };
                ws.onopen = () => {
                    resolve();
                };
            } catch(err) {
                reject(err);
            }
        });
    }

    /**
     * Post message.
     * @param {object} message a message object.
     * @returns {undefined}
     */
    postMessage(message) {
        this.messagePort.send(JSON.stringify(message));
    }
}
module.exports = WebSocketClient;
