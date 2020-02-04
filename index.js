/* Frank Poth 2020-01-03 */

(() => {
  
  const main_container = document.getElementById('main');

  const clearMainContainer = function() {

    while(main_container.firstChild) main_container.removeChild(main_container.firstChild);

  };

  const fillMainContainer = function(markup) {

    var fragment = document.createRange().createContextualFragment(markup);

    while(fragment.firstElementChild) main_container.appendChild(fragment.firstElementChild);


  };

  const getLocationHashValue = function() {
    
    return window.location.hash.slice(1, window.location.hash.length);

  };

  const loadPage = function(url) {

    if (url == '') {
      
      window.location.hash = '/pages/home/home.js';
      return;

    }

    import(url).then(module => {

      clearMainContainer();
      
      module.Page.getHTML(fillMainContainer);
    
    });

  };

  window.addEventListener('hashchange', event => {

    event.preventDefault();

    loadPage(getLocationHashValue());

  });

  loadPage(getLocationHashValue());

})();