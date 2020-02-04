// Frank Poth 03/07/2018

/* This is the main file where all of the different components of the application
come together. Since this application is extremely simple, using MVC or IPO is probably
unnecessary. There are many ways to implement this approach, and MVC gets a bit
more involved than simply separating an application into three parts, but at the
core of the concept is organization, so if you are organizing your application even
loosely into the three basic components, you are utilizing MVC */

(function() {

  function update() {

    output.renderColor(processor.getRandomColor());

  }

  var input     = new Input(update);
  var processor = new Processor();
  var output    = new Output(document.body);

  window.addEventListener("click", input.handleClick);

})();
