class Tile {

  constructor() {

    this.canvas = document.createElement("canvas");
  }

  draw(width, height, tilted_height, tilted_depth, max_height) {

    var context = this.canvas.getContext("2d", { alpha:true });

    this.canvas.width  = width;
    this.canvas.height = Math.ceil(tilted_height + tilted_depth);

    context.lineWidth = 1.1;

    context.imageSmoothingEnabled = false;

    var color1 = Math.floor((height / max_height) * 256);
    var color2 = color1;
    var color3 = Math.floor(color1 * 0.9);

    if (tilted_height != 0) {

      // left side
      context.fillStyle = context.strokeStyle = "rgb("+color2+","+color2+",0)";
      context.beginPath();
      context.moveTo(0, tilted_depth * 0.5);
      context.lineTo(width * 0.5, tilted_depth);
      context.lineTo(width * 0.5, tilted_depth + tilted_height);
      context.lineTo(0, tilted_depth * 0.5 + tilted_height);
      context.closePath();
      context.fill();
      context.stroke();

      // right side
      context.fillStyle = context.strokeStyle = "rgb("+color3+","+color3+",0)";
      context.beginPath();
      context.moveTo(width * 0.5, tilted_depth);
      context.lineTo(width, tilted_depth * 0.5);
      context.lineTo(width, tilted_depth * 0.5 + tilted_height);
      context.lineTo(width * 0.5, tilted_depth + tilted_height);
      context.closePath();
      context.fill();
      context.stroke();

    }

    // top 
    if (height < 16) context.fillStyle = context.strokeStyle = "#0000c0";
    else context.fillStyle = context.strokeStyle = "rgb(0,"+color1+",0)";
    context.beginPath();
    context.moveTo(0, tilted_depth * 0.5);
    context.lineTo(width * 0.5, 0);
    context.lineTo(width, tilted_depth * 0.5);
    context.lineTo(width * 0.5, tilted_depth);
    context.closePath();
    context.fill();
    context.stroke();

  }

}