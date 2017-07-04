// Frank Poth 05/27/2017

(function() {

  var featured_project;

  featured_project = {

    about:document.getElementById("featured-project-about"),
    button:document.getElementById("featured-project-button"),
    iframe:document.getElementById("featured-project"),
    message:document.getElementById("featured-project-message")

  };

  (function() {

    Importer.request("GET", "content/projects/projects-index.json", null, null, function(request) {

      var click, json, project;

      click = function(event) {

        if (featured_project.iframe.style.display == "block") {
          featured_project.iframe.src = "";
          featured_project.iframe.style.display = "none";
          featured_project.message.style.display = "block";
          this.innerHTML = "Click here to Run Program!";
        } else {
          featured_project.iframe.src = json.directory + "/" + json.featured_project.language + "/" + json.featured_project.year + "/" + project.directory + "/" + project.main;
          featured_project.iframe.style.display = "block";
          featured_project.message.style.display = "none";
          this.innerHTML = "Click here to Stop Program!";
        }

      }

      json = JSON.parse(request.responseText);

      project = json[json.featured_project.language][String("year_" + json.featured_project.year)][json.featured_project.index];

      featured_project.button.addEventListener("click", click, true);

      featured_project.iframe.style.display = "none";

      featured_project.about.innerHTML = project.about;

    });

  })();

  /*

  var content;

  content = document.getElementById("content");

  Importer.request("GET", "index.json", null, null, function(request) {

    var json;

    json = JSON.parse(request.responseText);

    Importer.getHTML("topic-panel.html", function(html) {

      var data, index, script, template;

      for (index = 0; index < json.content.length; ++ index) {

        data = json.content[index];

        template = html.cloneNode(true);

        template.querySelector(".topic-title").innerHTML = data.topic_title;
        template.querySelector(".topic-content").innerHTML = data.topic_content;
        template.querySelector(".topic-links").innerHTML = data.topic_links;
        template.querySelector(".topic-description").innerHTML = data.topic_description;

        content.appendChild(template);

      }

    });

  });*/

})();
