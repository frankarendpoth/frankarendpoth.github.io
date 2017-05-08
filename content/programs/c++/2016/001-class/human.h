// Frank Poth 10/06/2016

#include <string>

class Human {
  int age;
  std::string name;

  public:
    double height;
    double weight;
    std::string gender;
    std::string race;

    Human(int age_, std::string name_) {
      age = age_;
      name = name_;
    };

    std::string identify() {
      return std::string("--------------------\n- Name: " + name +
                         "\n- Gender: " + gender +
                         "\n- Age: " + std::to_string(age) +
                         "\n- Race: " + race +
                         "\n- Height: " + std::to_string(height) +
                         "\n- Weight: " + std::to_string(weight) +
                         "\n--------------------");
    };
};
