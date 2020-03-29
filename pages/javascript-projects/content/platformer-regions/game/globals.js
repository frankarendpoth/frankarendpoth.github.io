/* Frank Poth 2020-01-11 */

const IMAGES  = {};
const PIECES  = {};

const TILE_SIZE = 8;

var   PLAYER;

const PLAYERS = [];
const TILES   = [];

var OUTPUT;

const MOUSE = {

  column:0,
  row:0,
  x:0,
  y:0

};

const TOOL = {

  constructMultiple(Name, array, datas) {

    array.length = 0;

    for (var index = datas.length - 1; index > -1; -- index) array[index] = new Name(...datas[index]);

  },

  constructVariety(name_container, array, datas) {

    array.length = 0;

    for (var index = datas.length - 1; index > -1; -- index) {

      let data = datas[index];

      array[index] = new name_container[data[0]](...data.splice(1, data.length - 1));

    }

  },

  getColumnFromX(x) { return Math.floor(x / TILE_SIZE); },

  getRowFromY(y) { return Math.floor(y / TILE_SIZE); }

};