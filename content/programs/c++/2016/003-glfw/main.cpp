#include <iostream>

#include <GL/glew.h>
#include <GLFW/glfw3.h>

int main(int argc, char **argv) {

  glfwInit();
  glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
  glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
  glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
  glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);

  GLFWwindow* window = glfwCreateWindow(800, 600, "GLFW Window", nullptr, nullptr);

  if (window == nullptr) {
    std::cout << "Failed to create GLFW window" << std::endl;
    glfwTerminate();
    return -1;
  }

  glfwMakeContextCurrent(window);

  glewExperimental = GL_TRUE;

  if (glewInit() != GLEW_OK) {
    std::cout << "Failed to initialize GLEW" << std::endl;
    return -1;
  }

  int width, height;
  // Sets width and height based on Frame Buffer Size of window.
  glfwGetFramebufferSize(window, &width, &height);

  // Just to test the above line of code
  std::cout << "Width of window: " << width << std::endl;

  glViewport(0, 0, width, height);

  int count = 0;

  // game loop
  while(!glfwWindowShouldClose(window)) {
    //glfwPollEvents();

    count ++;
    std::cout << count << std::endl;

    glClearColor(0.2f, 0.2f, 0.2f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT);

    glfwSwapBuffers(window);
  }

  glfwTerminate();

  return 0;
}
