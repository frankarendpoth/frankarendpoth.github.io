// Frank Poth 03/27/2018

const ClickForIframe = function() {};

ClickForIframe.replace = function(element, source, width, aspect_ratio) {

  var div = DocKit.createElement("div", ["class=ClickForIframe", "style=max-width:" + width + "; background-color:rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ");"], "<p>click to load content</p>");

  DocKit.replaceElement(element, div);

  div.addEventListener("click", function(event) {

    div.innerHTML = "";

    let iframe = DocKit.createElement("iframe", ["src=" + source]);

    div.appendChild(iframe);

    div.style.height = div.clientWidth * aspect_ratio + "px";

  }, { once:true });

  window.addEventListener("resize", function(event) {

    if (div.querySelector("iframe")) div.style.height = div.clientWidth * aspect_ratio + "px";

  });

};
