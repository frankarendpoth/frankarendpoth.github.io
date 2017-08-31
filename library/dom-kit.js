// Frank Poth 08/18/2017

var DOMKit = function() {};

DOMKit.createElement = function(tag_name, attributes, content) {

  var element, index;

  element = document.createElement(tag_name);

  DOMKit.setAttributes(element, attributes);

  if (content) {

    element.innerHTML = content;

  }

  return element;

};

DOMKit.setAttributes = function(element, attributes) {

  var attribute_pair;

  for (index = attributes.length - 1; index > -1; -- index) {

    attribute_pair = attributes[index].split(/=(.+)?/, 2);

    element.setAttribute(attribute_pair[0], attribute_pair[1]);

  }

};
