// Frank Poth 03/06/2018

/* The input class handles everything to do with user input. */

const Input = function(update) {

  this.handleClick = function(event) {

    update();

  };

};

Input.prototype = {

  constructor:Input

};
