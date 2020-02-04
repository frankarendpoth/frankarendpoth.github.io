// https://www.siggraph.org/education/materials/HyperGraph/modeling/mod_tran/3drota.htm
// Super good rotation formulas ^^^

class Vector3D {

  constructor(x, y, z) {

    this.x = x;
    this.y = y;
    this.z = z;

  }

  rotateX(a) {

    var c = Math.cos(a);
    var s = Math.sin(a);

    var y  = this.y * c - this.z * s;
    this.z =      y * s + this.z * c;

    this.y = y;

  }

  rotateY(a) {

    var c = Math.cos(a);
    var s = Math.sin(a);

    var x  = this.z * s + this.x * c;
    this.z = this.z * c -      x * s;

    this.x = x;

  }

  rotateZ(a) {

    var c = Math.cos(a);
    var s = Math.sin(a);

    var x  = this.x * c - this.y * s;
    this.y =      x * s + this.y * c;

    this.x = x;

  }

}

Vector3D.crossProduct = function(v1, v2) {

  return new Vector3D(v1.y * v2.z - v1.z * v2.y, v1.x * v2.z - v1.z * v2.x, v1.x * v2.y - v1.y * v2.x);

}

Vector3D.difference = function(v1, v2) {

  return new Vector3D(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);

}

Vector3D.dotProduct = function(v1, v2) {

  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;

}