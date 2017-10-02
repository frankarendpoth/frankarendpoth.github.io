// Frank Poth 09/16/2017

/* FSKit makes it possible to create a directory object from various json files
which can be used to gain access to files on the client side. The only downside
to this system is that json files will need to be created in every directory
you wish to use and those files must list all files and folders you wish to use.
The upside is that your static site can access files and folders dynamically.

directory.json files must look like this:
{
  "files":[],
  "folders":[]
}
You can name them anything you want, but they must contain the files and folders
arrays and be populated with the file and folder names you wish to use.

A directory that utilizes FSKit should look like this:

myfruit
--apples
----macintosh.txt
----grannysmith.txt
----directory.json
--pear.txt
--directory.json

The corresponding directory.json files look like this:

{ "files":["macintosh.txt", "grannysmith.txt"],
"folders":[] }

{ "files":["pear.txt"],
"folders":["apples"] }

*/

var FSKit = function() {};

FSKit.Directory = function(path, files, folders, parent, children) {

  this.children = children || null;
  this.files = files;
  this.folders = folders;
  this.parent = parent || null;
  this.path = path;

};

FSKit.Directory.prototype = {};

FSKit.requestDirectoryHTML = function(path, file_name, callBack) {

  FSKit.requestDirectory(path, file_name, function(directory) {

    var element, fragment, parseDirectory;

    parseDirectory = function(directory, element) {

      for (let index = directory.files.length - 1; index > -1; -- index) {

        element.appendChild(DOMKit.createElement("a", ["href=" + directory.path], directory.files[index]))

      }

    };

    element = DOMKit.createElement("div", undefined, directory.path);
    fragment = document.createDocumentFragment();

    fragment.appendChild(element);

    parseDirectory(directory, element);

    callBack(fragment);

  });

};

/* Request a directory.json file at the specified url and call the callBack,
handing it the parsed JSON in the directory.json file. */

FSKit.requestJSON = function(path, file_name, callBack) {

  AJAXKit.request(path + file_name, "GET", function(request) {

    try {

      callBack(JSON.parse(request.responseText));

    } catch(error) {

      callBack({

        files:[],
        folders:[]

      });

    }

  });

};

FSKit.requestDirectory = function(path, file_name, callBack) {

  var requestDirectory, root, searches;

  searches = 1;

  requestDirectory = function(path, file_name, directory) {

    FSKit.requestJSON(path, file_name, function(json) {

      searches --;

      directory.files = json.files;
      directory.folders = json.folders;

      searches += json.folders.length;

      console.log("Creating Directory: " + directory.path + "\n  folders: " + json.folders.toString() + "\n searches: " + searches);

      for (let index = 0; index < json.folders.length; ++ index) {

        let folder = json.folders[index] + "/";
        let child = new FSKit.Directory(directory.path + folder, [], [], directory, []);
        directory.children[index] = child;

        requestDirectory(path + folder, file_name, child);

      }

      if (searches == 0) {

        callBack(root);

      }

    });

  };

  root =  new FSKit.Directory(path, [], [], null, []);

  requestDirectory(path, file_name, root);

};

FSKit.requestDirectoryHTML = function(path, file_name, callBack) {

  var requestDirectory, root, searches;

  searches = 1;

  requestDirectory = function(path, file_name, directory) {

    FSKit.requestJSON(path, file_name, function(json) {

      searches --;

      directory.files = json.files;
      directory.folders = json.folders;

      searches += json.folders.length;

      console.log("Creating Directory: " + directory.path + "\n  folders: " + json.folders.toString() + "\n searches: " + searches);

      for (let index = 0; index < json.folders.length; ++ index) {

        let folder = json.folders[index] + "/";
        let child = new FSKit.Directory(directory.path + folder, [], [], directory, []);
        directory.children[index] = child;

        requestDirectory(path + folder, file_name, child);

      }

      if (searches == 0) {

        callBack(root);

      }

    });

  };

  root =  new FSKit.Directory(path, [], [], null, []);

  requestDirectory(path, file_name, root);

};
