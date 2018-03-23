// Frank Poth 09/16/2017

(function() {

  var content = document.getElementById("content");

  FSKit.requestDirectory("content/pop-vlog/javascript/", "directory.json", function(directory) {

    directory.traverse(function(dir) {

      for (let index = dir.files.length - 1; index > -1; -- index) {

        let extension = dir.files[index].split(".")[1];
        extension = extension.split("?")[0];
        if (extension == "html") {

          content.appendChild(DOMKit.createElement("a", ["href=" + dir.path + dir.files[index]], dir.name));

        }

      }

    });

  });

})();
