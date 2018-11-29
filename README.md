transworker - WebWorker リモートメソッド呼び出しヘルパー
========================================================

![](image/readme_top.png "TransWorker")  
photo credit: <a href="http://www.flickr.com/photos/57763385@N03/16058283699">Pallet</a>
via <a href="http://photopin.com">photopin</a>
<a href="https://creativecommons.org/licenses/by-nc-nd/2.0/">(license)</a>

概要
----

TransWorkerは__WebWorkerのリモートメソッド呼び出しヘルパー__クラスです。

メインスレッドとワーカースレッドの両コンテキストでインスタンスを生成し、
スレッド間メッセージによって、メインスレッド側からワーカースレッドの、
メソッドを呼び出せるようにしています。

このため、すべての呼び出しが非同期呼び出しとなります。

また、処理はワーカースレッドで実行されますので、メインスレッド側の処理をブロックしません。

→ [サンプルページ](https://takamin.github.io/transworker/sample/)

TransWorkerオブジェクトの生成
-----------------------------

メインスレッド側で、TransWorkerのインスタンスを生成するには、
__ワーカースレッドで動作するスクリプトのURL__と、
そこで動作させようとしている__クラスの定義（コンストラクタ）__を与えます。

ワーカースレッドのスクリプトでも、同じクラスのインスタンスを与えて、
TransWorkerオブジェクトを生成しておきます。

メソッド呼び出しをスレッド間のメッセージ送受信に変換
----------------------------------------------------

メインスレッド側のTransWorkerは、与えられたクラスに定義されているインスタンスメソッドのラッパー関数を
__TransWorkerオブジェクト内に生成__します。
これらラッパー関数は、ワーカースレッドへメソッド呼び出しのためのメッセージを送信します。

ワーカースレッドのTransWorkerオブジェクトは、メインスレッドからこのメッセージを受信すると、
インスタンスメソッドを呼び出します。戻り値はメインスレッドへメッセージにより返されます。


メインスレッド側インスタンス生成
--------------------------------

__TransWorker.createInvoker(urlDerivedWorker, clientCtor, thisObject, notifyHandlers)__

メインスレッド側で利用できるTransWorkerオブジェクトを生成します。

__PARAMETERS__

1. urlDerivedWorker - WebWorkerプロセスのURL。
2. clientCtor - クライアントクラスのコンストラクタ。
3. thisObject - 通知を呼び出す場合のthisを指定する。
4. notifyHandlers - WebWorker側からの通知を受け取るハンドラーのリスト。

__DETAILS__

返されるオブジェクトには、
第二引数で渡されたクラスのすべてのメソッドと同名のメソッドが実装されています。

これらのメソッド呼び出しは、第一引数で示されたWebWorker内で動作している、
クライアントクラスのインスタンスメソッド呼び出しに変換されます。

この呼び出しは非同期呼び出しです。

メソッドの戻り値は、本来の引数リストの後に指定するコールバック関数で受け取ります。

__RETURNS__

第二引数に指定されたクラスのメソッドをすべて持った、
TransWorkerインスタンスを返します。

ワーカースレッド側インスタンス生成
----------------------------------

__TransWorker.createWorker(client)__

ワーカースレッドで動作するTransWorkerオブジェクトを生成します。
このオブジェクトがメインスレッドからの通知により第一引数で指定される
インスタンスのメソッドを呼び出します。

__PARAMETERS__

* client - ワーカースレッドで動作するクラスの、
インスタンスかデフォルトコンストラクタを指定します。

__DETAILS__

第一引数の対象となるインスタンスに、TransWorkerのインスタンスを保持させる
`_transworker`というフィールドを追加します。
これにより、postNotifyメソッドを呼び出せます。

__RETURNS__

ワーカースレッド側のTransWorkerインスタンスを返します。

ワーカーからメインスレッドへの通知
----------------------------------

__transworker.postNotify(name, parameter)__

メインスレッド側のTransWorkerオブジェクトへ通知を送信します。

__PARAMETERS__

* name - 通知の名称。
* parameter - 通知に関連するパラメータ。

それぞれの内容は対象のクラスで独自に定義します。

使用例 / EXAMPLE
----------------

ここでは、順番に素数を見つける簡単なクラスを使用して、TransWorkerの使用方法を説明します。

Here is an explanation of TransWorker class using a simple class to find prime number.

### 1. クライアントクラスの用意 / Prepare a 'client-class'

ここでは以下のような、クライアントクラスを準備します。

Here is a 'client-class' that will work in sub-thread:


__prime.js__

```javascript
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

### 2. Web Worker スクリプト / Create Web Worker script

Web Workerとして読み込まれるスクリプトを作成します。
最低限、以下の実装になります。

Create a script loaded as Web Worker. At least, it will be following codes.

__prime\_worker.js__

```javascript
importScripts('path/to/the/transworker.js');
importScripts('prime.js');
TransWorker.createWorker(Prime);
```

### 3. メインスレッド側のコード / Main thread codes

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

```html
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
<script src="path/to/the/transworker.js"></script>
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
    var prime_worker = TransWorker.createInvoker("./prime_worker.js", Prime, this);
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
