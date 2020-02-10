const VIEWPORT = {

  half_height:0,
  half_width:0,
  height:0,
  left:0,
  scale:1,
  top:0,
  width:0,

  resize(width, height) {

    this.half_height = height / 2;
    this.half_width  = width  / 2;
    this.height = height;
    this.width  = width;

  },

  setScale(scale) {

    this.scale = Number(scale.toPrecision(3));

    if (this.scale < 1)       this.scale = 1;
    else if (this.scale > 10) this.scale = 10;

  },

  scrollTo(x, y) {

    this.left = x * this.scale - this.half_width;
    this.top  = y * this.scale - this.half_height;

  }

};