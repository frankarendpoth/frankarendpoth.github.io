// Frank Poth 01/14/2017

/* By studying this example program, you can learn how to load json levels, how
to animate sprites, and other basic game design techniques including: user Input
on the keyboard, some collision detection and response, image loading, and maybe
some other things, too. */

/* You may notice that in the largest room the dominique sprite looks a little weird.
There is a brown bar that flashes in front of her face when she walks to the left.
This is because of something called "texture bleeding" where a scaled image allows
pixels from around the cropped source region of the image to bleed into the desired
part of the source image. This is okay for cropping from large images, but for sprite
sheets it's not desireable. A way around this is to create individual canvases for
each sprite image and use those to draw rather than cutting frames from the original
sprite sheet. No bleeding can occur because there are no longer pixels around the
edges of the sprite image. */

(function() { "use strict";

  const Animation = function(frame_set, delay, mode = "loop") {

    this.count       = 0;
    this.delay       = delay;
    this.frame_index = 0;
    this.frame_set   = frame_set;
    this.frame_value = frame_set[0];
    this.mode = mode;

  };

  /* I expanded the Animation class to include play, loop, and rewind modes. They're
  all really simple, and basically they are the same thing with very minor changes
  dictating how the playhead or frame_index moves. */
  Animation.prototype = {

    constructor:Animation,

    change:function(frame_set, delay = this.delay) {

      if (frame_set != this.frame_set) {

        this.count       = 0;
        this.delay       = delay;
        this.frame_index = 0;
        this.frame_set   = frame_set;
        this.frame_value = frame_set[0];

      }

    },

    loop:function() {

      this.count ++;

      if (this.count >= this.delay) {

        this.count = 0;

        this.frame_index = (this.frame_index < this.frame_set.length - 1) ? this.frame_index + 1 : 0;
        this.frame_value = this.frame_set[this.frame_index];

      }

    },

    play:function() {

      this.count ++;

      if (this.count >= this.delay) {

        this.count = 0;

        if (this.frame_index < this.frame_set.length - 1) {

          this.frame_index ++;
          this.frame_value = this.frame_set[this.frame_index];

        }

      }

    },

    rewind:function() {

      this.count ++;

      if (this.count >= this.delay) {

        this.count = 0;

        if (this.frame_index > 0) {

          this.frame_index --;
          this.frame_value = this.frame_set[this.frame_index];

        }

      }

    },

    update:function() {

      this[this.mode]();

    }

  };

  /* I added offsets to the frames. This allows me to group my frames close together
  in the source image and save a lot of space in my image files. The offset is
  applied when drawing the image to the screen, ensuring that the sprite always looks
  centered and doesn't jump back and forth. */
  const Frame = function(x, y, width, height, offset_x = 0, offset_y = 0) {

    this.height   = height;
    this.offset_x = offset_x;
    this.offset_y = offset_y;
    this.width    = width;
    this.x        = x;
    this.y        = y;

  };

  Frame.prototype = { constructor:Frame };

  /* This simplifies creation of input keys. */
  const Input = function(active, state) {

    this.active = active;
    this.state  = state;

  };

  Input.prototype = {

    constructor:Input,

    update:function(state) {

      if (this.state != state) this.active = state;
      this.state  = state;

    }

  };

      //////////////////////
    //// GAME CLASSES ////
  //////////////////////

  const Door = function(x, y, area, new_x) {

    this.animation = new Animation(display.sprite_sheet.frame_set.door, 5, "play");
    this.area = area;
    this.new_x = new_x;
    this.x = x;
    this.y = y;

  };

  Door.prototype = {

    constructor:Door,

  };

      ///////////////
    //// LOGIC ////
  ///////////////

  var controller, display, game;

  controller = {

    down: new Input(false, false), left: new Input(false, false), right:new Input(false, false), up:new Input(false, false),

    keyDownUp:function(event) { event.preventDefault();

      var key_state = (event.type == "keydown") ? true : false;

      switch(event.keyCode) {

        case 37: controller.left.update(key_state); break;// left key
        case 38: controller.up.update(key_state); break;// up key
        case 39: controller.right.update(key_state); break;// right key
        case 40: controller.down.update(key_state); break;// down key

      }

    }

  };

  display = {

    buffer:document.createElement("canvas").getContext("2d"),
    context:document.querySelector("canvas").getContext("2d"),
    height_width_ratio:undefined,

    sprite_sheet: {

      frames:[new Frame(  0,  0, 27, 30), new Frame( 27,  0, 25, 30,  1),
              new Frame( 52,  0, 19, 29, -1,  1), new Frame( 71,  0, 19, 30, -1), new Frame(90,  0, 18, 30), new Frame(108,  0, 18, 31, 0, -1),
              new Frame(126,  0, 18, 30,  1), new Frame(144,  0, 18, 31,  1, -1), new Frame(162,  0, 19, 29, 2), new Frame(181,  0, 19, 30, 2),
              new Frame(200,  0, 32, 32), new Frame(232,  0, 32, 32), new Frame(264,  0, 32, 32), new Frame(296,  0, 32, 32), new Frame(328,  0, 32, 32), new Frame(360,  0, 32, 32), new Frame(392,  0, 32, 32)],

      frame_set: {

        dominique_idle:[0, 1],
        dominique_right:[2, 3, 4, 5],
        dominique_left:[6, 7, 8, 9],
        door:[10, 11, 12, 13, 14, 15, 16]

      },

      image:new Image()

    },

    render:function() {

      var frame;

      /* Draw the background. */
      this.buffer.fillStyle = game.area.background_color;
      this.buffer.fillRect(0, 0, game.area.width, game.area.height);

      /* Draw the floor. */
      this.buffer.fillStyle = "#373641";
      this.buffer.fillRect(0, game.area.floor - 3, game.area.width, game.area.height - game.area.floor + 3);

      /* Draw the doors. */
      for (let index = game.area.doors.length - 1; index > -1; -- index) {

        let door = game.area.doors[index];
        frame = this.sprite_sheet.frames[door.animation.frame_value];

        this.buffer.drawImage(this.sprite_sheet.image, frame.x, frame.y, frame.width, frame.height, door.x, door.y, frame.width, frame.height);

      }

      /* Draw Dominique. */
      frame = this.sprite_sheet.frames[game.dominique.animation.frame_value];

      this.buffer.drawImage(this.sprite_sheet.image, frame.x, frame.y, frame.width, frame.height, Math.round(game.dominique.x) + frame.offset_x * 0.5 - frame.width * 0.5, Math.round(game.dominique.y) + frame.offset_y * 0.5 - frame.height * 0.5, frame.width, frame.height);

      this.context.drawImage(this.buffer.canvas, 0, 0, game.area.width, game.area.height, 0, 0, this.context.canvas.width, this.context.canvas.height);

      this.context.fillStyle = "#ffffff";
      this.context.font = "20px Arial";
      this.context.fillText(game.area.message, 10, 20);

    },

    resize:function(event) {

      display.context.canvas.width = document.documentElement.clientWidth - 16;

      if (display.context.canvas.width > document.documentElement.clientHeight - 16) {

        display.context.canvas.width = document.documentElement.clientHeight - 16;

      }

      display.context.canvas.height = display.context.canvas.width * display.height_width_ratio;

      display.buffer.imageSmoothingEnabled = display.context.imageSmoothingEnabled = false;

      display.render();

    }

  };

  game = {

    area:undefined,

    dominique: {

      animation:new Animation(display.sprite_sheet.frame_set.dominique_idle, 15),
      half_height:15,
      half_width:10,
      jumping:false,
      velocity_x:0,
      velocity_y:0,
      x:100,
      y:100,

      collideWorld:function() {

        if (this.x - this.half_width < 0) {

          this.x = this.half_width;

        } else if (this.x + this.half_width > game.area.width) {

          if (game.area.message != "~The Passageway~") {

            this.x = game.area.width - this.half_width;

          } else if (this.x - this.half_width > game.area.width) {

            game.engine.stop();
            controller.right.active = false;

            game.loadArea("area0.json", function() {

              game.reset();

            });

            alert("Dominique escaped the weird program full of pointless rooms and doors. She went to a much better, more interesting program.");

          }

        }

        if (this.y + this.half_height > game.area.floor) {

          this.jumping = false;
          this.velocity_y = 0;
          this.y = game.area.floor - this.half_height;

        }

      },

      update:function() {

        this.velocity_y += 0.5;

        this.x += this.velocity_x;
        this.y += this.velocity_y;

        this.velocity_x *= 0.9;
        this.velocity_y *= 0.9;

      }

    },

    engine: {

      accumulated_time:window.performance.now(),
      frame_request:undefined,
      time_step:1000/60,

      loop:function(time_stamp) {

        game.engine.frame_request = window.requestAnimationFrame(game.engine.loop);

        if (controller.left.active) {

          game.dominique.animation.change(display.sprite_sheet.frame_set.dominique_left, 15);
          game.dominique.velocity_x -= 0.1;

        }

        if (controller.right.active) {

          game.dominique.animation.change(display.sprite_sheet.frame_set.dominique_right, 15);
          game.dominique.velocity_x += 0.1;

        }

        if (!controller.left.active && !controller.right.active) {

          game.dominique.animation.change(display.sprite_sheet.frame_set.dominique_idle, 15);

        }

        if (controller.up.active && !game.dominique.jumping) {

          controller.up.active = false;
          game.dominique.jumping = true;
          game.dominique.velocity_y = -5;

        }

        game.dominique.update();
        game.dominique.collideWorld();

        game.dominique.animation.update();

        for (let index = game.area.doors.length - 1; index > -1; -- index) {

          let door = game.area.doors[index];

          if (game.dominique.x > door.x && game.dominique.x < door.x + 32) {

            door.animation.mode = "play";

            if (controller.down.active) { controller.down.active = false;

              game.dominique.x = door.new_x + 1;
              game.loadArea(door.area, game.reset);

              return;

            }

          } else { door.animation.mode = "rewind"; }

          game.area.doors[index].animation.update();

        }

        display.render();

      },

      start:function() {

        this.accumulated_time = window.performance.now();
        this.frame_request = window.requestAnimationFrame(this.loop);

      },

      stop:function() {

        window.cancelAnimationFrame(this.frame_request);

      }

    },

    loadArea:function(url, callback) {

      var request, readyStateChange;

      request = new XMLHttpRequest();

      readyStateChange = function(event) {

        if (this.readyState == 4 && this.status == 200) {

          game.area = JSON.parse(this.responseText);

          callback();

          game.engine.start();

        }

      };

      request.addEventListener("readystatechange", readyStateChange);
      request.open("GET", url);
      request.send(null);

      game.engine.stop();

    },

    reset:function() {

      for (let index = game.area.doors.length - 1; index > -1; -- index) {

        let door = game.area.doors[index];

        game.area.doors[index] = new Door(door.x, game.area.floor - 32 - 3, door.area, door.new_x);

      }

      game.dominique.y = game.area.floor - game.dominique.half_height;
      game.dominique.velocity_x = 0;

      display.buffer.canvas.height = game.area.height;
      display.buffer.canvas.width = game.area.width;
      display.height_width_ratio = game.area.height / game.area.width;
      display.resize();

    }

  };

      ////////////////////
    //// INITIALIZE ////
  ////////////////////

  display.sprite_sheet.image.addEventListener("load", function(event) {

    game.loadArea("area0.json", function() {

      game.reset();

    });

  });

  display.sprite_sheet.image.src = "dominiques-doors.png";

  window.addEventListener("resize", display.resize);

  window.addEventListener("keydown", controller.keyDownUp);
  window.addEventListener("keyup", controller.keyDownUp);

})();
