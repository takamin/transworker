importScripts(
        "../../transworker.js",
        "meteor.js",
        "meteorshower.js"
        );
function SampleWorker() {
    this.constructor = SampleWorker;
    this.create(new MeteorShower());
}
SampleWorker.prototype = new TransWorker();
SampleWorker.prototype.clear = function() {
    this.postNotify("fillRects", [{
        fillColor: this.client.backcolor,
        x:0, y:0,
        w: this.client.width, h: this.client.height
    }]);
};
SampleWorker.prototype.run = function() {
    var fillRects = [];
    this.client.meteors.forEach(function(app) {
        return function(mto) {
            var p = mto.getPos();
            fillRects.push({
                fillColor: app.backcolor,
                x:Math.floor(p.x),
                y:Math.floor(p.y),
                w:1, h:1 });
            mto.move();
            p = mto.getPos();
            if(p.y >= app.height) {
                var v = app.getRandSpeed();
                mto.reset(
                    Math.floor(Math.random() * app.width), 0,
                    v.x, v.y, app.getRandColor());
            } else {
                fillRects.push({
                    fillColor: p.color,
                    x:Math.floor(p.x),
                    y:Math.floor(p.y),
                    w:1, h:1 });
            }
        }
    }(this.client));
    this.postNotify("fillRects", fillRects);
}
new SampleWorker();
