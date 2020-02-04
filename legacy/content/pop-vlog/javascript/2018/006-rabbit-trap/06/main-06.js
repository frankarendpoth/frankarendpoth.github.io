// Frank Poth 04/06/2018

/* Changes:

  1. The update function now check on every frame for game.world.door. If a door
     is selected, the game engine stops and the door's level is loaded.
  2. When the game is first initialized at the bottom of this file, game.world is
     loaded using it's default values defined in its constructor.
  3. The AssetsManager class has been changed to load both images and json.

*/

window.addEventListener("load", function(event) {

  "use strict";

  //// CONSTANTS ////

  /* Each zone has a url that looks like: zoneXX.json, where XX is the current zone
  identifier. When loading zones, I use the game.world's zone identifier with these
  two constants to construct a url that points to the appropriate zone file. */
  /* I updated this after I made the video. I decided to move the zone files into
  the 06 folder because I won't be using these levels again in future parts. */
  const ZONE_PREFIX = "06/zone";
  const ZONE_SUFFIX = ".json";

      /////////////////
    //// CLASSES ////
  /////////////////

  const AssetsManager = function() {

    this.tile_set_image = undefined;

  };

  AssetsManager.prototype = {

    constructor: Game.AssetsManager,

    /* Requests a file and hands the callback function the contents of that file
    parsed by JSON.parse. */
    requestJSON:function(url, callback) {

      let request = new XMLHttpRequest();

      request.addEventListener("load", function(event) {

        callback(JSON.parse(this.responseText));

      }, { once:true });

      request.open("GET", url);
      request.send();

    },

    /* Creates a new Image and sets its src attribute to the specified url. When
    the image loads, the callback function is called. */
    requestImage:function(url, callback) {

      let image = new Image();

      image.addEventListener("load", function(event) {

        callback(image);

      }, { once:true });

      image.src = url;

    },

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

  var render = function() {

    display.drawMap   (assets_manager.tile_set_image,
    game.world.tile_set.columns, game.world.graphical_map, game.world.columns,  game.world.tile_set.tile_size);

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

    /* This if statement checks to see if a door has been selected by the player.
    If the player collides with a door, he selects it. The engine is then stopped
    and the assets_manager loads the door's level. */
    if (game.world.door) {

      engine.stop();

      /* Here I'm requesting the JSON file to use to populate the game.world object. */
      assets_manager.requestJSON(ZONE_PREFIX + game.world.door.destination_zone + ZONE_SUFFIX, (zone) => {

        game.world.setup(zone);

        engine.start();

      });

      return;

    }

  };

      /////////////////
    //// OBJECTS ////
  /////////////////

  var assets_manager = new AssetsManager();
  var controller     = new Controller();
  var display        = new Display(document.querySelector("canvas"));
  var game           = new Game();
  var engine         = new Engine(1000/30, render, update);

      ////////////////////
    //// INITIALIZE ////
  ////////////////////

  display.buffer.canvas.height = game.world.height;
  display.buffer.canvas.width  = game.world.width;
  display.buffer.imageSmoothingEnabled = false;

  assets_manager.requestJSON(ZONE_PREFIX + game.world.zone_id + ZONE_SUFFIX, (zone) => {

    game.world.setup(zone);

    assets_manager.requestImage("rabbit-trap.png", (image) => {

      assets_manager.tile_set_image = image;

      resize();
      engine.start();

    });

  });

  window.addEventListener("keydown", keyDownUp);
  window.addEventListener("keyup"  , keyDownUp);
  window.addEventListener("resize" , resize);

});
