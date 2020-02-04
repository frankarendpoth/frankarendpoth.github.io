(() => {

  var button  = document.querySelector("#button");
  var context = document.getElementById("canvas").getContext("2d", { alpha:false });

  var random1 = Math.random() * 4294967294 - 2147483647;
  var random2 = Math.random() * 4294967294 - 2147483647;
  var random3 = Math.random() * 4294967294 - 2147483647;
  var random4 = Math.random() * 4294967294 - 2147483647
  var random5 = Math.random() * 4294967294 - 2147483647

  var noise1d1 = new Noise1D(8, random1);
  var noise1d2 = new Noise1D(40, random2);
  var noise1d3 = new Noise1D(200, random3);
  var noise1d4 = new Noise1D(400, random4);
  var noise1d5 = new Noise1D(800, random5);

  var noise2d1 = new Noise2D(8, random1);
  var noise2d2 = new Noise2D(80, random2);
  var noise2d3 = new Noise2D(800, random3);
  var noise2d4 = new Noise2D(1600, random4);
  var noise2d5 = new Noise2D(3200, random5);

  var offset_x = 0;
  var offset_x_speed = 0;
  var offset_y = 0;
  var offset_y_speed = 0;

  function render() {

    switch(button.innerText) {

      case "Noise1D":

        context.fillStyle = "#000000";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        context.fillStyle = "#ffffff";

        for (var x = 0; x < context.canvas.width; x ++) {

          var ox = x + offset_x;
    
          var y = (noise1d1.getNoise(ox) * 0.025 + noise1d2.getNoise(ox) * 0.1 + (noise1d3.getNoise(ox) * 0.5 + noise1d4.getNoise(ox) * 0.9) * noise1d5.getNoise(ox)) * 50;
    
          context.fillRect(x - 1, y + context.canvas.height * 0.5 - 1, 2, 2);
    
        } break;

      case "Noise2D":

        var size = 12;

        var gradients = [new Color(0, 0, 80), new Color(64, 96, 255), new Color(237, 201, 175), new Color(56, 102, 0), new Color(177, 255, 195)];
        var heights   = [0, 25, 40, 50, 224];

        for (var x = 0; x < context.canvas.width; x += size) {

          var ox = Math.floor((x + offset_x) / size) * size;
          var mx = -offset_x + Math.floor(offset_x / size) * size;

          for (var y = 0; y < context.canvas.height; y += size) {

            var oy = Math.floor((y + offset_y) / size) * size;
            var my = -offset_y + Math.floor(offset_y / size) * size;

            var height = Math.floor(noise2d1.getNoise(ox, oy) * 10) + Math.floor(noise2d2.getNoise(ox, oy) * 16) + Math.floor(noise2d3.getNoise(ox, oy) * 36) + Math.floor(noise2d4.getNoise(ox, oy) * 72) + Math.floor(noise2d5.getNoise(ox, oy) * 122);

            for (var c = 1; c < heights.length - 1; c ++) {

              if (height >= heights[c]) continue;
              break;

            }

            var c1 = gradients[c - 1];
            var c2 = gradients[c];
            var color = Color.interpolateColor(c1, c2, (height - heights[c - 1]) / (heights[c] - heights[c - 1]));

            context.fillStyle = color.getCSSString();
            context.fillRect(x + mx, y + my, size, size);

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

      case "Noise1D": this.innerText = "Noise2D"; break;
      case "Noise2D": this.innerText = "Noise1D";

    }

  }

  function mouseMove(event) { event.preventDefault();

    var vector_x = event.clientX - context.canvas.width * 0.5;
    var vector_y = event.clientY - context.canvas.height * 0.5;

    offset_x_speed = vector_x * 0.05;
    offset_y_speed = vector_y * 0.05;
  
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