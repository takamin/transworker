const result = document.getElementById('result');
const primeWorker = TransWorker.createSharedInvoker(
    "./prime-worker.js", Prime);
primeWorker.subscribe("primeNumber", primeNumber => {
    const spanPrime = document.createElement('SPAN');
    spanPrime.innerHTML = primeNumber;
    result.appendChild(spanPrime);
});
primeWorker.start();
