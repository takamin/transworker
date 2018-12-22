function Prime() {
    this.primes = [];
    this.tid = null;
}

Prime.prototype.start = function() {
    if(this.tid != null) {
        console.log("Already started");
        return;
    }
    let prime = 1;
    this.tid = setInterval(()=> {
        let i = 0;
        while(i < 1) {
            prime = this.getNextPrimeOf(prime)
            this.primes.push(prime);
            this._transworker.postNotify("primeNumber", prime);
            i++;
        }
    }, 1);
};

Prime.prototype.getNextPrimeOf = function(n) {
    for(;;) {
        n++;
        if(this.isPrime(n)) {
            return n;
        }
    }
};
Prime.prototype.isPrime = function(n) {
    for(const prime of this.primes) {
        if((n % prime) == 0) {
            return false;
        }
    }
    return true;
};

module.exports = Prime;
