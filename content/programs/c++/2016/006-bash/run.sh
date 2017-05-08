#!/bin/sh

# To run this program in the command line via Linux Shell use:
# :sh run.sh

echo "Attemptint to run program..."

g++ -o main main.cpp header.cpp -I headers # gcc -o writes the build output of main.cpp to an output file called main.

# the -o tells g++ to compile the following .cpp files into an out file called main.
# the -I tells g++ to look for .h files in the following directories.

./main # ./ runs a compiled file
