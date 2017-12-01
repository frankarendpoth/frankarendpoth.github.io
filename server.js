// Frank Poth 08/16/2017

(function() {

  var fs, http, path, server;

  fs = require("fs");
  http = require("http");
  path = require("path");

  server = {

    ip:process.env.MY_IP || "localhost",

    mimetypes: {

      "css":"text/css",
      "html":"text/html",
      "ico":"image/ico",
      "jpg":"image/jpeg",
      "js":"text/javascript",
      "json":"application/json",
      "png":"image/png"

    },

    port:process.env.MY_PORT || "3000",

    serve:function(request, response) {

      if (request.url == "" || request.url == "/") {

        request.url = "index.html";

      }

      fs.readFile(__dirname + "/" + request.url, function(error, content) {

        if (error) {

          console.log("Error: " + error);

        } else {

          response.writeHead(200, {'Content-Type':server.mimetypes[path.extname(request.url).split(".")[1]]});
          response.write(content);

        }

        response.end();

      });

    }

  };

  http.createServer(server.serve).listen(server.port, server.ip);

  console.log("Server listening at: " + server.ip + ":" + server.port);

})();
