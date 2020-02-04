const RENDERER = {

  context:document.createElement('canvas').getContext('2d', { alpha:false, desynchronized:true }),

  clear(color = "#000000") {

    var canvas = this.context.canvas;

    this.context.fillStyle = color;

    this.context.fillRect(0, 0, canvas.width, canvas.height);

  },

  renderDot() {

    this.context.fillStyle = "#ff0000";
    this.context.fillRect(DOT.x - VIEWPORT.left, DOT.y - VIEWPORT.top, 1, 1);

  },

  renderMap() {

    var tile_index = 0;

    var height = MAP.rows    * TILE_SIZE;
    var width  = MAP.columns * TILE_SIZE;

    var top = 0;
    var left = 0; 

    while(top < height) {

      left = 0;
      
      while (left < width) {

        var tile = TILES[MAP.tile_indices[tile_index]];

        this.context.drawImage(IMAGE, tile.left, 0, TILE_SIZE, TILE_SIZE, left - VIEWPORT.left, top - VIEWPORT.top, TILE_SIZE, TILE_SIZE);

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

  },

  setScale(scale) { this.context.setTransform(scale, 0, 0, scale, 0, 0); }

};