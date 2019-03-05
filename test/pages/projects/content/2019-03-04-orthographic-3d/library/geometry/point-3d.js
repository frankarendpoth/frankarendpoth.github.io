class Point3D {

  constructor(x, y, z) {

    this.x = x;
    this.y = y;
    this.z = z;

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