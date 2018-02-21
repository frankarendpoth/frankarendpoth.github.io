// Frank Poth 02/12/2018

(function() { "use strict";

  const Ball = function(x, y) {

    this.frame_index = Math.floor(Math.random() * 4);
    this.x = x;
    this.x_velocity;
    this.y = y;
    this.y_velocity;

  };

  Ball.reset = function(ball) {

    var direction = Math.random() * (Math.PI * 2);

    ball.x = Math.random() * (game.world.width - display.tile_sheet.tile_size);
    ball.x_velocity = Math.cos(direction) * 2;
    ball.y = Math.random() * (game.world.height - display.tile_sheet.tile_size);
    ball.y_velocity = Math.sin(direction) * 2;

  };

  Ball.prototype = {

    constructor:Ball,

    update:function() {

      this.x += this.x_velocity;
      this.y += this.y_velocity;

    },

    collideWorld:function() {

      if (this.x < 0) {

        this.x = 0;
        this.x_velocity *= -1;

      } else if (this.x + display.tile_sheet.tile_size > game.world.width) {

        this.x = game.world.width - display.tile_sheet.tile_size;
        this.x_velocity *= -1;

      }

      if (this.y < 0) {

        this.y = 0;
        this.y_velocity *= -1;

      } else if (this.y + display.tile_sheet.tile_size > game.world.height) {

        this.y = game.world.height - display.tile_sheet.tile_size;
        this.y_velocity *= -1;

      }

    }

  };

  const Pool = function(constructor_name) {

    this.constructor_name = constructor_name;
    this.active_objects = new Array();
    this.stored_objects = new Array();

  };

  Pool.prototype = {

    constructor:Pool,

    activate:function(number, callback) {

      var object;

      for (let index = 0; index < number; index ++) {

        if (this.stored_objects.length != 0) {

          object = this.stored_objects.pop();

        } else {

          object = new this.constructor_name();

        }

        if (callback) { callback(object) }

        this.active_objects.push(object);

      }

    },

    store:function(number) {

      while(this.active_objects.length != 0 && number > 0) {

        number --;

        this.stored_objects.push(this.active_objects.pop());

      }

    }

  };

  var display, game, renderPreScale, renderScale, renderScaledSheet, tracker;

  renderScaledSheet = function() {

    //display.context.fillStyle = "#ffffff";
    //display.context.fillRect(0, 0, display.context.canvas.width, display.context.canvas.height);

    var scaled_size = display.tile_sheet.tile_size * display.scale;

    for (let index = game.object_manager.ball_pool.active_objects.length - 1; index > -1; -- index) {

      let ball = game.object_manager.ball_pool.active_objects[index];

      display.context.drawImage(display.tile_sheet.scaled_image.canvas,
                               (ball.frame_index % display.tile_sheet.columns) * scaled_size,
                               Math.floor(ball.frame_index / display.tile_sheet.columns) * scaled_size,
                               scaled_size, scaled_size,
                               ball.x * display.scale, ball.y * display.scale, scaled_size, scaled_size);
    }

  };

  renderPreScale = function() {

    //display.context.fillStyle = "#ffffff";
    //display.context.fillRect(0, 0, display.context.canvas.width, display.context.canvas.height);

    for (let index = game.object_manager.ball_pool.active_objects.length - 1; index > -1; -- index) {

      let ball = game.object_manager.ball_pool.active_objects[index];
      let graphic = display.tile_sheet.prerendered_frames[ball.frame_index];

      display.context.drawImage(graphic, 0, 0, graphic.width, graphic.height, ball.x * display.scale, ball.y * display.scale, graphic.width, graphic.height);

    }

  };

  renderScale = function() {

    //display.buffer.fillStyle = "#ffffff";
    //display.buffer.fillRect(0, 0, display.buffer.canvas.width, display.buffer.canvas.height);

    for (let index = game.object_manager.ball_pool.active_objects.length - 1; index > -1; -- index) {

      let ball = game.object_manager.ball_pool.active_objects[index];
      let graphic = display.tile_sheet.frames[ball.frame_index];

      display.buffer.drawImage(graphic,
                               0, 0, graphic.width, graphic.height,
                               ball.x, ball.y, graphic.width, graphic.height);

    }

    display.context.drawImage(display.buffer.canvas, 0, 0, display.buffer.canvas.width, display.buffer.canvas.height, 0, 0, display.context.canvas.width, display.context.canvas.height);

  };

  display = {

    buffer:document.createElement("canvas").getContext("2d"),
    context:document.querySelector("canvas").getContext("2d"),
    p:document.querySelector("p"),

    tile_sheet: {

      columns:2,
      rows:2,
      image:new Image(),
      scaled_image:document.createElement("canvas").getContext("2d"),
      prerendered_frames:[],
      frames:[],
      tile_size:16,

      prerenderFrames:function(scale) {

        var graphic, scaled_graphic;

        for (let index = this.columns * this.rows; index > -1; -- index) {

          graphic = document.createElement("canvas").getContext("2d");
          graphic.canvas.height = graphic.canvas.width = this.tile_size;
          graphic.imageSmoothingEnabled = false;

          graphic.drawImage(this.image,
                            (index % this.columns) * this.tile_size,
                            Math.floor(index / this.columns) * this.tile_size,
                            this.tile_size, this.tile_size,
                            0, 0, graphic.canvas.width, graphic.canvas.height);

          this.frames[index] = graphic.canvas;

          scaled_graphic = document.createElement("canvas").getContext("2d");
          scaled_graphic.canvas.height = scaled_graphic.canvas.width = this.tile_size * scale;
          scaled_graphic.imageSmoothingEnabled = false;

          scaled_graphic.drawImage(graphic.canvas,
                            0, 0, graphic.canvas.width, graphic.canvas.height,
                            0, 0, scaled_graphic.canvas.width, scaled_graphic.canvas.height);

          this.prerendered_frames[index] = scaled_graphic.canvas;

        }

        this.scaled_image.canvas.height = this.image.height * scale;
        this.scaled_image.canvas.width = this.image.width * scale;
        this.scaled_image.imageSmoothingEnabled = false;
        this.scaled_image.drawImage(this.image, 0, 0, this.image.width, this.image.height,
                                    0, 0, this.scaled_image.canvas.width, this.scaled_image.canvas.height);

      }

    },

    render:renderScale,

    resize:function(event) {

      var height, width;

      height = document.documentElement.clientHeight;
      width = document.documentElement.clientWidth;

      display.context.canvas.width = Math.floor(width / display.tile_sheet.tile_size) * display.tile_sheet.tile_size;

      if (display.context.canvas.width > height) {

        display.context.canvas.width = Math.floor(height / display.tile_sheet.tile_size) * display.tile_sheet.tile_size;

      }

      display.context.canvas.height = display.context.canvas.width * (game.world.height / game.world.width);

      display.scale = display.context.canvas.width / game.world.width;

      display.tile_sheet.prerenderFrames(display.scale);

    }

  };

  game = {

    engine: {

      accumulated_time:undefined,
      animation_frame_request:undefined,
      time:undefined,
      time_step:1000/60,
      needs_redraw:false,

      loop:function(time_stamp) {

        game.engine.animation_frame_request = window.requestAnimationFrame(game.engine.loop);

        game.engine.accumulated_time += time_stamp - game.engine.time;
        game.engine.time = time_stamp;

        while (game.engine.accumulated_time >= game.engine.time_step) {

          game.engine.accumulated_time -= game.engine.time_step;

          game.engine.update();
          game.engine.needs_redraw = true;

        }

        if (game.engine.needs_redraw) {

          game.engine.render();

        }

      },

      render:function() {

        var time = window.performance.now();

        display.render();

        time = window.performance.now() - time;

        tracker.iteration ++;
        tracker.time += time;
        tracker.average = tracker.time / tracker.iteration;

        display.p.innerHTML = display.render.name + ": " + tracker.average.toPrecision(2) + " ms / frame to render";

      },

      update:function() {

        for (let index = game.object_manager.ball_pool.active_objects.length - 1; index > -1; -- index) {

          let ball = game.object_manager.ball_pool.active_objects[index];

          ball.update();
          ball.collideWorld();

        }

      },

      start:function() {

        this.animation_frame_request = window.requestAnimationFrame(this.loop);
        this.accumulated_time = this.time_step;
        this.time = window.performance.now();

      }

    },

    object_manager: {

      ball_pool: new Pool(Ball)

    },

    world:{

      height:360,
      width:640

    }

  };

  tracker = {

    average:0,
    iteration:0,
    time:0,

    reset:function() {

      this.average = 0;
      this.iteration = 0;
      this.time = 0;

    }

  };

  //// INITIALIZE ////

  let buttons = document.querySelectorAll("a");

  for (let index = buttons.length - 1; index > -1; -- index) {

    buttons[index].addEventListener("click", function(event) {

      switch(this.innerHTML) {

        case "+ 100":

          game.object_manager.ball_pool.activate(100, Ball.reset);

        break;
        case "- 100":

          game.object_manager.ball_pool.store(100);

        break;
        case "method: scale":

          this.innerHTML = "method: pre-scale";
          display.render = renderPreScale;

        break;
        case "method: pre-scale":

          this.innerHTML = "method: pre-scaled-sheet";
          display.render = renderScaledSheet;

        break;

        case "method: pre-scaled-sheet":

          this.innerHTML = "method: scale";
          display.render = renderScale;

        break;

      }

      tracker.reset();

    });

  }

  display.tile_sheet.image.addEventListener("load", function(event) {

    display.buffer.canvas.height = game.world.height;
    display.buffer.canvas.width = game.world.width;

    display.resize();

    game.engine.start();

  });

  display.tile_sheet.image.src = "pre-scale-performance.png";

  window.addEventListener("resize", display.resize);

})();
