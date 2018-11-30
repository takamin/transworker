"use strict";
importScripts(
        "../../transworker.js",
        "meteor.js",
        "meteor-shower.js"
        );
function MeteorShowerWorker() {
    this.constructor = MeteorShowerWorker;
    this.create(new MeteorShower());
}
MeteorShowerWorker.prototype = new TransWorker();
MeteorShowerWorker.prototype.clear = function() {
    this.postNotify("fillRects", [{
        fillColor: this.client.backcolor,
        x:0, y:0,
        w: this.client.width, h: this.client.height
    }]);
};
MeteorShowerWorker.prototype.run = function() {
    const fillRects = [];
    for(const meteor of this.client.meteors) {
        const p0 = meteor.getPos();

        //消去
        fillRects.push({
            fillColor: this.client.backcolor,
            x:Math.floor(p0.x),
            y:Math.floor(p0.y),
            w:1, h:1 });
        meteor.move();
        const p1 = meteor.getPos();
        if(p1.y >= this.client.height) {
            //作り直し
            const v = this.client.getRandSpeed();
            meteor.reset(
                Math.floor(Math.random() * this.client.width), 0,
                v.x, v.y, this.client.getRandColor());
        } else {
            //描画
            fillRects.push({
                fillColor: p1.color,
                x:Math.floor(p1.x),
                y:Math.floor(p1.y),
                w:1, h:1 });
        }
    }
    this.postNotify("fillRects", fillRects);
};

new MeteorShowerWorker();
