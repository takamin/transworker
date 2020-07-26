"use strict";
const WebSocket = require("ws");
const TransWorker = require("./transworker.js");

/**
 * @class
 */
class WebSocketServer extends TransWorker {
    /**
     * Start to listen client connections.
     * @param {http.server} server HTTP server
     * @param {Function} createClient A function to create clientninstance
     * @returns {undefined}
     */
    static listen(server, createClient) {
        this.wss = new WebSocket.Server({server});
        this.wss.on("connection", ws => {
            const transworker = new WebSocketServer();
            transworker.worker = null;
            transworker.messagePort = ws;
            transworker.messagePort.onmessage = e => {
                const data = JSON.parse(e.data);
                transworker.onReceiveClientMessage({data});
            };
            const client = createClient(transworker);
            transworker.client = client;
            transworker.client._transworker = this;
            transworker.injectSubClassMethod();
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
module.exports = WebSocketServer;
