"use strict"
require("babel-polyfill");
const TransWorker = require("../transworker.js");
const TestClass = require("./test-class.js");
TransWorker.create(TestClass);
