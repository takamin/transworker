/* globals importScripts, Prime, TransWorker */
importScripts(
    "../../transworker.js",
    "./prime.js");
TransWorker.createSharedWorker(new Prime());
