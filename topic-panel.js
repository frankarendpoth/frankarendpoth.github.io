// Frank Poth 05/14/2017

(function() {

  var click, current_tab, current_panel, topic_panels;

  click = function(event) {

    if (window.innerWidth <= 720) {

      if (current_tab == this) {

        current_panel.classList.toggle("topic-highlight");

      } else {

        current_tab = this;

        current_panel.classList.remove("topic-highlight");
        current_panel = this.nextElementSibling;
        current_panel.classList.add("topic-highlight");

      }

    }

  };

  topic_panels = document.getElementsByClassName("topic-panel");
  current_panel = topic_panels[0];

  (function() {

    var index;

    for (index = topic_panels.length - 1; index > -1; --index) {

      topic_panels[index].getElementsByClassName("topic-title")[0].addEventListener("click", click, false);
      topic_panels[index].getElementsByClassName("topic-more")[0].addEventListener("click", click, false);
      topic_panels[index].getElementsByClassName("topic-about")[0].addEventListener("click", click, false);

    }

  })();

})();
