// Frank Poth 12/24/2017

(function() { "use strict";

  const TILE_SIZE = 16;
  const WORLD_HEIGHT = 144;
  const WORLD_WIDTH = 256;

  //// CLASSES ////

  var Animation = function(frame_set, delay) {

    this.count = 0;// Counts the number of game cycles since the last frame change.
    this.delay = delay;// The number of game cycles to wait until the next frame change.
    this.frame_value = frame_set[0];// The value in the sprite sheet of the sprite image / tile to display.
    this.frame_index = 0;// The frame's index in the current animation frame set.
    this.frame_set = frame_set;// The current animation frame set that holds sprite tile values.

  };

  Animation.prototype = {

    /* This changes the current animation frame set. For example, if the current
    set is [0, 1], and the new set is [2, 3], it changes the set to [2, 3]. It also
    sets the delay. */
    change:function(frame_set, delay = 15) {

      if (this.frame_set != frame_set) {// If the frame set is different:

        this.count = 0;// Reset the count.
        this.delay = delay;// Set the delay.
        this.frame_index = 0;// Start at the first frame in the new frame set.
        this.frame_set = frame_set;// Set the new frame set.
        this.frame_value = this.frame_set[this.frame_index];// Set the new frame value.

      }

    },

    /* Call this on each game cycle. */
    update:function() {

      this.count ++;// Keep track of how many cycles have passed since the last frame change.

      if (this.count == this.delay) {// If enough cycles have passed, we change the frame.

        this.count = 0;// Reset the count.
        /* If the frame index is on the last value in the frame set, reset to 0.
        If the frame index is not on the last value, just add 1 to it. */
        this.frame_index = (this.frame_index == this.frame_set.length - 1) ? 0 : this.frame_index + 1;
        this.frame_value = this.frame_set[this.frame_index];// Change the current frame value.

      }

    }

  };

  var Frame = function(x, y, width, height) {

    this.height = height;
    this.width  = width;
    this.x      = x;
    this.y      = y;

  };

  Frame.prototype = {};

  var controller, display, game;

  controller = {

    active:false, state:false,

    onOff:function(event) {

      event.preventDefault();

      let key_state = (event.type == "mousedown" || event.type == "touchstart") ? true : false;

      if (controller.state != key_state) controller.active = key_state;
      controller.state  = key_state;

    }

  };

  var TarPit = function(x, y) {

    this.animation = new Animation(display.tile_sheet.frame_sets[3], 8);
    this.height = 30; this.width = Math.floor(Math.random() * 64 + 48);
    this.x = x; this.y = y;

  };

  TarPit.prototype = {

    constructor:TarPit,

    update:function(){}

  };

  display = {

    buffer:document.createElement("canvas").getContext("2d"),
    context:document.querySelector("canvas").getContext("2d"),

    tile_sheet: {

      columns:undefined,// Set up in INITIALIZE section.
      frames: [new Frame(0, 32, 32, 16), new Frame(32, 32, 32, 16), new Frame(64, 32, 32, 16), new Frame(96, 32, 32, 16), new Frame(0, 48, 32, 16), new Frame(32, 48, 32, 16), new Frame(64, 48, 32, 16), new Frame(96, 48, 32, 16),
      new Frame(48, 16, 24, 16), new Frame(72, 16, 24, 16),// tar pit
      new Frame(0, 64, 32, 16), new Frame(32, 64, 32, 16), new Frame(64, 64, 32, 16), new Frame(96, 64, 32, 16), new Frame(0, 80, 32, 16), new Frame(32, 80, 32, 16)],
      frame_sets:[[0, 1, 2, 3, 4, 5, 6, 7], [2], [10, 11, 12, 13, 14, 15],
                  [8, 9]],// tar pit
      image:new Image()

    },

    render:function() {

      for (let index = game.area.map.length - 1; index > -1; -- index) {

        let value = game.area.map[index];

        this.buffer.drawImage(this.tile_sheet.image, (value % this.tile_sheet.columns) * TILE_SIZE, Math.floor(value / this.tile_sheet.columns) * TILE_SIZE, TILE_SIZE, TILE_SIZE, (index % game.area.columns) * TILE_SIZE - game.area.offset, Math.floor(index / game.area.columns) * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      }

      let frame = this.tile_sheet.frames[game.player.animation.frame_value];

      this.buffer.drawImage(this.tile_sheet.image, frame.x, frame.y, frame.width, frame.height, game.player.x, game.player.y, game.player.width, game.player.height);

      for (let index = game.object_manager.objects.length - 1; index > -1; -- index) {

        let object = game.object_manager.objects[index];

        frame = this.tile_sheet.frames[object.animation.frame_value];

        this.buffer.drawImage(this.tile_sheet.image, frame.x, frame.y, frame.width, frame.height, object.x, object.y, object.width, object.height);

      }

      this.context.drawImage(this.buffer.canvas, 0, 0, WORLD_WIDTH, WORLD_HEIGHT, 0, 0, this.context.canvas.width, this.context.canvas.height);

    },

    resize:function(event) {

      display.context.canvas.width = document.documentElement.clientWidth - 16;

      if (display.context.canvas.width > document.documentElement.clientHeight - 16) {

        display.context.canvas.width = document.documentElement.clientHeight - 16;

      }

      display.context.canvas.height = display.context.canvas.width * 0.5625;

      display.buffer.imageSmoothingEnabled = false;
      display.context.imageSmoothingEnabled = false;

      display.render();

    }

  };

  game = {

    speed:2,

    area: {

      columns:17,
      offset:0,
      map:[ 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0,
            0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1,
            1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1,
            1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1,
            0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0,
            1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0,
            1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0,
            2, 2, 2, 3, 2, 2, 3, 2, 4, 6, 7, 7, 6, 9, 2, 3, 2,
           10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],

      scroll:function() {

        this.offset += game.speed;
        if (this.offset >= TILE_SIZE) {

          this.offset -= TILE_SIZE;

          /* This loop removes the first column and inserts a randomly generated
          last column for the top 7 rows. This handles random sky generation. */
          for (let index = this.map.length - this.columns * 3 ; index > -1; index -= this.columns) {

            this.map.splice(index, 1);
            this.map.splice(index + this.columns - 1, 0, Math.floor(Math.random() * 2));

          }

          this.map.splice(this.columns * 7, 1);

          let right_index = this.columns * 8 - 1;
          let value = this.map[right_index - 1];

          switch(value) {

            case 2: case 3: value = [2, 3, 2, 3, 2, 3, 2, 3, 4, 5][Math.floor(Math.random() * 10)]; break;
            case 4: case 5: value = [6, 7][Math.floor(Math.random() * 2)]; break;
            case 6: case 7: value = [6, 7, 8, 9][Math.floor(Math.random() * 4)]; break;
            case 8: case 9: value = [2, 3][Math.floor(Math.random() * 2)]; break;

          }

          this.map.splice(right_index, 0, value);

        }

      }

    },

    engine: {

      afrequest:undefined,

      loop:function(time_stamp) {

        game.speed += 0.001;
        game.area.scroll();

        if (game.player.alive) {

          if (controller.active && !game.player.jumping) {

            controller.active = false;
            game.player.jumping = true;
            game.player.y_velocity -= 15;
            game.player.animation.change(display.tile_sheet.frame_sets[1], 15);

          }

          if (game.player.jumping == false) {

            game.player.animation.change(display.tile_sheet.frame_sets[0], 10 - Math.floor(game.speed));

          }

          game.player.y_velocity += 0.5;
          game.player.y += game.player.y_velocity;

          game.player.y_velocity *= 0.9;

          if (game.player.y > TILE_SIZE * 6 - TILE_SIZE * 0.25) {

            controller.active = false;
            game.player.y = TILE_SIZE * 6 - TILE_SIZE * 0.25;
            game.player.y_velocity = 0;
            game.player.jumping = false;

          }

        } else {

          game.player.x -= game.speed;
          game.speed *= 0.9;

          if (game.player.animation.frame_index == game.player.animation.frame_set.length - 1) game.reset();

        }

        game.object_manager.spawn();
        game.object_manager.update();
        game.object_manager.collide(game.player);

        game.player.animation.update();

        display.render();

        window.requestAnimationFrame(game.engine.loop);

      },

      start:function() {

        this.afrequest = window.requestAnimationFrame(this.loop);

      }

    },

    object_manager: {

      count:0,
      delay:100,

      objects:[],

      collide:function(player) {

        for (let index = this.objects.length - 1; index > -1; -- index) {

          let object = this.objects[index];

          if (object.constructor == TarPit && !player.jumping && player.x + player.width * 0.5 > object.x + object.width * 0.1 && player.x + player.width * 0.5 < object.x + object.width - object.width * 0.2) {

            player.alive = false;
            player.animation.change(display.tile_sheet.frame_sets[2], 10);
            return;

          }

        }

      },

      spawn:function() {

        this.count ++;

        if (this.count == this.delay) {

          this.count = 0;
          this.delay = 100 + Math.floor(Math.random() * 200 - 10 * game.speed);

          game.object_manager.objects.push(new TarPit(WORLD_WIDTH, WORLD_HEIGHT - TILE_SIZE * 1.75));

        }

      },

      update:function() {

        for (let index = this.objects.length - 1; index > -1; -- index) {

          let object = this.objects[index];

          object.x -= game.speed;

          object.update();
          object.animation.update();

          /* Remove the object if it goes off the left side of the screen. */
          if (object.x + object.width < 0) {

            this.objects.splice(this.objects.indexOf(object), 1);

          }

        }

      }

    },

    player: {

      alive:true,
      animation:new Animation([0], 10),
      jumping:false,
      height: 32, width: 64,
      x:0, y:TILE_SIZE * 6 - TILE_SIZE * 0.25,
      x_velocity:0, y_velocity:0

    },

    reset:function() {

      this.player.alive = true;
      this.player.jumping = false;
      this.player.x = 0;

      this.object_manager.objects = [];

      this.speed = 2;

    }

  };

      ////////////////////
    //// INITIALIZE ////
  ////////////////////

  display.buffer.canvas.height = WORLD_HEIGHT;
  display.buffer.canvas.width  = WORLD_WIDTH;

  display.tile_sheet.image.src = "dino.png";
  display.tile_sheet.image.addEventListener("load", function(event) {

    display.tile_sheet.columns = this.width / TILE_SIZE;

    display.resize();

    game.engine.start();

  });

  window.addEventListener("resize", display.resize);
  window.addEventListener("mousedown", controller.onOff);
  window.addEventListener("mouseup", controller.onOff);
  window.addEventListener("touchstart", controller.onOff);
  window.addEventListener("touchend", controller.onOff);

})();
