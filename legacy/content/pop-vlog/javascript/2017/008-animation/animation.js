// Frank Poth 08/12/2017

var context, rectangle, loop;

context = document.querySelector("canvas").getContext("2d");

context.canvas.height = 180;
context.canvas.width = 320;

rectangle = {

  height:32,
  width:32,
  x:0,
  y:72, // Center of the canvas

};

loop = function() {

  rectangle.x += 1;

  context.fillStyle = "#202020";
  context.fillRect(0, 0, 320, 180);// x, y, width, height
  context.fillStyle = "#ff0000";// hex for red
  context.beginPath();
  context.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  context.fill();

  if (rectangle.x > 320) {// if rectangle goes past right boundary

    rectangle.x = -32;

  }

  // call update when the browser is ready to draw again
  window.requestAnimationFrame(loop);

};

window.requestAnimationFrame(loop);
