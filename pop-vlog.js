// Frank Poth 09/16/2017

(function() {

  var content, menu, menu_panel_template;

  content = document.getElementById("content");
  menu_panel_template = document.getElementById("menu-panel-template");

  FSKit.requestDirectoryHTML("/content/pop-vlog/", "directory.json", function(fragment) {

    content.appendChild(fragment);

  });

})();
