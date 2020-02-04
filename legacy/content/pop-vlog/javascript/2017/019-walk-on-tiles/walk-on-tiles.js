// Frank Poth 11/15/2017

(function() { "use strict" // used to throw a compiler error if a variable is not propperly defined

  // the three main parts of the program:
  var controller, display, game;

  // holds our controller specific code:
  controller = {

    down:false,
    left:false,
    right:false,
    up:false,

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

  // holds display specific code used for interacting with HTML and drawing to
  // the canvas:
  display = {

    buffer:document.createElement("canvas").getContext("2d"), // used to draw image in game dimensions
    context:document.querySelector("canvas").getContext("2d"), // used to display final scaled image in browser window
    output:document.querySelector("p"), // used to show output in browser window

    render:function() {

      // draw the tile map
      for (let index = game.world.map.length - 1; index > -1; -- index) {

        this.buffer.fillStyle = (game.world.map[index] == 1)?"#0099ff":"#303840"; // I have another tutorial that explains the math behind converting 1d map coordinates to 2d world coordinates
        this.buffer.fillRect((index % game.world.columns) * game.world.tile_size, Math.floor(index / game.world.columns) * game.world.tile_size, game.world.tile_size, game.world.tile_size);

      }

      // draw the player
      this.buffer.fillStyle = game.player.color;
      this.buffer.beginPath();
      this.buffer.arc(game.player.x, game.player.y, game.player.radius, 0, Math.PI * 2);
      this.buffer.closePath();
      this.buffer.fill();

      // draw the buffer to the display context. this will automatically scale your image.
      // note that drawing this huge image on every frame is pretty memory intensive, and is a bad technique
      // for an actual game. I just use it in my examples because it is quick to set up and takes care of scaling.
      this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);

      // output all that nice data!
      this.output.innerHTML = "tile_x: " + game.player.tile_x + "<br>tile_y: " + game.player.tile_y + "<br>map index: " + game.player.tile_y + " * " + game.world.columns + " + " + game.player.tile_x + " = " + String(game.player.tile_y * game.world.columns + game.player.tile_x);

    },

    // keep the canvas sized properly:
    resize:function(event) {

      var client_height = document.documentElement.clientHeight;

      display.context.canvas.width = document.documentElement.clientWidth - 32;

      if (display.context.canvas.width > client_height) {

        display.context.canvas.width = client_height;

      }

      // everyone loves a 16/9 aspect ratio!
      display.context.canvas.height = Math.floor(display.context.canvas.width * 0.5625);

      display.render();// render the display again so you don't see a flicker on screen resize

    }

  };

  // holds game logic code:
  game = {

    // when the counter reaches 0, a tile turns blue
    counter:Math.random() * 100,

    // the player is just a yellow circle, doing yellow circle things:
    player: {

      color:"#ff9900",
      radius:8,
      tile_x:undefined,// the x and y tile positions of the player
      tile_y:undefined,
      velocity_x:0,
      velocity_y:0,
      x:160,// center screen
      y:90

    },

    // the world object holds information about the game world, such as the
    // level map and its dimensions as well as tile size
    world: {

      columns:16,// there are 16 columns and 9 rows in the map
      rows:9,
      tile_size:20,// each tile is 20 pixels wide and high

      // the one dimensional tile map:
      map:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,
           0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
           1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
           0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
           1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
           0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
           1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
           0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
           1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],

    },

    // this is the game loop. it is perpetuated by requestAnimationFrame
    loop:function() {

      // get input from the controller
      if (controller.down) {

        game.player.velocity_y += 0.25;

      }

      if (controller.left) {

        game.player.velocity_x -= 0.25;

      }

      if (controller.right) {

        game.player.velocity_x += 0.25;

      }

      if (controller.up) {

        game.player.velocity_y -= 0.25;

      }

      // do some collision detection with the edge of the screen

      // if the player is off of the left side of the screen
      if (game.player.x - game.player.radius < 0) {

        game.player.velocity_x = 0;// stop it from moving
        game.player.x = game.player.radius;// reposition it

      } else if (game.player.x + game.player.radius > display.buffer.canvas.width) { // or the right side of the screen

        game.player.velocity_x = 0;
        game.player.x = display.buffer.canvas.width - game.player.radius;

      }

      if (game.player.y - game.player.radius < 0) {

        game.player.velocity_y = 0;
        game.player.y = game.player.radius;

      } else if (game.player.y + game.player.radius > display.buffer.canvas.height) {

        game.player.velocity_y = 0;
        game.player.y = display.buffer.canvas.height - game.player.radius;

      }

      // add the player's velocity to its x and y positions
      game.player.x += game.player.velocity_x;
      game.player.y += game.player.velocity_y;

      // simulate friction and slow the player down
      game.player.velocity_x *= 0.9;
      game.player.velocity_y *= 0.9;

      // here is all the important stuff:
      // calculate the x and y tile in the map that the player is standing on
      game.player.tile_x = Math.floor(game.player.x / game.world.tile_size);
      game.player.tile_y = Math.floor(game.player.y / game.world.tile_size);

      // set the tile the player is standing on to 0 in the map
      game.world.map[game.player.tile_y * game.world.columns + game.player.tile_x] = 0;

      // now we will test for win conditions
      let victory = true;

      // we must check every tile to see if there are any 1s left (1s are blue tiles)
      for (let index = game.world.map.length - 1; index > -1; -- index) {

        // if any 1s exist, we cannot win and there's no point in continuing the for loop
        if (game.world.map[index] == 1) {

          victory = false;
          break;

        }

      }

      // that's right, you can win this "game"
      if (victory) {

        // reset the controller so the alert prompt doesn't freeze the keydown event and make the player keep moving in its current direction
        controller.down = controller.left = controller.right = controller.up = false;
        game.counter = -1;// reset the counter to -1 so another blue square can be generated immediately
        alert("You have done it! You have vanquished the evil blue squares! But they will rise again...");

      }

      // when the counter reaches zero, make a random tile in the map a 1
      game.counter --;

      if (game.counter < 0) {

        game.counter = Math.random() * 125;// reset the counter to a random value between 0 and 125
        game.world.map[Math.floor(Math.random() * game.world.map.length)] = 1;// reset that random tile!

      }

      // draw all the tiles, the player, and output data
      display.render();

      // call the loop function again once the window is ready to draw
      window.requestAnimationFrame(game.loop);

    }

  };

  // initialize the application by setting default values:

  // set the buffer size. this will be the world dimensions.
  display.buffer.canvas.height = 180;
  display.buffer.canvas.width = 320;

  window.addEventListener("resize", display.resize);
  window.addEventListener("keydown", controller.keyUpDown);
  window.addEventListener("keyup", controller.keyUpDown);

  // size the canvas element
  display.resize();

  // start the game loop!
  game.loop();

})();
