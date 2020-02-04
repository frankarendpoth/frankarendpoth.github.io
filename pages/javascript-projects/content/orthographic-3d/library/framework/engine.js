class Engine {

  constructor(update, render, time_step = 1000/30) {

    // animation frame request pointer
    this.afr = undefined;

    this.update = update;
    this.render = render;

    this.accumulated_time = 0;
    this.time             = 0;
    this.time_step        = time_step;

    this.callCycle = (time_stamp) => { this.cycle(time_stamp); };

  }

  cycle(time_stamp) {

    this.afr = window.requestAnimationFrame(this.callCycle);

    this.accumulated_time += time_stamp - this.time;
    this.time = time_stamp;

    while(this.accumulated_time > this.time_step) {

      this.update();

      this.accumulated_time -= this.time_step;

    }

    this.render();

  }

  start() {

    this.afr = window.requestAnimationFrame(this.callCycle);

  }

  stop() {

    window.cancelAnimationFrame(this.afr);

    this.afr = undefined;

  }

}