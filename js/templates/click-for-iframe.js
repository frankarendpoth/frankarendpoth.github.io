// Frank Poth 03/27/2018

function ClickForIframe() {}

ClickForIframe.replaceCurrentScript = function(source, width, aspect_ratio = 0.5625) {

  var div = DOMKit.replaceCurrentScript(DOMKit.createElement("div", ["style=align-content:center;border-color:#202830;border-style:solid;border-width:2px;display:grid;justify-content:center;width:" + width + ";"], "<p style=\"color:#202830;cursor:pointer;font-size:2.0em;user-select:none;\">Click For iFrame</p>"));

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
