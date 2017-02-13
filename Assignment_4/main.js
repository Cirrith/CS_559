// Main.js

var m4 = twgl.m4;
var canvas;
var cxt;

var theta = 0;
var dtheta = 0.01;
var radius = 50;
var eye = [radius*Math.cos(theta), radius*Math.sin(theta), 50];
var target = [0, 0, 0];
var up = [0, 0, 1];

var paint;

// Transform from world to camera
var Tcamera=m4.inverse(m4.lookAt(eye, target, up));

window.onload=init;

function init() {
	"use strict";
	canvas = document.getElementById("canvas");
	cxt = canvas.getContext('2d');
	paint = new Painter(canvas, cxt);
	paint.addSquare("black", 1, m4.identity());
	var Ttrans = m4.translate(m4.identity(), [50,0,0]);
	paint.addSquare("black", 0.6, Ttrans);
	window.requestAnimationFrame(update);
}

function update() {
	"use strict";
	cxt.clearRect(0,0,canvas.width,canvas.height);
	cxt.fillStyle="white";
	cxt.fillRect(0,0,canvas.width,canvas.height);
	theta += dtheta;
	eye = [radius*Math.cos(theta), radius*Math.sin(theta), 50];
	Tcamera=m4.inverse(m4.lookAt(eye, target, up));
	paint.draw(Tcamera);
	window.requestAnimationFrame(update);
}