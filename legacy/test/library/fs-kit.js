/*

FSKit (File System Kit) allows a single file to be placed inside each directory of a static website which defines all files and folders in that directory. From these files, a map of the file system can be generated on the client side for more dynamic access to content.

These files are written in JSON and look like the following:

directory.json:

{
  "files":["file-name.txt", "image.png"],
  "paths":["folder-name", "another-folder-name", "directory.json"]
}

*/

class FSKit {

  constructor(path, file) {

    this.file = file;
    this.path = path;

    this.root = getPath(path, file);

  }

  fetchDirectory(path, file, callback) {

    this.root = new FSKit.Directory();

    fetch(path + file).then(response => {

      var content = JSON.parse(response.text);

      this.root

      for (let f of content.files) {



      }

    }).catch(error => {

      console.log(error);

    });

  }

}

FSKit.Directory = class {

  constructor(name) {

    this.files = new Array();
    this.paths = new Array();

  }

}

FSKit.File = class {

  constructor(name) {

    this.name = name;
    console.log("file");

  }

}

FSKit.Path = class {

  constructor() {

    this.files = new Array();
    this.paths = new Array();

  }

}