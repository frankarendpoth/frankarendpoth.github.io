// Frank Poth 02/28/2018

/* This is the basic setup or "skeleton" of my program. It has three main parts:
the controller, display, and game logic. It also has an engine which combines the
three logical parts which are otherwise completely separate. One of the most important
aspects of programming is organization. Without an organized foundation, your code
will quickly become unruly and difficult to maintain. Separating code into logical
groups is also a principle of object oriented programming, which lends itself to
comprehensible, maintainable code as well as modularity. */

/* Since I am loading my scripts dynamically from the rabbit-trap.html, I am wrapping
my main JavaScript file in a load listener. This ensures that this code will not
execute until the document has finished loading and I have access to all of my classes. */
window.addEventListener("load", function(event) {

  "use strict";

      ///////////////////
    //// FUNCTIONS ////
  ///////////////////

  var render = function() {

    display.renderColor(game.color);
    display.render();

  };

  var update = function() {

    game.update();

  };

        /////////////////
      //// OBJECTS ////
    /////////////////

    /* Usually I just write my logical sections into object literals, but the temptation
    to reference one inside of another is too great, and leads to sloppy coding.
    In an effort to attain cleaner code, I have written classes for each section
    and instantiate them here. */

    /* The controller handles user input. */
    var controller = new Controller();
    /* The display handles window resizing, as well as the on screen canvas. */
    var display    = new Display(document.querySelector("canvas"));
    /* The game will eventually hold our game logic. */
    var game       = new Game();
    /* The engine is where the above three sections can interact. */
    var engine     = new Engine(1000/30, render, update);

        ////////////////////
      //// INITIALIZE ////
    ////////////////////

    window.addEventListener("resize",  display.handleResize);
    window.addEventListener("keydown", controller.handleKeyDownUp);
    window.addEventListener("keyup",   controller.handleKeyDownUp);

    display.resize();
    engine.start();

});
