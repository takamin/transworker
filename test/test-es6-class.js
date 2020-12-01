"use strict"
class TestEs6Class {
    constructor() {
        this._transObj = null;
    }
    testMethod() {
        return "TestClass.testMethod";
    }
    requestNotify( /*name, message*/) {
        /* no implementation on main thread side */
    }
    returnAfter(timeout, value) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(value);
            }, timeout);
        });
    }
    setTransObj(transObj) {
        console.log("setTransObj");
        this._transObj = transObj;
    }
    hasTransObj() {
        console.log("hasTransObj");
        return this._transObj != null;
    }
}

module.exports = TestEs6Class;
