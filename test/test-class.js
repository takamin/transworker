"use strict"
function TestClass() {
    this._transObj = null;
}
TestClass.prototype.testMethod = function() {
    return "TestClass.testMethod";
};
TestClass.prototype.requestNotify = function(/*name, message*/) {
    /* no implementation on main thread side */
};
TestClass.prototype.returnAfter = function(timeout, value) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(value);
        }, timeout);
    });
};

TestClass.prototype.setTransObj = function(transObj) {
    console.log("setTransObj");
    this._transObj = transObj;
};
TestClass.prototype.hasTransObj = function() {
    console.log("hasTransObj");
    return this._transObj != null;
};

module.exports = TestClass;
