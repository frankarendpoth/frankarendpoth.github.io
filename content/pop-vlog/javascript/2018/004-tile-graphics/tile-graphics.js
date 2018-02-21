// Frank Poth 02/09/2018

/* This example simply blits tile graphics to a buffer canvas according to a 1d
tile map. The buffer canvas is then blitted to the display canvas. */

(function() { "use strict";

  /* The display handles everything to do with drawing graphics and resizing the
  screen. The world holds the map and its dimensions. */
  var display, world;

  display = {

    /* We draw the tiles to the buffer in "world" coordinates or unscaled coordinates.
    All scaling is handled by drawImage when we draw the buffer to the display canvas. */
    buffer:document.createElement("canvas").getContext("2d"),
    /* Scaling takes place on the display canvas. This is its drawing context. The
    height_width_ratio is used in scaling the buffer to the canvas. */
    context:document.querySelector("canvas").getContext("2d"),
    /* The height width ratio is the height to width ratio of the tile map. It is
    used to size the display canvas to match the aspect ratio of the game world. */
    height_width_ratio:undefined,

    /* The tile_sheet object holds the tile sheet graphic as well as its dimensions. */
    tile_sheet: {

      image:new Image(),// The actual graphic will be loaded into this.

      columns:3,
      tile_height:16,
      tile_width:16

    },

    /* This function draws the tile graphics from the tile_sheet.image to the buffer
    one by one according to the world.map. It then draws the buffer to the display
    canvas and takes care of scaling the buffer image up to the display canvas size. */
    render:function() {

      /* Here we loop through the tile map. */
      for (let index = world.map.length - 1; index > -1; -- index) {

        /* We get the value of each tile in the map which corresponds to the tile
        graphic index in the tile_sheet.image. */
        var value = world.map[index];

        /* This is the x and y location at which to cut the tile image out of the
        tile_sheet.image. */
        var source_x = (value % this.tile_sheet.columns) * this.tile_sheet.tile_width;
        var source_y = Math.floor(value / this.tile_sheet.columns) * this.tile_sheet.tile_height;

        /* This is the x and y location at which to draw the tile image we are cutting
        from the tile_sheet.image to the buffer canvas. */
        var destination_x = (index % world.columns) * this.tile_sheet.tile_width;
        var destination_y = Math.floor(index / world.columns) * this.tile_sheet.tile_height;

        /* Draw the tile image to the buffer. The width and height of the tile is taken from the tile_sheet object. */
        this.buffer.drawImage(this.tile_sheet.image, source_x, source_y, this.tile_sheet.tile_width, this.tile_sheet.tile_height, destination_x, destination_y, this.tile_sheet.tile_width, this.tile_sheet.tile_height);

      }

      /* Now we draw the finalized buffer to the display canvas. You don't need to
      use a buffer; you could draw your tiles directly to the display canvas. If
      you are going to scale your display canvas at all, however, I recommend this
      method, because it eliminates antialiasing problems that arize due to scaling
      individual tiles. It is somewhat slower, however. */
      this.context.drawImage(this.buffer.canvas, 0, 0, world.width, world.height, 0, 0, this.context.canvas.width, this.context.canvas.height);

    },

    /* Resizes the display canvas when the screen is resized. */
    resize:function(event) {

      display.context.canvas.width = document.documentElement.clientWidth - 16;

      if (display.context.canvas.width > document.documentElement.clientHeight - 16) {

        display.context.canvas.width = document.documentElement.clientHeight - 16;

      }

      /* That height_width_ratio comes into play here. */
      display.context.canvas.height = display.context.canvas.width * display.height_width_ratio;

      display.buffer.imageSmoothingEnabled = display.context.imageSmoothingEnabled = false;

      display.render();

    }

  };

  /* The world holds information about the tile map. */
  world = {

    map: [7, 7, 8, 8, 8, 8, 8, 8,
          0, 7, 7, 7, 7, 8, 8, 8,
          1, 7, 7, 7, 7, 7, 7, 7,
          2, 3, 7, 7, 6, 7, 6, 7,
          4, 2, 5, 5, 5, 5, 5, 5],

    columns:8,

    height:80,
    width:124

  };

  //// INITIALIZE ////

  /* Before we can draw anything we have to load the tile_sheet image. */
  display.tile_sheet.image.addEventListener("load", function(event) {

    display.buffer.canvas.height = world.height;
    display.buffer.canvas.width  = world.width;
    display.height_width_ratio   = world.height / world.width;

    display.resize();

  });

  /* Start loading the image. */
  display.tile_sheet.image.src = "tile-graphics.png";

  window.addEventListener("resize", display.resize);

})();
