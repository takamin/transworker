importScripts('../transworker.js', 'prime.js');

//Constructor
function PrimeWorker() {
    //Set constructor
    this.constructor = PrimeWorker;

    // Craete client class object and TransWorker
    TransWorker.prototype.create.call(this, new Prime());
}

//This inherits the TrasnWorker
PrimeWorker.prototype = new TransWorker();

new PrimeWorker(); //Create
