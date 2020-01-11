"use strict"
require("babel-polyfill");
const TransWorker = require("../transworker.js");
const TestClass = require("./test-class.js");
TestClass.prototype.requestNotify = function(name, message) {
    this._transworker.postNotify(name, message);
};
const transworker = TransWorker.createWorker(TestClass);
transworker.listenTransferableObject("transObj", transObj => {
    transworker.client.setTransObj(transObj);
});
