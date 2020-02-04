// Frank Poth 09/07/2018 - 09/07/2018

class Button {

  constructor(name, action) {

    this.element = document.createElement("div");
    this.element.setAttribute("class", "button");
    this.element.innerText = name;
    this.action = action;

  }

}