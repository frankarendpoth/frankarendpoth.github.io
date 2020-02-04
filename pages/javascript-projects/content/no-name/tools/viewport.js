/* Frank Poth 2020/01/09 */

const VIEWPORT = {

  bottom:0,
  target_height:0,
  target_left:0,
  target_top:0,
  target_width:0,
  height:0,
  left:0,
  right:0,
  top:0,
  width:0,

  transition_increment:0,
  transition_height:0,
  transition_left:0,
  transition_top:0,
  transition_width:0,

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

    var x = PLAYER.middle_x;
    var y = PLAYER.middle_y;

    x -= region.left + viewport_width  * 0.5;
    y -= region.top  + viewport_height * 0.5;

    if      (x < 0)                               x = 0;
    else if (x > region.width - viewport_width)   x = region.width  - viewport_width;

    if      (y < 0)                               y = 0;
    else if (y > region.height - viewport_height) y = region.height - viewport_height;

    this.target_left = x + region.left - (this.target_width  - viewport_width)  * 0.5;
    this.target_top  = y + region.top  - (this.target_height - viewport_height) * 0.5;

    this.transition_increment = 100;

    this.transition_height = this.target_height - this.height;
    this.transition_left   = this.target_left   - this.left;
    this.transition_top    = this.target_top    - this.top;
    this.transition_width  = this.target_width  - this.width;

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

    if (this.transition_increment > 0) {

      this.transition_increment -= 5;

      var transition_percent = this.transition_increment * 0.01; // Do this to avoid rounding errors

      this.height = this.target_height - this.transition_height * transition_percent;
      this.width  = this.target_width  - this.transition_width  * transition_percent;

      this.target_left = x + region.left - (this.target_width  - viewport_width)  * 0.5;
      this.target_top  = y + region.top  - (this.target_height - viewport_height) * 0.5;

      this.left = this.target_left - this.transition_left * transition_percent;
      this.top  = this.target_top  - this.transition_top  * transition_percent;

    } else {
      
      this.left = x + region.left - (this.width  - viewport_width)  * 0.5;
      this.top  = y + region.top  - (this.height - viewport_height) * 0.5;

    }

    this.bottom = this.top  + this.height;
    this.right  = this.left + this.width;

  }

};