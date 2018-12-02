"use strict"
const assert = require("chai").assert;
const TransWorker = require("../index.js");
const TestClass = require("./test-class.js");
describe("TransWorker", () => {
    describe("Instance in the main thread", () => {
        describe("createInvoker", () => {
            it("should override target class prototype", () => {
                const tw = TransWorker.createInvoker(
                    "test-class-worker-bundle.js", TestClass);
                assert.isTrue("testMethod" in tw);
            });
            it("should declare a function of target class prototype", () => {
                const tw = TransWorker.createInvoker(
                    "test-class-worker-bundle.js", TestClass);
                assert.equal(typeof(tw.testMethod), "function");
            });
            it("should create a dedicated worker", () => {
                const tw = TransWorker.createInvoker(
                    "test-class-worker-bundle.js", TestClass);
                assert.isNotNull(tw.worker);
            });
        });
        describe("The wrapper methods created by createInvoker", async () => {
            it("should be invoked when the callback is specified", () => {
                assert.doesNotThrow(() => {
                    const tw = TransWorker.createInvoker(
                        "test-class-worker-bundle.js", TestClass);
                    tw.testMethod(() => {});
                });
            });
            it("should be invoked when the callback is not specified", () => {
                assert.doesNotThrow(() => {
                    const tw = TransWorker.createInvoker(
                        "test-class-worker-bundle.js", TestClass);
                    tw.testMethod();
                });
            });
            it("should callback a return value", async () => {
                try {
                    const tw = TransWorker.createInvoker(
                        "/test-class-worker-bundle.js", TestClass);
                    const result = await new Promise(
                        resolve => tw.testMethod(s => resolve(s)));
                    assert.equal(result, "TestClass.testMethod");
                } catch (err) {
                    assert.fail(err.message);
                }
            });
            it("should transport all parameters to worker even if the callback is omitted (issue#14)", async () => {
                try {
                    const result = await new Promise(resolve => {
                        const tw = TransWorker.createInvoker(
                            "/test-class-worker-bundle.js", TestClass, null,
                            { "hello": message => resolve(message) });
                        tw.requestNotify("hello", "transworker");
                    });
                    assert.equal(result, "transworker");
                } catch (err) {
                    assert.fail(err.message);
                }
            });
        });
        describe("Callback's caller", async () => {
            it("should be undefined when the parameter thisObject of createInvoker is omitted", async () => {
                try {
                    const tw = TransWorker.createInvoker(
                        "/test-class-worker-bundle.js", TestClass);
                    const callbackCaller = await new Promise(
                        resolve => tw.testMethod(function() {
                            resolve(this);
                        })
                    );
                    assert.isUndefined(callbackCaller);
                } catch (err) {
                    assert.fail(err.message);
                }
            });
            it("should be null when the parameter thisObject of createInvoker is set to null", async () => {
                try {
                    const tw = TransWorker.createInvoker(
                        "/test-class-worker-bundle.js", TestClass, null);
                    const callbackCaller = await new Promise(
                        resolve => tw.testMethod(function() {
                            resolve(this);
                        })
                    );
                    assert.isNull(callbackCaller);
                } catch (err) {
                    assert.fail(err.message);
                }
            });
            it("should equal to the parameter thisObject of createInvoker", async () => {
                try {
                    const thisObject = "thisObject";
                    const tw = TransWorker.createInvoker(
                        "/test-class-worker-bundle.js", TestClass, thisObject);
                    const callbackCaller = await new Promise(
                        resolve => tw.testMethod(function() {
                            resolve(this);
                        })
                    );
                    assert.equal(callbackCaller, thisObject);
                    assert.equal(thisObject, "thisObject");
                } catch (err) {
                    assert.fail(err.message);
                }
            });
        });
        describe("Notification", async () => {
            it("should be notified with a scalar parameter", async () => {
                try {
                    const notificationMessage = await new Promise( resolve => {
                        const tw = TransWorker.createInvoker(
                            "/test-class-worker-bundle.js", TestClass, null,
                            {
                                "hello": (message) => {
                                    resolve(message);
                                }
                            });
                        tw.requestNotify("hello", "transworker", null);
                    });
                    assert.deepEqual(notificationMessage, "transworker");
                } catch (err) {
                    assert.fail(err.message);
                }
            });
            it("should be notified with an array parameter", async () => {
                try {
                    const notificationMessage = await new Promise( resolve => {
                        const tw = TransWorker.createInvoker(
                            "/test-class-worker-bundle.js", TestClass, null,
                            {
                                "hello": (message) => {
                                    resolve(message);
                                }
                            });
                        tw.requestNotify("hello", ["transworker", true], null);
                    });
                    assert.deepEqual(notificationMessage, ["transworker", true]);
                } catch (err) {
                    assert.fail(err.message);
                }
            });
            it("should be notified with an object parameter", async () => {
                try {
                    const notificationMessage = await new Promise( resolve => {
                        const tw = TransWorker.createInvoker(
                            "/test-class-worker-bundle.js", TestClass, null,
                            {
                                "hello": (message) => {
                                    resolve(message);
                                }
                            });
                        tw.requestNotify("hello", {"transworker":true}, null);
                    });
                    assert.deepEqual(notificationMessage, {"transworker":true});
                } catch (err) {
                    assert.fail(err.message);
                }
            });
        });
        describe("Notification's caller", async () => {
            it("should be null when the parameter thisObject of createInvoker is set to null", async () => {
                try {
                    const notificationCaller = await new Promise( resolve => {
                        const tw = TransWorker.createInvoker(
                            "/test-class-worker-bundle.js", TestClass, null,
                            { "hello": function(message) { resolve(this); } });
                        tw.requestNotify("hello", "transworker", null);
                    });
                    assert.isNull(notificationCaller);
                } catch (err) {
                    assert.fail(err.message);
                }
            });
            it("should equal to the parameter thisObject of createInvoker ", async () => {
                try {
                    const thisObject = "thisObject";
                    const notificationCaller = await new Promise( resolve => {
                        const tw = TransWorker.createInvoker(
                            "/test-class-worker-bundle.js", TestClass, thisObject,
                            { "hello": function(message) { resolve(this); } });
                        tw.requestNotify("hello", "transworker", null);
                    });
                    assert.equal(notificationCaller, thisObject);
                    assert.equal(thisObject, "thisObject");
                } catch (err) {
                    assert.fail(err.message);
                }
            });
        });
    });
});
