class World {

  constructor(columns, rows) {

    this.columns = columns;
    this.rows    = rows;

    this.block_width = 64;
    this.block_depth = 64;

    this.blocks = new Array(columns * rows);

    this.populateBlocks();

  }

  populateBlocks() {

    for (var c = this.columns; c > -1; -- c) {

      for (var r = this.rows; r > -1; -- r) {

        this.blocks[r * this.columns + c] = new Block(c * this.block_width, 0, r * -this.block_depth, this.block_width * 0.5, 32 + Math.random() * 48, this.block_depth * 0.5);

      }

    }

  }

}