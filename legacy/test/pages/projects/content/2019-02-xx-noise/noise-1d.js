class Noise1D {

  constructor(wavelength, seed) {
    this.wavelength = wavelength;
    this.seed = seed;

  }

  getNoise(x) {

    var left  = Math.floor(x / this.wavelength) * this.wavelength;
    var right = left + this.wavelength;

    var y1 = this.getValue(left);
    var y2 = this.getValue(right);

    var offset = (x - left) / this.wavelength;

    return this.interpolate(y1, y2, offset);

  }

  getNoiseMap(left, right) {

    var map = new Array(right - left);

    for (var x = left; x < right; x ++) {

      map[x] = this.getNoise(x);

    }

  }

  getValue(x) {

    x *= x * this.seed;

    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    
    return x * 4.656612875245797e-10; // 1/2147483647

  }

  interpolate(value1, value2, amount) {

    amount = amount * amount * (3 - 2 * amount);

    return (1 - amount) * value1 + amount * value2;
  
  }

}