// Frank Poth 12/29/2017

(function() { "use strict";

  const PI = Math.PI;
  const pow = Math.pow;
  const sqrt = Math.sqrt;
  const ln = Math.log;
  const log = Math.log10;
  const rnd = Math.random;
  const cos = Math.cos;
  const sin = Math.sin;
  const tan = Math.tan;
  const acos = Math.acos;
  const asin = Math.asin;
  const atan = Math.atan;

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

      "?":document.getElementById("calculator-q"),
      "clr":document.getElementById("calculator-clr"),
      "f1":document.getElementById("calculator-f1"),
      "f2":document.getElementById("calculator-f2"),
      "f3":document.getElementById("calculator-f3"),

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
      "pow(":document.getElementById("calculator-pow"),
      "sqrt(":document.getElementById("calculator-sqrt"),
      "cos(":document.getElementById("calculator-cos"),
      "sin(":document.getElementById("calculator-sin"),
      "tan(":document.getElementById("calculator-tan"),
      "acos(":document.getElementById("calculator-acos"),
      "asin(":document.getElementById("calculator-asin"),
      "atan(":document.getElementById("calculator-atan"),
      "ln(":document.getElementById("calculator-ln"),
      "log(":document.getElementById("calculator-log"),
      "rnd()":document.getElementById("calculator-rnd"),
      ",":document.getElementById("calculator-cma"),
      ".":document.getElementById("calculator-prd"),
      "del":document.getElementById("calculator-del"),
      "ans":document.getElementById("calculator-ans"),

    },

    hitF1:function() {

      this.buttons["+"].style.display = "grid";
      this.buttons["-"].style.display = "grid";
      this.buttons["*"].style.display = "grid";
      this.buttons["/"].style.display = "grid";
      this.buttons["("].style.display = "grid";
      this.buttons[")"].style.display = "grid";

      this.buttons["PI"].style.display = "none";
      this.buttons["pow("].style.display = "none";
      this.buttons["sqrt("].style.display = "none";
      this.buttons["ln("].style.display = "none";
      this.buttons["log("].style.display = "none";
      this.buttons["rnd()"].style.display = "none";
      this.buttons["cos("].style.display = "none";
      this.buttons["sin("].style.display = "none";
      this.buttons["tan("].style.display = "none";
      this.buttons["acos("].style.display = "none";
      this.buttons["asin("].style.display = "none";
      this.buttons["atan("].style.display = "none";

    },

    hitF2:function() {

      this.buttons["+"].style.display = "none";
      this.buttons["-"].style.display = "none";
      this.buttons["*"].style.display = "none";
      this.buttons["/"].style.display = "none";
      this.buttons["("].style.display = "none";
      this.buttons[")"].style.display = "none";
      this.buttons["cos("].style.display = "none";
      this.buttons["sin("].style.display = "none";
      this.buttons["tan("].style.display = "none";
      this.buttons["acos("].style.display = "none";
      this.buttons["asin("].style.display = "none";
      this.buttons["atan("].style.display = "none";

      this.buttons["PI"].style.display = "grid";
      this.buttons["pow("].style.display = "grid";
      this.buttons["sqrt("].style.display = "grid";
      this.buttons["ln("].style.display = "grid";
      this.buttons["log("].style.display = "grid";
      this.buttons["rnd()"].style.display = "grid";

    },

    hitF3:function() {

      this.buttons["+"].style.display = "none";
      this.buttons["-"].style.display = "none";
      this.buttons["*"].style.display = "none";
      this.buttons["/"].style.display = "none";
      this.buttons["("].style.display = "none";
      this.buttons[")"].style.display = "none";
      this.buttons["PI"].style.display = "none";
      this.buttons["pow("].style.display = "none";
      this.buttons["sqrt("].style.display = "none";
      this.buttons["ln("].style.display = "none";
      this.buttons["log("].style.display = "none";
      this.buttons["rnd()"].style.display = "none";

      this.buttons["cos("].style.display = "grid";
      this.buttons["sin("].style.display = "grid";
      this.buttons["tan("].style.display = "grid";
      this.buttons["acos("].style.display = "grid";
      this.buttons["asin("].style.display = "grid";
      this.buttons["atan("].style.display = "grid";

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
        case "PI": case "pow(": case "sqrt(": case "ln(": case "log(": case "rnd()":
        case "cos(": case "sin(": case "tan(": case "acos(": case "asin(": case "atan(":
        case ",": case ".":

          ui.screen.innerHTML += controller.value;

        break;

        case "clr": ui.screen.innerHTML = ""; break;
        case "f1": ui.hitF1(); break;
        case "f2": ui.hitF2(); break;
        case "f3": ui.hitF3(); break;

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

        case "?": ui.screen.innerHTML = "Help Menu<br><br>*Always close parenthesis.<br><br>pow(<br>Returns the base to the exponent power. Must be written in the form pow(base, exponent)<br><br>acos( & asin(<br> Return the arcCosine and arcTangent of a number in radians. The number must be between -1 and 1 or NaN will be returned.<br><br>ln( & log(<br>ln is base e. log is base 10.<br><br>rnd()<br>Returns a pseudo random number.<br><br>This is a Javascript calculator that evaluates input with the eval method. This application was written by Frank Poth.";

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
