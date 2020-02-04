// Frank Poth 12/24/2017

/* This example has a lot packed into it. It has a scrolling tile based background.
The rightmost column is randomly generated when scrolling. There is animation.
There is collision detection between all moving objects and the world as well as
the player and the meteors and tarpits. There is an effect that turns the screen
red when a meteor spawns using image data. I implement object pooling to avoid using
"new" to create new objects. Some of this stuff I've covered in old tutorials, and
some stuff I have not covered. */

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

      if (this.count >= this.delay) {// If enough cycles have passed, we change the frame.

        this.count = 0;// Reset the count.
        /* If the frame index is on the last value in the frame set, reset to 0.
        If the frame index is not on the last value, just add 1 to it. */
        this.frame_index = (this.frame_index == this.frame_set.length - 1) ? 0 : this.frame_index + 1;
        this.frame_value = this.frame_set[this.frame_index];// Change the current frame value.

      }

    }

  };

  /* A frame just keeps track of a physical position inside the tile sheet for blitting. */
  var Frame = function(x, y, width, height) {

    this.height = height;
    this.width  = width;
    this.x      = x;
    this.y      = y;

  };

  /* A Pool object manages objects. The objects array holds all objects that are
  currently in use, and the pool holds objects that are not in use. By storing objects
  that would otherwise be deleted, we can reuse them instead of creating totally new
  instances with the new operator. Recycling saves memory. Do it. */
  var Pool = function(object) {

    this.object = object;// The constructor of the object we are pooling.
    this.objects = [];// The array of objects in use.
    this.pool = [];// The array of objects not in use.

  };

  Pool.prototype = {

    /* Get an object from the pool or create a new object. Pool expects objects to
    have a few basic functions, like reset. */
    get:function(parameters) {

      if (this.pool.length != 0) {

        let object = this.pool.pop();
        object.reset(parameters);
        this.objects.push(object);

      } else {

        this.objects.push(new this.object(parameters.x, parameters.y));

      }

    },

    store:function(object) {

      let index = this.objects.indexOf(object);

      if (index != -1) {

        this.pool.push(this.objects.splice(index, 1)[0]);

      }

    },

    storeAll:function() {

      for (let index = this.objects.length - 1; index > -1; -- index) {

        this.pool.push(this.objects.pop());

      }

    }

  };

  var Meteor = function(x, y) {

    this.alive = true;// Meteor dies when it goes offscreen.
    this.animation = new Animation(display.tile_sheet.frame_sets[1], 8);
    this.grounded = false;
    this.smoke = false;// smoke values are used for spawning smoke particles.
    this.smoke_count = 0;
    this.smoke_delay = Math.floor(Math.random() * 10 + 5);
    this.height = Math.floor(Math.random() * 16 + 24); this.width = this.height;
    this.x = x; this.y = y - this.height * 0.5;
    let direction = Math.PI * 1.75 + Math.random() * Math.PI * 0.1;// The trajectory.
    this.x_velocity = Math.cos(direction) * 3; this.y_velocity = -Math.sin(direction) * 3;

  };

  /* All game objects are expected to have collideWorld and CollideObject functions,
  as well as update and reset functions. If this were a strongly typed language, I
  would be using a base class called GameObject or something. */
  Meteor.prototype = {

    constructor:Meteor,

    collideObject:function(player) {

      let vector_x = player.x + player.width * 0.5 - this.x - this.width * 0.5;
      let vector_y = player.y + player.height * 0.5 - this.y - this.height * 0.5;
      let combined_radius = player.height * 0.5 + this.width * 0.5;

      if (vector_x * vector_x + vector_y * vector_y < combined_radius * combined_radius) {

        player.alive = false;
        player.animation.change(display.tile_sheet.frame_sets[5], 10);

      }

    },

    collideWorld:function() {

      if (this.x + this.width < 0) {

        this.alive = false;
        return;

      }

      if (this.y + this.height > WORLD_HEIGHT - 6) {

        this.x_velocity = -game.speed;
        this.grounded = true;
        this.y = WORLD_HEIGHT - this.height - 6;

      }

    },

    reset:function(parameters) {

      this.alive = true;
      this.animation.change(display.tile_sheet.frame_sets[1], 8);
      this.grounded = false;
      this.x = parameters.x;
      let direction = Math.PI * 1.75 + Math.random() * Math.PI * 0.1;
      this.x_velocity = Math.cos(direction) * 3;
      this.y = parameters.y;
      this.y_velocity = -Math.sin(direction) * 3;

    },

    update:function() {

      if (!this.grounded) {

        this.animation.update();
        this.y += this.y_velocity;

      } else {

        this.x_velocity = -game.speed;

      }

      this.x += this.x_velocity;

      this.smoke_count ++;
      if (this.smoke_count == this.smoke_delay) {

        this.smoke_count = 0;
        this.smoke = true;

      }

    }

  };

  var Smoke = function(x, y, x_velocity, y_velocity) {

    this.alive = true;
    this.animation = new Animation(display.tile_sheet.frame_sets[2], 8);
    this.life_count = 0;
    this.life_time = Math.random() * 20 + 30;
    this.height = 8 + Math.floor(Math.random() * 8); this.width = this.height;
    this.x = x; this.y = y;
    this.x_velocity = x_velocity; this.y_velocity = y_velocity;

  };

  Smoke.prototype = {

    constructor:Smoke,

    collideWorld:function() {

      if (this.x > WORLD_WIDTH || this.y > WORLD_HEIGHT - 20) {

        this.alive = false;

      }

    },

    reset:function(parameters) {

      this.alive = true;
      this.life_count = 0;
      this.life_time = Math.random() * 20 + 30;
      this.x          = parameters.x;
      this.x_velocity = parameters.x_velocity;
      this.y          = parameters.y;
      this.y_velocity = parameters.y_velocity;

    },

    update:function() {

      this.animation.update();
      this.x += this.x_velocity;
      this.y += this.y_velocity;

      this.life_count ++;

      if (this.life_count > this.life_time) {

        this.alive = false;

      }

    }

  };

  var TarPit = function(x, y) {

    this.alive = true;
    this.animation = new Animation(display.tile_sheet.frame_sets[0], 8);
    this.height = 30; this.width = Math.floor(Math.random() * 64 + 48);
    this.x = x; this.y = y;

  };

  TarPit.prototype = {

    constructor:TarPit,

    collideObject:function(player) {

    },

    collideObject:function(object) {

      if (!object.jumping && object.x + object.width * 0.5 > this.x + this.width * 0.2 && object.x + object.width * 0.5 < this.x + this.width * 0.8) {

        object.alive = false;
        object.animation.change(display.tile_sheet.frame_sets[4], 10);

      }

    },

    collideWorld:function() {

      if (this.x + this.width < 0) this.alive = false;

    },

    reset:function(parameters) {

      this.alive = true;
      this.width = Math.floor(Math.random() * 64 + 48);
      this.x = parameters.x;
      this.y = parameters.y;

    },

    update:function(){

      this.animation.update();
      this.x -= game.speed;

    }

  };

  var controller, display, game;

  /* This is awesome. I can use the same event handler for all mouseup, mousedown,
  touchstart, and touchend events. This controller works on everything! */
  controller = {

    active:false, state:false,

    onOff:function(event) {

      event.preventDefault();

      let key_state = (event.type == "mousedown" || event.type == "touchstart") ? true : false;

      if (controller.state != key_state) controller.active = key_state;
      controller.state  = key_state;

    }

  };

  display = {

    buffer:document.createElement("canvas").getContext("2d"),
    context:document.querySelector("canvas").getContext("2d"),

    tint:0,// The red tint value to add to the buffer's red channel when a meteor is on screen.

    tile_sheet: {

      columns:undefined,// Set up in INITIALIZE section.
      frames: [new Frame( 0, 32, 24, 16), new Frame(24, 32, 24, 16),// tar pit
               new Frame(64, 32, 16, 16), new Frame(80, 32, 16, 16),// Meteor
               new Frame(96, 32,  8,  8), new Frame(104,32,  8,  8), new Frame(96, 40,  8,  8), new Frame(104,40,  8, 8),// smoke
               new Frame( 0, 48, 28, 16), new Frame(28, 48, 28, 16), new Frame(56, 48, 28, 16), new Frame(84, 48, 28, 16), new Frame( 0, 64, 28, 16), new Frame(28, 64, 28, 16), new Frame(56, 64, 28, 16), new Frame(84, 64, 28, 16),//dino run
               new Frame( 0, 80, 28, 16), new Frame(28, 80, 28, 16), new Frame(56, 80, 28, 16), new Frame(84, 80, 28, 16), new Frame( 0, 96, 28, 16), new Frame(28, 96, 28, 16),//dino sink
               new Frame(56, 96, 28, 16), new Frame(84, 96, 28, 16), new Frame( 0,112, 28, 16), new Frame(28,112, 28, 16), new Frame(56,112, 28, 16), new Frame(84,112, 28, 16)//dino crisp
              ],

      frame_sets:[[ 0, 1],//tar pit
                  [ 2, 3],//Meteor
                  [ 4, 5, 6, 7],//smoke
                  [ 8, 9,10,11,12,13,14,15],//dino run
                  [16,17,18,19,20,21],//dino sink
                  [22,23,24,25,26,27]//dino crisp

      ],
      image:new Image()// The tile sheet image is loaded at the bottom of this file.

    },

    render:function() {

      // Draw Tiles
      for (let index = game.area.map.length - 1; index > -1; -- index) {

        let value = game.area.map[index];

        this.buffer.drawImage(this.tile_sheet.image, (value % this.tile_sheet.columns) * TILE_SIZE, Math.floor(value / this.tile_sheet.columns) * TILE_SIZE, TILE_SIZE, TILE_SIZE, (index % game.area.columns) * TILE_SIZE - game.area.offset, Math.floor(index / game.area.columns) * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      }

      // Draw distance
      this.buffer.font = "20px Arial";
      this.buffer.fillStyle = "#ffffff";
      this.buffer.fillText(String(Math.floor(game.distance/10) + " / " + Math.floor(game.max_distance/10)), 10, 20);

      // Draw TarPits
      for (let index = game.object_manager.tarpit_pool.objects.length - 1; index > -1; -- index) {

        let tarpit = game.object_manager.tarpit_pool.objects[index];

        let frame = this.tile_sheet.frames[tarpit.animation.frame_value];

        this.buffer.drawImage(this.tile_sheet.image, frame.x, frame.y, frame.width, frame.height, tarpit.x, tarpit.y, tarpit.width, tarpit.height);

      }

      // Draw Player
      let frame = this.tile_sheet.frames[game.player.animation.frame_value];

      this.buffer.drawImage(this.tile_sheet.image, frame.x, frame.y, frame.width, frame.height, game.player.x, game.player.y, game.player.width, game.player.height);

      // Draw Meteors
      for (let index = game.object_manager.meteor_pool.objects.length - 1; index > -1; -- index) {

        let meteor = game.object_manager.meteor_pool.objects[index];

        let frame = this.tile_sheet.frames[meteor.animation.frame_value];

        this.buffer.drawImage(this.tile_sheet.image, frame.x, frame.y, frame.width, frame.height, meteor.x, meteor.y, meteor.width, meteor.height);

      }

      // Draw Smoke
      for (let index = game.object_manager.smoke_pool.objects.length - 1; index > -1; -- index) {

        let smoke = game.object_manager.smoke_pool.objects[index];

        let frame = this.tile_sheet.frames[smoke.animation.frame_value];

        this.buffer.drawImage(this.tile_sheet.image, frame.x, frame.y, frame.width, frame.height, smoke.x, smoke.y, smoke.width, smoke.height);

      }

      // Draw tint if a meteor is on screen
      if (game.object_manager.meteor_pool.objects.length != 0) {

        this.tint = (this.tint < 80) ? this.tint + 1 : 80;

      } else {// Reduce tint otherwise

        this.tint = (this.tint > 0) ? this.tint - 2 : 0;

      }

      if (this.tint != 0) {// If there is a tint to draw, apply it to the buffer

        let image_data = this.buffer.getImageData(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        let data = image_data.data;

        for (let index = data.length - 4; index > -1; index -= 4) {

          data[index] += this.tint;

        }

        this.buffer.putImageData(image_data, 0, 0);

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

    distance:0,
    max_distance:0,
    speed:3,

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

      /* Takes care of scrolling the background and generating the next column to
      display on the far right of the map. */
      scroll:function() {

        game.distance += game.speed;

        if (game.distance > game.max_distance) game.max_distance = game.distance;

        this.offset += game.speed;
        if (this.offset >= TILE_SIZE) {

          this.offset -= TILE_SIZE;

          /* This loop removes the first column and inserts a randomly generated
          last column for the top 7 rows. This handles random sky generation. */
          for (let index = this.map.length - this.columns * 3 ; index > -1; index -= this.columns) {

            this.map.splice(index, 1);
            this.map.splice(index + this.columns - 1, 0, Math.floor(Math.random() * 2));

          }

          /* This next part replaces the grass with an appropriate grass tile. I
          made it a bit more complex than it needed to be, but the tiles actually
          reconcile their edges with the tile directly to the left. */
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

          // The last row stays the same. It's just dirt.

        }

      }

    },

    engine: {

      /* Fixed time step game loop!! */
      afrequest:undefined,// animation frame request reference
      accumulated_time:window.performance.now(),
      time_step:1000/60,// update rate

      loop:function(time_stamp) {

        /* How easy does this look? This is a fixed step loop with frame dropping.
        Amazingly it's super simple and only a few lines. This will make your game
        run at the same speed on all devices. Now that I look at it, I think there
        may be a better way to implement this because entire frames can be dropped
        without updating or rendering. Rather than fixing this now, I will just leave it.
        Ideally, I would utilize the free time and not do both updates and renderings
        at the same time unless I have to... Another day... This does work fine, though. */
        if (time_stamp >= game.engine.accumulated_time + game.engine.time_step) {

          if (time_stamp - game.engine.accumulated_time >= game.engine.time_step * 4) {

            game.engine.accumulated_time = time_stamp;

          }

          while(game.engine.accumulated_time < time_stamp) {

            game.engine.accumulated_time += game.engine.time_step;

            game.engine.update();

          }

          display.render();

        }

        window.requestAnimationFrame(game.engine.loop);

      },

      start:function() {// Start the game loop.

        this.afrequest = window.requestAnimationFrame(this.loop);

      },

      update:function() {// Update the game logic.

        /* Slowly increase speed and cap it when it gets too high. */
        game.speed = (game.speed >= TILE_SIZE * 0.5)? TILE_SIZE * 0.5 : game.speed + 0.001;
        /* Make sure the player's animation delay is keeping up with the scroll speed. */
        game.player.animation.delay = Math.floor(10 - game.speed);
        game.area.scroll();// Scroll!!!

        if (game.player.alive) {

          if (controller.active && !game.player.jumping) {// Get user input

            controller.active = false;
            game.player.jumping = true;
            game.player.y_velocity -= 15;
            game.player.animation.change([10], 15);

          }

          if (game.player.jumping == false) {

            game.player.animation.change(display.tile_sheet.frame_sets[3], Math.floor(TILE_SIZE - game.speed));

          }

          game.player.update();

          if (game.player.y > TILE_SIZE * 6 - TILE_SIZE * 0.25) {// Collide with floor

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

        game.player.animation.update();

        game.object_manager.spawn();
        game.object_manager.update();

      }

    },

    /* Manages all non player objects. */
    object_manager: {

      count:0,
      delay:100,

      meteor_pool:new Pool(Meteor),
      smoke_pool:new Pool(Smoke),
      tarpit_pool:new Pool(TarPit),

      spawn:function() {

        this.count ++;

        if (this.count == this.delay) {

          this.count = 0;
          this.delay = 100;// + Math.floor(Math.random() * 200 - 10 * game.speed);

          /* Pick randomly between tarpits and meteors */
          if (Math.random() > 0.5) {

            this.tarpit_pool.get( {x: WORLD_WIDTH, y:WORLD_HEIGHT - 30} );

          } else {

            this.meteor_pool.get( {x: WORLD_WIDTH * 0.2, y: -32 } );

          }

        }

      },

      update:function() {

        for (let index = this.meteor_pool.objects.length - 1; index > -1; -- index) {

          let meteor = this.meteor_pool.objects[index];

          meteor.update();

          meteor.collideObject(game.player);

          meteor.collideWorld();

          if (meteor.smoke) {

            meteor.smoke = false;

            let parameters = { x:meteor.x + Math.random() * meteor.width, y:undefined, x_velocity:undefined, y_velocity:undefined };

            if (meteor.grounded) {

              parameters.y = meteor.y + Math.random() * meteor.height * 0.5;
              parameters.x_velocity = Math.random() * 2 - 1 - game.speed;
              parameters.y_velocity = Math.random() * -1;

            } else {

              parameters.y = meteor.y + Math.random() * meteor.height;
              parameters.x_velocity = meteor.x_velocity * Math.random();
              parameters.y_velocity = meteor.y_velocity * Math.random();

            }

            this.smoke_pool.get(parameters);

          }

          if (!meteor.alive) {

            this.meteor_pool.store(meteor);

          };

        }

        for (let index = this.smoke_pool.objects.length - 1; index > -1; -- index) {

          let smoke = this.smoke_pool.objects[index];

          smoke.update();

          smoke.collideWorld();

          if (!smoke.alive) this.smoke_pool.store(smoke);

        }

        for (let index = this.tarpit_pool.objects.length - 1; index > -1; -- index) {

          let tarpit = this.tarpit_pool.objects[index];

          tarpit.update();

          tarpit.collideObject(game.player);

          tarpit.collideWorld();

          if (!tarpit.alive) this.tarpit_pool.store(tarpit);

        }

      }

    },

    player: {

      alive:true,
      animation:new Animation([15], 10),
      jumping:false,
      height: 32, width: 56,
      x:8, y:TILE_SIZE * 6 - TILE_SIZE * 0.25,
      y_velocity:0,

      reset:function() {

        this.alive = true;
        this.x = 8;

      },

      update:function() {

        game.player.y_velocity += 0.5;
        game.player.y += game.player.y_velocity;
        game.player.y_velocity *= 0.9;

      }

    },

    reset:function() {

      this.distance = 0;
      this.player.reset();

      /* Put all of our objects away. */
      this.object_manager.meteor_pool.storeAll();
      this.object_manager.smoke_pool.storeAll();
      this.object_manager.tarpit_pool.storeAll();

      this.speed = 3;

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
