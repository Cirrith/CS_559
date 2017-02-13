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

var gridSize = 10;

var paint;

// Transform from world to camera
var Tcamera=m4.inverse(m4.lookAt(eye, target, up));

window.onload=init;

function init() {
	"use strict";
	canvas = document.getElementById("canvas");
	cxt = canvas.getContext('2d');
	paint = new Painter(canvas, cxt);
	
	var scale = m4.scale(m4.identity(), [50, 50, 50]);
	
	
	for(var i=0; i<gridSize; i++) {
		for(var j=0; j<gridSize; j++) {
			var Trans = m4.translate(scale, [i-gridSize/2, j-gridSize/2,0]);
			if(i%2 == j%2) {
				paint.addSquare("black", 1, Trans);
			} else {
				paint.addSquare("black", 0.6, Trans);
			}
		}
	}
	window.requestAnimationFrame(update);
}

function update() {
	"use strict";
	cxt.clearRect(0,0,canvas.width,canvas.height);
	cxt.fillStyle="white";
	cxt.fillRect(0,0,canvas.width,canvas.height);
	theta += dtheta;
	eye = [radius*Math.cos(theta), radius*Math.sin(theta), 20];
	Tcamera=m4.inverse(m4.lookAt(eye, target, up));
	paint.draw(Tcamera);
	window.requestAnimationFrame(update);
}