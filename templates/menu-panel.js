// Frank Poth 09/03/2017

var MenuPanel = function() {};

MenuPanel.create = function(template, properties) {

  var menu_panel = document.importNode(template.content, true);

  MenuPanel.setup(menu_panel, properties);

  return menu_panel;

};

MenuPanel.setup = function(menu_panel, properties) {

  menu_panel.tab = menu_panel.querySelector(".menu-panel-tab");
  menu_panel.items = menu_panel.querySelector(".menu-panel-items");

  if (properties) {

    menu_panel.tab.innerHTML = properties.tab;
    menu_panel.items.innerHTML = properties.items;

  }

};
