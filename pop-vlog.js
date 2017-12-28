// Frank Poth 09/16/2017

(function() {

  var content = document.getElementById("content");

  FSKit.requestDirectory("content/pop-vlog/javascript/", "directory.json", function(directory) {

    var div = DOMKit.createElement("div");

    var traverse = function(directory, div) {

      div.appendChild(DOMKit.createElement("h4", null, directory.name));

      let d1 = DOMKit.createElement("div", ["style=background-color:rgba(0, 0, 0, 0.05);display:grid;grid-template-columns:auto auto;"]);

      for (let index = directory.files.length - 1; index > -1; -- index) {

        d1.appendChild(DOMKit.createElement("a", ["href=/" + directory.path + directory.files[index], "style=padding:0 4px;"], directory.files[index]));

      }

      for (let index = directory.directories.length - 1; index > -1; -- index) {

        let d = DOMKit.createElement("div", ["style=grid-column-end:span 2;padding:4px;"]);
        d1.appendChild(d);

        traverse(directory.directories[index], d);

      }

      div.appendChild(d1);

    };

    traverse(directory, div);

    content.appendChild(div);

  });

})();
