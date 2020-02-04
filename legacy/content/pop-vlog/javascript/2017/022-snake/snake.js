// Frank Poth 11/20/2017

(function() {

  /* I split the logic into three separate parts for organizational purposes. */
  var controller, display, game;

  /* The controller handles everything to do with getting user input. */
  controller = {

    down:false, left:false, right:false, up:false,

    // A very simple key up/down event handler:
    keyUpDown:function(event) {

      var key_state = (event.type == "keydown")?true:false;

      switch(event.keyCode) {

        case 37: controller.left = key_state; break; // left key
        case 38: controller.up = key_state; break; // up key
        case 39: controller.right = key_state; break; // right key
        case 40: controller.down = key_state; break; // down key

      }

    }

  };

  /* display handles everything to do with the display. */
  display = {

    /* The buffer is where we draw everything to in world space. World space
    is the actual size of the game world in pixels before it is scaled up to
    match the size of the user's viewport. */
    buffer:document.createElement("canvas").getContext("2d"),
    /* context is the drawing context of the display canvas. */
    context:document.querySelector("canvas").getContext("2d"),
    output:document.querySelector("p"),// The output p element.

    /* This object holds all of my graphics for the game. Each graphic is just
    a different tile. Each graphic object has a canvas and a function to draw
    itself. The numeric labels correspond to the tile values they represent.*/
    graphics: {

      0: {// background_tile

        canvas:document.createElement("canvas"),
        draw:function() {

          var context = this.canvas.getContext("2d");
          this.canvas.height = this.canvas.width = game.world.tile_size;

          context.fillStyle = "#202830";
          context.fillRect(0, 0, this.canvas.width, this.canvas.height);
          context.fillStyle = "#303840";
          context.fillRect(1, 1, this.canvas.width - 2, this.canvas.height - 2);

        }

      },

      1: {// segment

        canvas:document.createElement("canvas"),
        draw:function() {

          var context = this.canvas.getContext("2d");
          this.canvas.height = this.canvas.width = game.world.tile_size;

          context.fillStyle = "#202830";
          context.fillRect(0, 0, this.canvas.width, this.canvas.height);
          context.fillStyle = "#ff9900";
          context.fillRect(1, 1, game.world.tile_size - 2, game.world.tile_size - 2);

        }

      },

      2: {// apple

        canvas:document.createElement("canvas"),
        draw:function() {

          var context = this.canvas.getContext("2d");
          this.canvas.height = this.canvas.width = game.world.tile_size;

          context.fillStyle = "#202830";
          context.fillRect(0, 0, this.canvas.width, this.canvas.height);
          context.fillStyle = "#99ff00";
          context.fillRect(1, 1, game.world.tile_size - 2, game.world.tile_size - 2);

        }

      },

    },

    /* These are just here for ease of referencing the different graphics. I
    figured it would be easier to remember variable names than numeric references. */
    background_tile:0,
    segment:1,
    apple:2,

    /* Renders everything to the buffer, and then renders the buffer to the display canvas. */
    render:function() {

      /* Loop through the tile map and draw the corresponding graphics. */
      for (let index = 0; index < game.world.map.length; index ++) {

        /* Get the appropriate graphics canvas from the graphics object. */
        let graphic = this.graphics[game.world.map[index]].canvas;

        /* Draw the tile at the specified x and y coordinates in the buffer using the 1d to 2d conversion formulas. */
        this.buffer.drawImage(graphic, 0, 0, graphic.width, graphic.height, (index % game.world.columns) * game.world.tile_size, Math.floor(index / game.world.columns) * game.world.tile_size, game.world.tile_size, game.world.tile_size);

      }

      /* Output the score at the top of the screen, remembering to add leading zeros. */
      let leading_zeros = "SCORE: ";
      for (let index = 4 - game.score.toString().length; index > 0; -- index) {

        leading_zeros += "0";

      }

      this.output.innerHTML = leading_zeros + game.score;

      /* Draw the finalized buffer to the display canvas. This takes care of scaling. */
      this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);

    },

    /* Handle resize events. */
    resize:function(event) {

      var client_height = document.documentElement.clientHeight;

      display.context.canvas.width = document.documentElement.clientWidth - 32;

      if (display.context.canvas.width > client_height - 64 || display.context.canvas.height > client_height - 64) {

        display.context.canvas.width = client_height - 64;

      }

      display.context.canvas.height = display.context.canvas.width;

      display.render();

      /* Hide some elements when the display canvas gets really big, like in full screen mode. */
      let elements = document.querySelectorAll(".hideable");

      for (let index = elements.length - 1; index > -1; -- index) {

        if (document.body.offsetHeight < document.body.scrollHeight) {

          elements[index].style.visibility = "hidden";

        } else {

          elements[index].style.visibility = "visible";

        }

      }

    }

  };

  /* Everything to do with game logic goes here. */
  game = {

    /* Start the score off at 0. */
    score:0,

    /* The apple simply records a location on the map. */
    apple: {

      index:Math.floor(Math.random() * 400)

    },

    /* This is the snake object. It is fairly simple, tracking only map indices
    and the movement vector. */
    snake: {

      head_index:209,
      old_head_index:undefined,
      segment_indices:[209, 210],
      vector_x:0,
      vector_y:0

    },

    /* The world object holds information about the level. */
    world:{

      columns:20,
      tile_size:10,
      map:new Array(400).fill(display.background_tile)// Creates a new array with 400 spaces filled with 0s.

    },

    /* The amount of time accumulated since the start of the application. */
    accumulated_time:0,
    time_step:250,/* The amount of time to wait between redraws. */

    /* This resets the game. */
    reset:function() {

      this.score = 0;

      /* Set all the tiles under the snake to zeros. */
      for (let index = this.snake.segment_indices.length - 1; index > -1; -- index) {

        this.world.map[this.snake.segment_indices[index]] = display.background_tile;

      }

      this.snake.segment_indices = [209, 210];
      this.snake.head_index = 209;
      this.snake.old_head_index = undefined;
      this.snake.vector_x = this.snake.vector_y = 0;
      this.world.map[game.apple.index] = display.apple;
      this.world.map[game.snake.segment_indices[0]] = display.segment;
      this.world.map[game.snake.segment_indices[1]] = display.segment;

      this.time_step = 250;

      this.loop();// Restart the game loop
      display.render();

    },

    /* This is the game loop. All the cool stuff happens here. */
    loop:function(time_stamp) {

      /* Get controller input. Make sure that the vector on the opposite axis is
      set to 0 so the snake doesn't move on a diagonal. */
      if (controller.down) {

        game.snake.vector_x = 0;
        game.snake.vector_y = 1;

      } else if (controller.left) {

        game.snake.vector_x = -1;
        game.snake.vector_y = 0;

      } else if (controller.right) {

        game.snake.vector_x = 1;
        game.snake.vector_y = 0;

      } else if (controller.up) {

        game.snake.vector_x = 0;
        game.snake.vector_y = -1;

      }

      /* Only redraw and update the game if enough time has passed. time_stamp
      holds the amount of time in milliseconds that has passed since the start
      of the application. */
      if (time_stamp >= game.accumulated_time + game.time_step) {

        game.accumulated_time = time_stamp;

        /* If the snake isn't moving, there is nothing to update. */
        if (game.snake.vector_x != 0 || game.snake.vector_y != 0) {

          /* This allows the user to pause the game. If you try to move in the exact
          opposite direction it sets the movement vector on each axis to 0. since
          this is an early out case and nothing else needs to be executed afterwards,
          we setup the next game loop and use return to exit the loop. */
          if (game.snake.head_index + game.snake.vector_y * game.world.columns + game.snake.vector_x == game.snake.old_head_index) {

            game.snake.vector_x = game.snake.vector_y = 0;
            window.requestAnimationFrame(game.loop);
            return;

          }

          /* We move the snake by removing its tail and placing it one step ahead
          of its current head position in the direction of its movement vector. */
          let tail_index = game.snake.segment_indices.pop();// remove the tail
          game.world.map[tail_index] = display.background_tile;// set the tail index in the map to 0
          game.snake.old_head_index = game.snake.head_index;// keep track of the last head index
          game.snake.head_index += game.snake.vector_y * game.world.columns + game.snake.vector_x;// move the snake's head index

          /* Do collision detection, testing to see if the snake's head index is
          offscreen or colliding with another snake segment. */
          if (game.world.map[game.snake.head_index] == display.segment// hit a segment
            || game.snake.head_index < 0// off the top of the map
            || game.snake.head_index > game.world.map.length - 1// off the bottom
            || (game.snake.vector_x == -1 && game.snake.head_index % game.world.columns == game.world.columns - 1)// off the left of the map
            || (game.snake.vector_x == 1 && (game.snake.head_index % game.world.columns == 0))) {// off the right

            game.reset();
            return;

          }

          /* Set the tile under the snake's head to a segment value. */
          game.world.map[game.snake.head_index] = display.segment;
          /* Put the snake's head index back into the front of its segment array. */
          game.snake.segment_indices.unshift(game.snake.head_index);

          /* Is the snake's head on the apple? */
          if (game.snake.head_index == game.apple.index) {

            game.score ++;
            game.time_step = (game.time_step > 100)?game.time_step - 10:100;// increase speed

            // add another segment to the tail position
            game.snake.segment_indices.push(tail_index);
            game.world.map[tail_index] = display.segment;
            game.apple.index = Math.floor(Math.random() * game.world.map.length);// reset the apple

            // If the snake fills up the entire map minus 1 space, reset the game.
            if (game.snake.segment_indices.length == game.world.map.length - 1) {

              game.reset();
              return;

            }

            /* If the apple is on any tile but a background tile, we need to move
            it to a background tile. We have to search for that background tile. */
            while(game.world.map[game.apple.index] != display.background_tile) {

              game.apple.index ++;

              // If checking past the bottom of the map, jump to the top
              if (game.apple.index > game.world.map.length - 1) {

                game.apple.index = 0;

              }

            }

            // Once the while loop ends, we know we have a safe spot for the apple.
            game.world.map[game.apple.index] = display.apple;

          }

          display.render();

        }

      }

      // Ensure the loop runs again.
      window.requestAnimationFrame(game.loop);

    }

  };

  // Initialize the game:

  display.buffer.canvas.height = display.buffer.canvas.width = game.world.columns * game.world.tile_size;

  // Draw all the graphics.
  for(let object in display.graphics) {

    display.graphics[object].draw();

  };

  window.addEventListener("resize", display.resize);
  window.addEventListener("keydown", controller.keyUpDown);
  window.addEventListener("keyup", controller.keyUpDown);

  game.reset();
  display.resize();

})();
