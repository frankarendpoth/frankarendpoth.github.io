// Frank Poth 09/07/2018 - 09/07/2018

var directory_view = new DirectoryView();

var view_manager = {

  current_view:undefined,

  switch(view) {

    this.current_view.removeListeners();
    this.current_view.setVisible(false);
    this.current_view = view;
    view.addListeners();
    view.setVisible(true);

  }
  
};

  ////////////////////////
 //// EVENT HANDLERS ////
////////////////////////

function clickAddDirectoryButton(event) { event.preventDefault();

  directory_view.addDirectoryButton();

}

function clickAddContentButton(event) { event.preventDefault();

  directory_view.addContentButton();
  
}

  ///////////////////
 //// UTILITIES ////
///////////////////

  ////////////////////
 //// INITIALIZE ////
////////////////////

view_manager.current_view = directory_view;
view_manager.current_view.setVisible(true);
view_manager.current_view.addListeners();