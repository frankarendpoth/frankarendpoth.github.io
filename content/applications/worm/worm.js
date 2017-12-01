// Frank Poth 11/22/2017

/*(function() { "use strict"

      ///////////////////
    //// CONSTANTS ////
  ///////////////////

  const TILE_SIZE = 10;

  const getColumnFromIndex = function(index, columns) {

    return index % columns;

  };

  const getIndexFromColumnRow = function(column, row, columns) {

    return row * columns + column;

  };

  const getRowFromIndex = function(index, columns) {

    return Math.floor(index / columns);

  };

  const getYFromIndex = function(index, columns) {

    return Math.floor(index / columns) * TILE_SIZE;

  };

  const getXFromIndex = function(index, columns) {

    return (index % columns) * TILE_SIZE;

  };

      /////////////////
    //// CLASSES ////
  /////////////////

  var Graphic, Scheme, Segment;

  Graphic = function(draw) {

    this.canvas = document.createElement("canvas");
    this.canvas.height = this.canvas.width = TILE_SIZE;

    draw(this.canvas.getContext("2d"));

  },

  Scheme = function(start, stop, handler) {

    this.start = start;
    this.stop = stop;
    this.handler = handler;

  }

  Segment = function(column, row) {

    this.column = column;
    this.row = row;

  };

  Segment.prototype = {

    clone:function() {

      return new Segment(this.column, this.row);

    }

  };

      /////////////////
    //// OBJECTS ////
  /////////////////

  var controller, display, game, menu;

  controller = {

    input: {

      down:false,
      left:false,
      right:false,
      up:false

    },

    scheme: undefined,

    schemes:[

      // Left/Right touch
      new Scheme(function() {

        window.addEventListener("touchend", this.handler);
        window.addEventListener("touchstart", this.handler);

      },

      function() {

        window.removeEventListener("touchend", this.handler);
        window.removeEventListener("touchstart", this.handler);

      },

      function(event) { event.preventDefault();

        controller.input.left = controller.input.right = false;

        for (let index = event.targetTouches.length - 1; index > -1; -- index) {

          let touch = event.targetTouches[index];

          if (touch.clientX < display.width * 0.5) {

            controller.input.left = true; return;

          } else {

            controller.input.right = true; return;

          }

        }

      }),

      // Keyboard
      new Scheme(function() {

        window.addEventListener("keydown", this.handler);
        window.addEventListener("keyup", this.handler);

      },

      function() {

        window.removeEventListener("keydown", this.handler);
        window.removeEventListener("keyup", this.handler);

      },

      function(event) { event.preventDefault();

        var key_state = (event.type == "keydown")?true:false;

        switch(event.keyCode) {

          case 40: alert("hello"); break;

        }

      })

    ]

  };

  display = {

    buffer:document.createElement("canvas").getContext("2d"),
    context:document.querySelector("canvas").getContext("2d"),
    width:0,

    graphics: [

      new Graphic(function(context) {// Floor

        context.fillStyle = "#202830";
        context.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        context.fillStyle = "#303840";
        context.fillRect(1, 1, TILE_SIZE - 2, TILE_SIZE - 2);

      }),

      new Graphic(function(context) {// Hallowed Ground

        context.fillStyle = "#202830";
        context.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        context.fillStyle = "#283038";
        context.fillRect(1, 1, TILE_SIZE - 2, TILE_SIZE - 2);

      }),

      new Graphic(function(context) {// Block

        context.fillStyle = "#202830";
        context.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        context.fillStyle = "#384048";
        context.beginPath();
        context.moveTo(1, 1);
        context.lineTo(TILE_SIZE - 1, 1);
        context.lineTo(TILE_SIZE * 0.75, TILE_SIZE * 0.25);
        context.lineTo(TILE_SIZE * 0.25, TILE_SIZE * 0.25);
        context.closePath();
        context.fill();
        context.beginPath();
        context.moveTo(1, 1);
        context.lineTo(1, TILE_SIZE - 1);
        context.lineTo(TILE_SIZE * 0.25, TILE_SIZE * 0.75);
        context.lineTo(TILE_SIZE * 0.25, TILE_SIZE * 0.25);
        context.closePath();
        context.fill();

      }),

      new Graphic(function(context) {// Hole

        context.fillStyle = "#202830";
        context.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        context.fillStyle = "#000810";
        context.fillRect(1, 1, TILE_SIZE - 2, TILE_SIZE - 2);

      }),

      new Graphic(function(context) {// Segment

        context.fillStyle = "#993300";
        context.fillRect(1, 1, TILE_SIZE - 2, TILE_SIZE - 2);
        context.fillStyle = "#ff9900";
        context.fillRect(2, 2, TILE_SIZE - 4, TILE_SIZE - 4);

      }),

      new Graphic(function(context) {// Apple

        context.fillStyle = "#339900";
        context.fillRect(1, 1, TILE_SIZE - 2, TILE_SIZE - 2);
        context.fillStyle = "#99ff00";
        context.fillRect(2, 2, TILE_SIZE - 4, TILE_SIZE - 4);

      })

    ],

    renderApple:function(apple) {

      let graphic = this.graphics[5].canvas;

      this.buffer.drawImage(graphic, 0, 0, graphic.width, graphic.height, apple.column * TILE_SIZE, apple.row * TILE_SIZE, graphic.width, graphic.height);

    },

    renderArea:function(area) {

      for (let index = area.map.length - 1; index > -1; -- index) {

        let graphic = this.graphics[area.map[index]].canvas;

        this.buffer.drawImage(graphic, 0, 0, graphic.width, graphic.height, getXFromIndex(index, area.columns), getYFromIndex(index, area.columns), TILE_SIZE, TILE_SIZE);

      }

      for (let index = area.holes.length - 1; index > -1; -- index) {

        let graphic = this.graphics[3].canvas;
        let hole = area.holes[index];

        this.buffer.drawImage(graphic, 0, 0, graphic.width, graphic.height, hole.column * TILE_SIZE, hole.row * TILE_SIZE, graphic.width, graphic.height);

      }

    },

    renderDisplay:function() {

      this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);

    },

    renderWorm:function(worm) {

      let graphic = this.graphics[4].canvas;

      for (let index = worm.segments.length - 1; index > -1; -- index) {

        let segment = worm.segments[index];

        this.buffer.drawImage(graphic, 0, 0, graphic.width, graphic.height, segment.column * TILE_SIZE, segment.row * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      }

    },

    resize:function(event) {

      let height = document.documentElement.clientHeight;
      let width = document.documentElement.clientWidth;

      if (height < width) {

        display.context.canvas.height = display.context.canvas.width = height;
        display.context.canvas.style.left = Math.floor((width - height) * 0.5) + "px";
        display.context.canvas.style.top = "0px";

      } else {

        display.context.canvas.height = display.context.canvas.width = width;
        display.context.canvas.style.left = "0px";
        display.context.canvas.style.top = Math.floor((height - width) * 0.5) + "px";

      }

      display.width = width;

    }

  };

  game = {

    options: {



    },

    play: {

      apple: {

        column: undefined,
        row:undefined,

        reset:function() {

          let index = Math.floor(Math.random() * game.world.area.map.length);
          let test_index = index;

          while(game.world.area.map[index] != 0 || game.worm.contains(getColumnFromIndex(index, game.world.area.columns), getRowFromIndex(index, game.world.area.columns))) {

            index ++;

            if (index == game.world.area.map.length) {

              index = 0;

            }

            if (index == test_index) {

              return;// can't find open space

            }

          }

          this.column = getColumnFromIndex(index, game.world.area.columns);
          this.row = getRowFromIndex(index, game.world.area.columns);

        }

      }

    },

    title: {



    }

    engine: {

      animation_frame_request: undefined,

      start:function(time_step, loop) {

        var accumulated_time;



        accumulated_time = window.performance.now();


        this.animation_frame_request = window.requestAnimationFrame(loop);

      },

      stop:function() {

        window.cancelAnimationFrame(this.animation_frame_request);

      }

    },

    world: {

      area:undefined,
      area_index:0

    },

    worm: {

      segments:new Array(0),
      vector: {

        x:0,
        y:0

      },

      contains:function(column, row) {

        for (let index = this.segments.length - 1; index > -1; -- index) {

          let segment = this.segments[index];

          if (column == segment.column && row == segment.row) {

            return true;

          }

        }

        return false;

      }

    },

    loadArea: function(area) {

      var request, readyStateChange;

      game.engine.stop();

      request = new XMLHttpRequest();

      readyStateChange = function(event) {

        if (this.readyState == 4 && this.status == 200) {

          this.removeEventListener("readystatechange", readyStateChange);

          game.world.area = JSON.parse(this.responseText)[game.world.area_index];
          game.reset();

        }

      };

      request.addEventListener("readystatechange", readyStateChange);

      request.open("GET", "worm-areas.json");
      request.send(null);

    },

    reset:function() {

      game.engine.stop();
      controller.stop();

      this.worm.segments = [new Segment(this.world.area.holes[0].column, this.world.area.holes[0].row)];
      this.worm.segments[1] = this.worm.segments[0].clone();
      this.worm.vector.x = this.world.area.worm.vector_x;
      this.worm.vector.y = this.world.area.worm.vector_y;

      this.apple.reset();

      display.renderArea(this.world.area);
      display.renderApple(this.apple);
      display.renderWorm(this.worm);
      display.renderDisplay();

      controller.start();
      game.engine.start(500);

    }

  };

menu = {

  engine: {

    animation_frame_request:undefined,

    loop:function(time_stamp) {

      menu.engine.animation_frame_request = window.requestAnimationFrame(menu.engine.loop);

    },

    start:function() {

      menu.engine.animation_frame_request = window.requestAnimationFrame(menu.engine.loop);

    },

    stop:function() {

      window.cancelAnimationFrame(menu.engine.animation_frame_request);

    }

  }

  background: {

    map

  }

};

      ////////////////////
    //// INITIALIZE ////
  ////////////////////

  display.buffer.canvas.height = display.buffer.canvas.width = 100;

  window.addEventListener("resize", display.resize);

  display.resize();

  controller.scheme = controller.schemes[1];

  game.loadArea(0);

})();
*/

