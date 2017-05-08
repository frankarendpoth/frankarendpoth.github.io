// Frank Poth 04/20/2017

function HTMLImporter() {}

HTMLImporter.import = function(url) {

  var error, http_request, load, script;

  script = document.currentScript || document.scripts[document.scripts.length - 1];

  load = function(event) {

    var attribute, index, index1, new_script, old_script, scripts, wrapper;

    wrapper = document.createElement("div");
    wrapper.innerHTML = this.responseText;

    scripts = wrapper.getElementsByTagName("SCRIPT");

    for (index = scripts.length - 1; index > -1; -- index) {

      old_script = scripts[index];

      new_script = document.createElement("script");
      new_script.innerHTML = old_script.innerHTML;

      for (index1 = old_script.attributes.length - 1; index1 > -1; -- index1) {

        attribute = old_script.attributes[index1];
        new_script.setAttribute(attribute.name, attribute.value);

      }

      old_script.parentNode.replaceChild(new_script, old_script);

    }

    while(wrapper.firstChild) {

      script.parentNode.insertBefore(wrapper.removeChild(wrapper.firstChild), script);

    }

    script.parentNode.removeChild(script);

    this.removeEventListener("error", error);
    this.removeEventListener("load", load);

  };

  error = function(event) {

    this.removeEventListener("error", error);
    this.removeEventListener("load", load);

    alert("there was an error!");

  };

  http_request = new XMLHttpRequest();
  http_request.addEventListener("error", error);
  http_request.addEventListener("load", load);
  http_request.open("GET", url);
  http_request.send();

};
