class Face3D {

  constructor(vertices) {

    this.vertices = new Array(vertices.length);

    for (var i = vertices.length - 1; i > -1; -- i) this.vertices[i] = Point3D.clone(vertices[i]);

  }

  averageZ() {

    var z = this.vertices[0].z;

    for (var i = this.vertices.length - 1; i > 0; -- i) z += this.vertices[i].z;

    return z / this.vertices.length;

  }

  maximumPoint(v) {

    var mp = this.vertices[0];
    var d  = Vector3D.dotProduct(v, mp);

    for (var i = this.vertices.length - 1; i > 0; -- i) {

      var tp = this.vertices[i];
      var td = Vector3D.dotProduct(v, tp);

      if (td > d) { d = td; mp = tp; }

    }

    return mp.clone();

  }

  minimumPoint(v) {

    var mp = this.vertices[0];
    var d  = Vector3D.dotProduct(v, mp);

    for (var i = this.vertices.length - 1; i > 0; -- i) {

      var tp = this.vertices[i];
      var td = Vector3D.dotProduct(v, tp);

      if (td < d) { d = td; mp = tp; }

    }

    return mp.clone();

  }

  rotateX(a) {

    var c = Math.cos(a);
    var s = Math.sin(a);

    for (var i = this.vertices.length - 1; i > -1; -- i) {

      var v = this.vertices[i]; // selected vertex

      var y = v.y * c - v.z * s;
      v.z   = v.y * s + v.z * c;

      v.y = y;

    }

  }

  rotateY(a) {

    var c = Math.cos(a);
    var s = Math.sin(a);

    for (var i = this.vertices.length - 1; i > -1; -- i) {

      var v = this.vertices[i]; // selected vertex

      var x = v.z * s + v.x * c;
      v.z   = v.z * c - v.x * s;

      v.x = x;

    }

  }

  rotateZ(a) {

    var c = Math.cos(a);
    var s = Math.sin(a);

    for (var i = this.vertices.length - 1; i > -1; -- i) {

      var v = this.vertices[i]; // selected vertex

      var x = v.x * c - v.y * s;
      v.y   = v.x * s + v.y * c;

      v.x = x;

    }

  }

  translate(x, y, z) {

    for (var i = this.vertices.length - 1; i > -1; -- i) this.vertices[i].translate(x, y, z);

  }

}

Face3D.clone = function(f) {

  return new Face3D(f.vertices);

}