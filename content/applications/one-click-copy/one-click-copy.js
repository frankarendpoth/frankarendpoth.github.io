/* Frank Poth 08/31/2018 */

/* Here are some elements that I will need frequent access to. */
var elements = {
  
  click_board: document.getElementById("click-board"),
  edit_board:  document.getElementById("edit-board"),

}

var board          = new Board(elements.click_board); // The currently open board.
var buttons        = new Array(); // The array of button objects.
var current_button = undefined; // The button being edited.
var indexed_db     = new IndexedDB("one-click-copy");

  ////////////////////////
 //// EVENT HANDLERS ////
////////////////////////

function clickAddButton(event) { openEditBoard(); }

function clickBackButton(event) { board.switch(elements.click_board); }

function clickDeleteButton(event) {

  if (!confirm("Are you sure? This cannot be undone.")) return;

  if (current_button) {

    buttons.splice(buttons.indexOf(current_button));
    elements.click_board.removeChild(current_button.element);

    indexed_db.delete("name", current_button.name, "buttons");

    current_button = undefined;

    board.switch(elements.click_board);

  } else board.element.querySelector(".name").innerText = board.element.querySelector(".body").innerText = "";
        
}

function clickSaveButton(event) {

  var name = board.element.querySelector(".name").innerText;
  var body = board.element.querySelector(".body").innerText;

  if (current_button) { // We are editing a button we intentionally selected.

    if (confirm("Are you sure you want to overwrite this button?")) {

      let old_name = current_button.name;

      current_button.name = name;
      current_button.body = body;
      current_button.element.innerText = name;

      indexed_db.update("name", old_name, "buttons", current_button.toDatabaseEntry());

    }

  } else { // We are creating a new button.

    button = createButton(name, body, "#ff0000");

    indexed_db.add(button.toDatabaseEntry(), "buttons");

  }

  board.switch(elements.click_board);

}

function clickTemplateButton(event) {

  var input = document.createElement("textarea");
  
  input.value = this.parent.body;
  input.setAttribute("readonly", "");
  input.style.whiteSpace = "pre-wrap";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);

}

function contextMenuTemplateButton(event) {

  event.preventDefault();

}

function dblClickTemplateButton(event) { openEditBoard(this.parent); }

  //////////////////////////
 //// USEFUL FUNCTIONS ////
//////////////////////////

function createButton(name, body, color) {
  
  button = new Button(name, body, color);
  
  buttons.push(button); // Now we can find this button!

  elements.click_board.appendChild(button.element); // Now we can see this button!

  button.element.addEventListener("click",       clickTemplateButton); // Now we can click this button!
  button.element.addEventListener("contextmenu", contextMenuTemplateButton);
  button.element.addEventListener("dblclick",    dblClickTemplateButton); // And so on.

  return button;

}

function findButton(name) {

  for (let index = buttons.length - 1; index > -1; -- index) {

    let button = buttons[index];

    if (button.name == name) return button;

  } return undefined; // If we can't find a matching button, we return undefined.

}

function openEditBoard(button = undefined) {

  var name = elements.edit_board.querySelector(".name");
  var body = elements.edit_board.querySelector(".body");

  current_button = button;

  if (button) {

    name.innerText = button.name;
    body.innerText = button.body;

  } else name.innerText = body.innerText = "";

  board.switch(elements.edit_board);

}

  ////////////////////
 //// INITIALIZE ////
////////////////////

indexed_db.initialize((database) => {// If the database is initialized, load up some buttons!

  indexed_db.getAll("buttons", (stored_buttons) => {

    var length = stored_buttons.length;
    
    for (let index = 0; index < length; ++ index) {

      let object = stored_buttons[index];

      createButton(object.name, object.body, object.color);

    }

    elements.click_board.dataset.visible = true; // Show the clickboard after everything is loaded.

  });
  
}, (database) => {// If the database needs to be updated, use this function.

  database.createObjectStore("buttons", {

    autoIncrement: true

  }).transaction.onerror = (event) => { alert("Error Updating Database!") };

});

document.getElementById("add-button").addEventListener("click", clickAddButton);
document.getElementById("back-button").addEventListener("click", clickBackButton);
document.getElementById("delete-button").addEventListener("click", clickDeleteButton);
document.getElementById("save-button").addEventListener("click", clickSaveButton);