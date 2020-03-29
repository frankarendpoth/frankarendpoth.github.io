/* Frank Poth 2019-01-15 */

/* The PlayerPiece is the basis for all player pieces. */
const PlayerPiece = function(left, top, width, height, frame_index) {

  Piece.call(this);

  Rectangle2D.call(this, left, top, width, height);

  /* The frame of a PlayerPiece contains the source image rect (x, y, w, h) as well as the drawing offsets (x, y). */
  this.frame = this.frames[frame_index];

};

PlayerPiece.prototype = {

  /* The array of frames. */
  frames:undefined
  
};

Object.assign(PlayerPiece.prototype, Piece.prototype);
Object.assign(PlayerPiece.prototype, Rectangle2D.prototype);