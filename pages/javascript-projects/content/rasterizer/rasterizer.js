// 2019-04-18

(() => {

	function Vector2D(x, y) {
  
  	this.x = x;
    this.y = y;
  
  }

	function LineSegment2D(x1, y1, x2, y2) {
  
  	this.point1 = new Point2D(x1, y1);
    this.point2 = new Point2D(x2, y2);
  
  }
  
  function Point2D(x, y) {
  
  	this.x = x;
    this.y = y;
  
  }
  
  function Rasterizer() {}
  
  Rasterizer.prototype = {
  
    // Clears the specified array to the specified color values:
    clear:function(array, r, g, b, a = 255) {
    
    	for (var i = array.length - 1; i > -1; i -= 4) {
      	
        array[i]     = a;
        array[i - 1] = b;
        array[i - 2] = g;
        array[i - 3] = r;
      
      }
    
    },

    plotLineSegment:function(array, array_width, x1, y1, x2, y2, r, g, b, a = 255) {

    },
    
    // Plots any line segment with the specified color:
    plotLineSegment:function(array, array_width, x1, y1, x2, y2, r, g, b, a = 255) {

      // The actual x, y position of the line to plot starting at the first point of the segment:
      var x = x1;
      var y = y1;
      // The rounded x, y position of the line to plot needed for rasterization:
    	var x_plot;
      var y_plot;
    	// The actual rise and run of the line segment:
    	var rise = y2 - y1;
      var run  = x2 - x1;
      // The absolution rise and run of the line segment:
      var abs_rise = Math.abs(rise);
      var abs_run  = Math.abs(run);
      
      // The current increment or cycle of our plotting loop. The plotter will start at x, y and gradually move by x_increment and y_increment until the line is completely drawn.
      var increment = 0;
      // The total number of increments or cycles that need to be taken in order to draw the line:
      var total_increments;
      // The distance to move the actual x, y position of the plotter on each increment or cycle. These values should be at least 0 and at most 1.
    	var x_increment;
      var y_increment;
      
      if (abs_rise == 0) { // Horizontal line
      
        total_increments = abs_run;
        x_increment      = run / abs_run;
        y_increment      = 0;
      
      } else if (abs_run == 0) { // Vertical line
      
        total_increments = abs_rise;
      	x_increment      = 0;
      	y_increment      = rise / abs_rise;
      
      } else { // Sloped line
      
      	if (abs_rise > abs_run) { // y changes faster than x
      
          total_increments = abs_rise;
          y_increment      = rise / abs_rise;
          x_increment      = run  / abs_rise;

        } else { // x changes faster than or equal to y

          total_increments = abs_run;
          y_increment      = rise / abs_run;
          x_increment      = run  / abs_run;

        }
        
      }

      // plot all the points along the line:
      do {

        // Rasterize the current x, y position along the line to be plotted:
        x_plot = Math.floor(x + 0.5);
        y_plot = Math.floor(y + 0.5);

        // Get the index to plot at in the array:
        var i = (y_plot * array_width + x_plot) * 4;
        
        // Plot the point in the specified array:
        array[i]     = r;
        array[i + 1] = g;
        array[i + 2] = b;
        array[i + 3] = a;

        y += y_increment;
        x += x_increment;

        // Prepare for the next cycle
        increment ++;

      } while(increment < total_increments);
      
    },

    // Plots the specified point with the specified color:
  	plotPoint:function(array, array_width, x, y, r, g, b, a = 255) {
    
    	var index = (Math.floor(y + 0.5) * array_width + Math.floor(x + 0.5)) * 4;
    	
      array[index]     = r;
      array[index + 1] = g;
      array[index + 2] = b;
      array[index + 3] = a;
    
    },

    plotRectangle:function(array, array_width, x, y, width, height, r, g, b, a = 255) {

      var x_start = Math.floor(x + 0.5);
      var x_end   = x_start + Math.floor(width);
      var y_start = Math.floor(y + 0.5);
      var y_end   = y_start + Math.floor(height);

      for (var x_plot = x_start; x_plot < x_end; x_plot ++) {

        for (var y_plot = y_start; y_plot < y_end; y_plot ++) {

          var i = (y_plot * array_width + x_plot) * 4;

          array[i]     = r;
          array[i + 1] = g;
          array[i + 2] = b;
          array[i + 3] = a;

        }

      }

    },

    plotTriangle:function(array, array_width, x1, y1, x2, y2, x3, y3, r, g, b, a = 255) {

      var tx, ty, mx, my, bx, by;

      // First we have to sort the points from highest to lowest:
      if (y1 < y2) {

        mx = Math.floor(x2 + 0.5);
        my = Math.floor(y2 + 0.5);
        tx = Math.floor(x1 + 0.5);
        ty = Math.floor(y1 + 0.5);

      } else {

        mx = Math.floor(x1 + 0.5);
        my = Math.floor(y1 + 0.5);
        tx = Math.floor(x2 + 0.5);
        ty = Math.floor(y2 + 0.5);

      }

      if (y3 < ty) {

        bx = mx;
        by = my;
        mx = tx;
        my = ty;
        tx = Math.floor(x3 + 0.5);
        ty = Math.floor(y3 + 0.5);

      } else if (y3 < my) {

        bx = mx;
        by = my;
        mx = Math.floor(x3 + 0.5);
        my = Math.floor(y3 + 0.5);

      } else {

        bx = Math.floor(x3 + 0.5);
        by = Math.floor(y3 + 0.5);

      }

      var interval_tm_x = mx - tx;
      var interval_tm_y = my - ty || 1;
      var interval_mb_x = bx - mx;
      var interval_mb_y = by - my || 1;
      var interval_tb_x = bx - tx;
      var interval_tb_y = by - ty || 1;

      var interval_x_start = tx;
      var interval_x_stop  = tx;
      var interval_y_stop  = my;
      var increment_x_start;
      var increment_x_stop;

      var plot_y  = ty;
      var plot_x;

      var m_lt_b;

      if (interval_tm_x * interval_tb_y - interval_tm_y * interval_tb_x < 0) {
        
        m_lt_b = true;

        increment_x_start = interval_tm_x / interval_tm_y;
        increment_x_stop  = interval_tb_x / interval_tb_y;

      } else {

        increment_x_start = interval_tb_x / interval_tb_y;
        increment_x_stop  = interval_tm_x / interval_tm_y;
        
        m_lt_b = false;

      }

      output.innerText  = "x_start: " + increment_x_start + "\n";
      output.innerText += "x_stop:  " + increment_x_stop;
      output.innerText += "\n m_lt_b: " + m_lt_b;

      var i;

      for (var c = 0; c < 2; c ++) {

        do {

          plot_x = Math.floor(interval_x_start + 0.5);
  
          do {
  
            i = (plot_y * array_width + plot_x) * 4;
  
            array[i]     = r;
            array[i + 1] = g;
            array[i + 2] = b;
            array[i + 3] = a;
  
            plot_x ++;
  
          } while(plot_x < interval_x_stop);
  
          plot_y ++;
          interval_x_start += increment_x_start;
          interval_x_stop  += increment_x_stop;
  
        } while(plot_y < interval_y_stop);
  
        if (m_lt_b) increment_x_start = interval_mb_x / interval_mb_y;
        else        increment_x_stop  = interval_mb_x / interval_mb_y;

        interval_y_stop = by;

      }

    }
     
  };

  var context = document.querySelector("canvas").getContext("2d", { alpha:false });
  
  var output = document.querySelector("p");
  
  var mouse = { x:0, y:0 };
  
  var rasterizer = new Rasterizer();
  
  var r = 255;
  var g = 255;
  var b = 0;
  var a = 255;
  
  var buffer = new Uint8ClampedArray(context.canvas.width * context.canvas.height * 4);
  var image_data = new ImageData(buffer, context.canvas.width);
  
  function loop() {
  
  	window.requestAnimationFrame(loop);
    
    r += 1;
    if (r > 255) r = 0;
    b -= 1;
    if (b < 0) b = 255;
    
    rasterizer.clear(buffer, r, g, b, a);
    
    rasterizer.plotPoint(buffer, context.canvas.width, 50, 150, 0, 0, 0, 255);
    
    rasterizer.plotRectangle(buffer, context.canvas.width, 150, 150, 20, 20, 0, 128, 0, 128);

    rasterizer.plotTriangle(buffer, context.canvas.width, 210, 210, mouse.x, mouse.y, 260, 310, 0, 128, 128, 0);

    rasterizer.plotLineSegment(buffer, context.canvas.width, 200, 200, 250, 300, 255, 0, 0, 255);
    
    render();
  
  }
  
  function render() {
  
  	context.putImageData(image_data, 0, 0);
  
  }

  function resize(event) {

    context.canvas.width  = document.documentElement.clientWidth;
    context.canvas.height = document.documentElement.clientHeight;

    buffer = new Uint8ClampedArray(context.canvas.width * context.canvas.height * 4);
    image_data = new ImageData(buffer, context.canvas.width);

  }
  
  function mouseMove(event) {
  
  	mouse.x = event.clientX;
    mouse.y = event.clientY;
  
  }
  
  window.addEventListener("mousemove", mouseMove);
  window.addEventListener("resize", resize);

  resize();
  
  loop();

})();
