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
     * @param {Function} createClient A function to create client instance
     * @returns {undefined}
     */
    static listen(server, createClient) {
        this.wss = new WebSocket.Server({server});
        this.wss.on("connection", async ws => {
            const transworker = new WebSocketServer(ws);
            try {
                const client = createClient(transworker);
                await transworker.setupClient(client);
            } catch (err) {
                console.error(`Error: ${err.stack}`);
            }
        });
    }

    /**
     * @constructor
     * @param {WebSocket} ws A client WebSocket
     */
    constructor(ws) {
        super();
        this.worker = null;
        this.messagePort = ws;
        this.messagePort.onmessage = e => {
            try {
                const data = JSON.parse(e.data);
                this.onReceiveClientMessage({data});
            } catch (err) {
                console.error(`Error: ${err.stack}`);
            }
        };
    }
    /**
     * Set client.
     * @async
     * @param {any|Promise} client An instance of client class or its Promise
     * @returns {undefined}
     */
    async setupClient(client) {
        if(client instanceof Promise) {
            this.client = await client;
        } else {
            this.client = client;
        }
        this.client._transworker = this;
        this.injectSubClassMethod();
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
