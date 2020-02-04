// Frank Poth 04/03/2018

/* Changes:
1. Removed the TileSheet class from part 3 and added the Game.World.TileSet class to Game.
2. Changed the drawMap function to be as generic as posible.
3. Changed the drawPlayer function to the drawObject function. */

const Display = function(canvas) {

  this.buffer  = document.createElement("canvas").getContext("2d"),
  this.context = canvas.getContext("2d");

  /* This function draws the map to the buffer. */
  this.drawMap = function(image, image_columns, map, map_columns, tile_size) {

    for (let index = map.length - 1; index > -1; -- index) {

      let value         = map[index];
      let source_x      =           (value % image_columns) * tile_size;
      let source_y      = Math.floor(value / image_columns) * tile_size;
      let destination_x =           (index % map_columns  ) * tile_size;
      let destination_y = Math.floor(index / map_columns  ) * tile_size;

      this.buffer.drawImage(image, source_x, source_y, tile_size, tile_size, destination_x, destination_y, tile_size, tile_size);

    }

  };

  this.drawObject = function(image, source_x, source_y, destination_x, destination_y, width, height) {

    this.buffer.drawImage(image, source_x, source_y, width, height, Math.round(destination_x), Math.round(destination_y), width, height);

  };

  this.resize = function(width, height, height_width_ratio) {

    if (height / width > height_width_ratio) {

      this.context.canvas.height = width * height_width_ratio;
      this.context.canvas.width  = width;

    } else {

      this.context.canvas.height = height;
      this.context.canvas.width  = height / height_width_ratio;

    }

    this.context.imageSmoothingEnabled = false;

  };

};

Display.prototype = {

  constructor : Display,

  render:function() { this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height); },

};
