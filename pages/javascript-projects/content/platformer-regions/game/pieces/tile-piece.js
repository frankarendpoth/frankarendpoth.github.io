/* Frank Poth 2019-01-15 */

/* The TilePiece is the basis for all tile pieces. */
const TilePiece = function(frame_index) {

  /* The frame of a TilePiece is actually only the x, y coordinates of the frame in the source image. This is because a global TILE_SIZE value can be used in place of width and height, and there is no need for offset_x and offset_y because most tiles don't have offsets. */
  this.frame = this.frames[frame_index];

};

TilePiece.prototype = {

  /* The array of frame arrays. */
  frames:undefined

};

Object.assign(TilePiece.prototype, Piece.prototype);