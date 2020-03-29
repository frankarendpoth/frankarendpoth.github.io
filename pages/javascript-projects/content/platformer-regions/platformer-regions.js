/* Frank Poth 2020-01-09 */

(() => {

  function keyDown(event) { event.preventDefault();

    switch(event.keyCode) { 

      case 37: CONTROLLER.left.trigger(true);  break;
      case 38: CONTROLLER.up.trigger(true);    break;
      case 39: CONTROLLER.right.trigger(true); break;
      case 40: CONTROLLER.down.trigger(true);  break;

    }

  }

  function keyUp(event) { event.preventDefault();

    switch(event.keyCode) {

      case 37: CONTROLLER.left.trigger(false);  break;
      case 38: CONTROLLER.up.trigger(false);    break;
      case 39: CONTROLLER.right.trigger(false); break;
      case 40: CONTROLLER.down.trigger(false);  break;

    }

  }

  function mouseMove(event) { event.preventDefault();

    MOUSE.x = event.clientX;
    MOUSE.y = event.clientY;

  }

  function resize(event) { if (event) event.preventDefault();

    VIEWPORT.window_height = document.documentElement.clientHeight;
    VIEWPORT.window_width  = document.documentElement.clientWidth;
    
    VIEWPORT.window_ratio = VIEWPORT.window_width / VIEWPORT.window_height;

    VIEWPORT.resizeToRegion(MAP.region);

    RENDERER.resizeCanvas(VIEWPORT.window_width, VIEWPORT.window_height);

  }

  OUTPUT = document.getElementById('output');

  document.body.appendChild(RENDERER.context.canvas);

  window.addEventListener('resize',    resize);
  window.addEventListener('keydown',   keyDown);
  window.addEventListener('keyup',     keyUp);
  window.addEventListener('mousemove', mouseMove);

  ENGINE.render = function() {

    OUTPUT.innerText = MOUSE.column + ', ' + MOUSE.row + '\n' + MOUSE.column * TILE_SIZE + ', ' + MOUSE.row * TILE_SIZE;

    RENDERER.clear("#008040");
    RENDERER.renderTiles();
    RENDERER.highlightTile(MOUSE.x, MOUSE.y);
    RENDERER.renderPlayer(PLAYER);
    RENDERER.renderRegion(MAP.region);

  };

  ENGINE.update = function() {

    if (CONTROLLER.down.active)  { PLAYER.moveY(2);  }
    if (CONTROLLER.left.active)  { PLAYER.moveX(-2); }
    if (CONTROLLER.right.active) { PLAYER.moveX(2);  }
    if (CONTROLLER.up.active)    { PLAYER.moveY(-2); }

    if (MAP.changeRegionByPoint(PLAYER.middle_x, PLAYER.middle_y)) VIEWPORT.resizeToRegion(MAP.region);

    RENDERER.scale = RENDERER.context.canvas.width / VIEWPORT.width;

    VIEWPORT.scrollTo(PLAYER.middle_x, PLAYER.middle_y);

    MOUSE.column = (((MOUSE.x / RENDERER.scale) + VIEWPORT.left) / TILE_SIZE) | 0;
    MOUSE.row    = (((MOUSE.y / RENDERER.scale) + VIEWPORT.top)  / TILE_SIZE) | 0;

  };

  LOADER.loadLevel('test-room', () => {

    TOOL.constructVariety(PIECES, TILES,   LOADER.level_data.tiles);
    TOOL.constructVariety(PIECES, PLAYERS, LOADER.level_data.players);

    MAP.setup(...LOADER.level_data.map);

    PLAYER = PLAYERS.shift();

    MAP.selectRegionByPoint(PLAYER.middle_x, PLAYER.middle_y);

    VIEWPORT.resizeToRegion(MAP.region);

    resize();

    ENGINE.start();

  });

})();