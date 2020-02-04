// Frank Poth 10/16/2017

(function() {

  const ip = process.env.MY_IP || "127.0.0.1";
  const port = process.env.MY_PORT || "3000";

  var fs, https, mimetypes, options, path, server;

  fs = require("fs"); // file system
  http = require("http"); // creates an http server
  path = require("path"); // used for working with url paths

  // used to create response headers
  /* If the user requests a .css file, we want to ensure we attach "text/css" to
  our response header, this way the browser knows how to handle it. */
  mimetypes = {

    "css":"text/css",
    "html":"text/html",
    "ico":"image/ico",
    "jpg":"image/jpeg",
    "js":"text/javascript",
    "json":"application/json",
    "png":"image/png",
    "txt":"text/plain"

  };

  server = http.createServer((request, response) => {

    console.log(request.url);

    if (request.url == "" || request.url == "/") {

      // The user is requesting the home page of the website, so give it to them
      request.url = "index.html";

    }

    request.url = request.url.split("?")[0];

    fs.readFile(__dirname + "/" + request.url, function(error, content) {

      if (error) { // if there is an error reading the requested url

        console.log("Error: " + error); // output it to the console

      } else { // else, there is no error, write the file contents to the page

        let extension = path.extname(request.url).split(".")[1];

        if (!mimetypes[extension]) extension = "txt";

        // 200 is code for OK, and the second parameter is our content header
        response.writeHead(200, {'Content-Type':mimetypes[extension]});
        response.write(content); // write that content to our response object

      }

      response.end(); // This will send our response object to the browser

    });

  });

  server.listen(port, ip, function() {

    console.log("Server started at " + ip + ":" + port + "!");

  });

})();
