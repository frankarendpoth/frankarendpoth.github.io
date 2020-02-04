class SimplexNoise2D {

  constructor(frequency, seed) {

    this.frequency = frequency;
    this.seed      = seed;

  }

  // returns the amount required to scale a grid triangle's side into a grid square's diagonal.
  static get SKEW_FACTOR() {

    // sqrt(3)
    return 1.7320508076;

  }

  static get SKEW_FACTOR2() {

    // 1/sqrt(3)
    return 0.57735026919;

  }

  static get HEIGHT() {

    return 0.7071067811;

  }

  static get HEIGHT_SQUARED() {

    // (sqrt(2) / 2) * (sqrt(2) / 2)
    return 0.7071067811 * 0.7071067811;

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

  static get GRADIENTS() {

    return [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]];

  }

  getGradient(x, y) {

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

    //var gradients = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]];

    //var gradient = gradients[Math.abs(Math.floor((x + y)) % 8)];

    //return { x: gradient[0], y: gradient[1] };

    return { x: Math.cos(x + y) * SimplexNoise2D.HEIGHT, y: Math.sin(x + y) * SimplexNoise2D.HEIGHT };

    //return Math.sin(x + y);

  }

  getValue(x, y) {

    //console.log("----------------\ninput: " + x + ", " + y);

    // First we have to skew x, y into square grid coordinates.

    var projected_xy = (x + y) * 0.5;
    var skewed_xy    = projected_xy * SimplexNoise2D.SKEW_FACTOR;
    var vector_xy    = skewed_xy - projected_xy;
    var skewed_x     = x + vector_xy;
    var skewed_y     = y + vector_xy;
    var grid_left    = Math.floor(skewed_x / this.frequency);
    var grid_top     = Math.floor(skewed_y / this.frequency);
    var local_x      = (skewed_x - grid_left * this.frequency) / this.frequency;
    var local_y      = (skewed_y - grid_top * this.frequency) / this.frequency;

    //console.log("\ngrid_x: " + grid_left + "\ngrid_y: " + grid_top);
    //console.log("skewed_x: " + input_x + "\nskewed_y: " + input_y);

    /*var gradient1 = this.getGradient(grid_left, grid_top);
    var gradient2 = this.getGradient(grid_left + 1, grid_top + 1);
    var gradient3;*/

    var gradient1 = this.getGradient(grid_left, grid_top);
    var gradient2 = this.getGradient(grid_left + 1, grid_top + 1);
    var gradient3;

    var point1 = { x:0, y:0 };
    var point2 = SimplexNoise2D.BOTTOM_RIGHT;
    var point3;

    if (local_x > local_y) { // top right

      gradient3 = this.getGradient(grid_left + 1, grid_top);
      point3    = SimplexNoise2D.TOP_RIGHT;
    
    } else { // bottom left

      gradient3 = this.getGradient(grid_left, grid_top + 1);
      point3    = SimplexNoise2D.BOTTOM_LEFT;

    }

    //console.log("p1: " + point1.x + ", " + point1.y + "\np2: " + point2.x + ", " + point2.y + "\np3: " + point3.x + ", " + point3.y + "\ng1: " + gradient1.x + ", " + gradient1.y + "\ng2: " + gradient2.x + ", " + gradient2.y + "\ng3: " + gradient3.x + ", " + gradient3.y);

    // Don't forget to unskew x, y!

    projected_xy = (local_x + local_y) * 0.5;
    skewed_xy    = projected_xy * SimplexNoise2D.SKEW_FACTOR2;
    vector_xy    = skewed_xy - projected_xy;
    
    local_x += vector_xy;
    local_y += vector_xy;

    //console.log("unskewed: " + input_x + ", " + input_y);

    var vector1 = { x: local_x - point1.x, y: local_y - point1.y };
    var vector2 = { x: local_x - point2.x, y: local_y - point2.y };
    var vector3 = { x: local_x - point3.x, y: local_y - point3.y };

    var dot1 = vector1.x * gradient1.x + vector1.y * gradient1.y;
    var dot2 = vector2.x * gradient2.x + vector2.y * gradient2.y;
    var dot3 = vector3.x * gradient3.x + vector3.y * gradient3.y;

    // don't forget to trim these dots!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    var c1, c2, c3;

    if (dot1 > SimplexNoise2D.HEIGHT_SQUARED) c1 = 0;
    else c1 = 1 - (dot1 / SimplexNoise2D.HEIGHT_SQUARED);

    if (dot2 > SimplexNoise2D.HEIGHT_SQUARED) c2 = 0;
    else c2 = 1 - (dot2 / SimplexNoise2D.HEIGHT_SQUARED);

    if (dot3 > SimplexNoise2D.HEIGHT_SQUARED) c3 = 0;
    else c3 = 1 - (dot3 / SimplexNoise2D.HEIGHT_SQUARED);

    return (c1 + c2 + c3) / 3;

  }

}