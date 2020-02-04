class Display {

  constructor(canvas) {

    this.buffer = document.createElement("canvas").getContext("2d", { alpha:false });
    this.output = canvas.getContext("2d", { alpha:false });

    this.width = this.height = undefined;

    this.startResize = (event) => { this.resize(event); };

  }

  clear() {

    this.buffer.fillStyle = "#d8eeff";
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);

  }

  drawImage(canvas, x0, y0, w0, h0, x1, y1, w1, h1) {

    this.buffer.drawImage(canvas, x0, y0, w0, h0, x1, y1, w1, h1);

  }

  drawTile(x, y, tile) {

    this.buffer.lineWidth = 1;

    var color1 = Math.floor((tile.height / tile.max_height) * 256);
    var color2 = color1;
    var color3 = Math.floor(color1 * 0.9);

    if (tile.tilted_height != 0) {

      // left side
      this.buffer.fillStyle = this.buffer.strokeStyle = "rgb("+color2+","+color2+",0)";
      this.buffer.beginPath();
      this.buffer.moveTo(x, y + tile.half_tilted_depth);
      this.buffer.lineTo(x + tile.half_width, y + tile.tilted_depth);
      this.buffer.lineTo(x + tile.half_width, y + tile.tilted_depth + tile.tilted_height);
      this.buffer.lineTo(x, y + tile.half_tilted_depth + tile.tilted_height);
      this.buffer.closePath();
      this.buffer.fill();
      //this.buffer.stroke();

      // right side
      this.buffer.fillStyle = this.buffer.strokeStyle = "rgb("+color3+","+color3+",0)";
      this.buffer.beginPath();
      this.buffer.moveTo(x + tile.half_width, y + tile.tilted_depth);
      this.buffer.lineTo(x + tile.width, y + tile.half_tilted_depth);
      this.buffer.lineTo(x + tile.width, y + tile.half_tilted_depth + tile.tilted_height);
      this.buffer.lineTo(x + tile.half_width, y + tile.tilted_depth + tile.tilted_height);
      this.buffer.closePath();
      this.buffer.fill();
      //this.buffer.stroke();

    }

    // top 
    if (tile.height < 16) this.buffer.fillStyle = this.buffer.strokeStyle = "#0000c0";
    else this.buffer.fillStyle = this.buffer.strokeStyle = "rgb(0,"+color1+",0)";
    this.buffer.beginPath();
    this.buffer.moveTo(x, y + tile.half_tilted_depth);
    this.buffer.lineTo(x + tile.half_width, y);
    this.buffer.lineTo(x + tile.width, y + tile.half_tilted_depth);
    this.buffer.lineTo(x + tile.half_width, y + tile.tilted_depth);
    this.buffer.closePath();
    this.buffer.fill();
    this.buffer.stroke();

  }

  set fillStyle(color) {

    this.buffer.fillStyle = color;

  }

  fillRect(x, y, width, height) {

    this.buffer.fillRect(x, y, width, height);

  }

  render() {

    this.output.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.output.canvas.width, this.output.canvas.height);

  }

  resize(event) {

    var screen_width  = document.documentElement.clientWidth;
    var screen_height = document.documentElement.clientHeight;

    var width_ratio = screen_width / this.buffer.canvas.width;
    var height_ratio = screen_height / this.buffer.canvas.height;


    if (width_ratio < height_ratio) {

      this.output.canvas.width  = screen_width; 
      this.output.canvas.height = this.buffer.canvas.height * width_ratio;

    } else {

      this.output.canvas.width  = this.buffer.canvas.width * height_ratio;
      this.output.canvas.height = screen_height;

    }

    this.output.imageSmoothingEnabled = false;

  }

  resizeBuffer(width, height) {

    this.width  = this.buffer.canvas.width  = width;
    this.height = this.buffer.canvas.height = height;

    this.buffer.imageSmoothingEnabled = false;

  }

  start() {

    window.addEventListener("resize", this.startResize);

    this.startResize();

  }

}