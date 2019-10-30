(() => {

  var html = {

    scene_button:  document.querySelector(".scene-button"),
    scene_output:  document.querySelector(".scene-output"),
    scene_strikes: document.querySelector(".scene-strikes"),
    scene_title:   document.querySelector(".scene-title")
    
  };

  var scenes = {

    "create_a_puzzle": {

      name:"create_a_puzzle",

      clickInterfaceButton(button) {

        var output = html.scene_output.innerText;

        switch(button.innerText) {
    
          case "BACKSPACE" : html.scene_output.innerText  = output.slice(0, output.length -1); break;
          case "SPACE"     : html.scene_output.innerText  = output + " "; break;
          default          : html.scene_output.innerText += button.innerText;
    
        }

      },

      clickSceneButton:function() {

        if (html.scene_output.innerText.length === 0) return;

        for (var index = 0; index < html.scene_output.innerText.length; index ++) {

          puzzle[index] = html.scene_output.innerText.charAt(index);
          solved[index] = "_";

        }

        changeScene("solve_a_puzzle");

      },

      setup:function() {

        puzzle = [];
        solved = [];

        html.scene_button.style.display = "grid";
        html.scene_button.innerText     = "Play!";
        html.scene_output.innerText     = "";
        html.scene_title.innerText      = "Create A Puzzle!";

        modifyInterfaceButtons(true);

      }

    },

    "solve_a_puzzle": {

      name:"solve_a_puzzle",

      clickInterfaceButton(button) {

        button.style.display = "none";
        
        if (guessLetter(button.innerText)) {
          
          generateSceneOutputFromSolved();
          
          if (testSolved()) {

            html.scene_button.innerText      = "RePlay!";        
            html.scene_strikes.style.display = "none";
            html.scene_button.style.display  = "grid";
            html.scene_title.innerText       = "You Solved It!";

          }

        } else {

          strikes ++;

          if (strikes === 6) {

            html.scene_button.innerText      = "RePlay!";        
            html.scene_strikes.style.display = "none";
            html.scene_button.style.display  = "grid";
            html.scene_title.innerText       = "Out Of Tries!";

            modifyInterfaceButtons(false);

          }

          html.scene_strikes.innerText = generateSceneStrikes();

        }

      },

      clickSceneButton() {

        changeScene("create_a_puzzle");

      },

      setup:function() {

        generateSceneOutputFromPuzzle();

        strikes                          = 0;

        html.scene_button.style.display  = "none";
        html.scene_strikes.style.display = "grid";
        html.scene_strikes.innerText     = generateSceneStrikes();
        html.scene_title.innerText       = "Solve The Puzzle!";

        modifySpecialButtons(false);

      }

    }

  };

  var colors = ["#00C4D6", "#002933", "#006199", "#002D80", "#008F79", "#00523A", "#009445", "#1D00AD", "#1A005C", "#6000D6", "#9E006F", "#990033", "#5C0015", "#7A95FF", "#A985FF", "#FF758F", "#FF7547", "#9BCD9B", "#2E0038", "#6B0032"];

  var scene = undefined;

  var puzzle = [];
  var solved = [];

  var strikes = 0;
  var max_strikes = 6;

  function changeScene(name) {

    scene = scenes[name];
    scene.setup();

  }

  function clickInterface(event) {
    
    event.preventDefault();
    event.stopPropagation();

    if (event.target.className === "button interface-button" || event.target.className === "button interface-button special") scene.clickInterfaceButton(event.target);

  }

  function clickSceneButton(event) {

    event.preventDefault();
    event.stopPropagation();

    scene.clickSceneButton();

  }

  function generateSceneOutputFromPuzzle() {

    var value;

    html.scene_output.innerText = "";

    for (var index = 0; index < puzzle.length; index ++) {

      value = puzzle[index];

      switch(value) {

        case " ": case ",": case ".": case "?": case "!": case "'": solved[index] = value; break;
        default:                                                    solved[index] = "_";

      }

      html.scene_output.innerText += solved[index];

    }

  }

  function generateSceneOutputFromSolved() {

    var output = "";

    for (index = 0; index < solved.length; index ++) output += solved[index];

    html.scene_output.innerText = output;

  }

  function generateSceneStrikes() {

    var output = "";

    for (var index = max_strikes - strikes; index > 0; -- index) output += "O";

    for (index = strikes; index > 0; -- index) output = "X" + output;

    return output;

  }

  function generateColor() {

    return colors[Math.floor(Math.random() * colors.length)];

  }

  function guessLetter(character) {

    var match = false;

    for (var index = 0; index < puzzle.length; index ++) {

      if (character === puzzle[index]) {
       
        match         = true;
        solved[index] = character;

      }

    }

    return match;

  }

  function loop() {

    window.setTimeout(loop, 15000); // time must match css for body tag

    document.body.style.backgroundColor = generateColor();

  }

  function modifyInterfaceButtons(visible) {

    var display = visible === true ? "grid" : "none";

    var buttons = document.querySelectorAll(".interface-button");

    for (var index = buttons.length - 1; index > -1; -- index) buttons[index].style.display = display;

  }

  function modifySpecialButtons(visible) {

    var display = visible === true ? "grid" : "none";

    var special_buttons = document.querySelectorAll(".special");

    for (var index = special_buttons.length - 1; index > -1; -- index) special_buttons[index].style.display = display;

  }

  function setup() {

    document.querySelector(".interface").addEventListener("click", clickInterface);

    html.scene_button.addEventListener("click", clickSceneButton);

    changeScene("create_a_puzzle");
  
    loop();

  }

  function testSolved() {

    for (var index = solved.length - 1; index > -1; -- index) if (solved[index] === "_") return false;

    return true;

  }

  setup();

})();