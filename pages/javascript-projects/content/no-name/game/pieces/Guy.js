/* Frank Poth 2019-01-11 */

export const Guy = function(column, row, frame_index) {

  PlayerPiece.call(this, column, row, 8, 16, frame_index);

};

Guy.prototype = {};

Object.assign(Guy.prototype, PlayerPiece.prototype);

Guy.prototype.serialize = function() { return "Guy," + this.frames.indexOf(this.frame); };

Guy.prototype.frames = [[0, 0, 8, 16, 0, 0]];

Guy.prototype.name = "Guy";