/* Frank Poth 08/31/2018 */
class Button {

  constructor(name, body, color, index) {
    
    this.body    = body;
    this.color   = color;
    this.name    = name;

    this.element = document.createElement("div");
    this.element.setAttribute("class", "button");
    this.element.innerText = name;
    this.element.style.backgroundColor = color;
    this.element.parent    = this;// This is bad.

  }

  toDatabaseEntry() {

    return {

      body:  this.body,
      color: this.color,
      name:  this.name

    }

  }

}