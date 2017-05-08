#include <iostream>
#include <GL/glew.h>
#include <GLFW/glfw3.h>

class Rectangle {
  public:

    float x, y, width, height;

    float vertices[8];

    Rectangle(float x, float y, float width, float height): x(x), y(y), width(width), height(height) {
    };

    float getBottom() {
      return y + height;
    };

    float getLeft() {
      return x;
    };

    float getRight() {
      return x + width;
    };

    float getTop() {
      return y + height;
    };

    float * getVertices() {
      vertices[0] = getLeft();
      vertices[1] = getTop();
      vertices[2] = getRight();
      vertices[3] = getTop();
      vertices[4] = getRight();
      vertices[5] = getBottom();
      vertices[6] = getLeft();
      vertices[7] = getBottom();
      return vertices;
    };

};

int main() {

  glfwInit();

  glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
  glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
  glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
  glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);

  GLFWwindow * window = glfwCreateWindow(480, 480, "glfw-move-square", nullptr, nullptr);

  glfwMakeContextCurrent(window);

  // initialize GLEW
  glewExperimental = GL_TRUE;

  glewInit();

  glViewport(0, 0, 480, 480);

  Rectangle rectangle(10.0f, 10.0f, 32.0f, 32.0f);

  // generate a vertex buffer object to send data to the graphics card:
  GLuint vertex_buffer_object;
  glGenBuffers(1, &vertex_buffer_object); // generates 1 vbo

  glBindBuffer(GL_ARRAY_BUFFER, vertex_buffer_object);

  glBufferData(GL_ARRAY_BUFFER, sizeof(rectangle.vertices), rectangle.vertices, GL_STATIC_DRAW);

  const GLchar *vertex_source = "#version 150\n"
                                "in vec2 position;\n"

                                "void main() {\n"
                                  "gl_Position = vec4(position, 0.0, 1.0);\n"
                                "}\0";

  const GLchar *fragment_source = "#version 150\n"
                                  "out vec4 outColor;\n"

                                  "void main() {\n"
                                    "outColor = vec4(1.0, 1.0, 1.0, 1.0);\n"
                                  "}\0";

  GLuint vertex_shader = glCreateShader(GL_VERTEX_SHADER);
  glShaderSource(vertex_shader, 1, &vertex_source, NULL);
  glCompileShader(vertex_shader);

  GLuint fragment_shader = glCreateShader(GL_FRAGMENT_SHADER);
  glShaderSource(fragment_shader, 1, &fragment_source, NULL);
  glCompileShader(fragment_shader);

  GLuint shader_program = glCreateProgram();
  glAttachShader(shader_program, vertex_shader);
  glAttachShader(shader_program, fragment_shader);

  glLinkProgram(shader_program);
  

  bool running = true;

  while (running) {
    glClearColor(0.2f, 0.2f, 0.2f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    glfwSwapBuffers(window);
  };

  std::cout << "done" << std::endl;

  glfwTerminate();

  return 0;
};
