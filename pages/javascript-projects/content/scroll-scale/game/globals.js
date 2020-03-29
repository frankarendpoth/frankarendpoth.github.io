var IMAGE;

const MOUSE = {

  x:0,
  y:0,

  getMapX() { return this.x / SCALE; },

  getMapY() { return this.y / SCALE; }

};

const DOT = {

  x:32,
  y:36

};

const TILE_SIZE = 8;

const TILES = [];
