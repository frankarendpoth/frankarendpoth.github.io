class Display {

  constructor(canvas) {

    this.buffer = document.createElement("canvas").getContext("2d", { alpha:false });
    this.buffer_h = this.buffer_w = undefined;

    this.canvas = canvas.getContext("2d", { alpha:false });
    this.canvas_h = this.canvas_w = undefined;

  }

  render() {

    this.canvas.drawImage(this.buffer.canvas, 0, 0, this.buffer_w, this.buffer_h, 0, 0, this.canvas_w, this.canvas_h);

  }

  // w = width, h = height, s = image smoothing
  resizeBuffer(w, h, s = false) {

    this.buffer_h = this.buffer.canvas.height = h;
    this.buffer_w = this.buffer.canvas.width  = w;

    this.buffer.imageSmoothingEnabled = s;

  }

  // w = width, h = height, s = image smoothing
  resizeCanvas(w, h, s = false) {

    var ratio = this.buffer_w / this.buffer_h;

    if (h / this.buffer_h < w / this.buffer_w) w = h * ratio;
    else h = w / ratio;
    
    this.canvas_h = this.canvas.canvas.height = h;
    this.canvas_w = this.canvas.canvas.width  = w;

    this.canvas.imageSmoothingEnabled = s;

  }

}