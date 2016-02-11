transworker
===========

DESCRIPTION
-----------

このTransWorkerクラスは、スレッドを超えて、特定のクラスオブジェクトのメソッドを呼び出す機能を提供します。

This TransWorker class provides the ability to call a method of a particular class object beyond the thread.

![](image/readme_top.png "TransWorker")
photo credit: <a href="http://www.flickr.com/photos/57763385@N03/16058283699">Pallet</a> via <a href="http://photopin.com">photopin</a> <a href="https://creativecommons.org/licenses/by-nc-nd/2.0/">(license)</a>


USAGE
------

ここでは、順番に素数を見つける簡単なクラスを使用して、TransWorkerの使用方法を説明します。

Here is an explanation of TransWorker class using a simple class to find prime number.

### 1. クライアントクラスの実装 / Implement a 'client-class'

以下のような、実際にサブスレッドで動作させるクラスを作成します。
このクラスを「クライアントクラス」と呼ぶことにします。

Write a class called 'client-class' that works in sub-thread.

Like followings:


__prime.js__

```
function Prime() {
    this.primes = [];
    this.num = 1;
}
Prime.prototype.isPrime = function(n) {
    for(var i = 0; i < this.primes.length; i++) {
        if((n % this.primes[i]) == 0) {
            console.log("A", n,
                    "is not a prime",
                    "cause it was divided by a prime",
                    this.primes[i]);
            return false;
        }
    }
    console.log("Found a ", this.num, "as prime.");
    return true;
}
Prime.prototype.getNextPrime = function() {
    while(true) {
        this.num++;
        if(this.isPrime(this.num)) {
            this.primes.push(this.num);
            return this.num;
        }
    }
    return null;
};
```

### 2. Web Worker スクリプトを作成 / Create Web Worker script

Web Workerとして読み込まれるスクリプトを作成します。
最低限、以下の実装になります。

Create a script loaded as Web Worker. At least, it will be following codes.

__prime\_worker.js__

```
importScripts('../transworker.js', 'prime.js');

//Constructor
function PrimeWorker() {
    //Set constructor
    this.constructor = PrimeWorker;

    // Craete client class object and TransWorker
    TransWorker.prototype.create.call(this, new Prime());
}

//This inherits the TransWorker
PrimeWorker.prototype = new TransWorker();

new PrimeWorker(); //Create
```

### 3. 動作させるためのコードを書く / Write caller codes

以下のHTMLファイルでは、Primeクラスを、メインスレッドとサブスレッド両方で動作させています。

両者のコード上の違いは、見つかった素数の受け取り方です。
シングルスレッドバージョンの戻り値は、サブスレッドバージョンでは非同期のコールバックで返されます。

ある素数よりも次に大きい素数を得るのは、そんなに重たい処理ではありませんし、
このページには処理をブロックする要素もないため、両者の速度に違いはほとんどありません。

Following HTML, It runs the Prime class in both main-thread
and sub-thread.

One difference is that the returning value in single-thread-
model is to be passed by async callback function specified
when it called.

__prime.html__

```
<!doctype HTML>
<html>
<head>
<title>Prime</title>
<style type="text/css">
span { display:inline-block; padding:10px; margin:2px; }
.label {
    width:120px; text-align:center;
    background-color:silver; border: solid gray 1px; }
</style>
</head>
<body>
<h1>Prime</h1>
<div>
    <span class="label">Single Thread</span>
    <span id="lastResultSt" class="lastResult"></span>
</div>
<div>
    <span class="label">Woker Thread</span>
    <span id="lastResultMt" class="lastResult"></span>
</div>
<script src="prime.js"></script>
<script src="../transworker.js"></script>
<script type="text/javascript">
(function() {
    var lastResultSt = document.getElementById('lastResultSt');
    var prime = new Prime();
    window.setInterval(function() {
        (function(num) {
            lastResultSt.innerHTML = JSON.stringify(num);
        }(prime.getNextPrime()));
    }, 1);

    var lastResultMt = document.getElementById('lastResultMt');
    var prime_worker = new TransWorker();
    prime_worker.create("./prime_worker.js", Prime, this);
    window.setInterval(function() {
        prime_worker.getNextPrime(function(num) {
            lastResultMt.innerHTML = JSON.stringify(num);
        });
    }, 1);
}());
</script>
</body>
</html>
```


LICENSE
-------

MIT
