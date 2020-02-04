// Frank Poth 04/20/2018

/* The TempKit utility is used to import HTML fragments into a document via AJAX. */

const TempKit = function() {};

TempKit.replace = function(element, urls, callback) {

  var fragments = new Array();

  for (let index = 0; index < urls.length; ++ index) {

    TempKit.request(urls[index], (response) => {

      fragments[index] = document.createRange().createContextualFragment(response)

      if (index == urls.length - 1) {

        for (index = 0; index < fragments.length; ++ index) {

          element.parentNode.insertBefore(fragments[index], element);

        }

        element.parentNode.removeChild(element);

        if (callback) callback();

        return;

      }

    });

  }

};

TempKit.request = function(url, callback) {

  var request = new XMLHttpRequest();

  request.addEventListener("load", function(event) {

    callback(this.response);

  }, { once:true });

  request.open("GET", url);
  request.send();

};

TempKit.useTemplate = function(template) {

  let fragment = document.importNode(template.content, true);
  let script = document.currentScript;

  script.parentNode.replaceChild(fragment, script);

};
