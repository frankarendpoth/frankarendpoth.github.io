// Frank Poth 09/16/2017

(function() {

  var content = document.getElementById("content");

  FSKit.requestDirectory("content/pop-vlog/javascript/", "directory.json", function(directory) {

    directory.traverse(function(dir) {

      for (let index = dir.files.length - 1; index > -1; -- index) {

        if (dir.files[index].split(".")[1] == "html") {

          content.appendChild(DOMKit.createElement("a", ["href=" + dir.path + "/" + dir.files[index]], dir.name));

        }

      }

    });

    /*var div = DOMKit.createElement("div");

    var traverse = function(directory, div) {

      div.appendChild(DOMKit.createElement("h2", null, directory.name));

      let d1 = DOMKit.createElement("div", ["style=display:grid;grid-template-columns:auto;"]);

      for (let index = directory.files.length - 1; index > -1; -- index) {

        if (directory.files[index].split(".")[1] == "html") {

          d1.appendChild(DOMKit.createElement("a", ["href=/" + directory.path + directory.files[index], "style=padding:0 8px;color:#0099ff;font-size:1.25em"], directory.files[index]));

        }

      }

      for (let index = directory.directories.length - 1; index > -1; -- index) {

        let d = DOMKit.createElement("div", ["style=padding:4px;"]);
        d1.appendChild(d);

        traverse(directory.directories[index], d);

      }

      div.appendChild(d1);

    };

    traverse(directory, div);

    content.appendChild(div);*/

  });

})();
