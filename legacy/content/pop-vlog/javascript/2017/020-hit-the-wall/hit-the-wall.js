// Frank Poth 11/16/2017

(function() { "use strict"

  // the three main components of the example
  var controller, display, game;

  // a basic controller object that handles key input
  controller = {

    left:false,
    right:false,
    up:false,

    keyUpDown:function(event) {

      var key_state = (event.type == "keydown")?true:false;

      switch(event.keyCode) {

        case 37: controller.left = key_state; break; // left key
        case 38: controller.up = key_state; break; // up key
        case 39: controller.right = key_state; break; // right key

      }

    }

  };

  // draws everything and handles html elements
  display = {

    buffer:document.createElement("canvas").getContext("2d"),
    context:document.querySelector("canvas").getContext("2d"),
    output:document.querySelector("p"),

    render:function() {

      for (let index = game.world.map.length - 1; index > -1; -- index) {

        this.buffer.fillStyle = (game.world.map[index] > 0)?("#0099" + game.world.map[index] + "f"):"#303840";
        this.buffer.fillRect((index % game.world.columns) * game.world.tile_size, Math.floor(index / game.world.columns) * game.world.tile_size, game.world.tile_size, game.world.tile_size);

      }

      this.buffer.fillStyle = game.player.color;
      this.buffer.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);

      this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);

    },

    resize:function(event) {

      var client_height = document.documentElement.clientHeight;

      display.context.canvas.width = document.documentElement.clientWidth - 32;

      if (display.context.canvas.width > client_height) {

        display.context.canvas.width = client_height;

      }

      display.context.canvas.height = Math.floor(display.context.canvas.width * 0.625);

      display.render();

    }

  };

  // here's where things get interesting
  // the game object holds all of our awesome game logic
  game = {

    // there's something different about the player object, and its old_x and
    // old_y. these variables keep track of the last position the player occupied
    player: {

      color:"#ff9900",
      height:32,
      jumping:false,
      old_x:160,// used for tracking last position for collision detection
      old_y:160,
      velocity_x:0,
      velocity_y:0,
      width:24,
      x:160,
      y:90

    },

    // the world object holds information about our tile map
    world: {

      columns:8,// just some basic info. no worries
      rows:5,
      tile_size:40,

      map:[0,0,0,0,0,0,0,0,// I went with a smaller map this time
           0,0,0,0,0,0,0,0,// 0s represent walkable tiles and everything else
           1,0,0,0,0,0,0,2,// represents a collision tile or wall tile
           3,0,0,4,0,0,2,5,// the different numbers correspond to different
           5,5,5,5,5,5,5,5]// collision shapes.

    },

    // the collision object is used to handle narrow phase collision detection
    // and response. Broad phase collision detection is just determining if the
    // player is standing on a non 0 tile in the map, narrow phase is handled
    // here, where the player's exact position is tested against the specific
    // collision boundaries of each type of tile. In this example there are 5
    // types of collision tile
    collision: {

      // the reason these functions are indexed with numbers is because they
      // correspond directly to tile values in the map array. For instance, this
      // function handles collision for any tile in the map with a value of 1
      // it handles collision detection and response on the specified player object
      // at the specified row and column in the tile map. the 1 tile collision
      // shape has a flat top and a flat right side, so only test for collision
      // and do response on those sides.
      1:function(object, row, column) {

        /* Basically these indexed functions are like routing functions. They
        make it easy to connect a collision shape with a value in the tile map.
        The real collision code happens in these inner functions. The great thing
        about this approach is that it's extremely modular, so you can mix and
        match collision functions and easily introduce new ones. */

        /* Depending on whether you want to do y or x first collision is as simple
        as calling the collision function for a specific axis before the other.
        In a platformer where players are always falling down due to gravity, it's
        a good idea to do y collision detection first. */

        if (this.topCollision(object, row)) { return; }// if no top collision
        this.rightCollision(object, column);           // try right side collision

      },

      // the 2 tile type has a top and a left side to collide with
      2:function(object, row, column) {

        if (this.topCollision(object, row)) { return; }
        this.leftCollision(object, column);

      },

      // the 3 tile type only blocks movement through the right side
      3:function(object, row, column) {

        this.rightCollision(object, column);

      },

      // the 4 tile type has collision on all sides but the bottom
      4:function(object, row, column) {

        if (this.topCollision(object, row)) { return; }// you only want to do one
        if (this.leftCollision(object, column)) { return; }// of these collision
        this.rightCollision(object, column);// responses. that's why there are if statements

      },

      // the 5 tile only does collision if the object falls through the top
      5:function(object, row, column) {

        this.topCollision(object, row);

      },

      /* Here are the actual collision detection and response functions. The concept
      I am working off of with this example is that all tiles have 4 sides. Rather
      than doing collision for all of them in the same function, I want to mix and
      match collision methods for each side. By doing it this way I can create all
      sorts of collision shapes and resuse my side specific collision code. This
      works extremely well, and the only downside is having to be more specific
      when you lay out your level maps because each tile has a specific purpose.
      For example, a floor tile only tests for collision on its top side and a wall
      tile will only test for collision on the left and/or right side. It is a small
      price to pay for awesome and smooth collision detection with basically no restriction on
      tile based collision shapes. You can have tiles where one side is a slope and the
      other is a curve or a flat side, for instance. That's pretty sweet. */

      /* This function handles collision with a rightward moving object. Another
      design requirement to use this method is that objects must have a record of
      their current and last physical position. A collision can only occur when a
      player enters into a collision shape through its boundary. It's foolproof so
      long as you always spawn your players on empty tiles and not in the walls. */
      leftCollision(object, column) {

        if (object.velocity_x > 0) {// If the object is moving right

          var left = column * game.world.tile_size;// calculate the left side of the collision tile

          if (object.x + object.width * 0.5 > left && object.old_x <= left) {// If the object was to the right of the collision object, but now is to the left of it

            object.velocity_x = 0;// Stop moving
            object.x = object.old_x = left - object.width * 0.5 - 0.001;// place object outside of collision
            // the 0.001 is just to ensure that the object is no longer in the same tile space as the collision tile
            // due to the way object tile position is calculated, moving the object to the exact boundary of the collision tile
            // would not move it out if its tile space, meaning that another collision with an adjacent tile might not be detected in another broad phase check

            return true;

          }

        }

        return false;

      },

      // these are all basically the same concept as the leftCollision function,
      // only for the different sides.

      rightCollision(object, column) {

        if (object.velocity_x < 0) {

          var right = (column + 1) * game.world.tile_size;

          if (object.x + object.width * 0.5 < right && object.old_x + object.width * 0.5 >= right) {

            object.velocity_x = 0;
            object.old_x = object.x = right - object.width * 0.5;

            return true;

          }

        }

        return false;

      },

      topCollision(object, row) {

        if (object.velocity_y > 0) {

          var top = row * game.world.tile_size;

          if (object.y + object.height > top && object.old_y + object.height <= top) {

            object.jumping = false;
            object.velocity_y = 0;
            object.old_y = object.y = top - object.height - 0.01;

            return true;

          }

        }

        return false;

      }

    },

    // Here's the game loop, where it all goes down!!!
    loop:function() {

      // get and use keyboard input
      if (controller.left) {

        game.player.velocity_x -= 0.25;

      }

      if (controller.right) {

        game.player.velocity_x += 0.25;

      }

      if (controller.up && !game.player.jumping) {

        game.player.velocity_y = -16;
        game.player.jumping = true;

      }

      game.player.velocity_y += 1; // add gravity

      game.player.old_x = game.player.x;// store the last position of the player
      game.player.old_y = game.player.y;// before we move it on this cycle

      game.player.x += game.player.velocity_x;// move the player's current position
      game.player.y += game.player.velocity_y;

      // do collision detection with the level boundaries so the player can't leave
      // the screen. Nothing you haven't seen before...
      if (game.player.x < 0) {

        game.player.velocity_x = 0;
        game.player.old_x = game.player.x = 0;

      } else if (game.player.x + game.player.width > display.buffer.canvas.width) {

        game.player.velocity_x = 0;
        game.player.old_x = game.player.x = display.buffer.canvas.width - game.player.width;

      }

      if (game.player.y < 0) {

        game.player.velocity_y = 0;
        game.player.old_y = game.player.y = 0;

      } else if (game.player.y + game.player.height > display.buffer.canvas.height) {

        game.player.velocity_y = 0;
        game.player.old_y = game.player.y = display.buffer.canvas.height - game.player.height;

      }

      // NOW FOR SOME GOOD STUFF!!! Here we do broadphase collision detection by checking
      // which tile value the player is standing on. If it is anything but 0 we have a possible collision.

      // calculate the player's x and y tile position in the tile map
      var tile_x = Math.floor((game.player.x + game.player.width * 0.5) / game.world.tile_size);
      var tile_y = Math.floor((game.player.y + game.player.height) / game.world.tile_size);
      // get the value at the tile position in the map
      var value_at_index = game.world.map[tile_y * game.world.columns + tile_x];

      // do some output so we can see it all in action
      display.output.innerHTML = "tile_x: " + tile_x + "<br>tile_y: " + tile_y + "<br>map index: " + tile_y + " * " + game.world.columns + " + " + tile_x + " = " + String(tile_y * game.world.columns + tile_x) + "<br>tile value: " + game.world.map[tile_y * game.world.columns + tile_x];

      // if it's not an empty tile, we need to do narrow phase collision detection and possibly response!
      if (value_at_index != 0) {

        // simply call one of the routing functions in the collision object and pass
        // in values for the collision tile's location in grid/map space
        game.collision[value_at_index](game.player, tile_y, tile_x);

      }

      // This might be confusing at first, but we actually have to do this twice, since
      // we are using a player object with a single point of contact, which is its bottom middle.
      // say we handled a collision with the floor in the check above and now the player object is
      // moved up above that tile. There's still a posibility that the player was moved into
      // an adjacent wall tile! We need to recalculate the new tile space the player is in
      // and then check to see if there is another collision. Don't worry, we only need
      // to do this twice. Once for the x axis, and one for the y axis. With this
      // collision method they could happen in either order, but they will both be handled.

      tile_x = Math.floor((game.player.x + game.player.width * 0.5) / game.world.tile_size);
      tile_y = Math.floor((game.player.y + game.player.height) / game.world.tile_size);
      value_at_index = game.world.map[tile_y * game.world.columns + tile_x];

      if (value_at_index != 0) {

        game.collision[value_at_index](game.player, tile_y, tile_x);

      } // and that's it! You checked twice and resolved any collisions with the map!

      game.player.velocity_x *= 0.9;// apply some friction to the player's velocity
      game.player.velocity_y *= 0.9;// the reason we do this after the collision code
      // is because we use the players velocity in the collision code and don't want to change it before now.
      // it probably doesn't matter, though. You could also calculate the velocity for collision by
      // subtracting the players last position from its current position, that never fails.

      display.render();

      window.requestAnimationFrame(game.loop);

    }

  };

  // basic setup and initialization
  display.buffer.canvas.height = 200;
  display.buffer.canvas.width = 320;

  window.addEventListener("resize", display.resize);
  window.addEventListener("keydown", controller.keyUpDown);
  window.addEventListener("keyup", controller.keyUpDown);

  display.resize();

  game.loop();

})();
