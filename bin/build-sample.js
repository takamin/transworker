#!/usr/bin/env node
"use strict";
const Bundler = require('./lib/bundler.js');
const Path = require('path');
(async function() {
    try {
        const builds = [
            {
                outdir: "./sample/meteor-shower",
                bundles: {
                    "meteor-shower-worker-bundle.js":
                        Path.join("sample", "meteor-shower", "meteor-shower-worker.js"),
                    "app-bundle.js":
                        Path.join("sample", "meteor-shower", "app.js"),
                },
            },
            {
                outdir: "./sample/prime",
                bundles: {
                    "prime-worker-bundle.js":
                        Path.join("sample", "prime", "prime-worker.js"),
                    "app-bundle.js":
                        Path.join("sample", "prime", "app.js"),
                },
            },
        ];
        for(const build of builds) {
            await Bundler.build(build.bundles, build.outdir);
        }
    } catch(err) {
        console.error(`Error: ${err.message}`);
        process.exit(-1);
    }
})();

