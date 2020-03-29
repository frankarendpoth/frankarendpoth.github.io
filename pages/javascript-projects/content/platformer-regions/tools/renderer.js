/* Frank Poth 2020-01-20 */

const RENDERER = {

  context:document.createElement('canvas').getContext('2d', { alpha:false, desynchronized:true }),

  scale:1,

  clear(color = "#000000") {

    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

  },

  highlightTile(x, y) {

    var scale = this.scale;

    var viewport_left = VIEWPORT.left;
    var viewport_top  = VIEWPORT.top;

    var offset_x = viewport_left - ((viewport_left / TILE_SIZE) | 0) * TILE_SIZE;
    var offset_y = viewport_top  - ((viewport_top  / TILE_SIZE) | 0) * TILE_SIZE;

    var xx = ((((x / scale + offset_x) / TILE_SIZE) | 0) * TILE_SIZE) * scale - offset_x * scale;
    var yy = ((((y / scale + offset_y) / TILE_SIZE) | 0) * TILE_SIZE) * scale - offset_y * scale;

    this.context.fillStyle = 'rgba(255,255,255,0.1)';
    this.context.fillRect(xx | 0, yy | 0, (TILE_SIZE * scale + 1) | 0, (TILE_SIZE * scale + 1) | 0);

  },

  renderPlayer(player) {

    var viewport_left = VIEWPORT.left;
    var viewport_top  = VIEWPORT.top;

    var frame = player.frame;

    var scale = this.scale;

    this.context.drawImage(IMAGES[player.name], frame[0], frame[1], frame[2], frame[3], ((player.left - viewport_left + frame[4]) * scale) | 0, ((player.top - viewport_top + frame[5]) * scale) | 0, (frame[2] * scale) | 0, (frame[3] * scale) | 0);

  },

  renderRegion(region) {

    var scale = this.scale;

    var viewport_left = VIEWPORT.left;
    var viewport_top  = VIEWPORT.top;

    this.context.lineWidth   = 4;
    this.context.strokeStyle = "#804000";

    this.context.beginPath();
    this.context.rect(((region.left - viewport_left) * scale) | 0, ((region.top - viewport_top) * scale) | 0, (region.width * scale) | 0, (region.height * scale) | 0);
    this.context.stroke();

    var index_x = region.vertices.length - 2;

    this.context.beginPath();
    this.context.moveTo(((region.vertices[0] - viewport_left) * scale) | 0, ((region.vertices[1] - viewport_top) * scale) | 0);
  
    while (index_x > -1) {

      this.context.lineTo(((region.vertices[index_x] - viewport_left) * scale) | 0, ((region.vertices[index_x + 1] - viewport_top) * scale) | 0);
  
      index_x -= 2;
  
    }

    this.context.strokeStyle = "#f0b070";
    this.context.stroke();

  },

  renderTiles() {

    var viewport_bottom = VIEWPORT.bottom + TILE_SIZE;
    var viewport_left   = VIEWPORT.left;
    var viewport_right  = VIEWPORT.right  + TILE_SIZE;
    var viewport_top    = VIEWPORT.top;

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

        let tile  = TILES[MAP.tile_indices[index]];
        let image = IMAGES[tile.name];
        let frame = tile.frame;

        this.context.drawImage(image, frame[0], frame[1], TILE_SIZE, TILE_SIZE, (offset_x + left) | 0, (offset_y + top) | 0, (adjusted_tile_size + 1) | 0, (adjusted_tile_size + 1) | 0);

        index ++;

      }

      index += index_jump;

    }

    /*var adjusted_left = left_column * TILE_SIZE - viewport_left;
    var adjusted_top  = top_row     * TILE_SIZE - viewport_top;

    var adjusted_height = bottom_row   * TILE_SIZE - viewport_top;
    var adjusted_width  = right_column * TILE_SIZE - viewport_left;
  
    var index = top_row * MAP.columns + left_column;

    var index_jump = left_column + MAP.columns - right_column;

    for (var top = adjusted_top; top < adjusted_height; top += TILE_SIZE) {

      for (var left = adjusted_left; left < adjusted_width; left += TILE_SIZE) {

        let tile  = TILES[MAP.tile_indices[index]];
        let image = IMAGES[tile.name];
        let frame = tile.frame;

        this.context.drawImage(image, frame[0], frame[1], TILE_SIZE, TILE_SIZE, left, top, TILE_SIZE, TILE_SIZE);

        index ++;

      }

      index += index_jump;

    }*/

  },

  resizeCanvas(width, height) {

    this.context.canvas.width  = Math.floor(width);
    this.context.canvas.height = Math.floor(height);

    this.context.imageSmoothingEnabled = false;

  }

};