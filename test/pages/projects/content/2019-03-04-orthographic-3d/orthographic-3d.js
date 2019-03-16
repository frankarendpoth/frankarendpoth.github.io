(() => {

  function update() {

    if (controller.W.active) camera.rotation.x += 0.01;
    if (controller.S.active) camera.rotation.x -= 0.01;
    if (controller.A.active) camera.rotation.y -= 0.01;
    if (controller.D.active) camera.rotation.y += 0.01;

    if (controller.u.active) camera.translateZ(-1);
    if (controller.d.active) camera.translateZ(1);
    if (controller.l.active) camera.translateX(-1);
    if (controller.r.active) engine.stop();//camera.translateX(1);

    //block.rotateX(0.01);
    //block.rotateY(0.01);

  }

  function render() {

    output.innerText = "Position:\nx: " + Math.floor(camera.x) + "\ny: " + Math.floor(camera.y) + "\nz: " + Math.floor(camera.z);

    output.innerText += "\nRotation:\nx: " + Math.floor(camera.rotation.x * 180 / Math.PI) + "\ny: " + Math.floor(camera.rotation.y * 180 / Math.PI) + "\nz: " + Math.floor(camera.rotation.z * 180 / Math.PI);

    display.buffer.fillStyle = "#c9e9f6";
    display.buffer.fillRect(0, 0, display.buffer_w, display.buffer_h);

    for (var f = Block.faces.length - 1; f > -1; -- f) {

      var face = new Face3D(block.faceVertices(f));

      camera.projectFace(face);

      if (camera.backFace(face)) continue;

      var point = face.vertices[0];

      point.translate(camera.width * 0.5, camera.height * 0.5, 0);

      display.buffer.beginPath();
      display.buffer.moveTo(point.x, point.y);

      for (var p = face.vertices.length - 1; p > 0; -- p) {

        point = face.vertices[p];

        point.translate(camera.width * 0.5, camera.height * 0.5, 0);

        display.buffer.lineTo(point.x, point.y);

      }

      display.buffer.closePath();
      display.buffer.fillStyle = Block.colors[f];
      display.buffer.fill();

    }

    display.render();

  }

  function keyUpDown(event) {

    var state = event.type == "keydown" ? true : false;

    switch(event.keyCode) {

      case 37: controller.l.processInput(state); break;
      case 38: controller.u.processInput(state); break;
      case 39: controller.r.processInput(state); break;
      case 40: controller.d.processInput(state); break;
      case 65: controller.A.processInput(state); break;
      case 68: controller.D.processInput(state); break;
      case 83: controller.S.processInput(state); break;
      case 87: controller.W.processInput(state);

    }

  }

  // e = event
  function resize(e) {

    var de = document.documentElement;

    display.resizeCanvas(de.clientWidth, de.clientHeight);

  }

  var controller = {

    d : new BooleanInput(), // down
    l : new BooleanInput(), // left
    r : new BooleanInput(), // right
    u : new BooleanInput(), // up
    A : new BooleanInput(),
    D : new BooleanInput(),
    S : new BooleanInput(),
    W : new BooleanInput()

  };

  var camera  = new OrthographicCamera3D(0, 0, 0, 100, 100);

  var display = new Display(document.querySelector("canvas"));
  var engine  = new Engine(update, render);

  var output  = document.querySelector("p");

  var block = new Block(0, 0, 0, 8, 8, 8);

  window.addEventListener("keydown", keyUpDown);
  window.addEventListener("keyup"  , keyUpDown);
  window.addEventListener("resize" , resize);

  display.resizeBuffer(camera.width, camera.height);
  resize();

  engine.start();

})();