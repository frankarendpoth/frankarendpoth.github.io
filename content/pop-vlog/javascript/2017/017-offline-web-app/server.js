// Frank Poth 10/16/2017

(function() {

  var fs, https, mimetypes, options, path, server;

  fs = require("fs"); // file system
  https = require("https"); // creates an https server
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
    "png":"image/png"

  };

  options = {

    pfx: fs.readFileSync("ssl/crt.pfx"),
    passphrase: "password"

  };

  // Start a secure server that uses the credentials in ssl/crt.pfx
  server = https.createServer(options, function(request, response) {

    console.log(request.url);

    /* When requesting the homepage of a website, we usually only type
    www.mysite.com, but the server returns www.mysite.com/index.html. To make
    it easier for users to access our site, we add "/index.html" to their url
    so the user doesn't have to type out the whole address of our home page. */

    // If the url is empty
    if (request.url == "" || request.url == "/") {

      // The user is requesting the home page of the website, so give it to them
      request.url = "web-app.html";

    }

    // Next we read the file at the requested url and write it to the document.
    /* __dirname is just the base directory of your website, so if your website
    is www.coolsite.com, then __dirname is www.coolsite.com. When you put it all
    together it looks like www.coolsite.com/index.html or whatever the requested
    url is */
    fs.readFile(__dirname + "/" + request.url, function(error, content) {

      if (error) { // if there is an error reading the requested url

        console.log("Error: " + error); // output it to the console

      } else { // else, there is no error, write the file contents to the page

        // 200 is code for OK, and the second parameter is our content header
        response.writeHead(200, {'Content-Type':mimetypes[path.extname(request.url).split(".")[1]]});
        response.write(content); // write that content to our response object

      }

      response.end(); // This will send our response object to the browser

    });

  });

  server.listen("2468", "192.168.0.101", function() {

    console.log("Server started!");

  }); // listen on 192.168.0.101:2468

})();
