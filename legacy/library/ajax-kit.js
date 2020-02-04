// Frank Poth 08/18/2017

var AJAXKit = function() {};

/* If url points to css or js, creates link or script tag with appropriate src.
If url points to html, creates valid html. Applies callback. Replaces script tag
it is called in with the resulting element. */
AJAXKit.import = function(url, callBack) {

  var script = document.currentScript;

  AJAXKit.requestParsedHTML(url, function(html) {

    if (callBack) {

      callBack(html);

    }

    script.parentNode.replaceChild(html, script);

  });

};

/* Takes multiple urls. Creates a documentFragment from the elements it
generates from the urls and applies the callBack to it, then replaces the script
tag it is called in with that documentFragment. */
AJAXKit.importMultiple = function(urls, callBack) {

  var fragment, importMultiple, script;

  fragment = document.createDocumentFragment();

  importMultiple = function(url) {

    AJAXKit.requestParsedHTML(url, function(html) {

      fragment.appendChild(html);

      if (urls.length > 0) {

        importMultiple(urls.shift());

      } else {

        if (callBack) {

          callBack(fragment);

        }

        script.parentNode.replaceChild(fragment, script);

      }

    });

  };

  script = document.currentScript;

  importMultiple(urls.shift());

};

/* Converts a plain string to valid HTML elements that can be appended to the
document. */
AJAXKit.parseHTML = function(string, callBack) {

  var fragment, wrapper;

  fragment = document.createDocumentFragment();
  wrapper = document.createElement("div");
  wrapper.innerHTML = string;

  while(wrapper.firstChild) {

    fragment.appendChild(wrapper.removeChild(wrapper.firstChild));

  }

  callBack(fragment);

};

/* Replaces all script tags in a block of html, allowing the browser to execute
them after they have been appended. */
AJAXKit.replaceScripts = function(html) {

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

/* Makes an AJAX request. */
AJAXKit.request = function(url, method, callBack, data, headers) {

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

/* If the url points to js or css, creates a script or link tag with appropriate
src. If url points to html, creates valid html. Applies callBack. */
AJAXKit.requestParsedHTML = function(url, callBack) {

  var element, split_url;

  split_url = url.split(".");

  switch(split_url[split_url.length - 1]) {

    case "css":

      element = document.createElement("link");

      element.setAttribute("href", url);
      element.setAttribute("rel", "stylesheet");
      element.setAttribute("type", "text/css");

    break;

    case "html": AJAXKit.request(url, "GET", function(request) {

      AJAXKit.parseHTML(request.responseText, function(html) {

        AJAXKit.replaceScripts(html);

        callBack(html);

      });

    }); return; break;

    case "js":

      element = document.createElement("script");
      element.setAttribute("src", url);
      element.setAttribute("type", "text/javascript");

   break;

  }

  callBack(element);

};
