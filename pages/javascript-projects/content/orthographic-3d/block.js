class Block extends Polygon3D {

  // hw = half width, hh = half height, hd = half depth
  constructor(x, y, z, hw, hh, hd) {

    super(x, y, z, [-hw, -hh, -hd], [hw, -hh, -hd], [hw, -hh, hd], [-hw, -hh, hd],
                   [-hw,  hh, -hd], [hw,  hh, -hd], [hw,  hh, hd], [-hw,  hh, hd]);

    this.width  = hw * 2;
    this.height = hh * 2;
    this.depth  = hd * 2;

  }

  faceVertices(index) {

    var vertices = new Array(4);

    for (var i = 0; i < 4; i ++) {

      vertices[i] = this.vertices[Block.faces[index][i]];

    }

    return vertices;

  }

}

Block.faces = [[0, 1, 2, 3],  // top
               [1, 5, 6, 2],  // right
               [4, 7, 6, 5],  // bottom
               [0, 3, 7, 4],  // left
               [3, 2, 6, 7],  // front
               [0, 4, 5, 1]]; // back

Block.colors = ["rgba(0, 255, 0, 1)", "rgba(192, 192, 0, 1)", "rgba(96, 96, 0, 1)", "rgba(192, 192, 0, 1)", "rgba(128, 128, 0, 1)", "rgba(128, 128, 0, 1)"];