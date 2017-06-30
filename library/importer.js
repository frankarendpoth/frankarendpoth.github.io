// Frank Poth 05/26/2017

var Importer = function() {};

/* This converts plain text from a file to HTML elements and hands them to the
callBack function in the form of a DocumentFragment. */
Importer.getHTML = function(url, callBack) {

  Importer.request("GET", url, null, null, function(request) {

    var fragment, wrapper;

    fragment = document.createDocumentFragment();
    wrapper = document.createElement("div");
    wrapper.innerHTML = request.responseText;


    while(wrapper.firstChild) {

      fragment.appendChild(wrapper.removeChild(wrapper.firstChild));

    }

    callBack(fragment);

  });

};

/* This will replace the script tag it runs in with the html in the specified
file. It will also replace all script tags in the html so the DOM runs them. It
will also apply the callback function to the html if a callback is specified. */
Importer.importHTML = function(url, callBack) {

  var script;

  script = document.currentScript;

  Importer.getHTML(url, function(fragment) {

    Importer.replaceScripts(fragment);

    if (callBack) {

      callBack(fragment);

    }

    script.parentNode.replaceChild(fragment, script);

  });

};

/* This sends an XMLHttpRequest to the server and executes the callBack function
when the response comes back. */
Importer.request = function(method, url, headers, data, callBack) {

  var header, index, readyStateChange, request;

  readyStateChange = function(event) {

    if (this.readyState == 4 && this.status == 200) {

      this.removeEventListener("readystatechange", readyStateChange);

      callBack(this);

    }

  };

  request = new XMLHttpRequest();

  request.addEventListener("readystatechange", readyStateChange, false);
  request.open(method, url);

  if (headers) {

    for (index = headers.length - 1; index > -1; -- index) {

      header = headers[index].split(":");

      request.setRequestHeader(header[0], header[1]);

    }
  }

  request.send(data);

};

/* This replaces all script tags in the specified html with new ones. By doing
this, the DOM is prompted to execute the new script tags. */
Importer.replaceScripts = function(html) {

  var attribute, attribute_index, new_script, old_script, scripts, script_index;

  scripts = html.querySelectorAll("SCRIPT");

  for (script_index = scripts.length - 1; script_index > -1; -- script_index) {

    old_script = scripts[script_index];

    new_script = document.createElement("script");
    new_script.innerHTML = old_script.innerHTML;

    for (attribute_index = old_script.attributes.length - 1; attribute_index > -1; -- attribute_index) {

      attribute = old_script.attributes[attribute_index];
      new_script.setAttribute(attribute.name, attribute.value);

    }

    old_script.parentNode.replaceChild(new_script, old_script);

  }

};
