// Frank Poth 04/23/2018

const LinkBox = function() {};

LinkBox.getLinks = function(path, directory_name, callback) {

  var link_box = document.currentScript.parentNode;

  FSKit.requestDirectory(path, directory_name, function(directory) {

    directory.traverse(function(dir) {

      for (let index = dir.files.length - 1; index > -1; -- index) {

        callback(dir.path, dir.files[index], dir.name, link_box);

      }

    });

  });

  document.currentScript.parentNode.removeChild(document.currentScript);

};
