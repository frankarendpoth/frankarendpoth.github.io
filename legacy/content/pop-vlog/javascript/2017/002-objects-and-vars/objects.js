

var time = "3:43";

var rectangle = {

  x:0,
  y:10,
  width:100,
  height:200,

  print:function(what_to_say) {

    console.log(this.width + ", " + what_to_say);

  }

};

rectangle.print("I'm a rectangle!");

function sayHello() {

  alert("Hello!");

}

var sayHello = function() {

  alert("Hello, again!");

}

sayHello();