(function() { "use strict"

    ///////////////////
  //// CONSTANTS ////
///////////////////

const MATH = {

  getYFromIndex:function(index, columns, tile_size) {

    return Math.floor(index / columns) * tile_size;

  },

  getXFromIndex:function(index, columns, tile_size) {

    return (index % columns) * tile_size;

  }

};

    //////////////////
  //// OBJECTS /////
//////////////////

var controller, display, game;

controller = {

  scheme: undefined,

  schemes: [

    {// keyboard

      inputs: { down:false, left:false, right:false, up:false },
      handler:function(event) {},
      start:function() {},
      stop: function() {}

    },

    {// mouse

      inputs: { down:false, up:false },
      handler:function(event) {},
      start:function() {},
      stop:function() {}

    },

    {// touch left right

      inputs: { left:false, right:false },
      handler:function(event) {

      },
      start:function() {},
      stop:function() {}

    }

  ]

};

display = {

  buffer:document.createElement("canvas").getContext("2d"),
  buffer_offset: { x:0, y:0 },
  buffer_scale: 1,
  context:document.querySelector("canvas").getContext("2d"),
  orientation:undefined,
  height:document.documentElement.clientHeight,
  width:document.documentElement.clientWidth,

  color_scheme:0,
  color_schemes: [

    ["#202830", "#283038", "hole1", "hole2", "wall1", "wall2", "apple1", "apple2", "#993300", "#ff9900"]

  ],

  GRAPHICS: {

    background_tile:0,
    hole:1,
    wall:2,
    apple:3,
    segment:4

  },

  graphics: [

    {// background tile

      canvas:document.createElement("canvas"),
      render:function(tile_size) {

        let context = this.canvas.getContext("2d");
        let colors = display.color_schemes[display.color_scheme];

        this.canvas.height = tile_size;
        this.canvas.width = tile_size;

        context.fillStyle = colors[0];
        context.fillRect(0, 0, tile_size, tile_size);
        context.fillStyle = colors[1];
        context.fillRect(1, 1, tile_size - 2, tile_size - 2);

      }

    },

    {// hole

      canvas:document.createElement("canvas"),
      render:function(tile_size) {

      }

    },

    {// wall

      canvas:document.createElement("canvas"),
      render:function(tile_size) {

      }

    },

    {// apple

      canvas:document.createElement("canvas"),
      render:function(tile_size) {

      }

    },

    {// segment

      canvas:document.createElement("canvas"),
      render:function(tile_size) {

        let context = this.canvas.getContext("2d");
        let colors = display.color_schemes[display.color_scheme];

        this.canvas.height = tile_size;
        this.canvas.width = tile_size;

        context.fillStyle = colors[8];
        context.fillRect(0, 0, tile_size, tile_size);
        context.fillStyle = colors[9];
        context.fillRect(1, 1, tile_size - 2, tile_size - 2);

      }

    }

  ],

  renderArea:function(area) {

    for (let index = area.map.length - 1; index > -1; -- index) {

      let graphic = this.graphics[area.map[index]].canvas;

      this.buffer.drawImage(graphic, 0, 0, graphic.width, graphic.height, MATH.getXFromIndex(index, area.columns, area.tile_size), MATH.getYFromIndex(index, area.columns, area.tile_size), area.tile_size, area.tile_size);

    }

  },

  renderGraphics:function(tile_size) {

    for (let index = this.graphics.length - 1; index > -1; -- index) {

      this.graphics[index].render(tile_size);

    }

  },

  renderDisplay:function() {

    this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, this.buffer_offset.x, this.buffer_offset.y, this.width * this.buffer_scale, this.height * this.buffer_scale);

  },

  resize:function(event) {

    let display_height = document.documentElement.clientHeight;
    let display_width = document.documentElement.clientWidth;
    let buffer_height = display.buffer.canvas.height;
    let buffer_width = display.buffer.canvas.width;

    let difference_height = buffer_height - display_height;
    let difference_width = buffer_width - display_width;

    let ratio_height = buffer_height / display_height;
    let ratio_width = buffer_width / display_width;

    display.height = display.context.canvas.height = display_height;
    display.width = display.context.canvas.width = display_width;

    if (ratio_height * difference_height < ratio_width * difference_width) {

      display.buffer_offset.x = 0;
      //display.buffer_offset.y = 100;
      display.buffer_scale = 1 / ratio_height;

    } else {

      //display.buffer_offset.x = 100;
      display.buffer_offset.y = 0;
      display.buffer_scale = 1 / ratio_width;

    }

    /*

    display.height = document.documentElement.clientHeight;
    display.width  = document.documentElement.clientWidth;

    display.context.canvas.height = display.height;
    display.context.canvas.width  = display.width;

    if (display.height < display.width) {

      display.buffer_offset.x = Math.floor((display.width - display.buffer.canvas.width) * 0.5);
      display.buffer_offset.y = 0;
      display.orientation = "landscape";

    } else {

      display.buffer_offset.x = 0;
      display.buffer_offset.y = Math.floor((display.height - display.buffer.canvas.height) * 0.5);
      display.orientation = "portrait";

    }

    */

    game.mode.resize();

  }

};

game = {

  mode:undefined,
  modes: [

    {// title screen

      area: {

        columns:20,
        map:[
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,4,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,4,0,0,0,4,0,0,4,0,0,4,4,0,0,4,0,4,0,0,
          0,4,0,4,0,4,0,4,0,4,0,4,0,0,4,0,4,0,4,0,
          0,0,4,0,4,0,0,0,4,0,0,4,0,0,4,0,4,0,4,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
          0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
        ],
        tile_size:16,
        height:320,
        width:320

      },

      loop:function(time_stamp) {

        if (time_stamp > game.engine.accumulated_time + game.engine.time_step) {

          game.engine.accumulated_time = time_stamp;

          display.renderArea(game.mode.area);
          display.renderDisplay();

        }

        game.engine.animation_frame_request = window.requestAnimationFrame(game.mode.loop);

      },

      resize:function() {

      },

      start:function() {

        display.buffer.canvas.height = this.area.height;
        display.buffer.canvas.width = this.area.width;
        display.renderGraphics(this.area.tile_size);

        this.resize();

        game.engine.start(200, this.loop);

      }

    },

    {// options

    },

    {// play


    }

  ],

  engine: {

    accumulated_time:undefined,
    animation_frame_request:undefined,
    time_step:undefined,

    start:function(time_step, loop) {

      this.accumulated_time = window.performance.now();
      this.time_step = time_step;
      this.animation_frame_request = window.requestAnimationFrame(loop);

    },

    stop: function() {

      window.cancelAnimationFrame(this.animation_frame_request);
      this.animation_frame_request = undefined;

    },

  }

};

    ////////////////////
  //// INITIALIZE ////
////////////////////

controller.scheme = controller.schemes[0];
controller.scheme.start();// start the keyboard
controller.schemes[1].start();// start the mouse

window.addEventListener("resize", display.resize);

game.mode = game.modes[0];
game.mode.start();

display.resize();

})();
