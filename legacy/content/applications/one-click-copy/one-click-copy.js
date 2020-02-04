/* Frank Poth 08/31/2018 */

/* Here are some elements that I will need frequent access to. */
var elements = {
  
  click_board:        document.getElementById("click-board"),
  color_board:        document.getElementById("color-board"),
  edit_board:         document.getElementById("edit-board")

}

var board          = new Board(elements.click_board); // The currently open board.
var buttons        = new Array(); // The array of button objects.
var current_button = undefined; // The button being edited.
var indexed_db     = new IndexedDB("one-click-copy");

  ////////////////////////
 //// EVENT HANDLERS ////
////////////////////////

function clickAddButton(event) { event.preventDefault();  
  
  openEditBoard();

}

function clickBackButton(event) { event.preventDefault();
  
  board.switch(elements.click_board);

}

function clickColorButton(event) { event.preventDefault();

  elements.color_board.style.backgroundColor = board.element.style.backgroundColor;
  board.switch(elements.color_board);

}

function clickColorBoard(event) { event.preventDefault();

  board.switch(elements.edit_board);

}

function clickDeleteButton(event) { event.preventDefault();

  if (!confirm("Are you sure? This cannot be undone.")) return;

  if (current_button) {

    buttons.splice(buttons.indexOf(current_button));
    elements.click_board.removeChild(current_button.element);

    indexed_db.delete(current_button.toDatabaseEntry(), "buttons");

    current_button = undefined;

    board.switch(elements.click_board);

  } else board.element.querySelector(".name").innerText = board.element.querySelector(".body").innerText = "";
        
}

function clickSaveButton(event) { event.preventDefault();

  var name  = board.element.querySelector(".name").innerText;
  var body  = board.element.querySelector(".body").innerText;
  var color = board.element.style.backgroundColor;

  if (current_button) { // We are editing a button we intentionally selected.

    if (confirm("Are you sure you want to overwrite this button?")) {

      let old_current_button = current_button.toDatabaseEntry();

      current_button.name  = name;
      current_button.body  = body;
      current_button.color = color;
      current_button.element.innerText = name;
      current_button.element.style.backgroundColor = color;

      indexed_db.update(old_current_button, current_button.toDatabaseEntry(), "buttons");

    }

  } else { // We are creating a new button.

    button = createButton(name, body, color);

    indexed_db.add(button.toDatabaseEntry(), "buttons");

  }

  board.switch(elements.click_board);

}

function clickTemplateButton(event) { event.preventDefault();

  var input = document.createElement("textarea");
  
  input.value = this.parent.body;
  input.setAttribute("readonly", "");
  input.style.whiteSpace = "pre-wrap";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);

}

function contextMenuTemplateButton(event) { event.preventDefault();

  // I'd like an option to move the buttons left and right.

}

function dblClickTemplateButton(event) { event.preventDefault();
  
  openEditBoard(this.parent);

}

function mouseMoveColorBoard(event) { event.preventDefault();

  var rectangle = board.element.getBoundingClientRect();

  var x = event.clientX - rectangle.left - rectangle.width * 0.5;
  var y = event.clientY - rectangle.top - rectangle.height * 0.5;
  var max_distance = rectangle.width < rectangle.height ? rectangle.width * 0.5 : rectangle.height * 0.5;
  var angle = Math.floor(Math.atan2(y, x) * 180 / Math.PI + 180);
  var distance = Math.floor((Math.sqrt(x * x + y * y) / max_distance) * 100);

  if (distance > 100) distance = 100;

  elements.edit_board.style.backgroundColor = board.element.style.backgroundColor = "hsl(" + angle + "," + distance + "%,50%)";

}

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

function openEditBoard(button = undefined) {

  var name = elements.edit_board.querySelector(".name");
  var body = elements.edit_board.querySelector(".body");

  current_button = button;

  if (button) {

    name.innerText = button.name;
    body.innerText = button.body;

    elements.edit_board.style.backgroundColor = button.color;

  } else {
    
    name.innerText = body.innerText = "";

  }

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

document.getElementById("add-button").addEventListener("click",    clickAddButton);
document.getElementById("color-button").addEventListener("click",  clickColorButton);
document.getElementById("back-button").addEventListener("click",   clickBackButton);
document.getElementById("delete-button").addEventListener("click", clickDeleteButton);
document.getElementById("save-button").addEventListener("click",   clickSaveButton);

elements.color_board.addEventListener("click",     clickColorBoard);
elements.color_board.addEventListener("mousemove", mouseMoveColorBoard);

alert("One Click Copy is a fast way to copy your email templates. To start, click the + button and make a new template. To edit an existing template, Double-Click its button.");