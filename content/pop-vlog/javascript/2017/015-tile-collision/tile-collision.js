// Frank Poth 10/03/2017

(function() {

  var buffer, character, context, controller, drawMap, loop, map, map_columns, map_rows, output, resize, tile_size;

  buffer = document.createElement("canvas").getContext("2d");
  context = document.querySelector("canvas").getContext("2d");
  output = document.querySelector("p");

  controller = {

    active:false,
    buffer_context_ratio:1,
    pointer_x:0,
    pointer_y:0,

    mouseDown:function(event) {

      event.preventDefault();

      controller.active = true;

    },

    mouseMove:function(event) {

      var rectangle = context.canvas.getBoundingClientRect();

      event.preventDefault();

      controller.pointer_x = (event.clientX - rectangle.left) * controller.buffer_context_ratio;
      controller.pointer_y = (event.clientY - rectangle.top) * controller.buffer_context_ratio;

    },

    mouseUp:function(event) {

      event.preventDefault();

      controller.active = false;

    },

    touchEnd:function(event) {

      event.preventDefault();

      controller.touchMove(event);

      alert("hi");

      if (event.targetTouches.length == 0) {

        controller.active = false;

      }

    },

    touchMove:function(event) {

      var rectangle, touch;

      rectangle = context.canvas.getBoundingClientRect();
      touch = event.targetTouches[0];

      event.preventDefault();

      controller.pointer_x = (touch.clientX - rectangle.left) * controller.buffer_context_ratio;
      controller.pointer_y = (touch.targetTouches[0].clientY - rectangle.top) * controller.buffer_context_ratio;

    },

    touchStart:function(event) {

      event.preventDefault();

      controller.active = true;

      controller.touchMove(event);

    },

  };

  map = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
         1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
         1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
         1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
         1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
         1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
         1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
         1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
         1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

  map_columns = 16;
  map_rows = 9;
  tile_size = 32;

  buffer.canvas.height = map_rows * tile_size;
  buffer.canvas.width = map_columns * tile_size;

  drawMap = function() {

    for (let index = 0; index < map.length; index ++) {

      buffer.fillStyle = (map[index] == 1)?"#228b22":"#b0e0b6";
      buffer.fillRect((index % map_columns) * tile_size, Math.floor(index/map_columns) * tile_size, tile_size, tile_size);

    }

  };

  character = {

    height:30,
    velocity_x:0,
    velocity_y:0,
    width:30,
    x:3 * tile_size,
    y:4 * tile_size,

  };

  loop = function(time_stamp) {

    if (controller.active && controller.pointer_x < character.x + character.width * 0.5) {

      character.velocity_x -= 0.5;

    } else if (controller.active && controller.pointer_x > character.x + character.width * 0.5) {

      character.velocity_x += 0.5;

    }

    character.velocity_x *= 0.9;

    character.x += character.velocity_x;


    drawMap();

    buffer.fillStyle = "#ff0000";
    buffer.fillRect(character.x, character.y, character.width, character.height);

    context.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, context.canvas.width, context.canvas.height);

    window.requestAnimationFrame(loop);

  };

  resize = function(event) {

    context.canvas.width = Math.floor(document.documentElement.clientWidth - 32);

    if (context.canvas.width > document.documentElement.clientHeight) {

      context.canvas.width = Math.floor(document.documentElement.clientHeight);

    }

    context.canvas.height = Math.floor(context.canvas.width * 0.5625);

    controller.buffer_context_ratio = buffer.canvas.width / context.canvas.width;

    drawMap();

  };

  window.addEventListener("resize", resize);

  if ("ontouchstart" in document.documentElement) {

    context.canvas.addEventListener("touchend", controller.touchEnd);
    context.canvas.addEventListener("touchmove", controller.touchMove);
    context.canvas.addEventListener("touchstart", controller.touchStart);

  } else {

    context.canvas.addEventListener("mousedown", controller.mouseDown);
    context.canvas.addEventListener("mousemove", controller.mouseMove);
    context.canvas.addEventListener("mouseup", controller.mouseUp);

  }

  resize();

  loop();

})();
