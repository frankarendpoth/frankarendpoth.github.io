// Frank Poth 04/18/2017

function FixedStepLoop(time_step) {

  this.time_step = time_step;

  this.animation_frame = undefined;

  this.render = function(new_time_stamp, old_time_stamp) {};
  this.update = function(new_time_stamp, old_time_stamp) {};

}

FixedStepLoop.prototype.start = function() {

  var accumulated_time, handle, old_time_stamp, updated;

  function update(new_time_stamp) {

    accumulated_time += new_time_stamp - old_time_stamp;

    updated = false;

    if (accumulated_time > 300) {

      accumulated_time = handle.time_step;

    }

    while(accumulated_time >= handle.time_step) {

      accumulated_time -= handle.time_step;

      handle.update(new_time_stamp, old_time_stamp);

      updated = true;

    }

    if (updated) {

      handle.render(new_time_stamp, old_time_stamp);

    }

    old_time_stamp = new_time_stamp;

    handle.animation_frame = window.requestAnimationFrame(update);

  }

  accumulated_time = this.time_step;
  handle = this;
  old_time_stamp = 0;

  update(0);

};

FixedStepLoop.prototype.stop = function() {

  window.cancelAnimationFrame(this.animation_frame);
  this.animation_frame = undefined;

};
