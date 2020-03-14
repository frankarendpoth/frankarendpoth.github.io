/* Frank Poth 2020-02-28 */

const RENDERER = {

  context:document.createElement('canvas').getContext('webgl2', {

    alpha:false,
    antialias:false,
    depth:false,
    desynchronized:true,
    failIfMajorPerformanceCaveat:true,
    powerPreference:'low-power',
    premultipliedAlpha:false,
    preserveDrawingBuffer:false,
    stencil:false

  }),

  program:undefined,

  vertex_attribute_object:undefined,

  clear(red = 0, green = 0, blue = 0, alpha = 0) {

    this.context.clearColor(red, green, blue, alpha);
    this.context.clear(this.context.COLOR_BUFFER_BIT);

  },

  renderTriangles(triangles) {

    var color_buffer       = this.context.createBuffer();
    var translation_buffer = this.context.createBuffer();
    var vertex_buffer      = this.context.createBuffer();

    var colors       = new Float32Array(triangles.length * 4);
    var translations = new Float32Array(triangles.length * 2);
    var vertices     = new Float32Array(triangles.length * 6);

    for (var index = triangles.length - 1; index > -1; -- index) {

      var triangle = triangles[index];

      colors.set(triangle.color, index * 4);
      translations.set(triangle.translation, index * 2);
      vertices.set(triangle.vertices, index * 6);

    }

    this.context.bindBuffer(this.context.ARRAY_BUFFER, color_buffer);
    this.context.bufferData(this.context.ARRAY_BUFFER, colors, this.context.DYNAMIC_DRAW);

    this.context.bindBuffer(this.context.ARRAY_BUFFER, translation_buffer);
    this.context.bufferData(this.context.ARRAY_BUFFER, translations, this.context.DYNAMIC_DRAW);

    this.context.bindBuffer(this.context.ARRAY_BUFFER, vertex_buffer);
    this.context.bufferData(this.context.ARRAY_BUFFER, vertices, this.context.DYNAMIC_DRAW);

    this.context.drawArraysInstanced(this.context.TRIANGLES, 0, 6, triangles.length);

  },

  setResolution(width, height) {

    this.context.canvas.height = height;
    this.context.canvas.width  = width;

    this.context.viewport(0, 0, width, height);

    this.context.uniform2f(this.context.getUniformLocation(this.program, "u_resolution"), width, height);

  },

  setProgram(program) {

    this.program = program;

    this.context.useProgram(program);

    this.vertex_attribute_object = this.context.createVertexArray();

    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.context.createBuffer());

    this.context.bindVertexArray(this.vertex_attribute_object);

    var color_location       = this.context.getAttribLocation(this.program, 'a_color');
    var translation_location = this.context.getAttribLocation(this.program, 'a_translation');
    var vertex_location      = this.context.getAttribLocation(this.program, 'a_vertex');

    this.context.enableVertexAttribArray(color_location);
    this.context.enableVertexAttribArray(translation_location);
    this.context.enableVertexAttribArray(vertex_location);

    this.context.vertexAttribPointer(color_location,       4, this.context.FLOAT, false, 4 * 4, 0);
 
    // 2 components per iteration; data is ints; don't normalize to unit size; stride = 0; offset = 0;
    this.context.vertexAttribPointer(translation_location, 2, this.context.FLOAT, false, 2 * 4, 0);
    this.context.vertexAttribPointer(vertex_location,      2, this.context.FLOAT, false, 6 * 4, 0);
    
    this.context.vertexAttribDivisor(color_location, 1);
    this.context.vertexAttribDivisor(translation_location, 1);
    this.context.vertexAttribDivisor(vertex_location, 1);

  }

};
