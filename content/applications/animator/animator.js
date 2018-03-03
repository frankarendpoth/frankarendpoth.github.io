// Frank Poth 02/21/2018

(function() { "use strict";

  const AnimatorWindow = function(element) {

    this.context = element.querySelector(".animator-window-canvas").getContext("2d");
    this.toolbar = element.querySelector(".animator-window-toolbar");
    this.window  = element;

  };

  AnimatorWindow.prototype = {

  };

  var display, logic, ui;

  display = {


    render:function() {


    },

    resize:function() {


    }

  };

  logic = {

    engine: {

      accumulated_time:undefined,
      animation_frame_request:undefined,
      time:undefined,
      time_step:1000/60,

      loop:function(time_stamp) {

        logic.engine.animation_frame_request = window.requestAnimationFrame(logic.engine.loop);

        logic.engine.accumulated_time += time_stamp - logic.engine.time;

        while(logic.engine.accumulated_time >= logic.engine.time_step) {

          logic.engine.accumulated_time -= logic.engine.time_step;

        }

        display.render();

      },

      start:function() {

        this.accumulated_time = this.time_step;
        this.time = window.performance.now();
        this.animation_frame_request = window.requestAnimationFrame(this.loop);

      }

    }

  };

  ui = {

    animation:new AnimatorWindow(document.getElementById("animator-window-animation")),
    framesets:new AnimatorWindow(document.getElementById("animator-window-framesets")),
    sources:  new AnimatorWindow(document.getElementById("animator-window-sources"))

  };

  //// INITIALIZE ////

  window.addEventListener("dragover", function(event) { event.preventDefault(); });

  ui.sources.context.canvas.addEventListener("drop", function(event) {

    var file, reader;

    file = event.dataTransfer.files[0];

    reader = new FileReader();

    reader.addEventListener("load", function(event) {

      display.source_image.src = this.result;

      display.source_image.addEventListener("load", function(event) {


      });

    });

    reader.readAsDataURL(file);

  }


  event.preventDefault();

});

  window.addEventListener("resize", function(event) {

    display.resize();

  });

  display.resize();

  logic.engine.start();

})();
