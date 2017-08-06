// Frank Poth 08/04/2017

var display = document.getElementById("display").getContext("2d");

display.canvas.height = 180;
display.canvas.width = 320;

display.fillStyle = "#008000";
display.fillRect(0, 0, 320, 180);

display.strokeStyle = "#ffffff";
display.lineJoin = "round";
display.lineWidth = 4;

display.fillStyle = "#00ff00";
display.beginPath();
display.moveTo(10, 10);
display.lineTo(10, 90);
display.lineTo(90, 10);
display.closePath();
display.fill();
display.stroke();

display.beginPath();
display.moveTo(0, 180);
display.bezierCurveTo(80, 0, 80, 180, 160, 90);
display.bezierCurveTo(240, 0, 240, 180, 320, 0);
display.stroke();

display.fillStyle = "#0000ff";
display.beginPath();
display.rect(180, 130, 40, 40);
display.fill();
display.stroke();

display.fillStyle = "#ff0000";
display.beginPath();
display.arc(290, 150, 20, 0, Math.PI*2);
display.fill();
display.stroke();
