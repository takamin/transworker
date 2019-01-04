"use strict"
const assert = require("chai").assert;
const TransWorker = require("../index.js");
describe("TransWorker.Options", () => {
    describe("constructor", () => {
        it("should create no-shared when the param is omitted", ()=>{
            const opt = new TransWorker.Options();
            assert.isFalse(opt.shared);
            assert.equal(opt.syncType, TransWorker.SyncTypeCallback);
        });
        it("should create sync with callback when the param is omitted", ()=>{
            const opt = new TransWorker.Options();
            assert.isFalse(opt.shared);
            assert.equal(opt.syncType, TransWorker.SyncTypeCallback);
        });
        it("should create no-shared when only 'shared' is specified", ()=>{
            const opt = new TransWorker.Options({shared: false});
            assert.isFalse(opt.shared);
            assert.equal(opt.syncType, TransWorker.SyncTypeCallback);
        });
        it("should create sync with callback when only 'syncType' is specified", ()=>{
            const opt = new TransWorker.Options({
                syncType: TransWorker.SyncTypeCallback,
            });
            assert.isFalse(opt.shared);
            assert.equal(opt.syncType, TransWorker.SyncTypeCallback);
        });
        it("should create shared when only 'shared' is specified", ()=>{
            const opt = new TransWorker.Options({shared: true});
            assert.isTrue(opt.shared);
            assert.equal(opt.syncType, TransWorker.SyncTypeCallback);
        });
        it("should create sync with promise when only 'syncType' is specified", ()=>{
            const opt = new TransWorker.Options({
                syncType: TransWorker.SyncTypePromise,
            });
            assert.isFalse(opt.shared);
            assert.equal(opt.syncType, TransWorker.SyncTypePromise);
        });
        describe("Invalid shared option", ()=>{
            it("should throw when 'shared' is string", ()=>{
                assert.throw(() => (new TransWorker.Options({ shared: "shared" })));
            });
            it("should throw when 'shared' is number", ()=>{
                assert.throw(() => (new TransWorker.Options({ shared: 0 })));
            });
            it("should throw when 'shared' is object", ()=>{
                assert.throw(() => (new TransWorker.Options({ shared: {} })));
            });
            it("should throw when 'shared' is function", ()=>{
                assert.throw(() => (new TransWorker.Options({ shared: ()=>{} })));
            });
        });
        describe("Invalid syncType option", ()=>{
            it("should throw when 'syncType' is string", ()=>{
                assert.throw(() => (new TransWorker.Options({ syncType: "shared" })));
            });
            it("should throw when 'syncType' is number", ()=>{
                assert.throw(() => (new TransWorker.Options({ syncType: 0 })));
            });
            it("should throw when 'syncType' is object", ()=>{
                assert.throw(() => (new TransWorker.Options({ syncType: {} })));
            });
            it("should throw when 'syncType' is boolean", ()=>{
                assert.throw(() => (new TransWorker.Options({ syncType: true })));
            });
        });
    });
});

