/* Frank Poth 2019-01-xx */

/* The Piece object is the most basic form of all game objects. */
const Piece = function() {};

Piece.prototype = {

  /* The description is used to add extra depth to game objects. It is intended to be seen by the player. */
  description:"The most generic piece.",
  
  /* The name is meant to be seen by the player as well as act as an identifier used to match the piece to its assets, like sprite sheet image and sound file. */
  name:"Piece",

  /* The serialize function is used to save the piece's state. */
  serialize() { return this.name; },

};