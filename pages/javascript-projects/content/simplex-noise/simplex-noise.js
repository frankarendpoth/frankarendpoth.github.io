(() => {

  var button  = document.querySelector("#button");
  var context = document.getElementById("canvas").getContext("2d", { alpha:false });

  var simplex_noise_1d = new SimplexNoise1D(100, Math.random());
  var simplex_noise_2d1 = new SimplexNoise2D(5, Math.random());
  var simplex_noise_2d2 = new SimplexNoise2D(300, Math.random());

  var offset_x = 0;
  var offset_x_speed = 0;
  var offset_y = 0;
  var offset_y_speed = 0;

  function render() {

    switch(button.innerText) {

      case "SimplexNoise1D":

        context.fillStyle = "#000000";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        context.fillStyle = "#404040";

        // draw horizontal line (amplitude = 0)
        context.fillRect(0, context.canvas.height * 0.5 - 1, context.canvas.width, 2);

        for (var x = 0; x < context.canvas.width; x ++) {

          var y = simplex_noise_1d.getValue(x + offset_x) * 100 + context.canvas.height * 0.5;

          if (-(Math.floor(offset_x) + x) % simplex_noise_1d.frequency == 0) {
            
            context.fillStyle = "#404040";
            context.fillRect(x - 1, 0, 2, context.canvas.height);

          }
          
          context.fillStyle = "#ffffff";
          context.fillRect(x - 1, y - 1, 2, 2);



        } break;

      case "SimplexNoise2D":

        var wsize = 32;
        var hsize = 16;

        for (var y = 0; y < context.canvas.height / hsize; y ++) {

          var oy = y + Math.floor(offset_y);
          var my = (y + Math.floor(offset_y) - offset_y) * hsize;

          var mxo;

          for (var x = 0; x < context.canvas.width / wsize; x ++) {

            var ox = x + Math.floor(offset_x);
            var mx = (x + Math.floor(offset_x) - offset_x) * wsize;

            var color = Math.floor(simplex_noise_2d1.getValue(ox, oy) * 128) + 128;

            context.fillStyle = "rgb("+color+","+color+","+color+")";
            context.fillRect(mx, my, wsize, hsize);

          }

        }

    }

  }

  function cycle() {

    window.requestAnimationFrame(cycle);

    offset_x += offset_x_speed;
    offset_y += offset_y_speed;

    render();

  }

  function click(event) {

    switch(this.innerText) {

      case "SimplexNoise1D": this.innerText = "SimplexNoise2D"; break;
      case "SimplexNoise2D": this.innerText = "SimplexNoise1D";

    }

  }

  function mouseMove(event) { event.preventDefault();

    var vector_x = event.clientX - context.canvas.width * 0.5;
    var vector_y = event.clientY - context.canvas.height * 0.5;

    offset_x_speed = vector_x * 0.005;
    offset_y_speed = vector_y * 0.005;
  
  }

  function resize(event) {

    context.canvas.height = document.documentElement.clientHeight;
    context.canvas.width  = document.documentElement.clientWidth;

    render();
  
  }

  window.addEventListener("resize", resize);

  window.addEventListener("mousemove", mouseMove);

  button.addEventListener("click", click);

  resize();

  cycle();

})();