// Frank Poth 04/24/2017

(function() {

  var clickSubmit, input, submit;

  input = document.getElementById("input");

  submit = document.getElementById("submit");

  clickSubmit = function(event) {

    var readyStateChange, request;

    request = new XMLHttpRequest();

    readyStateChange = function(event) {

      this.removeEventListener("readyStateChange", readyStateChange);

      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {

        alert(this.responseText);

      } else if (this.status !== 200) {

        alert("Could not load directory.");

      }

    }

    request.addEventListener("readystatechange", readyStateChange);

    request.open("GET", "~" + input.value);
    request.send();

  };

  (function() {

    submit.addEventListener("click", clickSubmit);

  })();

})();
