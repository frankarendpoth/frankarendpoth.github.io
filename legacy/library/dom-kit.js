// Frank Poth 08/18/2017

var DOMKit = function() {};

DOMKit.createElement = function(tag_name, attributes, content) {

  var element, index;

  element = document.createElement(tag_name);

  if (attributes) {

    DOMKit.setAttributes(element, attributes);
  }

  if (content) {

    element.innerHTML = content;

  }

  return element;

};

DOMKit.maintainAspectRatio = function(element, aspect_ratio = 1) {

  let height = element.parentNode.clientHeight;
  let width  = element.parentNode.clientWidth;
  let max_height = document.documentElement.clientHeight;
  let max_width  = document.documentElement.clientWidth;
  let parent_ratio = height / width;
  let max_ratio = max_height / max_width;

  if (parent_ratio - max_ratio > aspect_ratio) {

    if (parent_ratio > aspect_ratio) {

      element.style.height = String(width * aspect_ratio) + "px";
      element.style.width  = width + "px";

    } else {

      element.style.height = height + "px";
      element.style.width  = String(height / aspect_ratio) + "px";

    }

  } else {

    if (max_ratio > aspect_ratio) {

      element.style.height = String(max_width * aspect_ratio) + "px";
      element.style.width  = max_width + "px";

    } else {

      element.style.height = max_height + "px";
      element.style.width  = String(max_height / aspect_ratio) + "px";

    }

  }

};

DOMKit.parseHTMLString = function(string) {

  let fragment = document.createDocumentFragment();
  //fragment.content = string;

  return fragment;

};

// created 03/27/2018
DOMKit.replaceCurrentScript = function(element) {

  let script = document.currentScript;

  script.parentNode.replaceChild(element, script);

  return element;

};

DOMKit.replaceElement = function(element, new_element) {

  element.parentNode.replaceChild(new_element, element);

  return new_element;

};

DOMKit.setAttributes = function(element, attributes) {

  var attribute_pair;

  for (index = attributes.length - 1; index > -1; -- index) {

    attribute_pair = attributes[index].split(/=(.+)?/, 2);

    element.setAttribute(attribute_pair[0], attribute_pair[1]);

  }

};
