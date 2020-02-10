var IMAGE;

const MOUSE = {

  x:0,
  y:0,

  getMapX() { return this.x / VIEWPORT.scale; },

  getMapY() { return this.y / VIEWPORT.scale; }

};

const DOT = {

  x:32,
  y:36

};

const TILE_SIZE = 8;

const TILES = [];
