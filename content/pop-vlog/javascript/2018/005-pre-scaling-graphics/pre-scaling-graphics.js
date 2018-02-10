// Frank Poth 02/09/2018

(function() { "use strict";

  var display, player, world;

  display = {

    context:document.querySelector("canvas").getContext("2d"),

    scale:undefined,

    tile_sheet: {

      columns:    2,// The number of columns in the tile sheet image.
      rows:       2,// The number of rows in the tile sheet image.
      graphics:   [],// The pre-scaled graphics.
      image:      new Image(),// The tile sheet image (yet to be loaded).
      tile_height:16,// The height of each tile.
      tile_width: 16,// The width of each tile.

      /* Draws graphics from the source tile sheet to individual canvases with a
      scale factor. You could easily expand this function to preprocess graphics
      in other ways as well. For example, you could adjust the color channels of
      each graphic to add a tint, or add other parameters to flip certain graphics. */
      drawGraphics:function(scale) {

        /* Loop through all tiles in the tile sheet image. */
        for (let index = this.columns * this.rows - 1; index > -1; -- index) {

          var graphic = document.createElement("canvas").getContext("2d");

          graphic.canvas.height = this.tile_height * scale;
          graphic.canvas.width  = this.tile_width * scale;

          graphic.imageSmoothingEnabled = false;

          graphic.drawImage(this.image,// The source image.
                            (index % this.columns) * this.tile_width,// The source x position to blit from.
                            Math.floor(index / this.columns) * this.tile_height,// The source y position to blit from.
                            this.tile_width, this.tile_height,// The source width and height to blit from.
                            0, 0, graphic.canvas.width, graphic.canvas.height);// The coordinates to blit to on the new graphic adjusted for scale.

          this.graphics[index] = graphic;

        }

      }

    },

    render:function() {

      for (let index = world.map.length - 1; index > -1; -- index) {

        let graphic = this.tile_sheet.graphics[world.map[index]];

        this.context.drawImage(graphic.canvas, (index % world.columns) * graphic.canvas.height, Math.floor(index / world.columns) * graphic.canvas.width);

      }

      this.context.drawImage(this.tile_sheet.graphics[1].canvas, player.x * this.scale, player.y * this.scale);

    },

    resize:function(event) {

      var height, width;

      height = document.documentElement.clientHeight;
      width  = document.documentElement.clientWidth;

      display.context.canvas.width  = Math.floor(width / world.columns) * world.columns;

      if (display.context.canvas.width > height) {

        display.context.canvas.width = Math.floor(height / world.columns) * world.columns;

      }

      display.context.canvas.height = display.context.canvas.width * (world.rows/world.columns);

      display.scale = (display.context.canvas.width / world.columns) / display.tile_sheet.tile_width;

      display.tile_sheet.drawGraphics(display.scale);

      display.render();

    }

  };

  player = {

    graphic_index:1,

    x:16, y:32

  };

  world = {

    columns:8,
    rows:   4,

    map:[0, 0, 0, 0, 0, 0, 0, 0,
         0, 0, 3, 0, 3, 0, 0, 0,
         0, 0, 0, 0, 0, 0, 3, 0,
         2, 2, 2, 2, 2, 2, 2, 2],

  };

  //// INITIALIZE ////

  display.tile_sheet.image.addEventListener("load", function(event) {

    display.resize();

    window.addEventListener("click", function(event) {

      var bounding_rectangle = display.context.canvas.getBoundingClientRect();

      player.x = (event.clientX - bounding_rectangle.left) / display.scale - display.tile_sheet.tile_width * 0.5;
      player.y = (event.clientY - bounding_rectangle.top) / display.scale - display.tile_sheet.tile_height * 0.5;

      display.render();

    });

  });

  display.tile_sheet.image.src = "tile-sheet.png";

  window.addEventListener("resize", display.resize);

})();
