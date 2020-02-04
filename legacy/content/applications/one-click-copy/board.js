/* Frank Poth 08/31/2018 */

class Board {

  constructor(element) {

    this.element = element;

  }

  setVisible(visible) { this.element.dataset.visible = visible; }

  switch(element) {

    this.setVisible(false);
    this.element = element;
    this.setVisible(true);

  }

}