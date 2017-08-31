// Frank Poth 08/16/2017

(function() {

  var content;

  content = document.getElementById("content");

  AJAXKit.request("tutorials.json", "GET", function(request) {

    var json, template, topic_panel;

    json = JSON.parse(request.responseText);

    template = document.getElementById("topic-panel-template");

    for (let index = 0; index < json.topic_panels.length; ++ index) {

      topic_panel = TopicPanel.create(template, json.topic_panels[index]);

      content.appendChild(topic_panel);

      TopicPanel.resize(topic_panel);

    }

  });

})();
