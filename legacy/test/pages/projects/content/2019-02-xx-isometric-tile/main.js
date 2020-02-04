(() => {

  var count = 0;
  var tilt_range = { min: 0, max: 1 };
  var direction = 0.005;

  function update(time_stamp) {

    game.world.offset_x ++;

    count ++;

    if (count > 2) {
      
      count = 0;

      var tilt = game.world.tilt + direction;

      tilt += direction;

      if (tilt > tilt_range.max) {
        
        tilt = tilt_range.max;
        direction *= -1;
    
      } else if (tilt < tilt_range.min) {

        tilt = tilt_range.min;
        direction *= -1;

      }

      game.world.setTilt(tilt);
    
    }

  }

  function render() {

    display.clear();

    var rows       = game.world.rows;
    var columns    = game.world.columns;
    var tile_width = game.world.tile_width;
    var tile_depth = game.world.tilted_depth;
    var max_height = rows * game.world.tile_depth * 0.5;
    var current_height = rows * tile_depth * 0.5;

    for (var r = 0; r < rows; r ++) {

      var row_value = r * columns;

      for (var c = 0; c < columns; c ++) {

        var tile = game.world.tile_map[row_value + c];

        if (tile.canvas.height != 0) display.drawImage(tile.canvas, 0, 0, tile.canvas.width, tile.canvas.height,
          
          Math.floor(c * tile_width + (r & 1) * tile_width * 0.5),
          
          Math.floor(max_height - current_height + (r * tile_depth * 0.5 - game.world.getTiltedHeight(game.world.height_map[row_value + c]))),
          
          tile.canvas.width, tile.canvas.height);

      }

    }

    display.render();

  }

  function keyDownUp(event) { event.preventDefault();


    
  }

  var display = new Display(document.querySelector("canvas"));
  var engine  = new Engine(update, render, 1000/30);
  var game    = new Game();

  display.resizeBuffer(game.world.viewport_width, game.world.viewport_height);

  display.start();
  engine.start();

  window.addEventListener("keydown", keyDownUp);
  window.addEventListener("keyup", keyDownUp);

})();