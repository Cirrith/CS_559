var m4 = twgl.m4;

var canvas = document.getElementById("canvas");
var cxt = canvas.getContext('2d');

function init() {
	var eye = [500, 200, 200];
	var target = [0, 0, 0];
	var up = [0, 0, 1];
	
	var Tcamera=m4.inverse(m4.lookAt(eye, target, up));
	drawAxes(cxt,Tcamera);
	
	var tester = new Firework(cxt, 250, 250, 250, 5, 2, "blue");
	
	tester.draw(Tcamera);
	
	requestAnimationFrame(draw);
}

function draw() {
	cxt.clearRect(0,0,canvas.width,canvas.height);
	tester.draw(Tcamera);
	drawAxes(cxt,Tcamera);
	window.requestAnimationFrame(draw);
}

window.onload=init;