/* Frank Poth 2020-01-14 */

const ENGINE = {

  accumulated_time:0,
  animation_frame_request:undefined,
  render:undefined,
  time_stamp:0,
  time_step:1000/30,
  update:undefined,

  cycle(time_stamp) {

    var render = false;

    ENGINE.animation_frame_request = window.requestAnimationFrame(ENGINE.cycle);

    ENGINE.accumulated_time += time_stamp - ENGINE.time_stamp;

    ENGINE.time_stamp = time_stamp;

    while(ENGINE.accumulated_time >= ENGINE.time_step) {

      render = true;

      ENGINE.accumulated_time -= ENGINE.time_step;

      ENGINE.update();

    }

    if (render) ENGINE.render();

  },

  isRunning:function() { return Boolean(this.animation_frame_request != undefined); },

  start:function() { this.animation_frame_request = window.requestAnimationFrame(this.cycle); },

  stop:function() {

    window.cancelAnimationFrame(this.animation_frame_request);
    this.animation_frame_request = undefined;

  }

};