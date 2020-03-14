/* THIS WORKS!!! In this example, VIEWPORT.left and top are just DOT.x and DOT.y
  this.context.resetTransform();
  this.context.translate(-VIEWPORT.left * VIEWPORT.scale + VIEWPORT.half_width, -VIEWPORT.top * VIEWPORT.scale + VIEWPORT.half_height);
  this.context.scale(VIEWPORT.scale, VIEWPORT.scale);
  
  You can also do:

  VIEWPORT.left = DOT.x * VIEWPORT.scale - VIEWPORT.width;
  VIEWPORT.top  = DOT.y * VIEWPORT.scale - VIEWPORT.height;

  this.context.setTransform(VIEWPORT.scale, 0, 0, VIEWPORT.scale, -VIEWPORT.left, -VIEWPORT.top);
  
  */
/*
const RENDERER = {

  buffer:  document.createElement('canvas').getContext('2d', { alpha:false, desynchronized:true }),
  display: document.createElement('canvas').getContext('2d', { alpha:false, desynchronized:true }),

  clear(color = "#000000") {

    var canvas = this.buffer.canvas;

    this.buffer.globalAlpha = 1;
    this.buffer.resetTransform();
    this.buffer.fillStyle = color;
    this.buffer.fillRect(0, 0, canvas.width, canvas.height);

  },

  render() {

    

  },

  renderDot() {

    this.buffer.globalAlpha = 1;
    //this.buffer.setTransform(this.scale, 0, 0, this.scale, -VIEWPORT.left * this.scale, -VIEWPORT.top * this.scale);
    this.buffer.drawImage(IMAGE, 40, 0, TILE_SIZE, TILE_SIZE, DOT.x - 4, DOT.y - 4, TILE_SIZE, TILE_SIZE);

  },

};*/

const RENDERER = {

  context:document.createElement('canvas').getContext('2d', { alpha:false, desynchronized:true }),

  scale:1,

  clear(color = "#000000") {

    var canvas = this.context.canvas;

    this.context.globalAlpha = 1;
    this.context.resetTransform();
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, canvas.width, canvas.height);

  },

  renderDot() {

    this.context.globalAlpha = 1;
    //this.context.setTransform(this.scale, 0, 0, this.scale, -VIEWPORT.left * this.scale, -VIEWPORT.top * this.scale);
    this.context.drawImage(IMAGE, 40, 0, TILE_SIZE, TILE_SIZE, DOT.x - 4, DOT.y - 4, TILE_SIZE, TILE_SIZE);

  },

  renderMap() {

    var viewport_bottom = VIEWPORT.bottom;
    var viewport_left   = VIEWPORT.left + TILE_SIZE;
    var viewport_right  = VIEWPORT.right;
    var viewport_top    = VIEWPORT.top + TILE_SIZE;

    var maximum_x = viewport_right  > MAP.width  ? MAP.width  : viewport_right;
    var maximum_y = viewport_bottom > MAP.height ? MAP.height : viewport_bottom;
    var minimum_x = viewport_left   < 0          ? 0          : viewport_left;
    var minimum_y = viewport_top    < 0          ? 0          : viewport_top;

    var bottom_row   = Math.floor(maximum_y / TILE_SIZE);
    var left_column  = Math.floor(minimum_x / TILE_SIZE);
    var right_column = Math.floor(maximum_x / TILE_SIZE);
    var top_row      = Math.floor(minimum_y / TILE_SIZE);

    var adjusted_left = left_column * TILE_SIZE;
    var adjusted_top  = top_row     * TILE_SIZE;

    var adjusted_height = bottom_row   * TILE_SIZE;
    var adjusted_width  = right_column * TILE_SIZE;
  
    var index = top_row * MAP.columns + left_column;

    var index_jump = left_column + MAP.columns - right_column;

    this.context.globalAlpha = 1;
    this.context.setTransform(this.scale, 0, 0, this.scale, -VIEWPORT.left * this.scale, -VIEWPORT.top * this.scale);

    for (var top = adjusted_top; top < adjusted_height; top += TILE_SIZE) {

      for (var left = adjusted_left; left < adjusted_width; left += TILE_SIZE) {

        var tile = TILES[MAP.tile_indices[index]];

        this.context.drawImage(IMAGE, tile.left, 0, TILE_SIZE, TILE_SIZE, left, top, TILE_SIZE, TILE_SIZE);

        index ++;

      }

      index += index_jump;

    }

    this.context.beginPath();
    this.context.strokeStyle = "#ff0000";
    this.context.rect(VIEWPORT.left, VIEWPORT.top, VIEWPORT.width, VIEWPORT.height);
    this.context.stroke();

  },

  resize(width, height) {

    this.context.canvas.height = height;
    this.context.canvas.width  = width;

    this.context.imageSmoothingEnabled = false;

  }

};