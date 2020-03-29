/* Frank Poth 2020-01-16 */

const Polygon2D = function(...vertices) {

  this.vertices = vertices;

};

Polygon2D.prototype = {

  containsPoint(x, y) {

    var contains_point = false;

    var x_index = this.vertices.length - 2;

    var vertex2_x = this.vertices[0];
    var vertex2_y = this.vertices[1];

    while(x_index > -1) {

      var vertex1_x = this.vertices[x_index];
      var vertex1_y = this.vertices[x_index + 1];

      if (((vertex1_y > y) != (vertex2_y > y)) && (x < (vertex2_x - vertex1_x) * (y - vertex1_y) / (vertex2_y - vertex1_y) + vertex1_x)) contains_point = !contains_point;

      vertex2_x = vertex1_x;
      vertex2_y = vertex1_y;

      x_index -= 2;

    }

    return contains_point;
    
  },

  getBottom() {

    var y_index = this.vertices.length - 1;

    var bottom = this.vertices[1];

    while (y_index > 1) {

      var vertex_y = this.vertices[y_index];

      if (vertex_y > bottom) bottom = vertex_y;

      y_index -= 2;

    }

    return bottom;

  },

  getLeft() {

    var x_index = this.vertices.length - 2;

    var left = this.vertices[0];

    while (x_index > 0) {

      var vertex_x = this.vertices[x_index];

      if (vertex_x < left) left = vertex_x;

      x_index -= 2;

    }

    return left;

  },

  getRight() {

    var x_index = this.vertices.length - 2;

    var right = this.vertices[0];

    while (x_index > 0) {

      var vertex_x = this.vertices[x_index];

      if (vertex_x > right) right = vertex_x;

      x_index -= 2;

    }

    return right;

  },

  getTop() {

    var y_index = this.vertices.length - 1;

    var top = this.vertices[1];

    while (y_index > 1) {

      var vertex_y = this.vertices[y_index];

      if (vertex_y < top) top = vertex_y;

      y_index -= 2;

    }

    return top;

  },

  moveXY(distance_x, distance_y) {

    var x_index = this.vertices.length - 2;

    while (x_index > -1) {

      this.vertices[x_index]     += distance_x;
      this.vertices[x_index + 1] += distance_y;

      x_index -= 2;

    }

  }

};