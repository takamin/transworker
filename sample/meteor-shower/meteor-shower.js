"use strict";
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
        var meteor = new Meteor(
            Math.floor(Math.random() * this.width),
            Math.floor(Math.random() * this.height),
            v.x, v.y, this.getRandColor());
        this.meteors.push(meteor);
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
    this.tid = setInterval(()=> this.run(), this.timerInterval);
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
    for(const meteor of this.meteors) {
        const p0 = meteor.getPos();
        this.ctx.fillStyle = this.backcolor;
        this.ctx.fillRect(Math.floor(p0.x), Math.floor(p0.y), 1, 1);
        meteor.move();
        const p1 = meteor.getPos();
        if(p1.y >= this.height) {
            const v = this.getRandSpeed();
            meteor.reset(
                Math.floor(Math.random() * this.width), 0,
                v.x, v.y, this.getRandColor());
        } else {
            this.ctx.fillStyle = p1.color;
            this.ctx.fillRect(Math.floor(p1.x), Math.floor(p1.y), 1, 1);
        }
    }
};
