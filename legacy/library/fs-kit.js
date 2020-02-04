// Frank Poth 12/27/2017

/* fs-kit is a recursive file loader. It loads JSON files that act as directories
with lists of files and sub directories inside. In this way, you can manually create
JSON files that reference files and folders and use them to access your files dynamically
on a static website. */

/* A JSON directory file has this basic structure:

directory_name.json

{

  "directories": ["pictures", "stories", "whatever"],
  "files":       ["beach.jpg", "notes.txt", "game.exe"]

}

You can omit either of these arrays, but it makes sense to have one present. */

var FSKit = function() {};

FSKit.Directory = function(path, root, name, files = [], directories = []) {

  this.files = files;// A potential array of file names.
  this.name = name;// The name of the directory or the folder name.
  this.path = path;// The path to this directory.
  this.root = root;// The parent Directory object of this Directory object.
  this.directories = directories;// A potential array of subdirectories.

};

FSKit.Directory.prototype = {

  constructor:FSKit.Directory,

  /* Gets the topmost directory in the tree whose root is null. */
  getRoot:function() {

    var root = this;

    while(root.root != null) {

      root = root.root;

    }

    return root;

  },

  traverse:function(callback) {

    callback(this);

    for (let index = this.directories.length - 1; index > -1; -- index) {

      this.directories[index].traverse(callback);

    }

  }

};

/* Note: all JSON directory files must have the same name, like directory.json.
path is the path to the root directory.
callback is the callback function that gets handed the root Directory object. */
FSKit.requestDirectory = function(path, json_name, callback) {//console.log("DIRECTORY REQUESTED");

  var directories_to_resolve, generateDirectory;

  directories_to_resolve = 0;

  generateDirectory = function(path, root, name) {

    var directory = new FSKit.Directory(path, root, name);

    directories_to_resolve ++;// We just created a directory and it has not yet been resolved.

    FSKit.requestJSON(path + json_name, function(json) {// When the JSON directory loads, we can resolve the directory.
      //console.log("generating directory " + path + json_name + "\n    files: " + json.files + " directories: " + json.directories);
      if (json.directories) {// If the file contains directory names:

        /* Populate the directory's directories array with new Directory objects. */
        for (let index = json.directories.length - 1; index > -1; -- index) {

          directory.directories[index] = generateDirectory(path + json.directories[index] + "/", directory, json.directories[index]);

        }

      }

      if (json.files) {// If the file contains file names:

        /* Copy all the file names to the directory's files array. */
        for (let index = json.files.length - 1; index > -1; -- index) {

          directory.files[index] = json.files[index];

        }

      }

      /* Once the directory has been populated, we know it's been resolved. */
      directories_to_resolve --;

      if (directories_to_resolve == 0) {// When all directories have been resolved:

        //console.log("DIRECTORY GRANTED");
        /* Return the root directory. */
        callback(directory.getRoot());

      }

    });

    return directory;// generateDirectory returns the directory it generates.

  };

  /* Since this process involves loading, we cannot return a directory right away.
  generateDirectory will create a directory tree and when it detects that all directories
  have been created, it will call the callback function and hand it the root directory. */
  generateDirectory(path, null, path);

};

FSKit.requestJSON = function(url, callback) {

  var readyStateChange, request;

  request = new XMLHttpRequest();

  readyStateChange = function(event) {

    if (this.readyState == 4 && this.status == 200) {

      if (this.responseText) {

        callback(JSON.parse(this.responseText));

      } else {

        callback( {} );

      }

    }

  };

  request.addEventListener("readystatechange", readyStateChange);

  request.open("GET", url);
  request.send(null);

};
