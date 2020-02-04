class SimplexNoise1D {

  constructor(frequency, seed) {

    this.frequency = frequency;
    this.seed = seed;

  }

  getValue(x) {

    var period = Math.floor(x / this.frequency);
    var unit_x = (x - period * this.frequency) / this.frequency;
    var slope1 = this.getHeight(period) * unit_x;
    var slope2 = (unit_x - 1) * this.getHeight(period + 1);

    var u = unit_x * unit_x * (3.0 - 2.0 * unit_x);

    return (slope1 * (1 - u) + slope2 * u);

  }

  getHeight(x) {

    x += this.seed;
    x *= x;

    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;

    return Math.sin(x);

  }

}