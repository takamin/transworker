"use strict"
const assert = require("chai").assert;
const TransWorker = require("../index.js");
const TestClass = require("./test-class.js");
describe("TransWorker", () => {
    describe("createSharedInvoker", () => {
        it("should override target class prototype", () => {
            const tw = TransWorker.createSharedInvoker(
                "test-class-worker-bundle.js", TestClass);
            assert.isTrue("testMethod" in tw);
        });
        it("should declare a function of target class prototype", () => {
            const tw = TransWorker.createSharedInvoker(
                "test-class-worker-bundle.js", TestClass);
            assert.equal(typeof(tw.testMethod), "function");
        });
        it("should create a dedicated worker", () => {
            const tw = TransWorker.createSharedInvoker(
                "test-class-worker-bundle.js", TestClass);
            assert.isNotNull(tw.worker);
        });
        describe("The wrapper methods behavior", () => {
            describe("Normally invocation", () => {
                it("should be invoked when the callback is specified", () => {
                    assert.doesNotThrow(() => {
                        const tw = TransWorker.createSharedInvoker(
                            "test-class-worker-bundle.js", TestClass);
                        tw.testMethod(() => {});
                    });
                });
                it("should be invoked when the callback is not specified", () => {
                    assert.doesNotThrow(() => {
                        const tw = TransWorker.createSharedInvoker(
                            "test-class-worker-bundle.js", TestClass);
                        tw.testMethod();
                    });
                });
            });
            describe("The return value", () => {
                it("should callback a return value", async () => {
                    try {
                        const tw = TransWorker.createSharedInvoker(
                            "/test-class-shared-worker-bundle.js", TestClass);
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
                            const tw = TransWorker.createSharedInvoker(
                                "/test-class-shared-worker-bundle.js", TestClass, null,
                                { "hello": message => resolve(message) });
                            tw.requestNotify("hello", "transworker");
                        });
                        assert.equal(result, "transworker");
                    } catch (err) {
                        assert.fail(err.message);
                    }
                });
            });
        });
    });
});

