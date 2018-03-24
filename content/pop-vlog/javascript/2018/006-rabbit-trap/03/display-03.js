// Frank Poth 03/23/2018

/* I moved some generic functions to the Display.prototype.
I created the Display.TileSheet class, which handles the tile sheet image and its
dimensions.
I got rid of the drawRectangle function and replaced it with the drawPlayer function. */

const Display = function(canvas) {

  this.buffer  = document.createElement("canvas").getContext("2d"),
  this.context = canvas.getContext("2d");

  this.tile_sheet = new Display.TileSheet(16, 8);

  /* This function draws the map to the buffer. */
  this.drawMap = function(map, columns) {

    for (let index = map.length - 1; index > -1; -- index) {

      let value = map[index] - 1;
      let source_x =           (value % this.tile_sheet.columns) * this.tile_sheet.tile_size;
      let source_y = Math.floor(value / this.tile_sheet.columns) * this.tile_sheet.tile_size;
      let destination_x =           (index % columns) * this.tile_sheet.tile_size;
      let destination_y = Math.floor(index / columns) * this.tile_sheet.tile_size;

      this.buffer.drawImage(this.tile_sheet.image, source_x, source_y, this.tile_sheet.tile_size, this.tile_sheet.tile_size, destination_x, destination_y, this.tile_sheet.tile_size, this.tile_sheet.tile_size);

    }

  };

  this.drawPlayer = function(rectangle, color1, color2) {

    this.buffer.fillStyle = color1;
    this.buffer.fillRect(Math.floor(rectangle.x), Math.floor(rectangle.y), rectangle.width, rectangle.height);
    this.buffer.fillStyle = color2;
    this.buffer.fillRect(Math.floor(rectangle.x + 2), Math.floor(rectangle.y + 2), rectangle.width - 4, rectangle.height - 4);

  };

  this.resize = function(width, height, height_width_ratio) {

    if (height / width > height_width_ratio) {

      this.context.canvas.height = width * height_width_ratio;
      this.context.canvas.width = width;

    } else {

      this.context.canvas.height = height;
      this.context.canvas.width = height / height_width_ratio;

    }

    this.context.imageSmoothingEnabled = false;

  };

};

Display.prototype = {

  constructor : Display,

  render:function() { this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height); },

};

Display.TileSheet = function(tile_size, columns) {

  this.image = new Image();
  this.tile_size = tile_size;
  this.columns = columns;

};

Display.TileSheet.prototype = {};
