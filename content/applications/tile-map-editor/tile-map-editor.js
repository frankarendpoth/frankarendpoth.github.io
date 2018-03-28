// Frank Poth 03/28/2018

(() => {

  //// CLASSES ////

  const Input = function(text_in, number_in, button) {

    this.text_in   = text_in;
    this.number_in = number_in;
    this.button    = button;

  };

  Input.prototype = {};

  const Output = function(text_out) {

    this.text_out = text_out;

  };

  Output.prototype = {};

  const Processor = function() {

    this.mapStringToArray = function(string) {

      return string.split(",");

    },

    this.shiftTileMap = function(map, shift = 0) {

      for (let index = map.length - 1; index > -1; -- index) {

        map[index] = Number(map[index]) + Number(shift);

      }

      return map;

    };

  };

  Processor.prototype = {};

  //// FUNCTIONS ////

  const change = function(event) {

    switch(this) {

      case input.button:

        output.text_out.innerHTML = processor.shiftTileMap(processor.mapStringToArray(input.text_in.value), input.number_in.value);

      break;
      case input.number_in: break;
      case input.text_in:

    }

  };

  //// INITIALIZE ////

  var input, output, processor;

  input     = new Input(document.getElementById("text_in"), document.getElementById("number_in"), document.getElementById("button"));
  output    = new Output(document.getElementById("text_out"));
  processor = new Processor();

  input.button.addEventListener("click", change);
  input.number_in.addEventListener("change", change);
  input.text_in.addEventListener("change", change);

})();
