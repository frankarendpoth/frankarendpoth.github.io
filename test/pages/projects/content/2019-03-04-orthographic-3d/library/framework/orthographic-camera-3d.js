class OrthographicCamera3D extends Point3D {

  constructor(x, y, z, w, h) {

    super(x, y, z);

    this.rotation = new Vector3D(Math.PI * 0.25, Math.PI * 0.25, 0);

    this.width  = w;
    this.height = h;

  }

  backFace(face) {

    var p0 = face.vertices[0];

    var v1 = Vector3D.difference(face.vertices[1], p0);
    var v2 = Vector3D.difference(face.vertices[2], p0);

    var c = Vector3D.crossProduct(v1, v2);

    if (Vector3D.dotProduct(c, OrthographicCamera3D.normal) < 0) return false;
    
    return true;

  }

  projectFace(face) {

    face.translate(-this.x, -this.y, -this.z);

    face.rotateX(this.rotation.x);
    face.rotateY(this.rotation.y);

  }

  projectPoints(points) {

    var projected_points = new Array(points.length);

    for (var i = points.length - 1; i > -1; -- i) {

      var p = Point3D.clone(points[i]);

      p.translate(-this.x, -this.y, -this.z);

      Point3D.rotateY(p, this.rotation.y);
      Point3D.rotateX(p, this.rotation.x);
      //Point3D.rotateY(p, this.rotation.y);
      //Point3D.rotateZ(p, this.rotation.z);

      //p.translate(this.x, this.y, this.z);

      projected_points[i] = p;

    }

    return projected_points;

  }

}

OrthographicCamera3D.normal = new Vector3D(0, 0, -1);