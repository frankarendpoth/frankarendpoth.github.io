// Frank Poth 08/03/2017

function Human(name) {

  this.name = name;

}

Human.prototype = {

  talk:function() {

    console.log("Hey, I'm a human and my name is " + this.name);

  }

};

function Worker(job) {

  this.job = job;

}

Worker.prototype = {

  work:function() {

    console.log("I am a worker and my job is " + this.job);

  }

};

function Bob(job) {

  Human.call(this, "Bob");
  Worker.call(this, job);

}

Bob.prototype = Object.create(Human.prototype);
Object.assign(Bob.prototype, Worker.prototype);

var bob = new Bob("rocket ship captain");

bob.talk();
bob.work();
