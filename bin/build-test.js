#!/usr/bin/env node
"use strict";
const Bundler = require('./lib/bundler.js');
const Path = require('path');
(async function() {
    try {
        const bundles = {
            "test-class-worker-bundle.js":
                Path.join("test", "test-class-worker.js"),
            "test-class-shared-worker-bundle.js":
                Path.join("test", "test-class-shared-worker.js"),
        };
        await Bundler.build(bundles);
    } catch(err) {
        console.error(`Error: ${err.message}`);
        process.exit(-1);
    }
})();
