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

    VIEWPORT.resize(document.documentElement.clientWidth, document.documentElement.clientHeight);
    //VIEWPORT.setScale(2);
    RENDERER.resize(VIEWPORT.width, VIEWPORT.height);
    //RENDERER.setScale(VIEWPORT.scale);

  }

  ENGINE.render = function() {

    RENDERER.clear("#042436");

    RENDERER.renderMap();

    RENDERER.renderDot(DOT.x, DOT.y);

  };

  ENGINE.update = function() {

    if (CONTROLLER.down.active)  DOT.y ++;
    if (CONTROLLER.left.active)  DOT.x --;
    if (CONTROLLER.right.active) DOT.x ++;
    if (CONTROLLER.up.active)    DOT.y --;
    if (CONTROLLER.d.active) {

      VIEWPORT.setScale(VIEWPORT.scale - 0.02);
      RENDERER.setScale(VIEWPORT.scale);

    }
    if (CONTROLLER.f.active) {

      VIEWPORT.setScale(VIEWPORT.scale + 0.02);
      RENDERER.setScale(VIEWPORT.scale);

    }

    VIEWPORT.scrollTo(DOT.x, DOT.y);

  };

  document.body.appendChild(RENDERER.context.canvas);

  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);
  window.addEventListener("resize", resize);

  TILES.push(new Tile(0), new Tile(8), new Tile(16), new Tile(24), new Tile(32));

  resize();

  requestImage('assets/tiles.png', () => {

    ENGINE.start();

  });

})();