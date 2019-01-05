"use strict"
const assert = require("chai").assert;
const TransWorker = require("../index.js");
const TestClass = require("./test-class.js");
describe("TransWorker", () => {
    describe("createInvoker", () => {
        describe("Method type", () => {
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
        describe("The wrappers are invokable", () => {
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
        describe("Callback's caller", () => {
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
                            { "hello": function() { resolve(this); } });
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
                            { "hello": function() { resolve(this); } });
                        tw.requestNotify("hello", "transworker", null);
                    });
                    assert.equal(notificationCaller, thisObject);
                    assert.equal(thisObject, "thisObject");
                } catch (err) {
                    assert.fail(err.message);
                }
            });
        });
        describe("subscribe", () => {
            it("should entry the notification", async () => {
                try {
                    const notificationMessage = await new Promise( resolve => {
                        const tw = TransWorker.createInvoker(
                            "/test-class-worker-bundle.js", TestClass);
                        tw.subscribe("hello", message => resolve(message));
                        tw.requestNotify("hello", "transworker", null);
                    });
                    assert.deepEqual(notificationMessage, "transworker");
                } catch (err) {
                    assert.fail(err.message);
                }
            });
            it("should entry the handler as the caller is the transworker", async () => {
                try {
                    const tw = TransWorker.createInvoker(
                        "/test-class-worker-bundle.js", TestClass, "caller");
                    const caller = await new Promise( resolve => {
                        tw.subscribe("hello", function() {
                            resolve(this);
                        });
                        tw.requestNotify("hello", "transworker", null);
                    });
                    assert.deepEqual(caller, tw);
                } catch (err) {
                    assert.fail(err.message);
                }
            });
            describe("should throw,", () => {
                describe("when the same notification was entried", () => {
                    it("by createInvoker", () => {
                        const tw = TransWorker.createInvoker(
                            "/test-class-worker-bundle.js", TestClass, null,
                            { "hello": function() {} });
                        assert.throw(() => {
                            tw.subscribe("hello", ()=>{});
                        });
                    });
                    it("by subscribe", () => {
                        const tw = TransWorker.createInvoker(
                            "/test-class-worker-bundle.js", TestClass);
                        tw.subscribe("hello", () => {});
                        assert.throw(() => {
                            tw.subscribe("hello", ()=>{});
                        });
                    });
                });
                describe("when the handler is", () => {
                    it("null", () => {
                        const tw = TransWorker.createInvoker(
                            "/test-class-worker-bundle.js", TestClass);
                        assert.throw(() => {
                            tw.subscribe("hello", null);
                        });
                    });
                    it("undefined", () => {
                        const tw = TransWorker.createInvoker(
                            "/test-class-worker-bundle.js", TestClass);
                        assert.throw(() => {
                            tw.subscribe("hello", undefined);
                        });
                    });
                    it("an array", () => {
                        const tw = TransWorker.createInvoker(
                            "/test-class-worker-bundle.js", TestClass);
                        assert.throw(() => {
                            tw.subscribe("hello", []);
                        });
                    });
                    it("an object", () => {
                        const tw = TransWorker.createInvoker(
                            "/test-class-worker-bundle.js", TestClass);
                        assert.throw(() => {
                            tw.subscribe("hello", {});
                        });
                    });
                    it("a string", () => {
                        const tw = TransWorker.createInvoker(
                            "/test-class-worker-bundle.js", TestClass);
                        assert.throw(() => {
                            tw.subscribe("hello", "transworker");
                        });
                    });
                    it("a number", () => {
                        const tw = TransWorker.createInvoker(
                            "/test-class-worker-bundle.js", TestClass);
                        assert.throw(() => {
                            tw.subscribe("hello", 123);
                        });
                    });
                    it("a boolean", () => {
                        const tw = TransWorker.createInvoker(
                            "/test-class-worker-bundle.js", TestClass);
                        assert.throw(() => {
                            tw.subscribe("hello", true);
                        });
                    });
                });
            });
        });
    });
    describe("A wrapper for the async method", () => {
        it("should returns fulfillment value", async ()=>{
            const tw = TransWorker.createInvoker(
                "/test-class-worker-bundle.js", TestClass);
            try {
                assert.deepEqual(await Promise.all([
                    new Promise((resolve, reject) => { try {
                        tw.returnAfter(2000, "2000", result => resolve(result));
                    } catch(err) { reject(err); }}),
                    new Promise((resolve, reject) => { try {
                        tw.returnAfter(1000, "1000", result => resolve(result));
                    } catch(err) { reject(err); }}),
                ]),
                ["2000", "1000"]);
            } catch(err) {
                assert.fail(err.message);
            }
        }).timeout(5000);
    });
});
