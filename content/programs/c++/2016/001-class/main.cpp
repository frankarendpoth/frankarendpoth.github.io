// Frank Poth
// Just messing around with c++, getting a feel for it and such.

#include <iostream>

#include "human.h"

int main() {

  Human human(37, "Lola Whales");
  human.gender = "Female";
  human.height = 72;
  human.weight = 147;
  human.race = "Black";

  std::cout << "Hey, you!! Show me your IDENTIFICATION!!!" << std::endl;
  std::cin.get();
  std::cout << "Oh, okay, officer, here it is:" << std::endl << std::endl;
  std::cout << human.identify() << std::endl;
  std::cin.get();
  std::cout << "Everything seems to be in order here. Carry on!" << std::endl << std::endl;

  return 0;
}
