"use strict"
function TestClass() {}
TestClass.prototype.testMethod = function() {
    return "TestClass.testMethod";
};
TestClass.prototype.requestNotify = function(/*name, message*/) {
    /* no implementation on main thread side */
};
module.exports = TestClass;
