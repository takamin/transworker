parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"Focm":[function(require,module,exports) {
"use strict";function t(){}var e=Function("return this;")(),r=e.constructor.name;r||("[object Window]"==e?r="Window":"[object WorkerGlobalScope]"==e&&(r="DedicatedWorkerGlobalScope")),t.context=r,t.createInvoker=function(e,r,o,a){var n=new t;return n.createInvoker(e,r,o,a),n},t.prototype.createInvoker=function(t,e,r,o){var a;this.worker=new Worker(t),this.createWrappers(Object.keys(e.prototype)),this.callbacks={},this.queryId=0,this.onNotify={},this.worker.onmessage=(a=this,function(t){switch(t.data.type){case"response":try{a.callbacks[t.data.queryId].apply(r,t.data.param)}catch(e){console.warn("*** exception: ",e,"in method",t.data.method,"params:",JSON.stringify(t.data.param))}delete a.callbacks[t.data.queryId];break;case"notify":try{a.onNotify[t.data.name](t.data.param)}catch(e){console.warn("*** exception: ",e,"in notify",t.data.name,"params:",JSON.stringify(t.data.param))}}}),o=o||{},Object.keys(o).forEach(function(t){this.onNotify[t]=function(){o[t].apply(r,arguments)}},this)},t.prototype.subscribe=function(t,e){var r=this;if(!e||"function"!=typeof e)throw new Error("Could not subscribe to '".concat(t,"' with the handler of non-function"));if(t in this.onNotify)throw new Error("Could not subscribe to '".concat(t,"' because it already exists"));this.onNotify[t]=function(){for(var t=arguments.length,o=new Array(t),a=0;a<t;a++)o[a]=arguments[a];return e.apply(r,o)}},t.prototype.createWrappers=function(e){var r=!0,o=!1,a=void 0;try{for(var n,c=e[Symbol.iterator]();!(r=(n=c.next()).done);r=!0){var i=n.value;t.prototype[i]=this.wrapper(i)}}catch(s){o=!0,a=s}finally{try{r||null==c.return||c.return()}finally{if(o)throw a}}},t.prototype.wrapper=function(t){return function(){var e=this.queryId++,r=Array.from(arguments);r.length>0&&"function"==typeof r.slice(-1)[0]?this.callbacks[e]=r.splice(-1,1)[0]:this.callbacks[e]=function(){},this.worker.postMessage({method:t,param:r,queryId:e})}},t.createWorker=function(e){var r=new t;return"function"==typeof e&&(e=new e),r.createWorker(e),r},t.prototype.createWorker=function(t){var r;this.worker=e,this.client=t,this.client._transworker=this,r=this,Object.keys(r.constructor.prototype).forEach(function(t){r.client[t]=function(){r.constructor.prototype[t].apply(r,arguments)}}),r.worker.onmessage=function(t){try{r.worker.postMessage({type:"response",queryId:t.data.queryId,method:t.data.method,param:[r.client[t.data.method].apply(r.client,t.data.param)]})}catch(e){console.warn("*** exception: ",e,"in method",t.data.method,"params:",JSON.stringify(t.data.param))}}},t.prototype.postNotify=function(t,e){this.worker.postMessage({type:"notify",name:t,param:e})},"Window"==t.context?(t.create=t.createInvoker,t.prototype.create=t.prototype.createInvoker):"DedicatedWorkerGlobalScope"!=t.context&&"WorkerGlobalScope"!=t.context||(t.create=t.createWorker,t.prototype.create=t.prototype.createWorker),e.TransWorker=t;try{module.exports=t}catch(o){}
},{}]},{},["Focm"], null)
//# sourceMappingURL=/transworker.map