// Frank Poth 04/19/2017

// To use this server on your machine, set the environment variables IP and PORT to your desired IP and Port address.

(function() {

  var file_system, http, server;

  server = {

    ip:process.env.IP || "192.168.0.101",
    port:process.env.PORT || "2468",

    mimetypes: {

      "css":"text/css",
      "html":"text/html",
      "ico":"image/ico",
      "jpg":"image/jpeg",
      "js":"text/javascript",
      "png":"image/png"

    },

    serve:function(request, response) {

      var extension, processFile;

      if (request.url == "" || request.url == "/") {

        request.url = "index.html";

      }

      extension = request.url.split(".");
      extension = extension[extension.length - 1];

      processFile = function(error, content) {

        if (error) {

          console.log("Error: " + error);

        } else {

          response.writeHead(200, {'Content-Type':server.mimetypes[extension]});
          response.write(content);

        }

        response.end();

      }

      file_system.readFile(__dirname + "/" + request.url, processFile);

    }

  };

  (function() {

    file_system = require("fs");
    http = require("http");

    http.createServer(server.serve).listen(server.port, server.ip);

    console.log("Server listening at: " + server.ip + ":" + server.port);

  })();

})();
