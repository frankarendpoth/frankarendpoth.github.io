var link = document.querySelector("#main-css");

function requestContent(url) {

  var main = document.querySelector("main");

  main.innerHTML = "";

  AJAXKit.requestParsedHTML(url, (element) => {

    main.appendChild(element);

  });

}