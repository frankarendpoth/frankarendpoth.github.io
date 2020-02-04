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

  static get HEIGHT_SQUARED() {

    // sqrt(2) / 2
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

  // Takes x, y input and returns a pseudo-random value for height at that location.
  getHeight(x, y) {

    x *= y + this.seed;
    y *= x + this.seed;

    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;

    y ^= y << 13;
    y ^= y >> 17;
    y ^= y << 5;

    // Put the height in the range of -1 to 1
    return Math.sin(x + y);

  }

  getValue(x, y) {

    // First we have to skew x, y into square grid coordinates.

    // Project x, y along the diagonal vector, 1, 1
    var projected_xy = (x + y) * 0.5;
    // Skew it by the ratio between our triangle side length and diagonal length 
    var skewed_xy    = projected_xy * SimplexNoise2D.SKEW_FACTOR;
    // Get the vector between the projected and skewed point.
    var vector_xy    = skewed_xy - projected_xy;
    // Get the position of x, y in square grid coordinates
    var skewed_x     = x + vector_xy;
    var skewed_y     = y + vector_xy;
    // Get the Grid column and row
    var grid_left    = Math.floor(skewed_x / this.frequency);
    var grid_top     = Math.floor(skewed_y / this.frequency);
    // Get the local x, y coordinates inside the grid on a scale of 0 to 1
    var local_x      = (skewed_x - grid_left * this.frequency) / this.frequency;
    var local_y      = (skewed_y - grid_top * this.frequency) / this.frequency;

    // Get the heights of each point in our isoscelese triangle
    var height1 = this.getHeight(grid_left, grid_top);
    var height2 = this.getHeight(grid_left + 1, grid_top + 1);
    var height3;

    // Also get the points of our unit sized isoscelese triangle
    var point1 = { x:0, y:0 };
    var point2 = SimplexNoise2D.BOTTOM_RIGHT;
    var point3;

    // Which one of the isoscelese triangles is x, y in?
    if (local_x > local_y) { // top right

      height3 = this.getHeight(grid_left + 1, grid_top);
      point3    = SimplexNoise2D.TOP_RIGHT;
    
    } else { // bottom left

      height3 = this.getHeight(grid_left, grid_top + 1);
      point3    = SimplexNoise2D.BOTTOM_LEFT;

    }

    // Now scale back down to the equilateral coordinates
    // Project local x, y back onto the diagonal
    projected_xy = (local_x + local_y) * 0.5;
    // Skew it by the the inverse of the ratio between our two grids
    skewed_xy    = projected_xy * SimplexNoise2D.SKEW_FACTOR2;
    // Get the vector between the projected and skewed point
    vector_xy    = skewed_xy - projected_xy;
    // Move local x, y back to equilateral triangle grid coordinates, but keep in mind that it's still in unit sized space
    local_x += vector_xy;
    local_y += vector_xy;

    // Get the vectors from each point in the equilateral triangle to the local x, y position
    var vector1 = { x: local_x - point1.x, y: local_y - point1.y };
    var vector2 = { x: local_x - point2.x, y: local_y - point2.y };
    var vector3 = { x: local_x - point3.x, y: local_y - point3.y };

    // Get the length of each vector squared
    var dot1 = vector1.x * vector1.x + vector1.y * vector1.y;
    var dot2 = vector2.x * vector2.x + vector2.y * vector2.y;
    var dot3 = vector3.x * vector3.x + vector3.y * vector3.y;

    // The height contribution from each point
    var c1, c2, c3;

    if (dot1 >= SimplexNoise2D.HEIGHT_SQUARED) c1 = 0;
    else c1 = (1 - (dot1 / SimplexNoise2D.HEIGHT_SQUARED)) * height1;

    if (dot2 >= SimplexNoise2D.HEIGHT_SQUARED) c2 = 0;
    else c2 = (1 - (dot2 / SimplexNoise2D.HEIGHT_SQUARED)) * height2;

    if (dot3 >= SimplexNoise2D.HEIGHT_SQUARED) c3 = 0;
    else c3 = (1 - (dot3 / SimplexNoise2D.HEIGHT_SQUARED)) * height3;

    return (c1 + c2 + c3) * 0.7;

  }

}