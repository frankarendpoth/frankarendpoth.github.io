const Triangle = function(x, y) {

  this.color       = [Math.random(), Math.random(), Math.random(), 1.0];
  this.translation = [x, y];
  this.velocity    = [Math.random(), Math.random()];
  this.vertices    = [0, -10, 10, 10, -10, 10];

};

Triangle.prototype = {

  collideBoundary(width, height) {

  },

  update() {

    this.translation[0] += this.velocity[0];
    this.translation[1] += this.velocity[1];

  }

};