// Frank Poth 03/06/2018

/* The processor class handles the application logic. */

const Processor = function() {

  this.getRandomColor = function() {

    return "#" + Math.floor(Math.random() * 16777215).toString(16);

  }

};

Processor.prototype = {

  constructor:Processor,

};
