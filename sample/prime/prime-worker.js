const TransWorker = require("../../index.js");
const Prime = require("./prime.js");
TransWorker.createSharedWorker(Prime);
