// Frank Poth 12/27/2017

/* This program tests drawImage and putImageData efficiency. Basically, I run these
functions thousands of times and time them. After some tests it became pretty obvious
that drawImage is way faster, at least on my version of Chrome, anyway. The speed
difference increases with the number of tests performed, but drawImage still comes
out ahead. "Comes out ahead..." What is this, a horse race? */

(function() {

  var averages, buffer, display, drawImage, image, image_context, imageData, number_of_tests, test, ui;

  averages = [[], []];// Where the averages for each set of tests are stored.
  /* I do the testing on the buffer, but to make the image bigger I draw the final
  image to the display with drawImage, which automatically scales it up. Only the
  individual drawing methods are timed, however, so don't let this distract you. */
  buffer = document.createElement("canvas").getContext("2d");
  display = document.querySelector("canvas").getContext("2d");
  image = new Image();// Where the loaded image will be stored.
  image_context = document.createElement("canvas").getContext("2d");
  number_of_tests = 10000;// The default number of tests to run.

  drawImage = function() {

    buffer.drawImage(image_context.canvas, 0, 0, image_context.canvas.width, image_context.canvas.height, 0, 0, image_context.canvas.width, image_context.canvas.height);

  };

  imageData = function() {

    buffer.putImageData(image_context.getImageData(0, 0, image_context.canvas.width, image_context.canvas.height), 0, 0);

  };

  test = function(draw) {

    /* This is the test. The time is recorded before and after the draw functions
    are called and the difference is displayed to the user. */
    let count = 0;
    let start_time = window.performance.now();

    while(count < number_of_tests) {

      count ++;

      draw();

    }

    let accumulated_time = window.performance.now() - start_time;
    let data = "Number of tests (" + number_of_tests + "): " + accumulated_time + "ms<br>";

    if (draw == drawImage) {

      ui.draw_image_output.innerHTML = data + ui.draw_image_output.innerHTML;
      averages[0].push(accumulated_time);

      let number = 0;
      for (let index = averages[0].length - 1; index > -1; -- index) {

        number += averages[0][index];

      }

      number /= averages[0].length;

      ui.draw_image_average.innerHTML = (averages[0].length > 1) ? "Average (" + averages[0].length + " sets): " + number + " ms" : "Average (" + averages[0].length + " set): " + number + " ms";

    } else if (draw == imageData) {

      ui.image_data_output.innerHTML = data + ui.image_data_output.innerHTML;
      averages[1].push(accumulated_time);

      let number = 0;
      for (let index = averages[1].length - 1; index > -1; -- index) {

        number += averages[1][index];

      }

      number /= averages[1].length;

      ui.image_data_average.innerHTML = (averages[1].length > 1) ? "Average (" + averages[1].length + " sets): " + number + " ms" : "Average (" + averages[1].length + " set): " + number + " ms";

    }

    display.imageSmoothingEnabled = false;
    display.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, display.canvas.width, display.canvas.height);

  };

  ui = {

    draw_image_average:document.getElementById("draw-image-average"),
    draw_image_button:document.getElementById("draw-image-button"),
    draw_image_output:document.getElementById("draw-image-output"),
    image_data_average:document.getElementById("image-data-average"),
    image_data_button:document.getElementById("image-data-button"),
    image_data_output:document.getElementById("image-data-output"),
    number_of_tests_input:document.getElementById("number-of-tests-input"),

    click:function(event) {

      switch(this) {

        case ui.draw_image_button:

          test(drawImage);

        break;
        case ui.image_data_button:

          test(imageData);

        break;

      }

    },

    change:function(event) {

      let number = Number.parseInt(this.value);

      if (!isNaN(number)) {

        number_of_tests = number;
        this.value = "Number of tests: (" + number + ")";

      } else if (this.value == "clear") {

        ui.draw_image_output.innerHTML = ui.image_data_output.innerHTML = "Number of tests (0): 0.0 ms";
        ui.draw_image_average.innerHTML =  ui.image_data_average.innerHTML =  "Average(0 sets): 0.0 ms";

        averages = [[], []];

        this.value = "Number of tests (" + number_of_tests + ")";

      } else {

        this.value = "Enter a valid integer";

      }

    },

    focusInOut:function(event) {

      switch(event.type) {

        case "focusin":

          this.value = "";

        break;
        case "focusout":

          if (this.value == "") this.value = "Number of tests (" + number_of_tests + ")";

      }

    }

  };

  //// INITIALIZE ////

  image.addEventListener("load", function(event) {

    buffer.canvas.height = this.height;
    buffer.canvas.width = this.width;
    display.canvas.height = this.height * 2;
    display.canvas.width = this.width * 2;

    image_context.canvas.height = this.height;
    image_context.canvas.width = this.width;

    image_context.drawImage(this, 0, 0, this.width, this.height, 0, 0, this.width, this.height);

    ui.draw_image_button.addEventListener("click", ui.click);
    ui.image_data_button.addEventListener("click", ui.click);

    ui.number_of_tests_input.addEventListener("focusin", ui.focusInOut);
    ui.number_of_tests_input.addEventListener("focusout", ui.focusInOut);
    ui.number_of_tests_input.addEventListener("change", ui.change);
    ui.number_of_tests_input.value = "Number of tests (" + number_of_tests + ")";

  });

  image.src = "blit.png";

})();
