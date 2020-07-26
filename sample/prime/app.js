/* globals Prime, TransWorker */
const result = document.getElementById('result');
const primeWorker = TransWorker.createInterface(
    "./prime-worker.js", Prime, { shared: true });
primeWorker.subscribe("primeNumber", primeNumber => {
    const spanPrime = document.createElement('SPAN');
    spanPrime.innerHTML = primeNumber;
    result.appendChild(spanPrime);
});
primeWorker.start();
