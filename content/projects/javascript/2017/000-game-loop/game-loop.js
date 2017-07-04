// Frank Poth 04/18/2017

(function() {

  var application, display, loop;

  application = {

    new_render:0,
    old_render:0,

    redraws:0,
    samples:new Array(),
    sample_index:0,
    sample_size:100,
    updates:0,

    addSample:function(sample) {

      this.samples[this.sample_index] = sample;

      this.sample_index = (this.sample_index > this.sample_size)?0:this.sample_index + 1;

    },

    getAverageSample:function() {

      var index, sample;

      sample = 0;

      for (index = this.samples.length - 1; index > -1; -- index) {

        sample += this.samples[index];

      }

      return sample/this.samples.length;

    }

  };

  display = {

    output:document.getElementById("output"),

  };

  loop = new FixedStepLoop(1000/60);

  (function() {

    loop.render = function(new_time_stamp, old_time_stamp) {

      application.old_render = application.new_render;
      application.new_render = new_time_stamp;

      application.redraws ++;

      application.addSample(application.new_render - application.old_render);

      display.output.innerHTML = "frame_rate:  " + 1000 / application.getAverageSample() + "<br>total_updates: " + application.updates + "<br>total_redraws:  " + application.redraws;

    };

    loop.update = function(new_time_stamp, old_time_stamp) {

      application.updates ++;

    };

    loop.start();

  })();

})();
