// Frank Poth 04/21/2018

const DocKit = function() {};

DocKit.createElement = function(tag, attributes, content) {

  var element = document.createElement(tag);

  if (attributes) DocKit.setAttributes(element, attributes);

  if (content) element.innerHTML = content;

  return element;

};

DocKit.parseHTML = function(string) {

  var fragment = document.createRange().createContextualFragment(string);

  return fragment;

};

DocKit.removeElement = function(element) {

  element.parentNode.removeChild(element);

};

DocKit.replaceElement = function(element, new_element) {

  element.parentNode.replaceChild(new_element, element);

};

DocKit.setAttributes = function(element, attributes) {

  for (let index = attributes.length - 1; index > -1; -- index) {

    let attribute_pair = attributes[index].split(/=(.+)?/, 2);

    element.setAttribute(attribute_pair[0], attribute_pair[1]);

  }

};
