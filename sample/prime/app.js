const TransWorker = require("../../index.js");
const Prime = require("./prime.js");
const result = document.getElementById('result');
const primeWorker = TransWorker.createSharedInvoker(
    "./prime-worker-bundle.js", Prime);
primeWorker.subscribe("primeNumber", primeNumber => {
    const spanPrime = document.createElement('SPAN');
    spanPrime.innerHTML = primeNumber;
    result.appendChild(spanPrime);
});
primeWorker.start();
