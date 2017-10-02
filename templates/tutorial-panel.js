// Frank Poth 09/02/2017

var TutorialPanel = function() {};

TutorialPanel.click = function(event) {

  this.parentNode.parentNode.querySelector(".tutorial-panel-source").textContent = this.source;

}

TutorialPanel.create = function(template, json) {

  var tutorial_panel = document.importNode(template.content, true);

  TutorialPanel.setup(tutorial_panel, json);

  TutorialPanel.tutorial_panels.push(tutorial_panel);

  return tutorial_panel;

};

TutorialPanel.resizeExample = function(tutorial_panel) {

  if (document.documentElement.clientWidth > 720) {

    tutorial_panel.example.style.width = 720 + "px";

  } else {

    tutorial_panel.example.style.width = Math.floor(document.documentElement.clientWidth) + "px";

  }

  tutorial_panel.example.style.height = Math.floor(tutorial_panel.example.clientWidth * 0.5625) + "px";

}

TutorialPanel.resizeVideo = function(tutorial_panel) {

  if (document.documentElement.clientWidth > 720) {

    tutorial_panel.video.style.width = 720 + "px";

  } else {

    tutorial_panel.video.style.width = Math.floor(document.documentElement.clientWidth) + "px";

  }

  tutorial_panel.video.style.height = Math.floor(tutorial_panel.video.clientWidth * 0.5625) + "px";

};

TutorialPanel.resizeWindow = function(event) {

  var index;

  for (index = TutorialPanel.tutorial_panels.length - 1; index > -1; -- index) {

    TutorialPanel.resizeVideo(TutorialPanel.tutorial_panels[index]);
    TutorialPanel.resizeExample(TutorialPanel.tutorial_panels[index]);

  }

};

TutorialPanel.setup = function(tutorial_panel, json) {alert(tutorial_panel);

  tutorial_panel.querySelector(".tutorial-panel-title").innerHTML = json.title;
  tutorial_panel.querySelector(".tutorial-panel-description").innerHTML = json.description;

  if (json.video) {

    tutorial_panel.video = tutorial_panel.querySelector(".tutorial-panel-video");
    tutorial_panel.video.src = json.video;

  }

  if (json.files) {

    tutorial_panel.source = tutorial_panel.querySelector(".tutorial-panel-source");

    let tutorial_panel_files = tutorial_panel.querySelector(".tutorial-panel-files");

    tutorial_panel.files = new Array();

    for (let index = 0; index < json.files.length; ++ index) {

      let file = DOMKit.createElement("a", ["class=tutorial-panel-file"], json.files[index]);

      file.addEventListener("click", TutorialPanel.click);

      tutorial_panel.files[index] = file

      tutorial_panel_files.appendChild(file);

      AJAXKit.request(json.path + file.innerHTML, "GET", function(request) {

        file.source = request.responseText;

      });

    }

    if (json.index) {

      tutorial_panel.example = tutorial_panel.querySelector(".tutorial-panel-example");
      tutorial_panel.example.src = json.path + json.index;

    }

  }

};

TutorialPanel.tutorial_panels = new Array();

window.addEventListener("resize", TutorialPanel.resizeWindow);
