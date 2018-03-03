// Frank Poth 02/28/2018

/* To keep this example from looking too boring, I made the game logic gradually
change some color values which then get drawn to the display canvas in the loop. */

const Game = function() {

  this.color  = "rgb(0,0,0)";
  this.colors = [0, 0, 0];
  this.shifts = [1, 1, 1];

  this.update = function() {

    for (let index = 0; index < 3; index ++) {

      let color = this.colors[index];
      let shift = this.shifts[index];

      if (color + shift > 255 || color + shift < 0) {

        shift = (shift < 0) ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * -2) - 1;

      }

      color += shift;

      this.colors[index] = color;
      this.shifts[index] = shift;

    }

    this.color = "rgb(" + this.colors[0] + "," + this.colors[1] + "," + this.colors[2] + ")";

  };

};

Game.prototype = {

  constructor : Game

};
