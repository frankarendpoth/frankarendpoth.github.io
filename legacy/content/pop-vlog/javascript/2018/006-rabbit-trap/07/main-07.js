// Frank Poth 04/18/2018

/* Changes:

  1. Added the drawing calls for drawing the grass and carrots in render.
  2. Added a p element for showing the number of carrots collected.

*/

window.addEventListener("load", function(event) {

  "use strict";

  //// CONSTANTS ////

  const ZONE_PREFIX = "07/zone";
  const ZONE_SUFFIX = ".json";

      /////////////////
    //// CLASSES ////
  /////////////////

  const AssetsManager = function() {

    this.tile_set_image = undefined;

  };

  AssetsManager.prototype = {

    constructor: Game.AssetsManager,

    requestJSON:function(url, callback) {

      let request = new XMLHttpRequest();

      request.addEventListener("load", function(event) {

        callback(JSON.parse(this.responseText));

      }, { once:true });

      request.open("GET", url);
      request.send();

    },

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

    var rectangle = display.context.canvas.getBoundingClientRect();

    p.style.left = rectangle.left + "px";
    p.style.top  = rectangle.top + "px";
    p.style.fontSize = game.world.tile_set.tile_size * rectangle.height / game.world.height + "px";

  };

  var render = function() {

    var frame = undefined;

    display.drawMap   (assets_manager.tile_set_image,
    game.world.tile_set.columns, game.world.graphical_map, game.world.columns,  game.world.tile_set.tile_size);

    for (let index = game.world.carrots.length - 1; index > -1; -- index) {

      let carrot = game.world.carrots[index];

      frame = game.world.tile_set.frames[carrot.frame_value];

      display.drawObject(assets_manager.tile_set_image,
      frame.x, frame.y,
      carrot.x + Math.floor(carrot.width * 0.5 - frame.width * 0.5) + frame.offset_x,
      carrot.y + frame.offset_y, frame.width, frame.height);

    }

    frame = game.world.tile_set.frames[game.world.player.frame_value];

    display.drawObject(assets_manager.tile_set_image,
    frame.x, frame.y,
    game.world.player.x + Math.floor(game.world.player.width * 0.5 - frame.width * 0.5) + frame.offset_x,
    game.world.player.y + frame.offset_y, frame.width, frame.height);

    for (let index = game.world.grass.length - 1; index > -1; -- index) {

      let grass = game.world.grass[index];

      frame = game.world.tile_set.frames[grass.frame_value];

      display.drawObject(assets_manager.tile_set_image,
      frame.x, frame.y,
      grass.x + frame.offset_x,
      grass.y + frame.offset_y, frame.width, frame.height);

    }

    p.innerHTML = "Carrots: " + game.world.carrot_count;

    display.render();

  };

  var update = function() {

    if (controller.left.active ) { game.world.player.moveLeft ();                               }
    if (controller.right.active) { game.world.player.moveRight();                               }
    if (controller.up.active   ) { game.world.player.jump();      controller.up.active = false; }

    game.update();

    if (game.world.door) {

      engine.stop();

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

  var p              = document.createElement("p");
  p.setAttribute("style", "color:#c07000; font-size:2.0em; position:fixed;");
  p.innerHTML = "Carrots: 0";
  document.body.appendChild(p);

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
