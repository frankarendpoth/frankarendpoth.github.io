// Frank Poth 03/06/2018

/* The output class handles everything to do with displaying graphics. */

const Output = function(element) {

  this.element = element;

  this.renderColor = function(color) {

    this.element.style.backgroundColor = color;

  }

};

Output.prototype = {

  constructor:Output

};
