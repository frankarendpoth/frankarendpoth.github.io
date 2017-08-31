// Frank Poth 08/08/2017

var TopicPanel = function() {};

TopicPanel.clickRefresh = function(event) {

  var iframe = this.parentElement.querySelector("iframe");

  if (iframe) {

    iframe.src = (iframe.src == iframe.dataset.source)?"iframe-default.html":iframe.dataset.source;

  }

};

TopicPanel.clickTab = function(event) {

  this.innerHTML = (this.innerHTML == "+")?"-":"+";
  this.details.classList.toggle("topic-panel-details-highlight");

};

TopicPanel.create = function(template, json) {

  var content, topic_panel;

  content = DOMKit.createElement(json.content.type, json.content.attributes, json.content.inner_html);
  topic_panel = document.importNode(template.content, true);

  topic_panel.content = topic_panel.querySelector(".topic-panel-content");
  topic_panel.content.parentNode.replaceChild(content, topic_panel.content);
  topic_panel.content = content;
  topic_panel.content = topic_panel.querySelector(".topic-panel-content");
  topic_panel.height_ratio = topic_panel.content.dataset.heightRatio;
  topic_panel.querySelector(".topic-panel-title").innerHTML = json.title;
  topic_panel.querySelector(".topic-panel-details").innerHTML = json.details;
  topic_panel.refresh = topic_panel.querySelector(".topic-panel-refresh");
  topic_panel.tab = topic_panel.querySelector(".topic-panel-tab");

  if (topic_panel.refresh) {

    topic_panel.refresh.addEventListener("click", TopicPanel.clickRefresh);

  }

  if (topic_panel.tab) {

    topic_panel.tab.details = topic_panel.querySelector(".topic-panel-details");
    topic_panel.tab.addEventListener("click", TopicPanel.clickTab);

  }

  TopicPanel.topic_panels.push(topic_panel);

  return topic_panel;

};

TopicPanel.resize = function(topic_panel) {

  topic_panel.content.style.height = Math.floor(topic_panel.content.clientWidth * topic_panel.height_ratio) + "px";

};

TopicPanel.resizeWindow = function(event) {

  for (let index = TopicPanel.topic_panels.length - 1; index > -1; -- index) {

    let topic_panel = TopicPanel.topic_panels[index];

    if (topic_panel.height_ratio) {

      TopicPanel.resize(topic_panel);

    }

  }

};

TopicPanel.topic_panels = new Array();

window.addEventListener("resize", TopicPanel.resizeWindow);
