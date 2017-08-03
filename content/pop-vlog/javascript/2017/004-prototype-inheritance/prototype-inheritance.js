// Frank Poth 08/02/2017

function Human(name) {

  this.name = name;

}

Human.prototype = {

  constructor:Human,

  talk:function() {

    console.log("Hey, I'm a human and my name is " + this.name);

  }

};

function Worker(name, job) {

  Human.call(this, name);

  this.job = job;

}

Worker.prototype = Object.create(Human.prototype);
Worker.prototype.constructor = Worker;
Worker.prototype.talk = function() {

  console.log("Hey, my name is " + this.name + " and I am a " + this.job + ". I am a " + this.constructor.name);

};


var human = new Human("Tim");
var worker = new Worker("John", "desk jockey");

worker.talk();
