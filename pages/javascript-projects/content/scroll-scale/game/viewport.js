/* The viewport exists in world space. It's width and height should always be clamped to the aspect ratio of the screen. */

const VIEWPORT = {

  aspect_ratio:1, // width / height
  bottom:48,
  half_height:24,
  half_width:24,
  height:48,
  left:0,
  right:48,
  top:0,
  width:48,

  scrollTo(x, y) {

    this.left = x - this.half_width;
    this.top  = y - this.half_height;
    
    this.bottom = this.top  + this.height;
    this.right  = this.left + this.width;

  },

  setHeight(height) {

    if      (height < 48)  height = 48;
    else if (height > 720) height = 720;

    this.height      = height;
    this.half_height = height / 2;
    
    this.width      = height * this.aspect_ratio;
    this.half_width = this.width / 2;

  },

  setWidth(width) {

    if      (width < 48)  width = 48;
    else if (width > 720) width = 720;

    this.width      = width;
    this.half_width = width / 2;

    this.height      = width / this.aspect_ratio;
    this.half_height = this.height / 2;

  }

};