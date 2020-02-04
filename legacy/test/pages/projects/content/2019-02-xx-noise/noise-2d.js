class Noise2D {

  constructor(wavelength, seed) {

    this.wavelength = wavelength;
    this.seed = seed;

  }

  getNoise(x, y) {

    x = Math.abs(x);
    y = Math.abs(y);

    var left   = Math.floor(x / this.wavelength) * this.wavelength;
    var right  = left + this.wavelength;
    var top    = Math.floor(y / this.wavelength) * this.wavelength;
    var bottom = top + this.wavelength;

    var lt = this.getValue(left, top); // left top z
    var rt = this.getValue(right, top); // right top z
    var lb = this.getValue(left, bottom); // left bottom z
    var rb = this.getValue(right, bottom); // right bottom z

    var olr = (x - left) / this.wavelength; // offset left to right
    var otb = (y - top) / this.wavelength; // offset top to bottom
    var itlr = this.interpolate(lt, rt, olr);
    var irtb = this.interpolate(rt, rb, otb);
    var iblr = this.interpolate(lb, rb, olr);
    var iltb = this.interpolate(lt, lb, otb);

    var ix = this.interpolate(iltb, irtb, olr);
    var iy = this.interpolate(itlr, iblr, otb);

    return (ix + iy) * 0.5;

  }

  getNoiseMap(left, right, top, bottom) {

    var columns = right - left;
    var rows    = bottom - top;
    var map = new Array(columns * rows);

    for (var x = 0; x < columns; x ++) {

      for (var y = 0; y < rows; y ++) {

        map[y * columns + x] = this.getNoise(left + x, top + y);

      }

    }

    return map;

  }

  getValue(x, y) {

    x *= y + this.seed;
    y *= x + this.seed;

    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;

    y ^= y << 13;
    y ^= y >> 17;
    y ^= y << 5;
    
    return (x + y) * 0.5 * 4.656612875245797e-10;

  }

  interpolate(value1, value2, amount) {

    amount = amount * amount * (3 - 2 * amount);

    return (1 - amount) * value1 + amount * value2;
  
  }

}