// Frank Poth 03/28/2018


const Game = function() {

  this.world = new Game.World();

  this.update = function() {

    this.world.update();

  };

};

Game.prototype = { constructor : Game };

Game.World = function(friction = 0.9, gravity = 3) {

  this.collider = new Game.World.Collider();

  this.friction = friction;
  this.gravity  = gravity;

  this.player   = new Game.World.Player();

  this.columns   = 12;
  this.rows      = 9;
  this.tile_size = 16;
  this.map = [48,17,17,17,49,48,18,19,16,17,35,36,10,39,39,39,16,18,39,31,31,31,39,7,10,31,39,31,31,31,39,12,5,5,28,1,35,6,39,39,31,39,39,19,39,39,8,9,2,31,31,47,39,47,39,31,31,4,36,25,10,39,39,31,39,39,39,31,31,31,39,37,10,39,31,4,14,6,39,39,3,39,0,42,49,2,31,31,11,39,39,31,11,0,42,9,8,40,27,13,37,27,13,3,22,34,9,24];

  this.collision_map = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,00,00,00,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,-1,-1,-1,-1,00,-1,-1,
                        -1,-1,00,00,00,00,00,00,-1,-1,-1,-1];

  this.height   = this.tile_size * this.rows;
  this.width    = this.tile_size * this.columns;

};

Game.World.prototype = {

  constructor: Game.World,

  collideObject:function(object) {

    if (object.getLeft < 0) { object.x = 0; object.velocity_x = 0; }
    else if (object.getRight() > this.width) { object.x = this.width - object.width; object.velocity_x = 0; }
    if (object.y < 0) { object.y = 0; object.velocity_y = 0; }
    else if (object.getBottom() > this.height) { object.jumping = false; object.y = this.height - object.height; object.velocity_y = 0; }

    let bottom = Math.floor(object.getBottom() / this.tile_size);
    let left   = Math.floor(object.getLeft() / this.tile_size);
    let right  = Math.floor(object.getRight() / this.tile_size);

    let value = this.collision_map[bottom * this.columns + left];

    this.collider.collide(value, object, left * this.tile_size, bottom * this.tile_size);

    value = this.collision_map[bottom * this.columns + right];

    this.collider.collide(value, object, right * this.tile_size, bottom * this.tile_size);

  },

  update:function() {

    this.player.velocity_y += this.gravity;
    this.player.update();

    this.player.velocity_x *= this.friction;
    this.player.velocity_y *= this.friction;

    this.collideObject(this.player);

  }

};

Game.World.Collider = function() {

  this.collide = function(value, object, boundary_x, boundary_y) {

    switch(value) {

      case 0:

        this.collideSolidTop(object, boundary_y);

      break;

    }

  }

};

Game.World.Collider.prototype = {

  constructor: Game.World.Collider,

  collideSolidTop:function(object, boundary_y) {

    if (object.getBottom() > boundary_y && object.getOldBottom() <= boundary_y) {

      object.setBottom(boundary_y);
      object.setOldBottom(boundary_y);
      object.velocity_y = 0;
      object.jumping = false;

    }

  }

 };

Game.World.Object = function(x, y, width, height) {

 this.height = height;
 this.width  = width;
 this.x      = x;
 this.x_old  = x;
 this.y      = y;
 this.y_old  = y;

};

Game.World.Object.prototype = {

  constructor:Game.World.Object,

  getBottom:function() { return this.y + this.height; },
  getLeft:  function() { return this.x; },
  getRight: function() { return this.x + this.width; },
  getTop:   function() { return this.y; },

  getOldBottom:function() { return this.y_old + this.height; },

  setBottom:function(y) { this.y = y - this.height; },
  setOldBottom:function(y) { this.y = y - this.height; }

};

Game.World.Player = function(x, y) {

  Game.World.Object.call(this, 100, 100, 12, 12);

  this.color1     = "#404040";
  this.color2     = "#f0f0f0";

  this.jumping    = true;
  this.velocity_x = 0;
  this.velocity_y = 0;

};

Game.World.Player.prototype = {

  jump:function() {

    if (!this.jumping) {

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

Object.assign(Game.World.Player.prototype, Game.World.Object.prototype);
Game.World.Player.prototype.constructor = Game.World.Player;
