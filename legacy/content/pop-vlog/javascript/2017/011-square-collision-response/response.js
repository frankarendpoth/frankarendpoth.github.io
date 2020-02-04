// Frank Poth 08/30/2017

// drawing context, controller object, Rectangle class,
// the red and white rectangle objects, game loop, resize event handler
var context, controller, Rectangle, red, white, loop, resize;

context = document.querySelector("canvas").getContext("2d");

// keeps track of where the pointer is
controller = {

  // mouse or finger position
  pointer_x:0,
  pointer_y:0,

  move:function(event) {

    // This will give us the location of our canvas element on screen
    var rectangle = context.canvas.getBoundingClientRect();

    // store the position of the move event inside the pointer variables
    controller.pointer_x = event.clientX - rectangle.left;
    controller.pointer_y = event.clientY - rectangle.top;

  }

};

// A simple rectangle class
Rectangle = function(x, y, width, height, color) {

  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.color = color;

};

Rectangle.prototype = {

  draw:function() {// draws rectangle to canvas

    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.fillStyle = this.color;
    context.fill();

  },

  // get the center coordinates of the rectangle
  get centerX() { return this.x + this.width * 0.5; },
  get centerY() { return this.y + this.height * 0.5; },
  // get the four side coordinates of the rectangle
  get bottom() { return this.y + this.height; },
  get left() { return this.x; },
  get right() { return this.x + this.width; },
  get top() { return this.y; },

  // determines if a collision is present between two rectangles
  testCollision:function(rectangle) {

    // using early outs cuts back on performance costs
    if (this.top > rectangle.bottom || this.right < rectangle.left || this.bottom < rectangle.top || this.left > rectangle.right) {

      return false;

    }

    return true;

  },

  // push the calling rectangle out of the callee rectangle on the
  // axis that has the most overlap
  resolveCollision:function(rectangle) {

    var vector_x, vector_y;

    // get the distance between center points
    vector_x = this.centerX - rectangle.centerX;
    vector_y = this.centerY - rectangle.centerY;

    // is the y vector longer than the x vector?
    if (vector_y * vector_y > vector_x * vector_x) {// square to remove negatives

      // is the y vector pointing down?
      if (vector_y > 0) {

        this.y = rectangle.bottom;

      } else { // the y vector is pointing up

        this.y = rectangle.y - this.height;

      }

    } else { // the x vector is longer than the y vector

      // is the x vector pointing right?
      if (vector_x > 0) {

        this.x = rectangle.right;

      } else { // the x vector is pointing left

        this.x = rectangle.x - this.width;

      }

    }

  }

};

// create the rectangles, positioning the white one in the center of the screen
red = new Rectangle(0, 0, 64, 64, "#ff0000");
white = new Rectangle(context.canvas.width * 0.5 - 32, context.canvas.height * 0.5 - 32, 64, 64, "#ffffff");

// the game loop
loop = function(time_stamp) {

  // make the red rectangle follow the pointer
  red.x = controller.pointer_x - 32;
  red.y = controller.pointer_y - 32;

  // fill background color
  context.fillStyle = "#303840";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  white.draw();
  red.draw();

  // if there is a collision
  if (red.testCollision(white)) {

    // resolve the collision
    red.resolveCollision(white);

    // draw the white outlines around the two rectangles
    context.beginPath();
    context.rect(red.x, red.y, red.width, red.height);
    context.rect(white.x, white.y, white.width, white.height);
    context.lineWidth = 1;
    context.strokeStyle = "#ffffff";
    context.stroke();

    // draw the collision regions of the white rectangle (white X)
    context.beginPath();
    context.moveTo(white.centerX - white.width, white.centerY - white.height);
    context.lineTo(white.centerX + white.width, white.centerY + white.height);
    context.stroke();

    context.beginPath();
    context.moveTo(white.centerX + white.width, white.centerY - white.height);
    context.lineTo(white.centerX - white.width, white.centerY + white.height);
    context.stroke();

    // draw the line between the center points of the rectangles
    context.beginPath();
    context.moveTo(controller.pointer_x, controller.pointer_y);
    context.lineTo(white.centerX, white.centerY);
    context.lineWidth = 3;
    context.strokeStyle = "#303840";
    context.stroke();

  }

  // perpetuate loop
  window.requestAnimationFrame(loop);

};

// just keeps the canvas element sized appropriately
resize = function(event) {

  context.canvas.width = document.documentElement.clientWidth - 32;

  if (context.canvas.width > document.documentElement.clientHeight) {

    context.canvas.width = document.documentElement.clientHeight;

  }

  context.canvas.height = Math.floor(context.canvas.width * 0.5625);

  white.x = context.canvas.width * 0.5 - 32;
  white.y = context.canvas.height * 0.5 - 32;

};

context.canvas.addEventListener("mousemove", controller.move);
context.canvas.addEventListener("touchmove", controller.move, {passive:true});

window.addEventListener("resize", resize, {passive:true});

resize();

// start the game loop
window.requestAnimationFrame(loop);
