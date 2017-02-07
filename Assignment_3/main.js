var m4 = twgl.m4;

var canvas = document.getElementById("canvas");
var cxt = canvas.getContext('2d');

var tester = new Firework(100, 100, 100, 2, 3, "blue");

var theta = 0;
var radius = 100;
var eye = [radius*Math.cos(theta), radius*Math.sin(theta), 50];

var target = [0, 0, 0];
var up = [0, 0, 1];

var Tcamera=m4.inverse(m4.lookAt(eye, target, up));
drawAxes(Tcamera);

tester.draw(Tcamera);

requestAnimationFrame(draw);

function draw() {
	cxt.clearRect(0,0,canvas.width,canvas.height);
	theta += 0.01;
	eye = [radius*Math.cos(theta), radius*Math.sin(theta), 50];
	Tcamera=m4.inverse(m4.lookAt(eye, target, up));
	if(tester.stat >= 100)
		tester = new Firework(100, 100, 100, 2, 3, "blue");
	tester.draw(Tcamera);
	drawAxes(Tcamera);
	window.requestAnimationFrame(draw);
}

//window.onload=init;