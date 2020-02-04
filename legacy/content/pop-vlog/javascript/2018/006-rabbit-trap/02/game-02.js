// Frank Poth 03/09/2018

/* The Game class has been updated with a new Player class and given a new world
object that controls the virtual game world. Players, NPCs, world dimensions, collision
maps, and everything to do with the game world are stored in the world object. */

const Game = function() {

  this.world = {

    background_color:"rgba(40,48,56,0.25)",

    friction:0.9,
    gravity:3,

    player:new Game.Player(),

    height:72,
    width:128,

    collideObject:function(object) {

      if (object.x < 0) { object.x = 0; object.velocity_x = 0; }
      else if (object.x + object.width > this.width) { object.x = this.width - object.width; object.velocity_x = 0; }
      if (object.y < 0) { object.y = 0; object.velocity_y = 0; }
      else if (object.y + object.height > this.height) { object.jumping = false; object.y = this.height - object.height; object.velocity_y = 0; }

    },

    update:function() {

      this.player.velocity_y += this.gravity;
      this.player.update();

      this.player.velocity_x *= this.friction;
      this.player.velocity_y *= this.friction;

      this.collideObject(this.player);

    }

  };

  this.update = function() {

    this.world.update();

  };

};

Game.prototype = { constructor : Game };

Game.Player = function(x, y) {

  this.color      = "#ff0000";
  this.height     = 16;
  this.jumping    = true;
  this.velocity_x = 0;
  this.velocity_y = 0;
  this.width      = 16;
  this.x          = 100;
  this.y          = 50;

};

Game.Player.prototype = {

  constructor : Game.Player,

  jump:function() {

    if (!this.jumping) {

      this.color = "#" + Math.floor(Math.random() * 16777216).toString(16);// Change to random color
      /* toString(16) will not add a leading 0 to a hex value, so this: #0fffff, for example,
      isn't valid. toString would cut off the first 0. The code below inserts it. */
      if (this.color.length != 7) {

        this.color = this.color.slice(0, 1) + "0" + this.color.slice(1, 6);

      }

      this.jumping     = true;
      this.velocity_y -= 20;

    }

  },

  moveLeft:function()  { this.velocity_x -= 0.5; },
  moveRight:function() { this.velocity_x += 0.5; },

  update:function() {

    this.x += this.velocity_x;
    this.y += this.velocity_y;

  }

};
