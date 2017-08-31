// Frank Poth 08/29/2017

var context, controller, Rectangle, red, white, loop, resize;

context = document.querySelector("canvas").getContext("2d");

controller = {

  // mouse or finger position
  pointer_x:0,
  pointer_y:0,

  move:function(event) {

    // This will give us the location of our canvas element
    var rectangle = context.canvas.getBoundingClientRect();

    // store the position of the move event inside the pointer variables
    controller.pointer_x = event.clientX - rectangle.left;
    controller.pointer_y = event.clientY - rectangle.top;

  }

};

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

  // get the four side coordinates of the rectangle
  get bottom() { return this.y + this.height; },
  get left() { return this.x; },
  get right() { return this.x + this.width; },
  get top() { return this.y; },

  testCollision:function(rectangle) {

    if (this.top > rectangle.bottom || this.right < rectangle.left || this.bottom < rectangle.top || this.left > rectangle.right) {

      return false;

    }

    return true;

  }

};

red = new Rectangle(0, 0, 64, 64, "#ff0000");
white = new Rectangle(context.canvas.width * 0.5 - 32, context.canvas.height * 0.5 - 32, 64, 64, "#ffffff");

loop = function(time_stamp) {

  red.x = controller.pointer_x - 32;
  red.y = controller.pointer_y - 32;

  context.fillStyle = "#303840";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  white.draw();
  red.draw();

  if (red.testCollision(white)) {

    context.beginPath();
    context.rect(red.x, red.y, red.width, red.height);
    context.rect(white.x, white.y, white.width, white.height);
    context.strokeStyle = "#ffffff";
    context.stroke();

  }

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
