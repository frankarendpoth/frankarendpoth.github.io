class World {

  constructor() {

    this.max_height = 48;

    this.offset_x = 0;
    this.offset_y = 0;

    this.columns = 16; // columns in the visible map
    this.rows    = 32; // rows in the visible map

    this.tile_width   = 16; // x axis length
    this.tile_depth   = 16; // z axis length
    this.tilted_depth = undefined;

    // an angle of 1 yields a top down view; an angle of 0 yields a side view; an angle of 0.5 yields a 45 degree top down view. 
    this.tilt = undefined;

    // This array holds all the heights for each tile
    this.height_map = new Array();
    // This array holds all the tile objects, which have graphics and tile type data.
    this.tile_map   = new Array();

    this.noise2d = new SimplexNoise2D(10, Math.random() * 1000);

    this.generateHeightMap(0, 0);
    this.setTilt(0.5);

    // These dimensions tell the buffer how big it should be.
    this.viewport_width  = Math.floor(this.columns * this.tile_width + this.tile_width * 0.5);
    Math.floor(this.viewport_height = this.rows * this.tile_depth * 0.5 + this.tile_depth * 0.5);

  }

  setTilt(amount) {

    this.tilt = amount;
    this.tilted_depth = this.tile_depth * this.tilt;

    this.generateTileMap();

  }

  getTiltedHeight(height) {

    return height * (1 - this.tilt);

  }

  generateHeightMap(column, row) {

    for (var c = this.columns - 1; c > -1; -- c) {
      for (var r = this.rows - 1; r > -1; -- r) {

        var height = Math.floor(this.noise2d.getValue(c + column, r + row) * this.max_height * 0.5 + this.max_height * 0.5);

        if (height < 16) height = 0;

        this.height_map[r * this.columns + c] = height;
      }
    }

  }

  generateTileMap() {

    for (var c = this.columns - 1; c > -1; -- c) {

      for (var r = this.rows - 1; r > -1; -- r) {

        var index = r * this.columns + c;
        var tile = new Tile();
        var tile_height = this.height_map[index];

        tile.draw(this.tile_width, tile_height, this.getTiltedHeight(tile_height), this.tilted_depth, this.max_height);

        this.tile_map[index] = tile;

      }

    }

  }

}