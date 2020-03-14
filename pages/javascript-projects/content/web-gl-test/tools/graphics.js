/* Frank Poth 2020-02-28 */

const GRAPHICS = {

  vertex_shader:`#version 300 es

in vec4 a_color;
in vec2 a_translation;
in vec2 a_vertex;

out vec4 v_color;

uniform vec2 u_resolution;
 
void main() {

  vec2 position = ((a_vertex + a_translation) / u_resolution) * 2.0 - 1.0;

  position.y = -position.y; // invert the y axis
 
  gl_Position = vec4(position, 0, 1);

  v_color = a_color;

}`,

fragment_shader:`#version 300 es

precision mediump float;
 
in vec4 v_color;

out vec4 v_color2;
 
void main() {
  
  v_color2 = v_color;

}`,

  createProgram(context, vertex_shader, fragment_shader) {

    var program = context.createProgram();
    context.attachShader(program, vertex_shader);
    context.attachShader(program, fragment_shader);
    context.linkProgram(program);

    //alert(context.getProgramParameter(program, context.LINK_STATUS));

    return program;

  },

  createShader(context, type, source) {

    var shader = context.createShader(type);
    context.shaderSource(shader, source);
    context.compileShader(shader);

    //alert(context.getShaderParameter(vertex_shader, context.COMPILE_STATUS));
    console.log(context.getShaderInfoLog(shader));

    return shader;

  }

};