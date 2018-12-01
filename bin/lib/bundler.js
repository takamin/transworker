"use strict";
const Bundler = require('parcel-bundler');
const Path = require('path');
module.exports = {
    build: async (bundles, outDir) => {
        outDir = outDir || "./dist";
        for(const outFile in bundles) {
            const srcFile = Path.join(__dirname, "..", "..", bundles[outFile]);
            const bundler = new Bundler(srcFile, {
                outDir: outDir, // The out directory to put the build files in, defaults to dist
                outFile: outFile, // The name of the outputFile
                publicUrl: './', // The url to server on, defaults to dist
                watch: false, // whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
                cache: true, // Enabled or disables caching, defaults to true
                cacheDir: '.cache', // The directory cache gets put in, defaults to .cache
                contentHash: false, // Disable content hash from being included on the filename
                minify: false, // Minify files, enabled if process.env.NODE_ENV === 'production'
                scopeHoist: false, // turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
                target: 'browser', // browser/node/electron, defaults to browser
                https: { // Define a custom {key, cert} pair, use true to generate one or false to use http
                    cert: './ssl/c.crt', // path to custom certificate
                    key: './ssl/k.key' // path to custom key
                },
                logLevel: 3, // 3 = log everything, 2 = log warnings & errors, 1 = log errors
                hmr: false, //Enable or disable HMR while watching
                hmrPort: 0, // The port the HMR socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
                sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (minified builds currently always create sourcemaps)
                hmrHostname: '', // A hostname for hot module reload, default to ''
                detailedReport: false // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
            });
            await bundler.bundle();
        }
    },
};
