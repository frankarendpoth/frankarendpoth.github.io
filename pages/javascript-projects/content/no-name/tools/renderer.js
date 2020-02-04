/* Frank Poth 2020-01-20 */

const RENDERER = {

  context:document.createElement('canvas').getContext('2d', { alpha:false, desynchronized:true }),

  clear(color = "#000000") {

    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

  },

  highlightTile(x, y) {



  },

  renderPlayer(player) {

    var viewport_left = Math.floor(VIEWPORT.left);
    var viewport_top  = Math.floor(VIEWPORT.top);

    var frame = player.frame;

    this.context.drawImage(IMAGES[player.name], frame[0], frame[1], frame[2], frame[3], player.left - viewport_left + frame[4], player.top - viewport_top + frame[5], frame[2], frame[3]);

  },

  renderRegion(region) {

    var viewport_left = Math.floor(VIEWPORT.left);
    var viewport_top  = Math.floor(VIEWPORT.top);

    this.context.lineWidth   = "1px";
    this.context.strokeStyle = "#804000";

    this.context.beginPath();
    this.context.rect(region.left - viewport_left + 0.5, region.top - viewport_top + 0.5, region.width, region.height);
    this.context.stroke();

    var index_x = region.vertices.length - 2;

    this.context.beginPath();
    this.context.moveTo(region.vertices[0] - viewport_left + 0.5, region.vertices[1] - viewport_top + 0.5);
  
    while (index_x > -1) {

      this.context.lineTo(region.vertices[index_x] - viewport_left + 0.5, region.vertices[index_x + 1] - viewport_top + 0.5);
  
      index_x -= 2;
  
    }

    this.context.strokeStyle = "#f0b070";
    this.context.stroke();

  },

  renderTiles() {

    var viewport_bottom = Math.ceil(VIEWPORT.bottom) + TILE_SIZE;
    var viewport_left   = Math.floor(VIEWPORT.left);
    var viewport_right  = Math.ceil(VIEWPORT.right)  + TILE_SIZE;
    var viewport_top    = Math.floor(VIEWPORT.top);

    var maximum_x = viewport_right  > MAP.width  ? MAP.width  : viewport_right;
    var maximum_y = viewport_bottom > MAP.height ? MAP.height : viewport_bottom;
    var minimum_x = viewport_left   < 0          ? 0          : viewport_left;
    var minimum_y = viewport_top    < 0          ? 0          : viewport_top;

    var bottom_row   = TOOL.getRowFromY(maximum_y);
    var left_column  = TOOL.getColumnFromX(minimum_x);
    var right_column = TOOL.getColumnFromX(maximum_x);
    var top_row      = TOOL.getRowFromY(minimum_y);

    var adjusted_left = left_column * TILE_SIZE - viewport_left;
    var adjusted_top  = top_row     * TILE_SIZE - viewport_top;

    /*if (adjusted_left < 0) {
     
      adjusted_left += 8;
      left_column   += 1;

    }

    if (adjusted_top < 0) {

      adjusted_top += 8;
      top_row      += 1;

    }*/

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

    }

  },

  resizeCanvas(width, height) {

    this.context.canvas.width  = Math.floor(width);
    this.context.canvas.height = Math.floor(height);

    this.context.imageSmoothingEnabled = false;

  }

};