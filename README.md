transworker - WebWorkerをメソッド呼び出し感覚で利用するモジュール
=================================================================

![](https://takamin.github.io/transworker/image/readme_top.png "TransWorker")  
photo credit: <a href="http://www.flickr.com/photos/57763385@N03/16058283699">Pallet</a>
via <a href="http://photopin.com">photopin</a>
<a href="https://creativecommons.org/licenses/by-nc-nd/2.0/">(license)</a>

概要
----

TransWorkerは __WebWorkerを手軽に扱えるようにする__ モジュールです。

ワーカースレッドで動かしたい処理を、クラスのインスタンスメソッドとして定義して、
メインスレッド側からワーカースレッド側のメソッドを呼び出せるようにしています。

各メソッドの戻り値はメインスレッド側で呼び出し時に指定したコールバック関数に返されます。

ワーカースレッド側から通知メッセージを発行することも可能です。

* [API](https://takamin.github.io/transworker/docs/TransWorker.html)
* [サンプルページ](https://takamin.github.io/transworker/sample/)


利用方法
--------

### バンドラーを利用する場合(オススメ)

```bash
npm install --save transworker
```

```javascript
const TransWorker = require("transworker");
```

### HTMLから直接読み込む方法

バンドラーを使用しない場合は、ビルド済みの transworker.js を読み込みます。
TransWorker クラスが利用可能です。

#### ローカルファイルを読み込む

```bash
$ git clone https://github.com/takamin/transworker.git
$ cd transworker
$ npm install
$ npm run build # ./transworker.js が生成されます。
```

```xml
<html>
・
・
・
<script src="${parent/of/repo}/transworker/transworker.js"></script>
・
・
・
</html>
```

#### GitHub.Ioのスクリプトを読み込む（非推奨）

本モジュールの GitHub Pages のビルド済みファイルも利用可能ですが、
更新の制御ができませんので継続的な利用にはお勧めしません。

```xml
<html>
・
・
・
<script src="https://takamin.github.io/transworker/transworker.js"></script>
・
・
・
</html>
```

SharedWorker を使ったサンプル
-----------------------------

ワーカースレッドで延々と素数を見つけてメインスレッドへ通知するサンプルです。

__sample/prime/index.html__

HTMLファイルです。表示した時から延々と素数を見つけて画面に表示します。
あまり長時間開きっぱなしにするとページが長くなりすぎるのでよくないです。

以下のSCRIPTで読み込んでいる `app-bundle.js` は、次の `app.js` をバンドルしたものです。

```xml
<!doctype HTML>
<html>
<head>
<title>Find Prime Numbers</title>
<style type="text/css">
span { display:inline-block; padding:10px; margin:2px; }
.label {
    width:120px; text-align:center;
    background-color:silver; border: solid gray 1px; }
</style>
</head>
<body>
<h1>Find Prime Numbers</h1>
<div id="result"></div>
<script src="app-bundle.js"></script>
</body>
</html>
```

__sample/prime/app.js__

メインスレッド側のスクリプトです。
TransWorkerを使ってPrimeクラスのSharedWorkerを作成し、
素数の通知を購読し、処理を開始します。


```javascript
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
```

__sample/prime/prime.js__

TransWorkerで利用する前提の素数を見つけるクラスです。
ワーカーコンテキストで生成されて、TransWorkerを介して各メソッドが呼び出されます。

素数をメインスレッドへ知らせるために利用している
`_transworker` フィールドはTransWorkerから注入されたものです。

※ メインスレッドではメソッドのインターフェースのみが利用されます。


```javascript
function Prime() {
    this.primes = [];
    this.tid = null;
}

Prime.prototype.start = function() {

    //SharedWorkerとして実行される場合は既に実行されている
    //可能性がある
    if(this.tid != null) {
        console.log("Already started");
        return;
    }

    let prime = 1;
    this.tid = setInterval(()=> {
        prime = this.getNextPrimeOf(prime)
        this.primes.push(prime);

        //素数をメインスレッドへ通知
        this._transworker.postNotify("primeNumber", prime);
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
```

__sample/prime/prime-worker.js__

メインスレッド側のTransWorkerのインスタンスから読み込まれる
ワーカーコンテキストのスクリプトです。

ここではSharedWorkerとして動作するPrimeクラスのTransWorkerを生成しています。

```javascript
const TransWorker = require("transworker.js");
const Prime = require("./prime.js");
TransWorker.createSharedWorker(Prime);
```


TransWorkerオブジェクトの生成
-----------------------------

メインスレッド側で、TransWorkerのインスタンスを生成するには、
__ワーカースレッドで動作するスクリプトのURL__ と、
そこで動作させようとしている __クラスの定義（コンストラクタ）__ を与えます。

ワーカースレッドのスクリプトでも、同じクラスのインスタンスを与えて、
TransWorkerオブジェクトを生成しておきます。

メソッド呼び出しをスレッド間のメッセージ送受信に変換
----------------------------------------------------

メインスレッド側のTransWorkerは、与えられたクラスに定義されているインスタンスメソッドのラッパー関数を
__TransWorkerオブジェクト内に生成__ します。
これらラッパー関数は、ワーカースレッドへメソッド呼び出しのためのメッセージを送信します。

ワーカースレッドのTransWorkerオブジェクトは、メインスレッドからこのメッセージを受信すると、
インスタンスメソッドを呼び出します。戻り値はメインスレッドへメッセージにより返されます。


メインスレッド側インスタンス生成
--------------------------------

__TransWorker.createInvoker(urlDerivedWorker, clientCtor, thisObject, notifyHandlers)__  
__TransWorker.createSharedInvoker(urlDerivedWorker, clientCtor, thisObject, notifyHandlers)__

メインスレッド側で利用できるTransWorkerオブジェクトを生成します。
`createInvoker`はDedicatedWorkerを、`createSharedInvoker`は、SharedWorkerを生成します。

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


ワーカースレッドからの通知を受け取る
------------------------------------

__transworker.subscribe(notificationName, handler)__

ワーカースレッドからの通知を購読します。


__PARAMETERS__

1. notificationName - 通知の名称。
2. handler - 通知を処理するハンドラー。

__DETAILS__

既に購読している通知に新たなハンドラーは設定できません。

ワーカースレッド側インスタンス生成
----------------------------------

__TransWorker.createWorker(client)__  
__TransWorker.createSharedWorker(client)__

ワーカースレッドで動作するTransWorkerオブジェクトを生成します。

これは、メインスレッド側でのインスタンス生成時に、
引数 `urlDerivedWorker` で指定するスクリプト中で使用する必要があります。

`createWorker`はDedicatedWorker、
`createSharedWorker`はSharedWorker
として実行されるためのインスタンスを生成します。


__PARAMETERS__

* client - ワーカースレッドで動作するクラスのインスタンス。

__DETAILS__

第一引数のインスタンスに、TransWorkerのインスタンスを保持させる
`_transworker`というフィールドを追加します。
これを利用してTransWorkerのメソッドを呼び出せます。

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

LICENSE
-------

MIT
