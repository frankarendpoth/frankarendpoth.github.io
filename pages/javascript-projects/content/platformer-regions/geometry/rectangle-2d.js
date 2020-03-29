/* Frank Poth 2020-01-10 */

const Rectangle2D = function(left, top, width, height) {

  this.bottom   = top  + height;
  this.height   = height;
  this.left     = left;
  this.middle_x = Math.floor(left + width  * 0.5);
  this.middle_y = Math.floor(top  + height * 0.5);
  this.right    = left + width;
  this.top      = top;
  this.width    = width;

};

Rectangle2D.prototype = {

  isColliding(rectangle) {

    if (this.left > rectangle.right || this.right < rectangle.left || this.bottom < rectangle.top || this.top > rectangle.bottom) return false;

    return true;

  },

  moveX(distance) {

    this.left     += distance;
    this.middle_x += distance;
    this.right    += distance;

  },

  moveY(distance) {

    this.bottom   += distance;
    this.middle_y += distance
    this.top      += distance;

  }

};