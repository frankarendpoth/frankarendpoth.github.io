function requestContent(url) {

  var main = document.querySelector("main");
  var link = document.querySelector("[data-main-css]");

  main.innerHTML = "";

  AJAXKit.requestParsedHTML(url, (element) => {

    if (link) document.head.removeChild(link);
    main.appendChild(element);

  });

}