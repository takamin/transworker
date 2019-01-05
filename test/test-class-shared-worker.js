"use strict"
require("babel-polyfill");
const TransWorker = require("../transworker.js");
const TestClass = require("./test-class.js");
TestClass.prototype.requestNotify = function(name, message) {
    console.log(`requestNotify(${name},${message});`);
    this._transworker.postNotify(name, message);
};
TransWorker.createSharedWorker(TestClass);
