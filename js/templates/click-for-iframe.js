// Frank Poth 03/27/2018

function ClickForIframe() {}

ClickForIframe.replaceCurrentScript = function(source, width, aspect_ratio = 0.5625) {

  var div = DOMKit.replaceCurrentScript(DOMKit.createElement("div", ["style=align-content:center;display:grid;justify-content:center;width:" + width + ";"], "<p style=\"font-size:3.0em;\">click for iframe</p>"));

  div.addEventListener("click", function(event) {

    let iframe = DOMKit.replaceElement(div, DOMKit.createElement("iframe", ["src=" + source, "style=width:" + div.style.width + ";height:" + div.style.height + ";"]));
    iframe.addEventListener("resize", function(event) {

      DOMKit.maintainAspectRatio(iframe, aspect_ratio);

    });

    DOMKit.maintainAspectRatio(iframe, aspect_ratio);

  }, { once:true });

  div.addEventListener("resize", function(event) {

    DOMKit.maintainAspectRatio(div, aspect_ratio);

  });

  DOMKit.maintainAspectRatio(div, aspect_ratio);

};
