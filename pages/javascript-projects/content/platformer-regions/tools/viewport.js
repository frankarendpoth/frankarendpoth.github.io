/* Frank Poth 2020/01/09 */

const VIEWPORT = {

  bottom:0,
  target_height:0,
  target_width:0,
  height:0,
  left:0,
  right:0,
  top:0,
  width:0,

  window_ratio:0,
  window_height:0,
  window_width:0,

  resizeToRegion(region) {

    var viewport_height = region.viewport_height;
    var viewport_width  = region.viewport_width;

    if (this.window_ratio < viewport_width / viewport_height) {
      
      this.target_width  = viewport_width;
      this.target_height = viewport_width / this.window_ratio;

    } else {
     
      this.target_width  = viewport_height * this.window_ratio;
      this.target_height = viewport_height;

    }

  },

  scrollTo(x, y) {

    var region = MAP.region;

    var viewport_height = region.viewport_height;
    var viewport_width  = region.viewport_width;

    x -= region.left + viewport_width  * 0.5;
    y -= region.top  + viewport_height * 0.5;

    if      (x < 0)                               x = 0;
    else if (x > region.width - viewport_width)   x = region.width  - viewport_width;

    if      (y < 0)                               y = 0;
    else if (y > region.height - viewport_height) y = region.height - viewport_height;

    this.height += (this.target_height - this.height) * 0.075;
    this.width  += (this.target_width  - this.width)  * 0.075;

    this.left += ((x + region.left - (this.width  - viewport_width)  * 0.5) - this.left) * 0.0875;
    this.top  += ((y + region.top  - (this.height - viewport_height) * 0.5) - this.top)  * 0.0875;

    this.bottom = this.top  + this.height;
    this.right  = this.left + this.width;

  }

};