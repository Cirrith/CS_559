var m4 = twgl.m4;

var canvas = document.getElementById("canvas");
var cxt = canvas.getContext('2d');

var tester = new Firework(250, 250, 250, 5, 2, "blue");

var eye = [500, 200, 200];
var target = [0, 0, 0];
var up = [0, 0, 1];

var Tcamera=m4.inverse(m4.lookAt(eye, target, up));
drawAxes(Tcamera);

tester.draw(Tcamera);

cxt.fillStyle="blue";

requestAnimationFrame(draw);

function draw() {
	cxt.clearRect(0,0,canvas.width,canvas.height);
	tester.draw(Tcamera);
	drawAxes(Tcamera);
	window.requestAnimationFrame(draw);
}

//window.onload=init;