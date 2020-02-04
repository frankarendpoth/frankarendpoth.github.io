/* Frank Poth 2019-01-10 */

export const Dirt = function(frame_index) {

  TilePiece.call(this, frame_index);

};

Dirt.prototype = {};

Object.assign(Dirt.prototype, TilePiece.prototype);

Dirt.prototype.serialize = function() { return "Dirt," + this.frames.indexOf(this.frame); };

Dirt.prototype.frames = [[0, 0], [8, 0], [16, 0]];

Dirt.prototype.name = "Dirt";