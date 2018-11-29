function Meteor(px, py, vx, vy, color) {
    this.px = px;
    this.py = py;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
}

Meteor.prototype.reset = function(px, py, vx, vy, color) {
    this.px = px;
    this.py = py;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
};
Meteor.prototype.move = function() {
    this.px += this.vx;
    this.py += this.vy;
};
Meteor.prototype.getPos = function() {
    return {x: this.px, y: this.py, color: this.color };
};

