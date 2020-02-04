class Point3D {

  constructor(x, y, z) {

    this.x = x;
    this.y = y;
    this.z = z;

  }

  clone() {

    return new Point3D(this.x, this.y, this.z);

  }

  translate(x, y, z) {

    this.x += x;
    this.y += y;
    this.z += z;

  }

  translateX(x) { this.x += x; }
  translateY(y) { this.y += y; }
  translateZ(z) { this.z += z; }

}

Point3D.clone = function(p) {

  return new Point3D(p.x, p.y, p.z);

}

Point3D.rotateX = function(p, a) {

  var c = Math.cos(a);
  var s = Math.sin(a);

  var y = p.y * c - p.z * s;
  p.z   =   y * s + p.z * c;

  p.y = y;

}

Point3D.rotateY = function(p, a) {

  var c = Math.cos(a);
  var s = Math.sin(a);

  var x = p.z * s + p.x * c;
  p.z   = p.z * c -   x * s;

  p.x = x;

}

Point3D.rotateZ = function(p, a) {

  var c = Math.cos(a);
  var s = Math.sin(a);

  var x = p.x * c - p.y * s;
  p.y   =   x * s + p.y * c;

  p.x = x;

}

Point3D.translate = function(p, x, y, z) {

  p.x += x;
  p.y += y;
  p.z += z;

}