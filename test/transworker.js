"use strict"
const assert = require("chai").assert;
const TransWorker = require("../transworker.js");
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
        describe("wrapper function", async () => {
            it("should be invoked with callback", () => {
                assert.doesNotThrow(() => {
                    const tw = TransWorker.createInvoker(
                        "test-class-worker-bundle.js", TestClass);
                    tw.testMethod(() => {});
                });
            });
            it("should be invoked without callback", () => {
                assert.doesNotThrow(() => {
                    const tw = TransWorker.createInvoker(
                        "test-class-worker-bundle.js", TestClass);
                    tw.testMethod();
                });
            });
            it("should notify a value as parameters of callback", async () => {
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
        });
    });
});
