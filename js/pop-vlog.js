// Frank Poth 09/16/2017

window.addEventListener("load", (event) => {

  var links = document.getElementById("links");

  FSKit.requestDirectory("../content/pop-vlog/javascript/", "directory.json", function(directory) {

    directory.traverse(function(dir) {

      for (let index = dir.files.length - 1; index > -1; -- index) {

        let extension = dir.files[index].split(".")[1];
        extension = extension.split("?")[0];
        if (extension == "html") {

          links.appendChild(DOMKit.createElement("a", ["href=" + dir.path + dir.files[index]], dir.name));

        }

      }

    });

    var resize_event = new Event("resize");
    var elements = document.getElementsByTagName("*");

    for (let index = elements.length - 1; index > -1; -- index) {

      elements[index].dispatchEvent(resize_event);

    }

  });

}, { once:true });
