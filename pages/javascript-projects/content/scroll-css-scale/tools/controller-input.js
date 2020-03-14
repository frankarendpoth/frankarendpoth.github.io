/* Frank Poth 2020-01-14 */

const ControllerInput = function() {

  this.active = false;
  this.status = false;

};

ControllerInput.prototype = {

  reset() { this.active = false; },

  trigger(status) {

    if (this.status != status) this.active = status;
    
    this.status = status;

  }

};