const VIEWPORT = {

  height:0,
  left:0,
  scale:1,
  top:0,
  width:0,

  resize(width, height) {

    this.height = height;
    this.width  = width;

  },

  setScale(scale) {

    this.scale = Number(scale.toPrecision(3));

    if (this.scale < 1)       this.scale = 1;
    else if (this.scale > 10) this.scale = 10;

  },

  scrollTo(x, y) {

    this.left = x - (this.width  * 0.5) / this.scale;
    this.top  = y - (this.height * 0.5) / this.scale;

  }

};