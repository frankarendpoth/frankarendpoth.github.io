(() => {

  function update() {

    if (controller.W.active) camera.rotation.x += 0.01;
    if (controller.S.active) camera.rotation.x -= 0.01;
    if (controller.A.active) camera.rotation.y -= 0.01;
    if (controller.D.active) camera.rotation.y += 0.01;

    if (controller.u.active) camera.translateZ(-1);
    if (controller.d.active) camera.translateZ(1);
    if (controller.l.active) camera.translateX(-1);
    if (controller.r.active) camera.translateX(1);

  }

  function render() {

    output.innerText = "Position:\nx: " + Math.floor(camera.x) + "\ny: " + Math.floor(camera.y) + "\nz: " + Math.floor(camera.z);

    output.innerText += "\nRotation:\nx: " + Math.floor(camera.rotation.x * 180 / Math.PI) + "\ny: " + Math.floor(camera.rotation.y * 180 / Math.PI) + "\nz: " + Math.floor(camera.rotation.z * 180 / Math.PI);

    camera.context.fillStyle = "#c9e9f6";
    camera.context.fillRect(0, 0, camera.width, camera.height);

    var faces  = new Array();
    var colors = new Array();

    for (var c = world.columns - 1; c > -1; -- c) {

      for (var r = world.rows - 1; r > -1; -- r) {

        for (var f = Block.faces.length - 1; f > -1; -- f) {

          var block = world.blocks[r * world.columns + c];

          var face = new Face3D(block.faceVertices(f));

          //face.translate(c * block.width, 0, -r * block.depth);
    
          camera.projectFace(face);
    
          if (camera.backFace(face)) continue;
    
          faces.push(face);
          face.z = -face.averageZ();//face.minimumPoint(OrthographicCamera3D.normal).z;
          face.c = Block.colors[f];

          colors.push(Block.colors[f]);
    
        }

      }

    }

    faces.sort((a, b) => { return a.z - b.z; });

    for (var i = faces.length - 1; i > -1; -- i) {

      face = faces[i];

      var point = face.vertices[0];
    
      point.translate(camera.width * 0.5, camera.height * 0.5, 0);

      camera.context.beginPath();
      camera.context.moveTo(point.x, point.y);

      for (var p = face.vertices.length - 1; p > 0; -- p) {

        point = face.vertices[p];

        point.translate(camera.width * 0.5, camera.height * 0.5, 0);

        camera.context.lineTo(point.x, point.y);

      }

      camera.context.closePath();
      camera.context.fillStyle = face.c;
      camera.context.fill();

    }

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
      case 87: controller.W.processInput(state); break;

      case 13: engine.stop();

    }

  }

  // e = event
  function resize(e) {

    var de = document.documentElement;

    camera.resizeCanvas(de.clientWidth, de.clientHeight);

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

  var camera  = new OrthographicCamera3D(224, 0, -224, 100, 100, document.querySelector("canvas"));

  var engine  = new Engine(update, render);

  var output  = document.querySelector("p");

  var world = new World(8, 8);

  window.addEventListener("keydown", keyUpDown);
  window.addEventListener("keyup"  , keyUpDown);
  window.addEventListener("resize" , resize);

  camera.resizeCanvas(camera.width, camera.height);
  resize();

  engine.start();

})();

var a = [];

for (var i = 0; i < 100; i ++) {

  var n = Math.floor(Math.random() * 100 - 50);

  a.push(n);

}

a.sort((a, b) => { return a - b; });

console.log(a.toString());