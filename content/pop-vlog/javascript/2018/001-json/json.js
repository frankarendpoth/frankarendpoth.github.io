// Frank Poth 01/14/2017

/* This program simply loads a json file and gets the data out of it. */
(function() { "use strict";

  var load, p;// The load function loads our json file.

  p = document.querySelector("p");// The output p element.

  load = function(url) {// Loads the file at the specified url.

    var request;

    request = new XMLHttpRequest();// We use an XMLHttpRequest to load the file.

    /* This event listener will call the specified function when the file at the
    specified url is loaded. */
    request.addEventListener("readystatechange", function(event) {

      if (this.readyState == 4 && this.status == 200) {

        // We parse the plain text response into a JavaScript object. */
        var json = JSON.parse(this.responseText);

        p.innerHTML = this.responseText;

        // Now we can use the json object just like a regular JavaScript Object.
        p.innerHTML += "<br><br>json.array:         " + json.array;
        p.innerHTML += "<br><br>json.number:        " + json.number;
        p.innerHTML += "<br>json.number + 2:    " + (json.number + 2);
        p.innerHTML += "<br><br>json.string:        " + json.string;
        p.innerHTML += "<br><br>json.object.string: " + json.object.string;

      }

    });

    request.open("GET", url);
    request.send(null);

  };

  load("json.json");// Our file is called json.json. Creative, I know.

})();
