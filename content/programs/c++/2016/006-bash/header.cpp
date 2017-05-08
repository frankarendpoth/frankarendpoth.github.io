#ifndef HEADER_H
#define HEADER_H
#include "header.h"

#include <iostream>

Header::Header():name("Steve") {
  std::cout << "This code is running in the constructor of a header object!" << std::endl;
  std::cout << "It's cool because the implementation is separated from the header file!" << std::endl;
};

#endif
