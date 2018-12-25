"use strict";

/**
 * MeteorShower.
 * @constructor
 * @param {CanvasRenderingContext2D|undefined} ctx The context
 */
function MeteorShower(ctx) {
    this.meteors = [];
    this.ctx = ctx;
    this.tid = null;
    this.timerInterval = 20;
}

/**
 * Set the width of canvas.
 * @param {number} width a canvas drawing width.
 * @returns {undefined}
 */
MeteorShower.prototype.setWidth = function(width) {
    this.width = width;
};

/**
 * Set the height of canvas.
 * @param {number} height a canvas drawing height.
 * @returns {undefined}
 */
MeteorShower.prototype.setHeight = function(height) {
    this.height = height;
};

/**
 * Set the background color of canvas.
 * @param {number|string} backcolor A background color.
 * @returns {undefined}
 */
MeteorShower.prototype.setBackcolor = function(backcolor) {
    this.backcolor = backcolor;
};

/**
 * Set count of meteors.
 * @param {number} count A count of meteor.
 * @returns {undefined}
 */
MeteorShower.prototype.setCount = function(count) {
    this.count = count;
};

/**
 * Initialize a drawing property.
 * @returns {undefined}
 */
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

/**
 * Get a random color code for CSS.
 * @returns {string} A RGB color code.
 */
MeteorShower.prototype.getRandColor = function() {
    return "rgb(" +
                Math.floor(Math.random() * 256) + "," +
                Math.floor(Math.random() * 256) + "," +
                Math.floor(Math.random() * 256) + ")";
};

/**
 * Get a random speed.
 * @returns {string} A RGB color code.
 */
MeteorShower.prototype.getRandSpeed = function() {
    return { x: 0, y: Math.floor(Math.random() * 4) + 1 };
};

/**
 * Get start the shooting star.
 * @returns {undefined}
 */
MeteorShower.prototype.start = function() {
    this.clear();
    this.tid = setInterval(()=> this.run(), this.timerInterval);
};

/**
 * Stop the star moving.
 * @returns {undefined}
 */
MeteorShower.prototype.stop = function() {
    if(this.tid != null) {
        clearInterval(this.tid);
        this.tid = null;
    }
};

/**
 * Clear with the background color.
 * @returns {undefined}
 */
MeteorShower.prototype.clear = function() {
    if(this.ctx != null) {
        this.ctx.fillStyle = this.backcolor;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
};

/**
 * Move the stars.
 * @returns {undefined}
 */
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
