// Frank Poth 04/03/2018

/* Changes:

1. I added an AssetsManager class which will eventually store all my graphics and sounds.
2. The render function now draws the player's frame instead of a square like in part 4.
3. The resize function now stretches the display canvas to the full viewport capacity.

The project is starting to grow unmanagable as it grows. Luckily my IPO structure
is dramatically decreasing the amount of rewrites I have to do to other classes,
but since most of my code is in the Game class, edits in that class are becoming
rather tedious. As the project grows I will have to focus my videos more on individual
changes and ignore the vast bulk of existing code. */

window.addEventListener("load", function(event) {

  "use strict";

  //// CLASSES ////

  /* The assets manager will be responsible for loading and storing graphics for
  the game. Because it only has to load the tilesheet image right now, it's very specific
  about what it does. */
  const AssetsManager = function() {

    this.tile_set_image = undefined;

  };

  AssetsManager.prototype = {

    constructor: Game.AssetsManager,

    loadTileSetImage:function(url, callback) {

      this.tile_set_image = new Image();

      this.tile_set_image.addEventListener("load", function(event) {

        callback();

      }, { once : true});

      this.tile_set_image.src = url;

    }

  };

      ///////////////////
    //// FUNCTIONS ////
  ///////////////////

  var keyDownUp = function(event) {

    controller.keyDownUp(event.type, event.keyCode);

  };

  var resize = function(event) {

    display.resize(document.documentElement.clientWidth, document.documentElement.clientHeight, game.world.height / game.world.width);
    display.render();

  };

  /* The render function uses the new display methods now. I will eventually have to create
  some sort of object manager when I get more objects on the screen. */
  var render = function() {

    display.drawMap   (assets_manager.tile_set_image,
    game.world.tile_set.columns, game.world.map, game.world.columns,  game.world.tile_set.tile_size);

    let frame = game.world.tile_set.frames[game.world.player.frame_value];

    display.drawObject(assets_manager.tile_set_image,
    frame.x, frame.y,
    game.world.player.x + Math.floor(game.world.player.width * 0.5 - frame.width * 0.5) + frame.offset_x,
    game.world.player.y + frame.offset_y, frame.width, frame.height);

    display.render();

  };

  var update = function() {

    if (controller.left.active ) { game.world.player.moveLeft ();                               }
    if (controller.right.active) { game.world.player.moveRight();                               }
    if (controller.up.active   ) { game.world.player.jump();      controller.up.active = false; }

    game.update();

  };

      /////////////////
    //// OBJECTS ////
  /////////////////

  var assets_manager = new AssetsManager();// Behold the new assets manager!
  var controller     = new Controller();
  var display        = new Display(document.querySelector("canvas"));
  var game           = new Game();
  var engine         = new Engine(1000/30, render, update);

      ////////////////////
    //// INITIALIZE ////
  ////////////////////

  /* This is going to have to be moved to a setup function inside of the Display class or something.
  Leaving it out here is kind of sloppy. */
  display.buffer.canvas.height = game.world.height;
  display.buffer.canvas.width  = game.world.width;
  display.buffer.imageSmoothingEnabled = false;

  /* Now my image is loaded into the assets manager instead of the display object.
  The callback starts the game engine when the graphic is loaded. */
  assets_manager.loadTileSetImage("rabbit-trap.png", () => {

    resize();
    engine.start();

  });

  window.addEventListener("keydown", keyDownUp);
  window.addEventListener("keyup",   keyDownUp);
  window.addEventListener("resize",  resize);

});
