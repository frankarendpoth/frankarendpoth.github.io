class SimplexNoise2D {

  constructor(frequency, seed) {

    this.frequency = frequency;
    this.seed = seed;

  }

  static get HEIGHT() {
    
    // sqrt(2) / 2
    return 0.70710678118;
  
  }

  static get HEIGHT_SQUARED() {

    // (sqrt(2) / 2) * (sqrt(2) / 2)
    return 0.5;

  }

  static get RATIO() {
    
    // sqrt(2) / sqrt(3) / sqrt(2)
    return 0.57735026919;
  
  }
  
  static get BOTTOM_LEFT() {
    
    // x = 0.5 * sqrt(2) / sqrt(3) / sqrt(2) - 0.5
    // y = 0.5 * sqrt(2) / sqrt(3) / sqrt(2) + 0.5
    return { x: -0.2113248654, y: 0.78867513459};

  };

  static get BOTTOM_RIGHT() {
  
    // Side of equilateral / Hypotenuse of grid square's isoscelese triangles
    // x = sqrt(2) / sqrt(3) / sqrt(2)
    // y = sqrt(2) / sqrt(3) / sqrt(2)
    return { x: 0.57735026919, y: 0.57735026919};
  
  };
  static get TOP_RIGHT() { 
    
    // x: 0.5 * sqrt(2) / sqrt(3) / sqrt(2) + 0.5
    // y: 0.5 * sqrt(2) / sqrt(3) / sqrt(2) - 0.5
    return { x: 0.78867513459, y: -0.2113248654};
  
  };

  getValue(x, y) {

    // get the period we are in and get x, y in unit size between 0 and 1
    var period_x = Math.floor(x / this.frequency);
    var period_y = Math.floor(y / this.frequency);
    var unit_x = (x - period_x * this.frequency) / this.frequency;
    var unit_y = (y - period_y * this.frequency) / this.frequency;

    // get the three points on our simplex
    var point1 = { x:0, y:0 };
    var point2 = SimplexNoise2D.BOTTOM_RIGHT;
    var point3; // The third point is determined below

    var height1 = this.getHeight(period_x, period_y);
    var height2 = this.getHeight(period_x + 1, period_y + 1);
    var height3; // The third height is determined below

    // figure out the third point based on x's and y's location within the grid
    if (unit_x > unit_y) {
      
      point3 = SimplexNoise2D.TOP_RIGHT;
      height3 = this.getHeight(period_x + 1, period_y);

    } else {
      
      point3 = SimplexNoise2D.BOTTOM_LEFT;
      height3 = this.getHeight(period_x, period_y + 1);

    }

    // Start getting the scaled version of unit_x and unit_y
    var projection_xy = (unit_x + unit_y) / 2; // 2 is the sum of 1 and 1
    var scale_xy = projection_xy * SimplexNoise2D.RATIO;
    var vector_xy = scale_xy - projection_xy;

    // Scale unit x, y
    unit_x += vector_xy;
    unit_y += vector_xy;

    // Get the three vectors to the scaled unit x, y
    var vector1 = { x: unit_x - point1.x, y: unit_y - point1.y };
    var vector2 = { x: unit_x - point2.x, y: unit_y - point2.y };
    var vector3 = { x: unit_x - point3.x, y: unit_y - point3.y };

    var dot1 = vector1.x * vector1.x + vector1.y * vector1.y;
    var dot2 = vector2.x * vector2.x + vector2.y * vector2.y;
    var dot3 = vector3.x * vector3.x + vector3.y * vector3.y;

    var c1;
    var c2;
    var c3;

    if (dot1 > SimplexNoise2D.HEIGHT) c1 = 0;
    else c1 = height1 * (1 - dot1 / SimplexNoise2D.HEIGHT);

    if (dot2 > SimplexNoise2D.HEIGHT) c2 = 0;
    else c2 = height2 * (1 - dot2 / SimplexNoise2D.HEIGHT);

    if (dot3 > SimplexNoise2D.HEIGHT) c3 = 0;
    else c3 = height3 * (1 - dot3 / SimplexNoise2D.HEIGHT);

    return (c1 + c2 + c3) / 3;

  }

  getHeight(x, y) {

    x += this.seed;
    x *= x;

    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;

    y += this.seed;
    y *= y * x * x;

    y ^= y << 13;
    y ^= x >> 17;
    y ^= y << 5;

    return Math.sin(x + y);

  }

  interpolate(value1, value2, amount) {

    var u = value1 * value1 * (3.0 - 2.0 * value1);

    return (value1 * (1 - u) + value2 * u);

  }

}