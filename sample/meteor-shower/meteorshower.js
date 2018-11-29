function MeteorShower(ctx) {
    this.meteors = [];
    this.ctx = ctx;
    this.tid = null;
    this.timerInterval = 20;
};
MeteorShower.prototype.setWidth = function(width) {
    this.width = width;
};
MeteorShower.prototype.setHeight = function(height) {
    this.height = height;
};
MeteorShower.prototype.setBackcolor = function(backcolor) {
    this.backcolor = backcolor;
};
MeteorShower.prototype.setCount = function(count) {
    this.count = count;
};
MeteorShower.prototype.initialize = function() {
    if(this.ctx != null) {
        this.ctx.fillStyle = this.backcolor;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    for(var i = 0; i < this.count; i++) {
        var v = this.getRandSpeed();
        var mto = new Meteor(
            Math.floor(Math.random() * this.width),
            Math.floor(Math.random() * this.height),
            v.x, v.y, this.getRandColor());
        this.meteors.push(mto);
    }
};
MeteorShower.prototype.getRandColor = function() {
    return "rgb(" +
                Math.floor(Math.random() * 256) + "," +
                Math.floor(Math.random() * 256) + "," +
                Math.floor(Math.random() * 256) + ")";
};
MeteorShower.prototype.getRandSpeed = function() {
    return { x: 0, y: Math.floor(Math.random() * 4) + 1 };
};
MeteorShower.prototype.setTimerInterval = function(timerInterval) {
    this.timerInterval = timerInterval;
};
MeteorShower.prototype.start = function() {
    this.clear();
    this.tid = setInterval(
            (function(app) { return function() {
                app.run();
            };}(this)), this.timerInterval);
};
MeteorShower.prototype.stop = function() {
    if(this.tid != null) {
        clearInterval(this.tid);
        this.tid = null;
    }
};
MeteorShower.prototype.clear = function() {
    if(this.ctx != null) {
        this.ctx.fillStyle = this.backcolor;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
};
MeteorShower.prototype.run = function() {
    this.meteors.forEach(function(app) { return function(mto) {
        var p = mto.getPos();
        app.ctx.fillStyle = app.backcolor;
        app.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 1, 1);
        mto.move();
        p = mto.getPos();
        if(p.y >= app.height) {
            var v = app.getRandSpeed();
            mto.reset(
                Math.floor(Math.random() * app.width), 0,
                v.x, v.y, app.getRandColor());
        } else {
            app.ctx.fillStyle = p.color;
            app.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 1, 1);
        }
    }}(this));
};
