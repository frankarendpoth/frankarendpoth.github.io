const RENDERER = {

  context:document.createElement('canvas').getContext('2d', { alpha:false, desynchronized:true }),

  scale:1,

  clear(color = "#000000") {

    var canvas = this.context.canvas;

    this.context.fillStyle = color;
    this.context.fillRect(0, 0, canvas.width, canvas.height);

  },

  renderDot() {

    var scale = this.scale;
    var adjusted_tile_size = (TILE_SIZE * scale + 1) | 0;

    this.context.drawImage(IMAGE, 40, 0, TILE_SIZE, TILE_SIZE, ((VIEWPORT.half_width - 4) * scale) | 0, ((VIEWPORT.half_height - 4) * scale) | 0, adjusted_tile_size, adjusted_tile_size);

  },

  renderMap() {

    var viewport_bottom = VIEWPORT.bottom;
    var viewport_left   = VIEWPORT.left + TILE_SIZE; // add TILE_SIZE to offset the clip region
    var viewport_right  = VIEWPORT.right;
    var viewport_top    = VIEWPORT.top + TILE_SIZE;

    var maximum_x = viewport_right  > MAP.width  ? MAP.width  : viewport_right;
    var maximum_y = viewport_bottom > MAP.height ? MAP.height : viewport_bottom;
    var minimum_x = viewport_left   < 0          ? 0          : viewport_left;
    var minimum_y = viewport_top    < 0          ? 0          : viewport_top;

    var bottom_row   = (maximum_y / TILE_SIZE) | 0;
    var left_column  = (minimum_x / TILE_SIZE) | 0;
    var right_column = (maximum_x / TILE_SIZE) | 0;
    var top_row      = (minimum_y / TILE_SIZE) | 0;

    var scale = this.scale;

    var offset_x = -VIEWPORT.left * scale;
    var offset_y = -VIEWPORT.top  * scale;

    var adjusted_left = left_column * TILE_SIZE * scale;
    var adjusted_top  = top_row     * TILE_SIZE * scale;

    var adjusted_height = (bottom_row   * TILE_SIZE * scale - 1) | 0;
    var adjusted_width  = (right_column * TILE_SIZE * scale - 1) | 0;

    var adjusted_tile_size = TILE_SIZE * scale;
  
    var index = top_row * MAP.columns + left_column;

    var index_jump = left_column + MAP.columns - right_column;

    for (var top = adjusted_top; top < adjusted_height; top += adjusted_tile_size) {

      for (var left = adjusted_left; left < adjusted_width; left += adjusted_tile_size) {

        var tile = TILES[MAP.tile_indices[index]];

        this.context.drawImage(IMAGE, tile.left, 0, TILE_SIZE, TILE_SIZE, (offset_x + left) | 0, (offset_y + top) | 0, (adjusted_tile_size + 1) | 0, (adjusted_tile_size + 1) | 0);

        index ++;

      }

      index += index_jump;

    }

  },

  resize(width, height) {

    this.context.canvas.height = height;
    this.context.canvas.width  = width;

    this.context.imageSmoothingEnabled = false;

  }

};