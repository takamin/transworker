importScripts(
    "../../transworker.js",
    "./prime.js");
TransWorker.createSharedWorker(new Prime());
