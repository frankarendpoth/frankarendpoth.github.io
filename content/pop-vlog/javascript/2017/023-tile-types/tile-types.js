// Frank Poth 12/05/2017

(function() { "use strict";

  const TILE_SIZE = 16;

      /////////////////
    //// OBJECTS ////
  /////////////////

  var controller, display, game;

  controller = {

    down:false, left:false, right:false, up:false,

    // A very simple key up/down event handler:
    keyUpDown:function(event) {

      var key_state = (event.type == "keydown")?true:false;

      switch(event.keyCode) {

        case 37: controller.left = key_state; break;// left key
        case 38: controller.up = key_state; break;// up key
        case 39: controller.right = key_state; break;// right key

      }

    }

  };

  display = {

    buffer:document.createElement("canvas").getContext("2d"),
    context:document.querySelector("canvas").getContext("2d"),
    output:document.querySelector("p"),// The output p element.
    tile_sheet: document.querySelector("img"),// The tile sheet graphic.

    render:function(game) {

      /* Loop through the map and draw all the tiles. */
      for (let index = game.area.map.length - 1; index > -1; -- index) {

        this.buffer.drawImage(this.tile_sheet, game.area.map[index] * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE, (index % game.area.columns) * TILE_SIZE, Math.floor(index / game.area.columns) * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      }

      /* Draw the player character. */
      this.buffer.drawImage(this.tile_sheet, 240, 0, TILE_SIZE, TILE_SIZE, game.player.x, game.player.y, game.player.width, game.player.height);

      /* Draw the buffer to the canvas. This takes care of scaling. */
      this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);

    },

    /* Resizes the display canvas when the window is resized. */
    resize:function(event) {

      let height = document.documentElement.clientHeight;

      display.context.canvas.width = document.documentElement.clientWidth - 16;

      if (display.context.canvas.width >= height * 0.5) {

        display.context.canvas.width = height * 0.5;

      }

      display.context.canvas.height = display.context.canvas.width;

      display.render(game);

    }

  };

  game = {

    /* The area object holds information about the map. */
    area: {

      columns:8,
      map:[ 0, 0, 0, 0, 0, 0, 3, 0,
            0, 0, 5, 0, 0, 0, 0, 4,
            0, 7, 0, 0, 6, 2, 0, 4,
            0, 1, 1, 1, 1, 1, 1, 1,
            7, 0, 0, 0, 0, 0,13, 0,
            0,11,12, 9,10, 0, 0, 7,
            0, 1, 1, 1, 1, 1, 1, 1,
           12, 0,14,14,14, 0, 8, 0]
    },

    player: {

      jumping:   true,
      height:    TILE_SIZE - 4,
      width:     TILE_SIZE - 4,
      x:         TILE_SIZE * 4 - TILE_SIZE * 0.5 + 2,
      x_old:     TILE_SIZE * 4 - TILE_SIZE * 0.5 + 2,
      x_velocity:0,
      y:         TILE_SIZE * 4,
      y_old:     TILE_SIZE * 8,
      y_velocity:0,

    },

    collider: {

      offset:0.001,

      /* A platform tile with a flat top surface. */
      1:function(object, column, row) {

        this.collideTop(object, row);

      },

      /* A platform tile with a flat right surface. */
      2:function(object, column, row) {

        this.collideRight(object, column);

      },

      /* A platform tile with a flat bottom surface. */
      3:function(object, column, row) {

        this.collideBottom(object, row);

      },

      /* A platform tile with a flat left surface. */
      4:function(object, column, row) {

        this.collideLeft(object, column);

      },

      /* A platform tile with flat top, right, bottom, and left surfaces. */
      5:function(object, column, row) {

        if (this.collideTop(object, row)) return;
        if (this.collideLeft(object, column)) return;
        if (this.collideRight(object, column)) return;
        this.collideBottom(object, row);

      },

      /* A half height platform tile residing in the bottom half of the tile space
      with flat top, right, bottom, and left surfaces. */
      6:function(object, column, row) {

        if (this.collideTop(object, row, TILE_SIZE * 0.5)) return;

        if (object.y + object.height > row * TILE_SIZE + TILE_SIZE * 0.5) {

          if (this.collideLeft(object, column)) return;
          if (this.collideRight(object, column)) return;

        }

        this.collideBottom(object, row);

      },

      /* A half height platform tile residing in the bottom half of the tile space
      with a flat top surface. */
      7:function(object, column, row) {

        this.collideTop(object, row, TILE_SIZE * 0.5);

      },

      /* A slope tile starting in the bottom left corner and rising to the top right
      corner of the tile space that only pushes objects up out of it. This is not
      a platform tile, it is a solid tile. */
      8:function(object, column, row) {

        let current_x = object.x + object.width - column * TILE_SIZE;

        let top = -1 * current_x + TILE_SIZE + row * TILE_SIZE;

        if (current_x > TILE_SIZE) {

          object.jumping = false;
          object.y_velocity = 0;
          object.y = row * TILE_SIZE - object.height - this.offset;

        } else if (object.y + object.height > top) {

          object.jumping = false;
          object.y_velocity = 0;
          object.y = top - object.height - this.offset;

        }

      },

      /* A slope tile starting in the bottom left corner and rising to the top right
      corner of the tile space. */
      9:function(object, column, row) {

        this.collideSlopeTop(object, column, row, -1, TILE_SIZE);

      },

      /* A slope tile starting in the top left corner and declining to the bottom
      right corner of the tile space. */
      10:function(object, column, row) {

        this.collideSlopeTop(object, column, row, 1, 0);

      },

      /* A half height slope tile starting in the bottom left corner and rising to
      the middle right side of the tile space. */
      11:function(object, column, row) {

        this.collideSlopeTop(object, column, row, -0.5, TILE_SIZE);

      },

      /* A half height slope tile starting in the middle left side and declining
      to the bottom right corner of the tile space. */
      12:function(object, column, row) {

        this.collideSlopeTop(object, column, row, 0.5, TILE_SIZE * 0.5);

      },

      /* A slope tile starting in the top left corner and declining to the bottom
      right corner of the tile space, with flat surfaces on the bottom and left sides. */
      13:function(object, column, row) {

        if (this.collideSlopeTop(object, column, row, 1, 0)) return;
        if (this.collideLeft(object, column)) return;

        let bottom = row * TILE_SIZE + TILE_SIZE;
        let right = column * TILE_SIZE + TILE_SIZE;

        if (object.x < right && object.x_old >= right && object.y < bottom && object.y + object.height > bottom) {

          object.x_velocity = 0;
          object.x = right;

        }

        this.collideBottom(object, row);

      },

      /* A half height curve tile that simply pushes the object up when collision is detected. */
      14:function(object, column, row) {

        /* x is the x center of the object adjusted so that x = 0 when the object
        is in the center of the tile space. */
        let x = (object.x + object.width * 0.5) - (column * TILE_SIZE + TILE_SIZE * 0.5);
        /* y_vertex is the y value at the peak of the curve or the turn around point,
        or whatever you'd like to call it. In this case it's just at the top of our
        curve tile. */
        let y_vertex = row * TILE_SIZE + TILE_SIZE * 0.5;
        /* The coefficient determines how wide the curve will be at its base or
        to be exact, how wide it will be at the y intercept. This particular formula
        will yield a width of the full tile size at the base of the tile should
        the vertex be in the center of the tile space. Changing the 2 can yield different
        heights. For instance, 4 would give the width of the base if the vertex were at
        the top of the tile space and the base were at the bottom. I haven't tested
        this with a TILE_SIZE other than 16, so this formula may be garbage. */
        let coefficient = TILE_SIZE / ((TILE_SIZE * TILE_SIZE) / 2);

        /* This is the basic formula for a quadratic curve: y = a(x - h)^2 + k
        Where h is the x offset, and k is the y_vertex */
        let top = coefficient * x * x + y_vertex;

        if (object.y + object.height > top) {

          object.jumping = false;
          object.y_velocity = 0;
          object.y = top - object.height - this.offset;

        }

      },

      collideBottom:function(object, row, y_offset = TILE_SIZE) {

        let bottom = row * TILE_SIZE + y_offset;

        if (object.y < bottom && object.y_old >= bottom) {

          object.y_velocity = 0;
          object.y = bottom + this.offset;

          return true;

        } return false;

      },

      collideLeft:function(object, column) {

        let left = column * TILE_SIZE;

        if (object.x + object.width > left && object.x_old + object.width <= left) {

          object.x_velocity = 0;
          object.x = left - object.width - this.offset;

          return true;

        } return false;

      },

      collideRight:function(object, column) {

        let right = column * TILE_SIZE + TILE_SIZE;

        if (object.x < right && object.x_old >= right) {

          object.x_velocity = 0;
          object.x = right;

          return true;

        } return false;

      },

      collideTop:function(object, row, y_offset = 0) {

        let top = row * TILE_SIZE + y_offset;

        if (object.y + object.height > top && object.y_old + object.height <= top) {

          object.jumping = false;
          object.y_velocity = 0;
          object.y = top - object.height - this.offset;

          return true;

        } return false;

      },

      /* This function handles collision with slope tiles on the y axis. */
      collideSlopeTop:function(object, column, row, slope, y_offset) {

        let origin_x = column * TILE_SIZE;
        let origin_y = row * TILE_SIZE + y_offset;
        let current_x = (slope < 0) ? object.x + object.width - origin_x : object.x - origin_x;
        let current_y = object.y + object.height - origin_y;
        let old_x = (slope < 0) ? object.x_old + object.width - origin_x : object.x_old - origin_x;
        let old_y = object.y_old + object.height - origin_y;
        let current_cross_product = current_x * slope - current_y;
        let old_cross_product     = old_x * slope - old_y;
        let top = (slope < 0) ? row * TILE_SIZE + TILE_SIZE + y_offset * slope : row * TILE_SIZE + y_offset;

        if ((current_x < 0 || current_x > TILE_SIZE) && (object.y + object.height > top && object.y_old + object.height <= top || current_cross_product < 1 && old_cross_product > -1)) {

          object.jumping = false;
          object.y_velocity = 0;
          object.y = top - object.height - this.offset;

          return true;

        } else if (current_cross_product < 1 && old_cross_product > -1) {

          object.jumping = false;
          object.y_velocity = 0;
          object.y = row * TILE_SIZE + slope * current_x + y_offset - object.height - this.offset;

          return true;

        } return false;

      },

      handleCollision:function(object, area) {

        var column, row, value;

        /* TEST TOP */

        column = Math.floor(object.x / TILE_SIZE);// The column under the left side of the object:
        row    = Math.floor(object.y / TILE_SIZE);// The row under the top side of the object:
        value  = area.map[row * area.columns + column];// We get the tile value under the top left corner of the object:

        if (value != 0) this[value](object, column, row);// If it's not a walkable tile, we do narrow phase collision.

        column = Math.floor((object.x + object.width) / TILE_SIZE);// The column under the right side of the object:
        value  = area.map[row * area.columns + column];// Value under the top right corner of the object.

        if (value != 0) this[value](object, column, row);

        /* TEST BOTTOM */

        column = Math.floor(object.x / TILE_SIZE);// The column under the left side of the object:
        row    = Math.floor((object.y + object.height) / TILE_SIZE);// The row under the bottom side of the object:
        value  = area.map[row * area.columns + column];

        if (value != 0) this[value](object, column, row);

        column = Math.floor((object.x + object.width) / TILE_SIZE);// The column under the right side of the object:
        value  = area.map[row * area.columns + column];

        if (value != 0) this[value](object, column, row);

        /* TEST LEFT */

        column = Math.floor(object.x / TILE_SIZE);// The column under the left side of the object:
        row    = Math.floor(object.y / TILE_SIZE);// Top side row:
        value  = area.map[row * area.columns + column];

        if (value != 0) this[value](object, column, row);

        row = Math.floor((object.y + object.height) / TILE_SIZE);// Bottom side row:
        value = area.map[row * area.columns + column];

        if (value != 0) this[value](object, column, row);

        /* TEST RIGHT */

        column = Math.floor((object.x + object.width) / TILE_SIZE);// The column under the right side of the object:
        row    = Math.floor(object.y / TILE_SIZE);// Top side row:
        value  = area.map[row * area.columns + column];

        if (value != 0) this[value](object, column, row);

        row = Math.floor((object.y + object.height) / TILE_SIZE);// Bottom side row:
        value = area.map[row * area.columns + column];

        if (value != 0) this[value](object, column, row);

      }

    },

    loop: function(time_stamp) {

      if (controller.up && !game.player.jumping) {

        game.player.jumping = true;
        game.player.y_velocity = -10;

      }

      if (controller.left) {

        game.player.x_velocity -= 0.2;

      }

      if (controller.right) {

        game.player.x_velocity += 0.2;

      }

      game.player.x_old = game.player.x;
      game.player.y_old = game.player.y;

      game.player.y_velocity += 1;

      game.player.x += game.player.x_velocity;
      game.player.y += game.player.y_velocity;

      game.player.x_velocity *= 0.9;
      game.player.y_velocity *= 0.9;

      // Collision detection and response handling with the walls:

      if (game.player.y < 0) {

        game.player.y_velocity = 0;
        game.player.y = 0;

      } else if (game.player.y + game.player.height > display.buffer.canvas.height) {

        game.player.jumping = false;
        game.player.y_velocity = 0;
        game.player.y = display.buffer.canvas.height - game.player.height - 0.001;

      }

      if (game.player.x < 0) {

        game.player.x_velocity = 0;
        game.player.x = 0;

      } else if (game.player.x + game.player.width > display.buffer.canvas.width) {

        game.player.x_velocity = 0;
        game.player.x = display.buffer.canvas.width - game.player.width - 0.001;

      }

      // Handle collision with world AFTER moving the player.
      game.collider.handleCollision(game.player, game.area);

      display.render(game);

      display.output.innerHTML = "player bottom: " + (game.player.y + game.player.height) + "<br>tile top:      " + Math.round(game.player.y + game.player.height) + "<br>tile row:      " + (Math.floor((game.player.y + game.player.height) / TILE_SIZE));

      window.requestAnimationFrame(game.loop);

    }

  };

      ////////////////////
    //// INITIALIZE ////
  ////////////////////

  display.buffer.canvas.height = 128;
  display.buffer.canvas.width = 128;
  display.output.style.textAlign = "left";
  display.output.style.justifySelf = "center";
  display.output.style.whiteSpace = "pre";

  window.addEventListener("keydown", controller.keyUpDown);
  window.addEventListener("keyup", controller.keyUpDown);
  window.addEventListener("resize", display.resize);

  display.resize();

  game.loop();

})();
