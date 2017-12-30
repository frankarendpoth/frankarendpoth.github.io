// Frank Poth 12/29/2017

(function() { //"use strict";

  const PI = Math.PI;
  const cos = Math.cos;
  const pow = Math.pow;
  const sin = Math.sin;
  const tan = Math.tan;

  var controller, resize, ui, update;

  controller = {

    active:false, state:false, value:"",

    click:function(event) {

      controller.active = true;
      controller.value = this.innerHTML;

      update();

    },

    keyPress:function(event) {

      if (!event.repeat) {

        controller.active = true;
        controller.value = String(event.key);

      }

      update();

    }

  };

  ui = {

    calculator:document.getElementById("calculator"),
    screen:document.getElementById("calculator-screen"),

    buttons: {

      "clr":document.getElementById("calculator-clr"),
      "f1":document.getElementById("calculator-f1"),
      "f2":document.getElementById("calculator-f2"),

      "0":document.getElementById("calculator-0"),
      "1":document.getElementById("calculator-1"),
      "2":document.getElementById("calculator-2"),
      "3":document.getElementById("calculator-3"),
      "4":document.getElementById("calculator-4"),
      "5":document.getElementById("calculator-5"),
      "6":document.getElementById("calculator-6"),
      "7":document.getElementById("calculator-7"),
      "8":document.getElementById("calculator-8"),
      "9":document.getElementById("calculator-9"),

      "+":document.getElementById("calculator-plus"),
      "-":document.getElementById("calculator-minus"),
      "/":document.getElementById("calculator-divide"),
      "*":document.getElementById("calculator-multiply"),
      "(":document.getElementById("calculator-open-parenthesis"),
      ")":document.getElementById("calculator-close-parenthesis"),
      "PI":document.getElementById("calculator-pi"),
      "cos(":document.getElementById("calculator-cos"),
      "sin(":document.getElementById("calculator-sin"),
      "tan(":document.getElementById("calculator-tan"),
      "pow(":document.getElementById("calculator-pow"),
      ".":document.getElementById("calculator-prd"),
      ",":document.getElementById("calculator-cma"),
      "del":document.getElementById("calculator-del"),
      "ans":document.getElementById("calculator-ans")

    },

    hitF1:function() {

      this.buttons["+"].style.display = "grid";
      this.buttons["-"].style.display = "grid";
      this.buttons["*"].style.display = "grid";
      this.buttons["/"].style.display = "grid";
      this.buttons["("].style.display = "grid";
      this.buttons[")"].style.display = "grid";

      this.buttons["PI"].style.display = "none";
      this.buttons["cos("].style.display = "none";
      this.buttons["sin("].style.display = "none";
      this.buttons["tan("].style.display = "none";
      this.buttons["pow("].style.display = "none";
      this.buttons[","].style.display = "none";

    },

    hitF2:function() {

      this.buttons["+"].style.display = "none";
      this.buttons["-"].style.display = "none";
      this.buttons["*"].style.display = "none";
      this.buttons["/"].style.display = "none";
      this.buttons["("].style.display = "none";
      this.buttons[")"].style.display = "none";

      this.buttons["PI"].style.display = "grid";
      this.buttons["cos("].style.display = "grid";
      this.buttons["sin("].style.display = "grid";
      this.buttons["tan("].style.display = "grid";
      this.buttons["pow("].style.display = "grid";
      this.buttons[","].style.display = "grid";

    }

  };

  resize = function(event) {

    let height = Math.floor(document.documentElement.clientHeight);
    let width = Math.floor(document.documentElement.clientWidth);
    ui.screen.style.maxWidth = ui.screen.clientWidth + "px";

  };

  update = function() {

    if (controller.active) {

      controller.active = false;

      switch(controller.value) {

        case "0": case "1": case "2": case "3": case "4": case "5": case "6": case "7": case "8": case "9":
        case "+": case "-": case "/": case "*": case "(": case ")":
        case "PI": case "cos(": case "sin(": case "tan(": case "pow(":
        case ",": case ".":

          ui.screen.innerHTML += controller.value;

        break;

        case "clr": ui.screen.innerHTML = ""; break;
        case "f1": ui.hitF1(); break;
        case "f2": ui.hitF2(); break;

        case "del": case "Delete":

          if (ui.screen.innerHTML.length > 0) ui.screen.innerHTML = ui.screen.innerHTML.slice(0, ui.screen.innerHTML.length - 1);

        break;

        case "Enter": case "ans":

          let answer = undefined;

          try {

            answer = parseFloat(eval(ui.screen.innerHTML).toPrecision(10));

          } catch(error) {

            answer = error;

          }

          ui.screen.innerHTML = answer;

        break;

      }

    }

  };

      ////////////////////
    //// INITIALIZE ////
  ////////////////////

  window.addEventListener("resize", resize);

  for (let property in ui.buttons) {

    ui.buttons[property].addEventListener("click",  controller.click, { passive:true });

  }

  window.addEventListener("keypress", controller.keyPress);

  resize();

})();
