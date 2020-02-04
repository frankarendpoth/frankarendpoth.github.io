class Color {

  constructor(r, g, b) {

    this.r = r;
    this.g = g;
    this.b = b;

  }

  getCSSString() {

    return "rgb(" + this.r + "," + this.g + "," + this.b +")";

  }

  static interpolateColor(color1, color2, amount) {

    var color = new Color();

    color.r = Color.interpolate(color1.r, color2.r, amount);
    color.g = Color.interpolate(color1.g, color2.g, amount);
    color.b = Color.interpolate(color1.b, color2.b, amount);

    return color;

  }

  static interpolate(value1, value2, amount) {

    return Math.floor((1 - amount) * value1 + amount * value2);
  
  }

}