// Main.js

var m4 = twgl.m4;
var canvas;
var cxt;

var theta = 0;
var dtheta = 0.01;
var radius = 100;
var eye = [radius*Math.cos(theta), radius*Math.sin(theta), 150];
var target = [0, 0, 0];
var up = [0, 0, 1];

var gridSize = 50;
var wire = false;

var paint;

// Transform from world to camera
var Tcamera=m4.inverse(m4.lookAt(eye, target, up));
var scale;

window.onload=init;

var count = 0;

function init() {
	"use strict";
	canvas = document.getElementById("canvas");
	cxt = canvas.getContext('2d');
	paint = new Painter(canvas, cxt);
	
	scale = m4.scale(m4.identity(), [50, 50, 50]);

	window.requestAnimationFrame(update);
}

function drawCube(x,y,z,color,Tx) {
	var Top = m4.translate(Tx, [x,y,z]);
	paint.addSquare(color,1,"Box",Top);
	var Near = m4.rotateX(Top,-Math.PI/2);
	paint.addSquare(color,1,"Box",Near);
	var Far = m4.translate(Near, [0,0,1]);
	paint.addSquare(color,1,"Box",Far);
	var Left = m4.rotateY(Top,Math.PI/2);
	paint.addSquare(color,1,"Box",Left);
	var Right = m4.translate(Left, [0,0,1]);
	paint.addSquare(color,1,"Box",Right);
}

function update() {
	"use strict";
	cxt.clearRect(0,0,canvas.width,canvas.height);
	theta += dtheta;
	eye = [radius*Math.cos(theta), radius*Math.sin(theta), 20];
	Tcamera=m4.inverse(m4.lookAt(eye, target, up));
	
	for(var i=0; i<gridSize; i++) {
		for(var j=0; j<gridSize; j++) {
			var Trans = m4.translate(scale, [i-gridSize/2, j-gridSize/2,0]);
			var Tview = m4.multiply(Tcamera, Trans);
			if(i%2 == j%2) {
				paint.addSquare("black", 1, "Grid",Tview);
			} else {
				paint.addSquare("black", 0.8, "Grid",Tview);
			}
		}
	}
	drawCube(10,0,1,"red", Tcamera);
	drawCube(0,0,1,"blue", Tcamera);
	
	paint.draw(m4.identity(), wire);
	
	paint.clear();
	
	count++;
	if(count == 60) {
		
		count = 0;
	}
	window.requestAnimationFrame(update);
}

