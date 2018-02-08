// Frank Poth 01/27/2018

/* This paginator is designed for static websites, making it quite rare. People
don't usually do stuff like this for static websites because of how much maintenance
it requires. Every time you add content to your site, you have to update the paginator.
Sites with backend servers that can handle loading dynamic content for your site at
a simple request are far better suited to handle this sort of thing. But, if you are
set on making your static site as dynamic as possible and don't mind maintaining it,
this will work just fine for you. */

/* The paginator takes an array of links or urls to content. Each url and its corresponding
file content represent 1 item to paginate. The index is the first item in that list
of links to be displayed on a page, and the limit is how many items will be displayed
per page. */
const Paginator = function(links, index, limit) {

  this.links = links;
  this.index = 0;
  /* Make sure the limit per page is not greater than the actual amount of items we have or 0 */
  this.limit = (limit <= links.length && limit > 0) ? limit : links.length;

  /* I created my html with JavaScript, but you could easily do this with an HTML
  template or create your HTML inline and use querySelector to get a reference to it.
  I thought it would be more portable to use this approach. That being said, All the
  CSS for these elements is in the pagination.css file. How you style this stuff is
  up to you. Even without the css, it all works. */
  this.html = document.createElement("div");
  this.html.setAttribute("class", "paginator");
  this.html.innerHTML = "<div class = \"paginator-content\"></div><div class = \"paginator-navigator\"><a class = \"paginator-button\">back</a><div class = \"paginator-index\"></div><a class = \"paginator-button\">next</a></div>";

  /* Here we set up the buttons created above to respond to click events and give
  them a reference to their paginator. */
  var buttons = this.html.querySelectorAll("a");

  for (let index = buttons.length - 1; index > -1; -- index) {// Loop through all buttons.

    let button = buttons[index];

    button.addEventListener("click", Paginator.click);
    /* Button elements need access to their paginator object so they can access its
    variables inside of the Paginator.click event handler. */
    button.paginator = this;

  }

};

Paginator.prototype = {

  constructor:Paginator,

  /* Changes the currently displayed items in the paginator's content div. */
  changeIndex:function(new_index) {

    var content_div, content_strings, limit, loaded;

    this.index = new_index;// The new index in the list of links to start getting items from.

    /* Show the users what page they are on and how many pages there are. */
    this.html.querySelector(".paginator-index").innerHTML = (new_index / this.limit + 1) + " of " + Math.ceil(this.links.length / this.limit);

    content_div = this.html.querySelector(".paginator-content");
    content_div.scrollTop = 0;// Whenever the page changes, scroll content to the top.
    content_strings = [];// We load each file in order into this array.
    /* Make sure we don't try to load items that don't exist. */
    limit = (new_index + this.limit <= this.links.length) ? this.limit : this.links.length - new_index;
    loaded = 0;// Keep track of how many files have been loaded.

    paginator = this;// Get a reference to this paginator.

    /* The reason for this seemingly convoluted method of loading content is that
    asynchronous requests can load at different rates, meaning if I request content
    in a specific order I might get it in a different order. This would be terrible
    if I were requesting pages in a book and they came back out of order, so to remedy
    this, I load each file's content into the content_strings array in the correct
    order and then when everything is done loading, I put the strings together. */
    for (let index = 0; index < limit; index ++) {

      Paginator.requestContent(this.links[this.index + index], function(request) {

        loaded ++;

        // index is relative to the value it was set to in the encompassing for loop thanks to let scope.
        content_strings[index] = "<br>" + request.responseText + "<br>";

        if (loaded >= limit) {

          content_div.innerHTML = "";

          for (let index = 0; index < limit; index ++) {

            content_div.innerHTML += content_strings[index];

          }

        }

      });

    }

  }

};

/* The click listener for this paginator. */
Paginator.click = function(event) {

  var shift;// The number of items to shift past when loading the items for the new page.

  switch(this.innerHTML) {

    case "back":

      shift = this.paginator.index - this.paginator.limit;
      if (shift < 0) return;

    break;

    case "next":

      shift = this.paginator.index + this.paginator.limit;
      if (shift >= this.paginator.links.length) return;

    break;

  }

  this.paginator.changeIndex(shift);

};

/* Creates a paginator inside a <script> tag and replaces that tag with the paginator's html. */
Paginator.create = function(links, index, limit) {

  var paginator, script;

  script = document.currentScript;// Get the currently running script.

  paginator = new Paginator(links, 0, limit);

  paginator.changeIndex(index);/* Load up the content. */

  /* Replace the running script with the html of the paginator object. */
  script.parentNode.replaceChild(paginator.html, script);

};

/* Loads a file at the specified url and executes the callback. */
Paginator.requestContent = function(url, callback) {

  var request;

  request = new XMLHttpRequest();

  request.addEventListener("load", function(event) {

    callback(this);

  });

  request.open("GET", url);
  request.send(null);

}
