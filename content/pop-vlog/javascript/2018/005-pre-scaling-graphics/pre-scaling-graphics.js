// Frank Poth 02/09/2018

/* This example draws pre-scaled graphics directly to the display canvas; this eliminates
the need for a buffer canvas and also eliminates scaling on subsequent redraws of
the display canvas once it has been resized. In my past programs, I drew everything
to a buffer canvas in "real" coordinates according to the original size of my graphics.
I then drew that buffer to the final display canvas which was scaled up to a different
size to fit the browser window. The drawImage function would take care of scaling
the buffer canvas to fit the display canvas on every single redraw. With this method,
you only need to scale when your browser window resizes, and you only need to draw
your graphics once to the final canvas rather than drawing them once to a buffer,
and then drawing the buffer to the display canvas. Double buffering is apparently
handled by the browser, so don't worry about drawing everything to a buffer first.
If you need to double buffer, try canvas "flipping". This is where you have two
on screen canvas elements on top of each other and you draw to them on alternating
frames of animation. When one canvas is done rendering, you set its visibility to
"visible" and set the other canvas's visibility to "hidden". This ensures that you
never draw the same image twice (once to an offscreen buffer and once to the display
buffer), and it ensures that you do not display your canvas until you decide it is
done buffering. Jeez, this is a long comment. I have never tried flipping, so try
it at your own risk. */
(function() { "use strict";

  var display, player, world;// world is just the map data.

  display = {

    context:document.querySelector("canvas").getContext("2d"),// The display canvas context.
    p:document.querySelector("p"),// The output p element.

    scale:undefined,// The scale factor of our graphics (yet to be set).

    tile_sheet: {// Everything to do with our tile sheet and its graphics.

      columns:    2,// The number of columns in the tile sheet image.
      rows:       2,// The number of rows in the tile sheet image.
      graphics:   [],// The pre-scaled graphics (yet to be created).
      image:      new Image(),// The tile sheet image (yet to be loaded).
      tile_size:16,// The height and width of each tile.

      /* Draws graphics from the source tile sheet to individual canvases with a
      scale factor. You could easily expand this function to preprocess graphics
      in other ways as well. For example, you could adjust the color channels of
      each graphic to add a tint, or add other parameters to flip certain graphics. */
      drawGraphics:function(scale) {

        /* Loop through all tiles in the tile sheet image. */
        for (let index = this.columns * this.rows - 1; index > -1; -- index) {

          var graphic = document.createElement("canvas").getContext("2d");

          /* Size the canvas to the scaled dimensions. */
          graphic.canvas.height = graphic.canvas.width = this.tile_size * scale;

          graphic.imageSmoothingEnabled = false;// Don't use image smoothing for crisp scaling.

          graphic.drawImage(this.image,// The source image.
                            (index % this.columns) * this.tile_size,// The source x position to blit from.
                            Math.floor(index / this.columns) * this.tile_size,// The source y position to blit from.
                            this.tile_size, this.tile_size,// The source width and height to blit from.
                            0, 0, graphic.canvas.width, graphic.canvas.height);// The coordinates to blit to on the new graphic adjusted for scale.

          this.graphics[index] = graphic;// Store the graphic in the tile_sheet's graphics array.

        }

      }

    },

    render:function() {console.log(this.scale)

      /* Loop through the map and draw each graphic according to the tile values. */
      for (let index = world.map.length - 1; index > -1; -- index) {

        let graphic = this.tile_sheet.graphics[world.map[index]];// Get the appropriate graphic.

        /* Without scaling we can use the simplified version of drawImage. */
        this.context.drawImage(graphic.canvas, (index % world.columns) * graphic.canvas.height, Math.floor(index / world.columns) * graphic.canvas.width);

      }

      /* Draw the player. Make sure to scale the player's x and y coordinates accordingly. */
      this.context.drawImage(this.tile_sheet.graphics[1].canvas, player.x * this.scale, player.y * this.scale);

    },

    /* This is an extremely important part of this method. We only scale our graphics
    when the screen is resized, and we need to calculate our scale factor based on
    the size of our visible tile map in rows and columns and the maximum size we
    can make our display canvas. */
    resize:function(event) {

      var height, width;

      /* Get the screen height and width as a reference point. These are the maximum
      screen dimensions we can possibly have. */
      height = document.documentElement.clientHeight;
      width  = document.documentElement.clientWidth;

      /* Get the maximum whole number that our tiles can be to fill the width of
      the screen and multiply it by the number of columns in the map to get the
      width of the display canvas. */
      display.context.canvas.width  = Math.floor(width / world.columns) * world.columns;

      /* If our map is taller than the screen, shrink it down some more. */
      if (display.context.canvas.width > height) {

        display.context.canvas.width = Math.floor(height / world.columns) * world.columns;

      }

      /* Make sure the canvas has the same height to width ratio as our map. */
      display.context.canvas.height = display.context.canvas.width * (world.rows/world.columns);

      /* Scale is calculated by dividing the width of our display canvas by the
      number of columns in the map and then dividing that value by the original
      tile size. Scale is the ratio of our scaled tile size to the original tile size. */
      display.scale = (display.context.canvas.width / world.columns) / display.tile_sheet.tile_size;

      display.p.innerHTML = "scale factor:       " + display.scale + "<br>original tile size: " + display.tile_sheet.tile_size + "<br>scaled tile size:   " + display.tile_sheet.tile_size + " * " + display.scale + " = " + display.tile_sheet.tile_size * display.scale;

      display.tile_sheet.drawGraphics(display.scale);// Scale the graphics.

      display.render();

    }

  };

  player = {

    graphic_index:1,// The index of the player graphic in the tile_sheet.graphics array.

    x:16, y:32

  };

  world = {

    columns:8,
    rows:   4,

    map:[0, 0, 0, 0, 0, 0, 0, 0,
         0, 0, 3, 0, 3, 0, 0, 0,
         0, 0, 0, 0, 0, 0, 3, 0,
         2, 2, 2, 2, 2, 2, 2, 2]/*,

    columns:32,
    rows:   8,

      map: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,3,3,3,0,0,3,3,3,0,0,3,3,0,0,0,0,3,0,3,0,0,0,3,3,0,0,3,3,3,0,0,
            0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,3,0,3,0,3,0,0,3,0,3,0,0,3,0,
            0,3,3,3,0,0,0,3,0,0,3,0,0,0,0,0,3,0,3,0,3,0,3,3,3,3,0,3,3,3,0,0,
            0,3,0,0,3,0,0,3,0,0,3,0,3,3,0,0,3,0,0,0,3,0,3,0,0,3,0,3,0,0,0,0,
            0,3,3,3,0,0,3,3,3,0,0,3,3,0,0,0,3,0,0,0,3,0,3,0,0,3,0,3,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]*/

  };

  //// INITIALIZE ////

  /* Set up the output p element. */
  display.p.style.whiteSpace = "pre";
  display.p.style.fontFamily = "monospace";

  /* Add a load event listener for loading our tile sheet image. This will also
  call the resize and render function once the image is loaded. */
  display.tile_sheet.image.addEventListener("load", function(event) {

    display.resize();

    /* For fun I added this functionality to move the player image around by
    clicking the screen. */
    window.addEventListener("click", function(event) {

      var bounding_rectangle = display.context.canvas.getBoundingClientRect();

      player.x = (event.clientX - bounding_rectangle.left) / display.scale - display.tile_sheet.tile_size * 0.5;
      player.y = (event.clientY - bounding_rectangle.top) / display.scale - display.tile_sheet.tile_size * 0.5;

      display.render();

    });

  });

  display.tile_sheet.image.src = "tile-sheet.png";// Start loading the tile sheet.

  window.addEventListener("resize", display.resize);

})();
