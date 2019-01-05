"use strict"
const assert = require("chai").assert;
const TransWorker = require("../index.js");
const TestClass = require("./test-class.js");
describe("TransWorker", () => {
    describe("createInterface", () => {
        describe("without options", () => {
            it("should creates DedicatedWorker", () => {
                const tw = TransWorker.createInterface(
                    "test-class-worker-bundle.js", TestClass);
                assert.isFalse(tw._shared);
            });
            it("should creates wrappers that is resolved by callback", () => {
                const tw = TransWorker.createInterface(
                    "test-class-worker-bundle.js", TestClass);
                assert.equal(tw._syncType, Function);
            });
        });
        it("should creates DedicatedWorker specified by options", () => {
            const tw = TransWorker.createInterface(
                "test-class-worker-bundle.js", TestClass,
                { shared: false }
            );
            assert.isFalse(tw._shared);
            assert.equal(tw._syncType, Function);
        });
        it("should creates SharedWorker specified by options", () => {
            const tw = TransWorker.createInterface(
                "test-class-shared-worker-bundle.js", TestClass,
                { shared: true }
            );
            assert.isTrue(tw._shared);
            assert.equal(tw._syncType, Function);
        });
        it("should creates DedicatedWorker resolved by Callback", () => {
            const tw = TransWorker.createInterface(
                "test-class-worker-bundle.js", TestClass,
                { syncType: TransWorker.SyncTypeCallback }
            );
            assert.isFalse(tw._shared);
            assert.equal(tw._syncType, TransWorker.SyncTypeCallback);
        });
        it("should creates DedicatedWorker resolved by Promise", () => {
            const tw = TransWorker.createInterface(
                "test-class-worker-bundle.js", TestClass,
                { syncType: TransWorker.SyncTypePromise }
            );
            assert.isFalse(tw._shared);
            assert.equal(tw._syncType, TransWorker.SyncTypePromise);
        });
        it("should creates SharedWorker and Promise wrappers with options", () => {
            const tw = TransWorker.createInterface(
                "test-class-shared-worker-bundle.js", TestClass, {
                    shared: true,
                    syncType: TransWorker.SyncTypePromise,
                }
            );
            assert.isTrue(tw._shared);
            assert.equal(tw._syncType, TransWorker.SyncTypePromise);
        });
        describe("syncType = Promise", () => {
            it("should create a wrapper that returns promise", () => {
                assert.doesNotThrow(() => {
                    const tw = TransWorker.createInterface(
                        "test-class-worker-bundle.js", TestClass,
                        { syncType: TransWorker.SyncTypePromise });
                    assert.equal(
                        tw.testMethod().constructor,
                        TransWorker.SyncTypePromise);
                });
            });
            it("should callback a return value", async () => {
                try {
                    const tw = TransWorker.createInterface(
                        "/test-class-worker-bundle.js", TestClass,
                        { syncType: TransWorker.SyncTypePromise });
                    assert.equal(await tw.testMethod(), "TestClass.testMethod");
                } catch (err) {
                    assert.fail(err.message);
                }
            });
            it("should transport all parameters to worker even if the callback is omitted (issue#14)", async () => {
                try {
                    const result = await new Promise( resolve => {
                        const tw = TransWorker.createInterface(
                            "/test-class-worker-bundle.js", TestClass, null,
                            { syncType: TransWorker.SyncTypePromise });
                        tw.subscribe("hello", message => resolve(message));
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
