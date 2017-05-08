// Frank Poth 10/06/2016
// A simple game loop using iostream.

#include <cstdlib> // srand
#include <ctime>
#include <iostream>
#include <string>



int main() {

  // seed random function with time
  std::srand(std::time(0));

  // an array of several objects in the room
  std::string objects[14] = {"chair", "window", "rug", "dresser", "couch", "pillow", "teddy bear", "table", "end table", "vase", "bookshelf", "picture frame", "gold fish bowl", "ceiling fan"};

  // The key is set to an index of the objects array. When the user chooses an object at that index, the key will be discovered.
  int key = std::rand() % 14;

  int choice;

  int tries = 0;

  std::cout << "Welcome to the simple game loop press ENTER to start!" << std::endl;
  std::cin.get();

start:

  std::cout << "You are in a locked room and must find the key to get out. There are several items in the room whereby a key might be hidden. Where will you search?" << std::endl << std::endl;

  for (int index = 13; index > -1; index --) {
    std::cout << std::to_string(index) << ": " + objects[index] + "\n";
  }

  std::cout << std::endl;

  std::cin >> choice;

  std::cout << std::endl;

  if (!std::cin) {
    std::cin.clear();
    std::cin.ignore();
    std::cout << "You are incoherent. The stress of captivity is driving you to madness..." << std::endl << std::endl;
    goto start;
  } else if (choice < 0 || choice > 13) {
    std::cout << "You are starting to lose your mind, searching through items that aren't in the room..." << std::endl << std::endl;
    goto start;
  } else if (choice != key) {
    std::cout << "You didn't find a key in the " + objects[choice] + "..." << std::endl << std::endl;
    tries += 1;
    goto start;
  } else {
    std::cout << "You found the key in the " + objects[choice] + "!!! It took you " + std::to_string(tries) + " trie(s) to find the key! Now you can escape from this average looking room and go back to whatever it was you were doing with your life!" << std::endl << std::endl;
  }

  std::cout << "Thanks for trying out the simple game loop! Press ENTER to exit!" << std::endl;

  return 0;
}
