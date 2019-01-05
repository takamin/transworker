"use strict"
function TestClass() {}
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

module.exports = TestClass;
