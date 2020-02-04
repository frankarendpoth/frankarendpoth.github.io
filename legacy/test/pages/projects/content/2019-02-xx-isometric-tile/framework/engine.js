class Engine {

  constructor(update, render, time_step) {

    this.animation_frame_request = undefined;

    this.accumulated_time = time_step;
    this.time = 0;
    this.time_step = time_step;

    this.update = update;
    this.render = render;

    this.startCycle = (time_stamp) => { this.cycle(time_stamp); };

  }

  cycle(time_stamp) {

    this.animation_frame_request = window.requestAnimationFrame(this.startCycle);

    this.accumulated_time += time_stamp - this.time;
    this.time = time_stamp;

    var updated = false;

    if (this.accumulated_time > 1000) this.accumulated_time = this.time_step;

    while(this.accumulated_time > this.time_step) {

      this.accumulated_time -= this.time_step;

      this.update(time_stamp);

      updated = true;

    }

    if (updated) this.render();

  }

  start() {

    this.animation_frame_request = window.requestAnimationFrame(this.startCycle);

  }

  stop() {

    window.cancelAnimationFrame(this.animation_frame_request);

  }

}