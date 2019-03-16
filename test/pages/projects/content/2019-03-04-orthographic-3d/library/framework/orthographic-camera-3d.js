class OrthographicCamera3D extends Point3D {

  constructor(x, y, z, w, h, canvas) {

    super(x, y, z);

    this.rotation = new Vector3D(-Math.PI * 0.25, Math.PI * 0.25, 0);

    this.ratio = w / h;

    this.width  = w;
    this.height = h;

    this.context = canvas.getContext("2d", { alpha:false });

    canvas.width  = w;
    canvas.height = h;

  }

  backFace(face) {

    var p0 = face.vertices[0];

    var v1 = Vector3D.difference(face.vertices[1], p0);
    var v2 = Vector3D.difference(face.vertices[2], p0);

    var c = Vector3D.crossProduct(v1, v2);

    if (Vector3D.dotProduct(c, OrthographicCamera3D.normal) <= 0) return false;
    
    return true;

  }

  projectFace(face) {

    face.translate(-this.x, -this.y, -this.z);

    face.rotateX(this.rotation.x);
    face.rotateY(this.rotation.y);

  }

  resizeCanvas(width, height, scale, image_smoothing_enabled = false) {

    var ratio = width / height;

    this.scale = scale;

    if (this.ratio < ratio) width = height * this.ratio;
    else height = width / this.ratio;
    
    this.height = this.context.canvas.height = height;
    this.width  = this.context.canvas.width  = width;

    this.context.imageSmoothingEnabled = image_smoothing_enabled;

  }

}

OrthographicCamera3D.normal = new Vector3D(0, 0, -1);