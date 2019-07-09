"use strict"
require("babel-polyfill");
const TransWorker = require("../transworker.js");
const TestClass = require("./test-class.js");
TestClass.prototype.requestNotify = function(name, message) {
    this._transworker.postNotify(name, message);
};
TransWorker.createWorker(TestClass);
