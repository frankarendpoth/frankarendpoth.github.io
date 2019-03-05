class OrthographicCamera3D extends Point3D {

  constructor(x, y, z, w, h) {

    super(x, y, z);

    this.rotation = new Vector3D(-Math.PI * 0.5, 0, 0);

    this.width  = w;
    this.height = h;

  }

  backFace(points) {

    var p0 = points[0];

    var v1 = Vector3D.difference(points[1], p0);
    var v2 = Vector3D.difference(points[2], p0);

    var c = Vector3D.crossProduct(v1, v2);

    if (Vector3D.dotProduct(c, OrthographicCamera3D.normal) > 0) return false;
    
    return true;

  }

  projectPoints(points) {

    var projected_points = new Array(points.length);

    for (var i = points.length - 1; i > -1; -- i) {

      var p = Point3D.clone(points[i]);

      var v = Vector3D.difference(p, this);

      var dot1 = Vector3D.dotProduct(v, OrthographicCamera3D.normal);
      var dot2 = Vector3D.dotProduct(OrthographicCamera3D.normal, OrthographicCamera3D.normal);

      var f = dot1 / dot2;

      var proj = new Vector3D(this.x + f * OrthographicCamera3D.normal.x, this.y + f * OrthographicCamera3D.normal.y, this.z + f * OrthographicCamera3D.normal.z);


      var v2 = Vector3D.difference(v, proj);

      var final = new Point3D(this.x + v2.x, this.y + v2.y, this.z + v2.z);

      projected_points[i] = final;

    }

    this.rotatePointsX(projected_points, this.rotation.x);

    return projected_points;

  }

  rotatePointsX(points, a) {

    var c = Math.cos(a);
    var s = Math.sin(a);

    for (var i = points.length - 1; i > -1; -- i) {

      var p = points[i]; // selected point

      //p.translate(-this.x, -this.y, -this.z);

      var y = p.y * c - p.z * s;
      p.z   = p.y * s + p.z * c;

      p.y = y;

      //p.translate(this.x, this.y, this.z);

    }

  }

}

OrthographicCamera3D.normal = new Vector3D(0, 0, -1);