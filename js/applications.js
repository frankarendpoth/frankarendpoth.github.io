// Frank Poth 03/28/2018

window.addEventListener("load", (event) => {

  var links = document.getElementById("links");

  FSKit.requestDirectory("../content/applications/", "directory.json", function(directory) {

    directory.traverse(function(dir) {

      for (let index = dir.files.length - 1; index > -1; -- index) {

        let extension = dir.files[index].split(".")[1];
        extension = extension.split("?")[0];
        if (extension == "html") {

          links.appendChild(DOMKit.createElement("a", ["href=" + dir.path + dir.files[index]], dir.name));

        }

      }

    });

  });

}, { once:true });
