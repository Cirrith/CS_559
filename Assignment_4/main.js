// Main.js

var m4 = twgl.m4;
var cxt;

var theta = 0;
var dtheta = 0.01;
var radius = 100;
var eye = [radius*Math.cos(theta), radius*Math.sin(theta), 50];
var target = [0, 0, 0];
var up = [0, 0, 1];

// Transform from world to camera
var Tcamera=m4.inverse(m4.lookAt(eye, target, up));

window.onload=init;

function init() {
	"use strict";
	var canvas = document.getElementById("canvas");
	cxt = canvas.getContext('2d');
	var paint = new Painter(canvas, cxt);
	paint.addSquare("red", 0.5, m4.identity());
	paint.addSquare("black", 1, m4.identity());
	window.requestAnimationFrame(update);
}

function update() {
	"use strict";
	
	
	window.requestAnimationFrame(update);
}