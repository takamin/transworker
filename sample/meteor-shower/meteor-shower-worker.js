"use strict";
importScripts(
        "../../transworker.js",
        "meteor.js",
        "meteor-shower.js"
        );

/**
 * Worker side MeteorShower.
 * @constructor
 */
function MeteorShowerWorker() {
    MeteorShower.apply(this, Array.from(arguments));
}

MeteorShowerWorker.prototype = new MeteorShower();

/**
 * Override to notify to clear the canvas.
 * @returns {undefined}
 */
MeteorShowerWorker.prototype.clear = function() {
    this._transworker.postNotify("fillRects", [{
        fillColor: this.backcolor,
        x:0, y:0,
        w: this.width, h: this.height
    }]);
};

/**
 * Override to notify the drawing message.
 * @returns {undefined}
 */
MeteorShowerWorker.prototype.run = function() {
    const fillRects = [];
    for(const meteor of this.meteors) {
        const p0 = meteor.getPos();

        //消去
        fillRects.push({
            fillColor: this.backcolor,
            x:Math.floor(p0.x),
            y:Math.floor(p0.y),
            w:1, h:1 });
        meteor.move();
        const p1 = meteor.getPos();
        if(p1.y >= this.height) {
            //作り直し
            const v = this.getRandSpeed();
            meteor.reset(
                Math.floor(Math.random() * this.width), 0,
                v.x, v.y, this.getRandColor());
        } else {
            //描画
            fillRects.push({
                fillColor: p1.color,
                x:Math.floor(p1.x),
                y:Math.floor(p1.y),
                w:1, h:1 });
        }
    }
    this._transworker.postNotify("fillRects", fillRects);
};

TransWorker.createWorker(new MeteorShowerWorker());
