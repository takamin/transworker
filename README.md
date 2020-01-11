transworker - WebWorkerをメソッド呼び出し感覚で利用するモジュール
=================================================================

![](image/readme_top.png "TransWorker")  
photo credit: <a href="http://www.flickr.com/photos/57763385@N03/16058283699">Pallet</a>
via <a href="http://photopin.com">photopin</a>
<a href="https://creativecommons.org/licenses/by-nc-nd/2.0/">(license)</a>

概要
----

TransWorkerは __WebWorkerによるJavaScriptのマルチスレッドを手軽に使えるようにするモジュール__ です。

ユーザーが作成したクラスのインスタンスをワーカースレッド側で生成し、
そのクラスのインスタンスメソッドをメインスレッド側からリモート呼び出しできるようにします。

機能
----


### インスタンスメソッドをスレッド間リモート呼び出しに変換

メインスレッドではユーザー定義クラスのプロトタイプを読み取り、
スレッド間メッセージを送信する同名のラッパーメソッドを生成します。

ワーカスレッド側では、このメッセージを受信すると、クラスインスタンスのメソッドを呼び出して、
その戻り値をスレッド間メッセージでメインスレッドへ戻します。

### その他の機能

* ワーカースレッド側からメインスレッドへ通知メッセージを発行。
* メインスレッドからワーカースレッドへのTransferableオブジェクトの移譲（⇒[Transferable - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/Transferable)）。
* WebWorkerは DedicatedWorker と SharedWorker に対応しています。

### リンク

* [JSDoc: Class: TransWorker](https://takamin.github.io/transworker/docs/TransWorker.html)
* [/sample/](https://github.com/takamin/transworker/tree/master/sample)
* [サンプルページ](https://takamin.github.io/transworker/sample/)

利用方法
--------

### バンドラー利用の場合

```bash
npm install --save transworker
```

```javascript
const TransWorker = require("transworker");
```

### HTMLで直接読み込む場合

バンドラーを使用しない場合は、ビルド済みの transworker.js を読み込みます。
TransWorker クラスが利用可能です。

```xml
<script src="${parent/of/repo}/transworker/transworker.js"></script>
```

最新のビルド済みスクリプトを https://takamin.github.io/transworker/transworker.js で公開しています。

LICENSE
-------

MIT
