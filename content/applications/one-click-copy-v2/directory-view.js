// Frank Poth 09/07/2018 - 09/07/2018

class DirectoryView extends View {

  constructor() {

    super(document.getElementById("directory-view"));

    this.directories_tree     = this.element.querySelector("#directories-tree");
    this.directories          = this.element.querySelector("#directories");
    this.contents             = this.element.querySelector("#contents");
    this.add_directory_button = new Button(this.element.querySelector("#add-directory-button"));
    this.add_content_button   = new Button(this.element.querySelector("#add-content-button"));

  }

    ////////////////////////
   //// EVENT HANDLERS ////
  ////////////////////////

  addDirectoryButton() {

    this.directories.appendChild(new DirectoryButton("biff").element);

  }

  addContentButton() {

  }

    ///////////////////
   //// UTILITIES ////
  ///////////////////

  addListeners() {

    this.add_directory_button.element.addEventListener("click", this.clickAddDirectoryButton);
    this.add_content_button.element.addEventListener("click", this.clickAddContentButton);

  }

}