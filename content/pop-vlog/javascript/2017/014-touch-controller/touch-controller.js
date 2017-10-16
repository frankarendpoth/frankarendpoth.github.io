// Frank Poth 10/03/2017

(function() {

  var Button, controller, display, game;

  // basically a rectangle, but it's purpose here is to be a button:
  Button = function(x, y, width, height, color) {

    this.active = false;
    this.color = color;
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;

  }

  Button.prototype = {

    // returns true if the specified point lies within the rectangle:
    containsPoint:function(x, y) {

      // if the point is outside of the rectangle return false:
      if (x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.width) {

        return false;

      }

      return true;

    }

  };

  // handles everything to do with user input:
  controller = {

    buttons:[

      new Button(0, 160, 60, 60, "#f09000"),
      new Button(190, 160, 60, 60, "#0090f0"),
      new Button(260, 160, 60, 60, "#0090f0")

    ],

    testButtons:function(target_touches) {

      var button, index0, index1, touch;

      // loop through all buttons:
      for (index0 = this.buttons.length - 1; index0 > -1; -- index0) {

        button = this.buttons[index0];
        button.active = false;

        // loop through all touch objects:
        for (index1 = target_touches.length - 1; index1 > -1; -- index1) {

          touch = target_touches[index1];

          // make sure the touch coordinates are adjusted for both the canvas offset and the scale ratio of the buffer and output canvases:
          if (button.containsPoint((touch.clientX - display.bounding_rectangle.left) * display.buffer_output_ratio, (touch.clientY - display.bounding_rectangle.top) * display.buffer_output_ratio)) {

            button.active = true;
            break;// once the button is active, there's no need to check if any other points are inside, so continue

          }

        }

      }

      // this is all just for displaying the messages when buttons are pressed. This isn't necessary code.
      display.message.innerHTML = "touches: " + event.targetTouches.length + "<br>- ";

      if (this.buttons[0].active) {

        display.message.innerHTML += "jump ";

      }

      if (this.buttons[1].active) {

        display.message.innerHTML += "left ";

      }

      if (this.buttons[2].active) {

        display.message.innerHTML += "right ";

      }

      display.message.innerHTML += "-";

    },

    touchEnd:function(event) {

      event.preventDefault();
      controller.testButtons(event.targetTouches);

    },

    touchMove:function(event) {

      event.preventDefault();
      controller.testButtons(event.targetTouches);

    },

    touchStart:function(event) {

      event.preventDefault();
      controller.testButtons(event.targetTouches);

    }

  };

  // handles everything to do with displaying graphics on the screen:
  display = {

    // the buffer is used to scale the applications graphics to fit the screen:
    buffer:document.createElement("canvas").getContext("2d"),
    // the on screen canvas context that we will be drawing to:
    output:document.querySelector("canvas").getContext("2d"),
    // the p element for text output:
    message:document.querySelector("p"),

    // the ratio in size between the buffer and output canvases used to scale user input coordinates:
    buffer_output_ratio:1,
    // the bounding rectangle of the output canvas used to determine the location of user input on the output canvas:
    bounding_rectangle:undefined,

    // clears the display canvas to the specified color:
    clear:function(color) {

      this.buffer.fillStyle = color || "#000000";
      this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);

    },

    // renders the buffer to the output canvas:
    render:function() {

      this.output.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.output.canvas.width, this.output.canvas.height);

    },

    // renders the buttons:
    renderButtons:function(buttons) {

      var button, index;

      this.buffer.fillStyle = "#202830";
      this.buffer.fillRect(0, 150, this.buffer.canvas.width, this.buffer.canvas.height);

      for (index = buttons.length - 1; index > -1; -- index) {

        button = buttons[index];

        this.buffer.fillStyle = button.color;
        this.buffer.fillRect(button.x, button.y, button.width, button.height);

      }

    },

    // renders a square:
    renderSquare:function(square) {

      this.buffer.fillStyle = square.color;
      this.buffer.fillRect(square.x, square.y, square.width, square.height);

    },

    // just keeps the output canvas element sized appropriately:
    resize:function(event) {

      display.output.canvas.width = Math.floor(document.documentElement.clientWidth - 32);

      if (display.output.canvas.width > document.documentElement.clientHeight) {

        display.output.canvas.width = Math.floor(document.documentElement.clientHeight);

      }

      display.output.canvas.height = Math.floor(display.output.canvas.width * 0.6875);

      // these next two lines are used for adjusting and scaling user touch input coordinates:
      display.bounding_rectangle = display.output.canvas.getBoundingClientRect();

      display.buffer_output_ratio = display.buffer.canvas.width / display.output.canvas.width;

    }

  };

  // handles game logic:
  game = {

    loop:function(time_stamp) {

      if (controller.buttons[0].active && game.square.jumping == false) {

        game.square.velocity_y = -20;
        game.square.jumping = true;

      }

      if (controller.buttons[1].active) {

        game.square.velocity_x -= 0.5;

      }

      if (controller.buttons[2].active) {

        game.square.velocity_x += 0.5;

      }


      // simulate gravity:
      game.square.velocity_y += 1.5;

      // simulate friction:
      game.square.velocity_x *= 0.9;
      game.square.velocity_y *= 0.9;

      // move the square:
      game.square.x += game.square.velocity_x;
      game.square.y += game.square.velocity_y;

      // collision detection for the square and the boundaries of the graphics buffer:
      if (game.square.x + game.square.width < 0) {

        game.square.x = display.buffer.canvas.width;

      } else if (game.square.x > display.buffer.canvas.width) {

        game.square.x = 0;

      }

      if (game.square.y + game.square.height > 150) {

        game.square.y = 150 - game.square.height;
        game.square.jumping = false;

      }


      display.clear("#303840");

      display.renderSquare(game.square);

      display.renderButtons(controller.buttons);

      display.render();

      window.requestAnimationFrame(game.loop);

    },

    square: {

      color:"#ff0000",
      height:32,
      jumping:true,
      velocity_x:0,
      velocity_y:0,
      width:32,
      x:0,
      y:0,

    }

  };

  // initialize the application

  // size the buffer:
  display.buffer.canvas.height = 220;
  display.buffer.canvas.width = 320;

  window.addEventListener("resize", display.resize);
  // setting passive:false allows you to use preventDefault in event listeners:
  display.output.canvas.addEventListener("touchend", controller.touchEnd, {passive:false});
  display.output.canvas.addEventListener("touchmove", controller.touchMove, {passive:false});
  display.output.canvas.addEventListener("touchstart", controller.touchStart, {passive:false});

  // make sure the display canvas is the appropriate size on the screen:
  display.resize();

  // start the game loop:
  game.loop();

})();
