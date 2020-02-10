/* THIS WORKS!!! In this example, VIEWPORT.left and top are just DOT.x and DOT.y
  this.context.resetTransform();
  this.context.translate(-VIEWPORT.left * VIEWPORT.scale + VIEWPORT.half_width, -VIEWPORT.top * VIEWPORT.scale + VIEWPORT.half_height);
  this.context.scale(VIEWPORT.scale, VIEWPORT.scale);
  
  You can also do:

  VIEWPORT.left = DOT.x * VIEWPORT.scale - VIEWPORT.width;
  VIEWPORT.top  = DOT.y * VIEWPORT.scale - VIEWPORT.height;

  this.context.setTransform(VIEWPORT.scale, 0, 0, VIEWPORT.scale, -VIEWPORT.left, -VIEWPORT.top);
  
  */

const RENDERER = {

  context:document.createElement('canvas').getContext('2d', { alpha:false, desynchronized:true }),

  clear(color = "#000000") {

    var canvas = this.context.canvas;

    this.context.globalAlpha = 1;
    this.context.resetTransform();
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, canvas.width, canvas.height);

  },

  highlightMouse() {

    var mouse_x = MOUSE.getMapX();
    var mouse_y = MOUSE.getMapY();

    var column_x = Math.floor(mouse_x / TILE_SIZE) * TILE_SIZE;
    var row_y    = Math.floor(mouse_y / TILE_SIZE) * TILE_SIZE;

    this.context.fillStyle = "#ffffff";
    this.context.globalAlpha = 0.2;
    this.context.fillRect(column_x, row_y, TILE_SIZE, TILE_SIZE);

  },

  renderDot() {

    this.context.globalAlpha = 1;
    //this.context.setTransform(VIEWPORT.scale, 0, 0, VIEWPORT.scale, -VIEWPORT.left, -VIEWPORT.top);
    this.context.drawImage(IMAGE, 40, 0, TILE_SIZE, TILE_SIZE, DOT.x - 4, DOT.y - 4, TILE_SIZE, TILE_SIZE);

  },

  renderMap() {

    var tile_index = 0;

    var height = MAP.rows    * TILE_SIZE;
    var width  = MAP.columns * TILE_SIZE;

    var top  = 0;
    var left = 0;

    this.context.globalAlpha = 1;
    this.context.setTransform(VIEWPORT.scale, 0, 0, VIEWPORT.scale, -VIEWPORT.left, -VIEWPORT.top);

    while(top < height) {

      left = 0;
      
      while (left < width) {

        var tile = TILES[MAP.tile_indices[tile_index]];

        this.context.drawImage(IMAGE, tile.left, 0, TILE_SIZE, TILE_SIZE, left, top, TILE_SIZE, TILE_SIZE);

        tile_index ++;

        left += TILE_SIZE;

      }

      top += TILE_SIZE;
    
    }

  },

  resize(width, height) {

    this.context.canvas.height = height;
    this.context.canvas.width  = width;

    this.context.imageSmoothingEnabled = false;

  }

};