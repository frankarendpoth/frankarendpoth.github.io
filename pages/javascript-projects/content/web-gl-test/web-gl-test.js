/* Frank Poth 2020-02-27 */

(() => {

  var triangles = [];

  for (var index = 0; index < 10; index ++) {

    triangles[index] = new Triangle(index * 10, index * 10);

  }

  var vertex_shader = GRAPHICS.createShader(RENDERER.context, RENDERER.context.VERTEX_SHADER, GRAPHICS.vertex_shader);

  var fragment_shader = GRAPHICS.createShader(RENDERER.context, RENDERER.context.FRAGMENT_SHADER, GRAPHICS.fragment_shader);

  RENDERER.setProgram(GRAPHICS.createProgram(RENDERER.context, vertex_shader, fragment_shader));

  resizeWindow();

  function loop() {

    RENDERER.clear(1, 1, 1);

    RENDERER.renderTriangles(triangles);

    window.requestAnimationFrame(loop);

  }

  function resizeWindow(event) {

    RENDERER.setResolution(document.documentElement.clientWidth, document.documentElement.clientHeight);

  }

  document.body.appendChild(RENDERER.context.canvas);

  window.addEventListener('resize', resizeWindow);

  window.requestAnimationFrame(loop);

})();