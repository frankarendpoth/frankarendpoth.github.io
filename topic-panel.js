// Frank Poth 08/08/2017

(function() {

  var clickRefresh, clickTab, resize, topic_panels;

  clickRefresh = function(event) {

    var iframe = this.parentElement.querySelector("iframe");

    if (iframe) {

      iframe.src = iframe.src;

    }

  };

  clickTab = function(event) {

    this.innerHTML = (this.innerHTML == "+")?"-":"+";
    this.details.classList.toggle("topic-panel-details-highlight");

  };

  resize = function(event) {

    for (let index = topic_panels.length - 1; index > -1; -- index) {

      let topic_panel = topic_panels[index];

      if (topic_panel.height_ratio) {

        topic_panel.content.style.height = Math.floor(topic_panel.content.clientWidth * topic_panel.height_ratio) + "px";

      }

    }

  };

  topic_panels = document.getElementsByClassName("topic-panel");

  for (let index = topic_panels.length - 1; index > -1; -- index) {

    let topic_panel = topic_panels[index];

    topic_panel.content = topic_panel.querySelector(".topic-panel-content");
    topic_panel.height_ratio = topic_panel.content.dataset.heightRatio;
    topic_panel.refresh = topic_panel.querySelector(".topic-panel-refresh");
    topic_panel.tab = topic_panel.querySelector(".topic-panel-tab");

    if (topic_panel.refresh) {

      topic_panel.refresh.addEventListener("click", clickRefresh);

    }

    if (topic_panel.tab) {

      topic_panel.tab.details = topic_panel.querySelector(".topic-panel-details");
      topic_panel.tab.addEventListener("click", clickTab);

    }

  }

  window.addEventListener("resize", resize);

  resize();

})();
