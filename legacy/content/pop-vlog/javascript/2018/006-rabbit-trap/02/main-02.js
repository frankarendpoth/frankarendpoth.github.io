// Frank Poth 03/09/2018

/* In part 2, I added a player character to the screen. I created world
boundaries with collision detection, and I added keyboard input to move the
player around. His color changes whenever he jumps. */

/* Changes since the last part: I moved the event handlers out of the component
files. Any functionality that might need two or more components to communicate
should be in the main file. The resize function, for example, shouldn't be in
Display, because it needs information from Game to size the onscreen canvas.
As a general rule, anything that causes two components to communicate should be
in the main file because we want to reduce internal references between components
as much as possible. They should communicate via public methods that take primitives. */

window.addEventListener("load", function(event) {

  "use strict";

      ///////////////////
    //// FUNCTIONS ////
  ///////////////////

  /* This used to be in the Controller class, but I moved it out to the main file.
  The reason being that later on in development I might need to do something with
  display or processing directly on an input event in addition to updating the controller.
  To prevent referencing those components inside of my controller logic, I moved
  all of my event handlers here, to the main file. */
  var keyDownUp = function(event) {

    controller.keyDownUp(event.type, event.keyCode);

  };

  /* I also moved this handler out of Display since part 1 of this series. The reason
  being that I need to reference game as well as display to resize the canvas according
  to the dimensions of the game world. I don't want to reference game inside of my
  Display class, so I moved the resize method into the main file. */
  var resize = function(event) {

    display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.height / game.world.width);
    display.render();

  };

  var render = function() {

    display.fill(game.world.background_color);// Clear background to game's background color.
    display.drawRectangle(game.world.player.x, game.world.player.y, game.world.player.width, game.world.player.height, game.world.player.color);
    display.render();

  };

  var update = function() {

    if (controller.left.active)  { game.world.player.moveLeft();  }
    if (controller.right.active) { game.world.player.moveRight(); }
    if (controller.up.active)    { game.world.player.jump(); controller.up.active = false; }

    game.update();

  };

      /////////////////
    //// OBJECTS ////
  /////////////////

  var controller = new Controller();
  var display    = new Display(document.querySelector("canvas"));
  var game       = new Game();
  var engine     = new Engine(1000/30, render, update);

      ////////////////////
    //// INITIALIZE ////
  ////////////////////

  /* This is very important. The buffer canvas must be pixel for pixel the same
  size as the world dimensions to properly scale the graphics. All the game knows
  are player location and world dimensions. We have to tell the display to match them. */
  display.buffer.canvas.height = game.world.height;
  display.buffer.canvas.width = game.world.width;

  window.addEventListener("keydown", keyDownUp);
  window.addEventListener("keyup",   keyDownUp);
  window.addEventListener("resize",  resize);

  resize();

  engine.start();

});
