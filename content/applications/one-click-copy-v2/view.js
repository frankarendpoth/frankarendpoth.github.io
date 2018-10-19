// Frank Poth 09/07/2018 - 09/07/2018

class View {

  constructor(element) {

    this.element = element;

  }

    ///////////////////
   //// UTILITIES ////
  ///////////////////


  addListeners() {

    this.element.addEventListener("click", this.clickElement);

  }

  removeListeners() {

    this.element.removeEventListener("click", this.clickElement);

  }

  // Make the element visible or invisible.
  setVisible(visible) {

    this.element.dataset.visible = visible;

  }

    ////////////////////////
   //// EVENT HANDLERS ////
  ////////////////////////

  /* When you click the background of the view something should happen. */
  clickElement(event) { event.preventDefault();

    alert("You clicked the view!");

  }

}