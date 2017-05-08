How To Install And Compile GLFW

1. Get the source package by going to http://www.glfw.org/download.html and clicking the "source package" link to download the latest .zip.

2. There are dependencies for GLFW depending on which platform you are using. Go here: http://www.glfw.org/docs/latest/compile_guide.html#compile_manual to see which ones you need. Since the website is lacking, you may have to search for the dependencies for GLFW elsewhere.

3. Once you have downloaded the source package from step 1 and you have your dependencies installed from step 2, extract your downloaded source package to where you want it.

4. Now build the files on the command line:

  cd <source directory>
  cmake .

  Now you can #include <GLFW/glfw3.h> in your code

5. When you want to build, use these linkages in the command line (Ubuntu): -lglfw3 -lGL -lX11 -lXi -lXrandr -lXxf86vm -lXinerama -lXcursor -pthread -ldl
