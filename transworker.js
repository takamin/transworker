parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"gKk3":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=o;var e="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto),t=new Uint8Array(16);function o(){if(!e)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return e(t)}
},{}],"jqeo":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;for(var e=[],r=0;r<256;++r)e[r]=(r+256).toString(16).substr(1);function t(r,t){var o=t||0,s=e;return[s[r[o++]],s[r[o++]],s[r[o++]],s[r[o++]],"-",s[r[o++]],s[r[o++]],"-",s[r[o++]],s[r[o++]],"-",s[r[o++]],s[r[o++]],"-",s[r[o++]],s[r[o++]],s[r[o++]],s[r[o++]],s[r[o++]],s[r[o++]]].join("")}var o=t;exports.default=o;
},{}],"qgnI":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e,r,s=u(require("./rng.js")),o=u(require("./bytesToUuid.js"));function u(e){return e&&e.__esModule?e:{default:e}}var t=0,n=0;function a(u,a,d){var l=a&&d||0,i=a||[],c=(u=u||{}).node||e,v=void 0!==u.clockseq?u.clockseq:r;if(null==c||null==v){var f=u.random||(u.rng||s.default)();null==c&&(c=e=[1|f[0],f[1],f[2],f[3],f[4],f[5]]),null==v&&(v=r=16383&(f[6]<<8|f[7]))}var m=void 0!==u.msecs?u.msecs:(new Date).getTime(),q=void 0!==u.nsecs?u.nsecs:n+1,p=m-t+(q-n)/1e4;if(p<0&&void 0===u.clockseq&&(v=v+1&16383),(p<0||m>t)&&void 0===u.nsecs&&(q=0),q>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");t=m,n=q,r=v;var _=(1e4*(268435455&(m+=122192928e5))+q)%4294967296;i[l++]=_>>>24&255,i[l++]=_>>>16&255,i[l++]=_>>>8&255,i[l++]=255&_;var g=m/4294967296*1e4&268435455;i[l++]=g>>>8&255,i[l++]=255&g,i[l++]=g>>>24&15|16,i[l++]=g>>>16&255,i[l++]=v>>>8|128,i[l++]=255&v;for(var j=0;j<6;++j)i[l+j]=c[j];return a||(0,o.default)(i)}var d=a;exports.default=d;
},{"./rng.js":"gKk3","./bytesToUuid.js":"jqeo"}],"Y6ie":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=u,exports.URL=exports.DNS=void 0;var r=e(require("./bytesToUuid.js"));function e(r){return r&&r.__esModule?r:{default:r}}function t(r){var e=[];return r.replace(/[a-fA-F0-9]{2}/g,function(r){e.push(parseInt(r,16))}),e}function a(r){r=unescape(encodeURIComponent(r));for(var e=new Array(r.length),t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}var n="6ba7b810-9dad-11d1-80b4-00c04fd430c8";exports.DNS=n;var o="6ba7b811-9dad-11d1-80b4-00c04fd430c8";function u(e,u,s){var f=function(e,n,o,f){var c=o&&f||0;if("string"==typeof e&&(e=a(e)),"string"==typeof n&&(n=t(n)),!Array.isArray(e))throw TypeError("value must be an array of bytes");if(!Array.isArray(n)||16!==n.length)throw TypeError("namespace must be uuid string or an Array of 16 byte values");var i=s(n.concat(e));if(i[6]=15&i[6]|u,i[8]=63&i[8]|128,o)for(var d=0;d<16;++d)o[c+d]=i[d];return o||(0,r.default)(i)};try{f.name=e}catch(c){}return f.DNS=n,f.URL=o,f}exports.URL=o;
},{"./bytesToUuid.js":"jqeo"}],"bGV3":[function(require,module,exports) {
"use strict";function n(n){if("string"==typeof n){var u=unescape(encodeURIComponent(n));n=new Array(u.length);for(var o=0;o<u.length;o++)n[o]=u.charCodeAt(o)}return r(t(e(n),8*n.length))}function r(n){var r,t,e,u=[],o=32*n.length;for(r=0;r<o;r+=8)t=n[r>>5]>>>r%32&255,e=parseInt("0123456789abcdef".charAt(t>>>4&15)+"0123456789abcdef".charAt(15&t),16),u.push(e);return u}function t(n,r){var t,e,o,f,l;n[r>>5]|=128<<r%32,n[14+(r+64>>>9<<4)]=r;var v=1732584193,d=-271733879,s=-1732584194,g=271733878;for(t=0;t<n.length;t+=16)e=v,o=d,f=s,l=g,v=a(v,d,s,g,n[t],7,-680876936),g=a(g,v,d,s,n[t+1],12,-389564586),s=a(s,g,v,d,n[t+2],17,606105819),d=a(d,s,g,v,n[t+3],22,-1044525330),v=a(v,d,s,g,n[t+4],7,-176418897),g=a(g,v,d,s,n[t+5],12,1200080426),s=a(s,g,v,d,n[t+6],17,-1473231341),d=a(d,s,g,v,n[t+7],22,-45705983),v=a(v,d,s,g,n[t+8],7,1770035416),g=a(g,v,d,s,n[t+9],12,-1958414417),s=a(s,g,v,d,n[t+10],17,-42063),d=a(d,s,g,v,n[t+11],22,-1990404162),v=a(v,d,s,g,n[t+12],7,1804603682),g=a(g,v,d,s,n[t+13],12,-40341101),s=a(s,g,v,d,n[t+14],17,-1502002290),v=c(v,d=a(d,s,g,v,n[t+15],22,1236535329),s,g,n[t+1],5,-165796510),g=c(g,v,d,s,n[t+6],9,-1069501632),s=c(s,g,v,d,n[t+11],14,643717713),d=c(d,s,g,v,n[t],20,-373897302),v=c(v,d,s,g,n[t+5],5,-701558691),g=c(g,v,d,s,n[t+10],9,38016083),s=c(s,g,v,d,n[t+15],14,-660478335),d=c(d,s,g,v,n[t+4],20,-405537848),v=c(v,d,s,g,n[t+9],5,568446438),g=c(g,v,d,s,n[t+14],9,-1019803690),s=c(s,g,v,d,n[t+3],14,-187363961),d=c(d,s,g,v,n[t+8],20,1163531501),v=c(v,d,s,g,n[t+13],5,-1444681467),g=c(g,v,d,s,n[t+2],9,-51403784),s=c(s,g,v,d,n[t+7],14,1735328473),v=i(v,d=c(d,s,g,v,n[t+12],20,-1926607734),s,g,n[t+5],4,-378558),g=i(g,v,d,s,n[t+8],11,-2022574463),s=i(s,g,v,d,n[t+11],16,1839030562),d=i(d,s,g,v,n[t+14],23,-35309556),v=i(v,d,s,g,n[t+1],4,-1530992060),g=i(g,v,d,s,n[t+4],11,1272893353),s=i(s,g,v,d,n[t+7],16,-155497632),d=i(d,s,g,v,n[t+10],23,-1094730640),v=i(v,d,s,g,n[t+13],4,681279174),g=i(g,v,d,s,n[t],11,-358537222),s=i(s,g,v,d,n[t+3],16,-722521979),d=i(d,s,g,v,n[t+6],23,76029189),v=i(v,d,s,g,n[t+9],4,-640364487),g=i(g,v,d,s,n[t+12],11,-421815835),s=i(s,g,v,d,n[t+15],16,530742520),v=h(v,d=i(d,s,g,v,n[t+2],23,-995338651),s,g,n[t],6,-198630844),g=h(g,v,d,s,n[t+7],10,1126891415),s=h(s,g,v,d,n[t+14],15,-1416354905),d=h(d,s,g,v,n[t+5],21,-57434055),v=h(v,d,s,g,n[t+12],6,1700485571),g=h(g,v,d,s,n[t+3],10,-1894986606),s=h(s,g,v,d,n[t+10],15,-1051523),d=h(d,s,g,v,n[t+1],21,-2054922799),v=h(v,d,s,g,n[t+8],6,1873313359),g=h(g,v,d,s,n[t+15],10,-30611744),s=h(s,g,v,d,n[t+6],15,-1560198380),d=h(d,s,g,v,n[t+13],21,1309151649),v=h(v,d,s,g,n[t+4],6,-145523070),g=h(g,v,d,s,n[t+11],10,-1120210379),s=h(s,g,v,d,n[t+2],15,718787259),d=h(d,s,g,v,n[t+9],21,-343485551),v=u(v,e),d=u(d,o),s=u(s,f),g=u(g,l);return[v,d,s,g]}function e(n){var r,t=[];for(t[(n.length>>2)-1]=void 0,r=0;r<t.length;r+=1)t[r]=0;var e=8*n.length;for(r=0;r<e;r+=8)t[r>>5]|=(255&n[r/8])<<r%32;return t}function u(n,r){var t=(65535&n)+(65535&r);return(n>>16)+(r>>16)+(t>>16)<<16|65535&t}function o(n,r){return n<<r|n>>>32-r}function f(n,r,t,e,f,a){return u(o(u(u(r,n),u(e,a)),f),t)}function a(n,r,t,e,u,o,a){return f(r&t|~r&e,n,r,u,o,a)}function c(n,r,t,e,u,o,a){return f(r&e|t&~e,n,r,u,o,a)}function i(n,r,t,e,u,o,a){return f(r^t^e,n,r,u,o,a)}function h(n,r,t,e,u,o,a){return f(t^(r|~e),n,r,u,o,a)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var l=n;exports.default=l;
},{}],"vJdu":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=t(require("./v35.js")),r=t(require("./md5.js"));function t(e){return e&&e.__esModule?e:{default:e}}var u=(0,e.default)("v3",48,r.default),d=u;exports.default=d;
},{"./v35.js":"Y6ie","./md5.js":"bGV3"}],"K7Zs":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=t(require("./rng.js")),r=t(require("./bytesToUuid.js"));function t(e){return e&&e.__esModule?e:{default:e}}function u(t,u,n){var a=u&&n||0;"string"==typeof t&&(u="binary"===t?new Array(16):null,t=null);var o=(t=t||{}).random||(t.rng||e.default)();if(o[6]=15&o[6]|64,o[8]=63&o[8]|128,u)for(var l=0;l<16;++l)u[a+l]=o[l];return u||(0,r.default)(o)}var n=u;exports.default=n;
},{"./rng.js":"gKk3","./bytesToUuid.js":"jqeo"}],"MvYZ":[function(require,module,exports) {
"use strict";function r(r,e,t,n){switch(r){case 0:return e&t^~e&n;case 1:return e^t^n;case 2:return e&t^e&n^t&n;case 3:return e^t^n}}function e(r,e){return r<<e|r>>>32-e}function t(t){var n=[1518500249,1859775393,2400959708,3395469782],a=[1732584193,4023233417,2562383102,271733878,3285377520];if("string"==typeof t){var o=unescape(encodeURIComponent(t));t=new Array(o.length);for(var f=0;f<o.length;f++)t[f]=o.charCodeAt(f)}t.push(128);var u=t.length/4+2,c=Math.ceil(u/16),s=new Array(c);for(f=0;f<c;f++){s[f]=new Array(16);for(var h=0;h<16;h++)s[f][h]=t[64*f+4*h]<<24|t[64*f+4*h+1]<<16|t[64*f+4*h+2]<<8|t[64*f+4*h+3]}s[c-1][14]=8*(t.length-1)/Math.pow(2,32),s[c-1][14]=Math.floor(s[c-1][14]),s[c-1][15]=8*(t.length-1)&4294967295;for(f=0;f<c;f++){for(var l=new Array(80),v=0;v<16;v++)l[v]=s[f][v];for(v=16;v<80;v++)l[v]=e(l[v-3]^l[v-8]^l[v-14]^l[v-16],1);var i=a[0],p=a[1],d=a[2],g=a[3],w=a[4];for(v=0;v<80;v++){var y=Math.floor(v/20),A=e(i,5)+r(y,p,d,g)+w+n[y]+l[v]>>>0;w=g,g=d,d=e(p,30)>>>0,p=i,i=A}a[0]=a[0]+i>>>0,a[1]=a[1]+p>>>0,a[2]=a[2]+d>>>0,a[3]=a[3]+g>>>0,a[4]=a[4]+w>>>0}return[a[0]>>24&255,a[0]>>16&255,a[0]>>8&255,255&a[0],a[1]>>24&255,a[1]>>16&255,a[1]>>8&255,255&a[1],a[2]>>24&255,a[2]>>16&255,a[2]>>8&255,255&a[2],a[3]>>24&255,a[3]>>16&255,a[3]>>8&255,255&a[3],a[4]>>24&255,a[4]>>16&255,a[4]>>8&255,255&a[4]]}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var n=t;exports.default=n;
},{}],"K2oB":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=t(require("./v35.js")),r=t(require("./sha1.js"));function t(e){return e&&e.__esModule?e:{default:e}}var u=(0,e.default)("v5",80,r.default),s=u;exports.default=s;
},{"./v35.js":"Y6ie","./sha1.js":"MvYZ"}],"UeUD":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),Object.defineProperty(exports,"v1",{enumerable:!0,get:function(){return e.default}}),Object.defineProperty(exports,"v3",{enumerable:!0,get:function(){return r.default}}),Object.defineProperty(exports,"v4",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(exports,"v5",{enumerable:!0,get:function(){return u.default}});var e=n(require("./v1.js")),r=n(require("./v3.js")),t=n(require("./v4.js")),u=n(require("./v5.js"));function n(e){return e&&e.__esModule?e:{default:e}}
},{"./v1.js":"qgnI","./v3.js":"vJdu","./v4.js":"K7Zs","./v5.js":"K2oB"}],"XDX7":[function(require,module,exports) {
"use strict";var t=require("uuid"),e=t.v4,r=Function("return this;")(),o=r.constructor.name;function n(){"Window"==o?(this.callbacks={},this._uuid=e(),this.queryId=0,this._onNotify={},this._callbacker=null):(this.worker=r,this.client=null,this.messagePort=null,this._txObjReceiver={})}o||("[object Window]"==r?o="Window":"[object WorkerGlobalScope]"==r&&(o="DedicatedWorkerGlobalScope")),n.context=o,n.SyncTypeCallback=Function,n.SyncTypePromise=Promise,n.prototype.createInvoker=function(t,e,r,o){var a=this;this._callbacker=r,this.connectWorker(t);var i=Object.keys(e.prototype);if(this._syncType===n.SyncTypePromise){var s=!0,c=!1,p=void 0;try{for(var u,h=i[Symbol.iterator]();!(s=(u=h.next()).done);s=!0){var l=u.value;this[l]=this.createPromiseWrapper(l).bind(this)}}catch(v){c=!0,p=v}finally{try{s||null==h.return||h.return()}finally{if(c)throw p}}}else{var y=!0,f=!1,d=void 0;try{for(var b,m=i[Symbol.iterator]();!(y=(b=m.next()).done);y=!0){var k=b.value;this[k]=this.createCallbackWrapper(k).bind(this)}}catch(v){f=!0,d=v}finally{try{y||null==m.return||m.return()}finally{if(f)throw d}}}o=o||{},Object.keys(o).forEach(function(t){name in a._onNotify||(a._onNotify[t]=[]),a._onNotify[t].push(function(){for(var e=arguments.length,r=new Array(e),n=0;n<e;n++)r[n]=arguments[n];o[t].apply(a._callbacker,r)})}),this.subscribeWorkerConsole()},n.prototype.onReceiveWorkerMessage=function(t){switch(t.data.type){case"response":try{if(t.data.uuid!==this._uuid)break;this.callbacks[t.data.queryId].apply(this._callbacker,t.data.param)}catch(e){console.warn("*** exception: ",e,"in method",t.data.method,"params:",JSON.stringify(t.data.param))}delete this.callbacks[t.data.queryId];break;case"notify":try{this._onNotify[t.data.name].forEach(function(e){return e(t.data.param)})}catch(e){console.warn("*** exception: ",e,"in notify",t.data.name,"params:",JSON.stringify(t.data.param))}}},n.prototype.connectWorker=function(t){this.worker=new Worker(t),this.messagePort=this.worker,this.messagePort.onmessage=this.onReceiveWorkerMessage.bind(this)},n.prototype.subscribeWorkerConsole=function(){},n.prototype.subscribe=function(t,e){var r=this;if(!e||"function"!=typeof e)throw new Error("Could not subscribe to '".concat(t,"' with the handler of non-function"));t in this._onNotify||(this._onNotify[t]=[]),this._onNotify[t].push(function(){for(var t=arguments.length,o=new Array(t),n=0;n<t;n++)o[n]=arguments[n];return e.apply(r,o)})},n.prototype.createCallbackWrapper=function(t){var e=this;return function(){try{for(var r=e.queryId++,o=arguments.length,n=new Array(o),a=0;a<o;a++)n[a]=arguments[a];n.length>0&&"function"==typeof n.slice(-1)[0]?e.callbacks[r]=n.splice(-1,1)[0]:e.callbacks[r]=function(){},e.messagePort.postMessage({method:t,param:n,uuid:e._uuid,queryId:r})}catch(i){console.error(i.stack)}}},n.prototype.invokeMethod=function(t,e,r){var o=this;return new Promise(function(n,a){try{var i=o.queryId++;o.callbacks[i]=function(t){return n(t)},o.messagePort.postMessage({method:t,param:e,uuid:o._uuid,queryId:i},r)}catch(s){a(s)}})},n.prototype.createPromiseWrapper=function(t){var e=this;return function(){for(var r=arguments.length,o=new Array(r),n=0;n<r;n++)o[n]=arguments[n];return e.invokeMethod(t,o)}},n.prototype.transferObject=function(t,e){return this.invokeMethod("onTransferableObject",[t,e],[e])},n.prototype.createWorker=function(t){var e=this;this.client=t,this.client._transworker=this,this.publishWorkerConsole(),Object.keys(this.constructor.prototype).forEach(function(t){e.client[t]=function(){for(var r=arguments.length,o=new Array(r),n=0;n<r;n++)o[n]=arguments[n];e.constructor.prototype[t].apply(e,o)}}),this.setupOnConnect()},n.prototype.publishWorkerConsole=function(){},n.prototype.setupOnConnect=function(){this.messagePort=this.worker,this.messagePort.onmessage=this.onReceiveClientMessage.bind(this)},n.prototype.onReceiveClientMessage=function(t){var e=this,r=function(r){e.messagePort.postMessage({type:"response",uuid:t.data.uuid,queryId:t.data.queryId,method:t.data.method,param:[r]})},o=function(e){console.warn("*** exception: ",e,"in method",t.data.method,"params:",JSON.stringify(t.data.param))};try{var n=this.client[t.data.method].apply(this.client,t.data.param);n&&n.constructor===Promise?n.then(function(t){r(t)}).catch(function(t){o(t)}):r(n)}catch(a){o(a)}},n.prototype.postNotify=function(t,e){this.messagePort.postMessage({type:"notify",name:t,param:e})},n.prototype.onTransferableObject=function(t,e){this._txObjReceiver[t](e)},n.prototype.listenTransferableObject=function(t,e){this._txObjReceiver[t]=e},"Window"==n.context?(n.prototype.create=n.prototype.createInvoker,n.create=n.createInvoker):"DedicatedWorkerGlobalScope"!=n.context&&"WorkerGlobalScope"!=n.context||(n.prototype.create=n.prototype.createWorker,n.create=n.createWorker),r.TransWorker=n,module.exports=n;
},{"uuid":"UeUD"}],"aIs3":[function(require,module,exports) {
"use strict";var r=require("./transworker.js");function o(){}o.prototype=new r,o.prototype.subscribeWorkerConsole=function(){this.subscribe("TransWorker.post_log",function(r){return console.log(r)}),this.subscribe("TransWorker.post_error",function(r){return console.err(r)}),this.subscribe("TransWorker.post_warn",function(r){return console.warn(r)})},o.prototype.connectWorker=function(r){this.worker=new SharedWorker(r),this.messagePort=this.worker.port,this.messagePort.onmessage=this.onReceiveWorkerMessage.bind(this),this.messagePort.start()},o.prototype.publishWorkerConsole=function(){var r=this,o={log:this.worker.console.log,warn:this.worker.console.warn,error:this.worker.console.error},e=function(e,t){r.messagePort?r.postNotify("TransWorker.post_".concat(e),t.join(" ")):o[e].apply(r.worker,t)};this.worker.console={log:function(){for(var r=arguments.length,o=new Array(r),t=0;t<r;t++)o[t]=arguments[t];return e("log",o)},error:function(){for(var r=arguments.length,o=new Array(r),t=0;t<r;t++)o[t]=arguments[t];return e("error",o)},warn:function(){for(var r=arguments.length,o=new Array(r),t=0;t<r;t++)o[t]=arguments[t];return e("warn",o)}}},o.prototype.setupOnConnect=function(){var r=this;this.worker.onconnect=function(o){r.messagePort=o.ports[0],r.messagePort.addEventListener("message",r.onReceiveClientMessage.bind(r)),r.messagePort.start()}},module.exports=o;
},{"./transworker.js":"XDX7"}],"YOwE":[function(require,module,exports) {
"use strict";var r=Object.getOwnPropertySymbols,t=Object.prototype.hasOwnProperty,e=Object.prototype.propertyIsEnumerable;function n(r){if(null==r)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(r)}function o(){try{if(!Object.assign)return!1;var r=new String("abc");if(r[5]="de","5"===Object.getOwnPropertyNames(r)[0])return!1;for(var t={},e=0;e<10;e++)t["_"+String.fromCharCode(e)]=e;if("0123456789"!==Object.getOwnPropertyNames(t).map(function(r){return t[r]}).join(""))return!1;var n={};return"abcdefghijklmnopqrst".split("").forEach(function(r){n[r]=r}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},n)).join("")}catch(o){return!1}}module.exports=o()?Object.assign:function(o,c){for(var a,i,s=n(o),f=1;f<arguments.length;f++){for(var u in a=Object(arguments[f]))t.call(a,u)&&(s[u]=a[u]);if(r){i=r(a);for(var b=0;b<i.length;b++)e.call(a,i[b])&&(s[i[b]]=a[i[b]])}}return s};
},{}],"ebtb":[function(require,module,exports) {
module.exports=function(o){return o&&"object"==typeof o&&"function"==typeof o.copy&&"function"==typeof o.fill&&"function"==typeof o.readUInt8};
},{}],"Zvxt":[function(require,module,exports) {
"function"==typeof Object.create?module.exports=function(t,e){t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:module.exports=function(t,e){t.super_=e;var o=function(){};o.prototype=e.prototype,t.prototype=new o,t.prototype.constructor=t};
},{}],"g5IB":[function(require,module,exports) {

var t,e,n=module.exports={};function r(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function i(e){if(t===setTimeout)return setTimeout(e,0);if((t===r||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}function u(t){if(e===clearTimeout)return clearTimeout(t);if((e===o||!e)&&clearTimeout)return e=clearTimeout,clearTimeout(t);try{return e(t)}catch(n){try{return e.call(null,t)}catch(n){return e.call(this,t)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:r}catch(n){t=r}try{e="function"==typeof clearTimeout?clearTimeout:o}catch(n){e=o}}();var c,s=[],l=!1,a=-1;function f(){l&&c&&(l=!1,c.length?s=c.concat(s):a=-1,s.length&&h())}function h(){if(!l){var t=i(f);l=!0;for(var e=s.length;e;){for(c=s,s=[];++a<e;)c&&c[a].run();a=-1,e=s.length}c=null,l=!1,u(t)}}function m(t,e){this.fun=t,this.array=e}function p(){}n.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];s.push(new m(t,e)),1!==s.length||l||i(h)},m.prototype.run=function(){this.fun.apply(null,this.array)},n.title="browser",n.env={},n.argv=[],n.version="",n.versions={},n.on=p,n.addListener=p,n.once=p,n.off=p,n.removeListener=p,n.removeAllListeners=p,n.emit=p,n.prependListener=p,n.prependOnceListener=p,n.listeners=function(t){return[]},n.binding=function(t){throw new Error("process.binding is not supported")},n.cwd=function(){return"/"},n.chdir=function(t){throw new Error("process.chdir is not supported")},n.umask=function(){return 0};
},{}],"KpDW":[function(require,module,exports) {
var global = arguments[3];
var process = require("process");
var e=arguments[3],t=require("process"),r=/%[sdj%]/g;exports.format=function(e){if(!v(e)){for(var t=[],n=0;n<arguments.length;n++)t.push(i(arguments[n]));return t.join(" ")}n=1;for(var o=arguments,s=o.length,u=String(e).replace(r,function(e){if("%%"===e)return"%";if(n>=s)return e;switch(e){case"%s":return String(o[n++]);case"%d":return Number(o[n++]);case"%j":try{return JSON.stringify(o[n++])}catch(t){return"[Circular]"}default:return e}}),c=o[n];n<s;c=o[++n])h(c)||!z(c)?u+=" "+c:u+=" "+i(c);return u},exports.deprecate=function(r,n){if(j(e.process))return function(){return exports.deprecate(r,n).apply(this,arguments)};if(!0===t.noDeprecation)return r;var o=!1;return function(){if(!o){if(t.throwDeprecation)throw new Error(n);t.traceDeprecation?console.trace(n):console.error(n),o=!0}return r.apply(this,arguments)}};var n,o={};function i(e,t){var r={seen:[],stylize:u};return arguments.length>=3&&(r.depth=arguments[2]),arguments.length>=4&&(r.colors=arguments[3]),x(t)?r.showHidden=t:t&&exports._extend(r,t),j(r.showHidden)&&(r.showHidden=!1),j(r.depth)&&(r.depth=2),j(r.colors)&&(r.colors=!1),j(r.customInspect)&&(r.customInspect=!0),r.colors&&(r.stylize=s),p(r,e,r.depth)}function s(e,t){var r=i.styles[t];return r?"["+i.colors[r][0]+"m"+e+"["+i.colors[r][1]+"m":e}function u(e,t){return e}function c(e){var t={};return e.forEach(function(e,r){t[e]=!0}),t}function p(e,t,r){if(e.customInspect&&t&&D(t.inspect)&&t.inspect!==exports.inspect&&(!t.constructor||t.constructor.prototype!==t)){var n=t.inspect(r,e);return v(n)||(n=p(e,n,r)),n}var o=l(e,t);if(o)return o;var i=Object.keys(t),s=c(i);if(e.showHidden&&(i=Object.getOwnPropertyNames(t)),E(t)&&(i.indexOf("message")>=0||i.indexOf("description")>=0))return a(t);if(0===i.length){if(D(t)){var u=t.name?": "+t.name:"";return e.stylize("[Function"+u+"]","special")}if(O(t))return e.stylize(RegExp.prototype.toString.call(t),"regexp");if(w(t))return e.stylize(Date.prototype.toString.call(t),"date");if(E(t))return a(t)}var x,h="",b=!1,m=["{","}"];(d(t)&&(b=!0,m=["[","]"]),D(t))&&(h=" [Function"+(t.name?": "+t.name:"")+"]");return O(t)&&(h=" "+RegExp.prototype.toString.call(t)),w(t)&&(h=" "+Date.prototype.toUTCString.call(t)),E(t)&&(h=" "+a(t)),0!==i.length||b&&0!=t.length?r<0?O(t)?e.stylize(RegExp.prototype.toString.call(t),"regexp"):e.stylize("[Object]","special"):(e.seen.push(t),x=b?f(e,t,r,s,i):i.map(function(n){return g(e,t,r,s,n,b)}),e.seen.pop(),y(x,h,m)):m[0]+h+m[1]}function l(e,t){if(j(t))return e.stylize("undefined","undefined");if(v(t)){var r="'"+JSON.stringify(t).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return e.stylize(r,"string")}return m(t)?e.stylize(""+t,"number"):x(t)?e.stylize(""+t,"boolean"):h(t)?e.stylize("null","null"):void 0}function a(e){return"["+Error.prototype.toString.call(e)+"]"}function f(e,t,r,n,o){for(var i=[],s=0,u=t.length;s<u;++s)$(t,String(s))?i.push(g(e,t,r,n,String(s),!0)):i.push("");return o.forEach(function(o){o.match(/^\d+$/)||i.push(g(e,t,r,n,o,!0))}),i}function g(e,t,r,n,o,i){var s,u,c;if((c=Object.getOwnPropertyDescriptor(t,o)||{value:t[o]}).get?u=c.set?e.stylize("[Getter/Setter]","special"):e.stylize("[Getter]","special"):c.set&&(u=e.stylize("[Setter]","special")),$(n,o)||(s="["+o+"]"),u||(e.seen.indexOf(c.value)<0?(u=h(r)?p(e,c.value,null):p(e,c.value,r-1)).indexOf("\n")>-1&&(u=i?u.split("\n").map(function(e){return"  "+e}).join("\n").substr(2):"\n"+u.split("\n").map(function(e){return"   "+e}).join("\n")):u=e.stylize("[Circular]","special")),j(s)){if(i&&o.match(/^\d+$/))return u;(s=JSON.stringify(""+o)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(s=s.substr(1,s.length-2),s=e.stylize(s,"name")):(s=s.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),s=e.stylize(s,"string"))}return s+": "+u}function y(e,t,r){return e.reduce(function(e,t){return 0,t.indexOf("\n")>=0&&0,e+t.replace(/\u001b\[\d\d?m/g,"").length+1},0)>60?r[0]+(""===t?"":t+"\n ")+" "+e.join(",\n  ")+" "+r[1]:r[0]+t+" "+e.join(", ")+" "+r[1]}function d(e){return Array.isArray(e)}function x(e){return"boolean"==typeof e}function h(e){return null===e}function b(e){return null==e}function m(e){return"number"==typeof e}function v(e){return"string"==typeof e}function S(e){return"symbol"==typeof e}function j(e){return void 0===e}function O(e){return z(e)&&"[object RegExp]"===A(e)}function z(e){return"object"==typeof e&&null!==e}function w(e){return z(e)&&"[object Date]"===A(e)}function E(e){return z(e)&&("[object Error]"===A(e)||e instanceof Error)}function D(e){return"function"==typeof e}function N(e){return null===e||"boolean"==typeof e||"number"==typeof e||"string"==typeof e||"symbol"==typeof e||void 0===e}function A(e){return Object.prototype.toString.call(e)}function J(e){return e<10?"0"+e.toString(10):e.toString(10)}exports.debuglog=function(e){if(j(n)&&(n=""),e=e.toUpperCase(),!o[e])if(new RegExp("\\b"+e+"\\b","i").test(n)){var r=t.pid;o[e]=function(){var t=exports.format.apply(exports,arguments);console.error("%s %d: %s",e,r,t)}}else o[e]=function(){};return o[e]},exports.inspect=i,i.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},i.styles={special:"cyan",number:"yellow",boolean:"yellow",undefined:"grey",null:"bold",string:"green",date:"magenta",regexp:"red"},exports.isArray=d,exports.isBoolean=x,exports.isNull=h,exports.isNullOrUndefined=b,exports.isNumber=m,exports.isString=v,exports.isSymbol=S,exports.isUndefined=j,exports.isRegExp=O,exports.isObject=z,exports.isDate=w,exports.isError=E,exports.isFunction=D,exports.isPrimitive=N,exports.isBuffer=require("./support/isBuffer");var R=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function H(){var e=new Date,t=[J(e.getHours()),J(e.getMinutes()),J(e.getSeconds())].join(":");return[e.getDate(),R[e.getMonth()],t].join(" ")}function $(e,t){return Object.prototype.hasOwnProperty.call(e,t)}exports.log=function(){console.log("%s - %s",H(),exports.format.apply(exports,arguments))},exports.inherits=require("inherits"),exports._extend=function(e,t){if(!t||!z(t))return e;for(var r=Object.keys(t),n=r.length;n--;)e[r[n]]=t[r[n]];return e};
},{"./support/isBuffer":"ebtb","inherits":"Zvxt","process":"g5IB"}],"g2FE":[function(require,module,exports) {
var global = arguments[3];
var t=arguments[3],e=require("object-assign");function r(t,e){if(t===e)return 0;for(var r=t.length,n=e.length,i=0,o=Math.min(r,n);i<o;++i)if(t[i]!==e[i]){r=t[i],n=e[i];break}return r<n?-1:n<r?1:0}function n(e){return t.Buffer&&"function"==typeof t.Buffer.isBuffer?t.Buffer.isBuffer(e):!(null==e||!e._isBuffer)}var i=require("util/"),o=Object.prototype.hasOwnProperty,u=Array.prototype.slice,a="foo"===function(){}.name;function c(t){return Object.prototype.toString.call(t)}function f(e){return!n(e)&&("function"==typeof t.ArrayBuffer&&("function"==typeof ArrayBuffer.isView?ArrayBuffer.isView(e):!!e&&(e instanceof DataView||!!(e.buffer&&e.buffer instanceof ArrayBuffer))))}var s=module.exports=q,l=/\s*function\s+([^\(\s]*)\s*/;function p(t){if(i.isFunction(t)){if(a)return t.name;var e=t.toString().match(l);return e&&e[1]}}function g(t,e){return"string"==typeof t?t.length<e?t:t.slice(0,e):t}function E(t){if(a||!i.isFunction(t))return i.inspect(t);var e=p(t);return"[Function"+(e?": "+e:"")+"]"}function h(t){return g(E(t.actual),128)+" "+t.operator+" "+g(E(t.expected),128)}function y(t,e,r,n,i){throw new s.AssertionError({message:r,actual:t,expected:e,operator:n,stackStartFunction:i})}function q(t,e){t||y(t,!0,e,"==",s.ok)}function d(t,e,o,u){if(t===e)return!0;if(n(t)&&n(e))return 0===r(t,e);if(i.isDate(t)&&i.isDate(e))return t.getTime()===e.getTime();if(i.isRegExp(t)&&i.isRegExp(e))return t.source===e.source&&t.global===e.global&&t.multiline===e.multiline&&t.lastIndex===e.lastIndex&&t.ignoreCase===e.ignoreCase;if(null!==t&&"object"==typeof t||null!==e&&"object"==typeof e){if(f(t)&&f(e)&&c(t)===c(e)&&!(t instanceof Float32Array||t instanceof Float64Array))return 0===r(new Uint8Array(t.buffer),new Uint8Array(e.buffer));if(n(t)!==n(e))return!1;var a=(u=u||{actual:[],expected:[]}).actual.indexOf(t);return-1!==a&&a===u.expected.indexOf(e)||(u.actual.push(t),u.expected.push(e),b(t,e,o,u))}return o?t===e:t==e}function m(t){return"[object Arguments]"==Object.prototype.toString.call(t)}function b(t,e,r,n){if(null==t||null==e)return!1;if(i.isPrimitive(t)||i.isPrimitive(e))return t===e;if(r&&Object.getPrototypeOf(t)!==Object.getPrototypeOf(e))return!1;var o=m(t),a=m(e);if(o&&!a||!o&&a)return!1;if(o)return d(t=u.call(t),e=u.call(e),r);var c,f,s=A(t),l=A(e);if(s.length!==l.length)return!1;for(s.sort(),l.sort(),f=s.length-1;f>=0;f--)if(s[f]!==l[f])return!1;for(f=s.length-1;f>=0;f--)if(!d(t[c=s[f]],e[c],r,n))return!1;return!0}function v(t,e,r){d(t,e,!0)&&y(t,e,r,"notDeepStrictEqual",v)}function x(t,e){if(!t||!e)return!1;if("[object RegExp]"==Object.prototype.toString.call(e))return e.test(t);try{if(t instanceof e)return!0}catch(r){}return!Error.isPrototypeOf(e)&&!0===e.call({},t)}function S(t){var e;try{t()}catch(r){e=r}return e}function w(t,e,r,n){var o;if("function"!=typeof e)throw new TypeError('"block" argument must be a function');"string"==typeof r&&(n=r,r=null),o=S(e),n=(r&&r.name?" ("+r.name+").":".")+(n?" "+n:"."),t&&!o&&y(o,r,"Missing expected exception"+n);var u="string"==typeof n,a=!t&&o&&!r;if((!t&&i.isError(o)&&u&&x(o,r)||a)&&y(o,r,"Got unwanted exception"+n),t&&o&&r&&!x(o,r)||!t&&o)throw o}function O(t,e){t||y(t,!0,e,"==",O)}s.AssertionError=function(t){this.name="AssertionError",this.actual=t.actual,this.expected=t.expected,this.operator=t.operator,t.message?(this.message=t.message,this.generatedMessage=!1):(this.message=h(this),this.generatedMessage=!0);var e=t.stackStartFunction||y;if(Error.captureStackTrace)Error.captureStackTrace(this,e);else{var r=new Error;if(r.stack){var n=r.stack,i=p(e),o=n.indexOf("\n"+i);if(o>=0){var u=n.indexOf("\n",o+1);n=n.substring(u+1)}this.stack=n}}},i.inherits(s.AssertionError,Error),s.fail=y,s.ok=q,s.equal=function(t,e,r){t!=e&&y(t,e,r,"==",s.equal)},s.notEqual=function(t,e,r){t==e&&y(t,e,r,"!=",s.notEqual)},s.deepEqual=function(t,e,r){d(t,e,!1)||y(t,e,r,"deepEqual",s.deepEqual)},s.deepStrictEqual=function(t,e,r){d(t,e,!0)||y(t,e,r,"deepStrictEqual",s.deepStrictEqual)},s.notDeepEqual=function(t,e,r){d(t,e,!1)&&y(t,e,r,"notDeepEqual",s.notDeepEqual)},s.notDeepStrictEqual=v,s.strictEqual=function(t,e,r){t!==e&&y(t,e,r,"===",s.strictEqual)},s.notStrictEqual=function(t,e,r){t===e&&y(t,e,r,"!==",s.notStrictEqual)},s.throws=function(t,e,r){w(!0,t,e,r)},s.doesNotThrow=function(t,e,r){w(!1,t,e,r)},s.ifError=function(t){if(t)throw t},s.strict=e(O,s,{equal:s.strictEqual,deepEqual:s.deepStrictEqual,notEqual:s.notStrictEqual,notDeepEqual:s.notDeepStrictEqual}),s.strict.strict=s.strict;var A=Object.keys||function(t){var e=[];for(var r in t)o.call(t,r)&&e.push(r);return e};
},{"object-assign":"YOwE","util/":"KpDW"}],"VIds":[function(require,module,exports) {
"use strict";var e=require("assert"),s=require("./transworker.js");function y(y){(y=y||{shared:!1,syncType:s.SyncTypeCallback}).shared=null!=y.shared&&y.shared,y.syncType=null!=y.syncType?y.syncType:s.SyncTypeCallback,e.ok("boolean"==typeof y.shared&&(y.syncType===s.SyncTypeCallback||y.syncType===s.SyncTypePromise)),this.shared=y.shared,this.syncType=y.syncType}module.exports=y;
},{"assert":"g2FE","./transworker.js":"XDX7"}],"Focm":[function(require,module,exports) {
"use strict";var e=require("./lib/transworker.js"),r=e,n=require("./lib/shared-transworker.js");e.Options=require("./lib/transworker-options.js"),e.createInterface=function(t,o,a){a=a||new e.Options,t.constructor!==e.Options&&(a=new e.Options(a));var c=a.shared?new n:new r;return c._shared=a.shared,c._syncType=a.syncType,c.createInvoker(t,o),c},e.createInvoker=function(n,t,o,a){var c=new r;return c._syncType=e.SyncTypeCallback,c.createInvoker(n,t,o,a),c},e.createSharedInvoker=function(r,t,o,a){var c=new n;return c._syncType=e.SyncTypeCallback,c.createInvoker(r,t,o,a),c},e.createWorker=function(e){var n=new r;return"function"==typeof e&&(e=new e),n.createWorker(e),n},e.createSharedWorker=function(e){var r=new n;return"function"==typeof e&&(e=new e),r.createWorker(e),r},module.exports=e;
},{"./lib/transworker.js":"XDX7","./lib/shared-transworker.js":"aIs3","./lib/transworker-options.js":"VIds"}]},{},["Focm"], null)
//# sourceMappingURL=/transworker.js.map