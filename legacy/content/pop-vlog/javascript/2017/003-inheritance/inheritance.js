// Frank Poth 08/02/2017

function Human(name) {

  this.name = name;

}

function Worker(name, job) {

  Human.call(this, name);

  this.job = job;

}


var human = new Human("Tim");
var worker = new Worker("John", "desk jockey");


console.log(human.name);
console.log(worker.name + ", " + worker.job);
