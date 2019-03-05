

class BooleanInput {

  constructor() {
    
    this.active = false;
    this.state  = false;

  }

  processInput(state) {
     
    if (this.state != state) this.active = state;

    this.state = state;

  }

}