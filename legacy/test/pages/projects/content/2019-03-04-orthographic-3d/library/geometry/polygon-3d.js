class Polygon3D {

  constructor(x, y, z, ...vertices) {

    this.x = x;
    this.y = y;
    this.z = z;

    this.vertices = new Array(vertices.length);

    for (var i = vertices.length - 1; i > -1; -- i) {

      var v = vertices[i]; // selected vertex

      this.vertices[i] = new Point3D(v[0] + x, v[1] + y, v[2] + z);

    }

  }

  rotateX(a) {

    var c = Math.cos(a);
    var s = Math.sin(a);

    for (var i = this.vertices.length - 1; i > -1; -- i) {

      var v = this.vertices[i]; // selected vertex

      v.translate(-this.x, -this.y, -this.z);

      var y = v.y * c - v.z * s;
      v.z   = v.y * s + v.z * c;

      v.y = y;

      v.translate(this.x, this.y, this.z);

    }

  }

  rotateY(a) {

    var c = Math.cos(a);
    var s = Math.sin(a);

    for (var i = this.vertices.length - 1; i > -1; -- i) {

      var v = this.vertices[i]; // selected vertex

      v.translate(-this.x, -this.y, -this.z);

      var x = v.z * s + v.x * c;
      v.z   = v.z * c - v.x * s;

      v.x = x;

      v.translate(this.x, this.y, this.z);

    }

  }

  rotateZ(a) {

    var c = Math.cos(a);
    var s = Math.sin(a);

    for (var i = this.vertices.length - 1; i > -1; -- i) {

      var v = this.vertices[i]; // selected vertex

      v.translate(-this.x, -this.y, -this.z);

      var x = v.x * c - v.y * s;
      v.y   = v.x * s + v.y * c;

      v.x = x;

      v.translate(this.x, this.y, this.z);

    }

  }

  translateX(x) {

    for (var i = this.vertices.length - 1; i > -1; -- i) this.vertices[i].x += x;

    this.x += x;

  }

  translateY(y) {

    for (var i = this.vertices.length - 1; i > -1; -- i) this.vertices[i].y += y;

    this.y += y;

  }

  translateZ(z) {

    for (var i = this.vertices.length - 1; i > -1; -- i) this.vertices[i].z += z;

    this.z += z;

  }

}