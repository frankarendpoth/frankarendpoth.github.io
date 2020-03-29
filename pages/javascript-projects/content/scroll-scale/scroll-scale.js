alert("Use the arrow keys to move. Use D and F to zoom. This example showcases smooth, simultaneous scrolling and scaling. It may lag when you zoom out all the way.");

(() => {

  function keyDown(event) { event.preventDefault();

    switch(event.keyCode) { 

      case 37: CONTROLLER.left.trigger(true);  break;
      case 38: CONTROLLER.up.trigger(true);    break;
      case 39: CONTROLLER.right.trigger(true); break;
      case 40: CONTROLLER.down.trigger(true);  break;
      case 68: CONTROLLER.d.trigger(true);     break;
      case 70: CONTROLLER.f.trigger(true);     break;
      
    }

  }

  function keyUp(event) { event.preventDefault();

    switch(event.keyCode) {

      case 37: CONTROLLER.left.trigger(false);  break;
      case 38: CONTROLLER.up.trigger(false);    break;
      case 39: CONTROLLER.right.trigger(false); break;
      case 40: CONTROLLER.down.trigger(false);  break;
      case 68: CONTROLLER.d.trigger(false);     break;
      case 70: CONTROLLER.f.trigger(false);     break;

    }

  }

  function mouseMove(event) { event.preventDefault();
  
    MOUSE.x = event.clientX;
    MOUSE.y = event.clientY;
  
  }

  function requestImage(url, callback) {

    return new Promise(resolve => {

      let image = new Image();

      image.addEventListener('load', () => { resolve(image); }, { once:true });

      image.src = url;

    }).then(image => {

      IMAGE = image;

      callback();
      
    });

  }

  function resize(event) {

    if (event) event.preventDefault();

    var height = document.documentElement.clientHeight;
    var width  = document.documentElement.clientWidth;

    RENDERER.resize(width, height);

    VIEWPORT.aspect_ratio = width / height;

    VIEWPORT.setWidth(VIEWPORT.width);

  }

  ENGINE.render = function() {
    
    RENDERER.clear("#000000");
    RENDERER.renderMap();
    RENDERER.renderDot();

  };

  ENGINE.update = function() {

    if (CONTROLLER.down.active)  DOT.y += 2;
    if (CONTROLLER.left.active)  DOT.x -= 2;
    if (CONTROLLER.right.active) DOT.x += 2;
    if (CONTROLLER.up.active)    DOT.y -= 2;

    if (CONTROLLER.d.active) VIEWPORT.setWidth(VIEWPORT.width + 4);
    if (CONTROLLER.f.active) VIEWPORT.setWidth(VIEWPORT.width - 4);

    RENDERER.scale = RENDERER.context.canvas.width / VIEWPORT.width;

    VIEWPORT.scrollTo(DOT.x, DOT.y);

  };

  document.body.appendChild(RENDERER.context.canvas);

  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);
  window.addEventListener("mousemove", mouseMove);
  window.addEventListener("resize", resize);

  TILES.push(new Tile(0), new Tile(8), new Tile(16), new Tile(24), new Tile(32));

  resize();

  requestImage('assets/tiles.png', () => {

    ENGINE.start();

  });

})();