// Frank Poth 09/01/2017

var LinkPanel = function() {};

LinkPanel.create = function(template, json) {

  var link_panel = document.importNode(template.content, true);

  LinkPanel.setup(link_panel, json);

  return link_panel;

};

LinkPanel.setup = function(link_panel, json) {

  link_panel.description = link_panel.querySelector(".link-panel-description");
  link_panel.tags = link_panel.querySelector(".link-panel-tags");
  link_panel.title = link_panel.querySelector(".link-panel-title");

  link_panel.description.innerHTML = json.description;
  link_panel.title.innerHTML = json.title;
  link_panel.title.href = json.path + json.index;
  link_panel.tags.innerHTML = json.tags.toString();


};
