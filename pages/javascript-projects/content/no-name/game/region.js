const Region = function(name, left, top, width, height, viewport_width, viewport_height, ...vertices) {
  
  Polygon2D.call(this, ...vertices);

  this.name = name;

  this.left = left;
  this.top  = top;

  this.height = height;
  this.width  = width;

  this.viewport_height = viewport_height;
  this.viewport_width  = viewport_width;

};

Region.prototype = {};

Object.assign(Region.prototype, Polygon2D.prototype);