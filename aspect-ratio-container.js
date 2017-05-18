// Frank Poth 05/18/2017

(function() {

  var aspect_ratio_containers, resize, size;

  aspect_ratio_containers = document.getElementsByClassName("aspect-ratio-container");

  resize = function(event) {

    var index;

    for (index = aspect_ratio_containers.length - 1; index > -1; -- index) {

      size(aspect_ratio_containers[index]);

    }

  };

  size = function(aspect_ratio_container) {

    var height, ratio, width;

    ratio = aspect_ratio_container.getAttribute("data-aspect-ratio").split(":");
    height = Number(ratio[1]);
    width = Number(ratio[0]);

    aspect_ratio_container.style.height = height/width * aspect_ratio_container.clientWidth + "px";

  };

  (function(){

    var index;

    for (index = aspect_ratio_containers.length - 1; index > -1; -- index) {

      size(aspect_ratio_containers[index]);

    }

    window.addEventListener("resize", resize, false);

  })();

})();
