// Main.js

var m4 = twgl.m4;
var canvas;
var cxt;
var paint;

var theta = 0;
var dtheta = 0.01;
var radius = 400;
var eyeHeight = 200;
var target = [0,0,0];
var up = [0,0,1];

var gridSize = 50;
var wire = false;
var background = "black";

// Transform from world to camera
var Tbasic;
var Tscale;
var Trans;

var rotate;
	
var speed;
var spe;
	
var color;
var col;

var drawColor = "blue";

function init() {
	"use strict";
	canvas = document.getElementById("canvas");
	cxt = canvas.getContext('2d');
	
	rotate = document.getElementById("rotate");
	
	speed = document.getElementById("speed");
	spe = document.getElementById("spe");

	color = document.getElementById("color");
	col = document.getElementById("col");
	
	col.innerHTML = "Blue";
	color.value = 0;
	
	spe.innerHTML = "50";
	speed.value = 50;
	
	paint = new Painter(canvas, cxt);
	
	Tscale = m4.scaling([20,20,20]);  // Scale Model
	
	var Tproj = m4.perspective(Math.PI/4,canvas.width/canvas.height,50,100);
	var Tvpscale = m4.scaling([canvas.width/2,-canvas.height/2,1]);
	var Tvptrans = m4.translation([canvas.width/2,canvas.height/2,0]);
	
	var Tvp = m4.multiply(Tvpscale,Tvptrans);

	//Tproj->Tvp
	Tbasic = m4.multiply(Tproj,Tvp);
	
	// Generate translation for grid
	Trans = [];
	for(var i=0; i<gridSize; i++) {
		Trans[i] = [];
		for(var j=0; j<gridSize; j++) {
			Trans[i][j] = m4.translation([i-gridSize/2, j-gridSize/2,0]);
		}
	}
	
	color.addEventListener("input", colorHandler);
	speed.addEventListener("input", speedHandler);
	
	window.requestAnimationFrame(update);
}

function drawCube(x,y,z,color,Tx) {
	var Top = m4.translate(Tx, [x,y,z]);
	paint.addSquare(color,1,"block",Top);
	var Near = m4.rotateX(Top,-Math.PI/2);
	paint.addSquare(color,1,"block",Near);
	var Far = m4.translate(Near, [0,0,1]);
	paint.addSquare(color,1,"block",Far);
	var Left = m4.rotateY(Top,Math.PI/2);
	paint.addSquare(color,1,"block",Left);
	var Right = m4.translate(Left, [0,0,1]);
	paint.addSquare(color,1,"block",Right);
}

function grid(Tview) {
	for(var i=0; i<gridSize; i++) {
		for(var j=0; j<gridSize; j++) {
			var Tviewg = m4.multiply(Trans[i][j],Tview); 
			paint.addSquare("black", 1, "grid",Tviewg);
		}
	}
	paint.grid = true;
}

function update() {
	"use strict";
	cxt.fillStyle = background;
	cxt.fillRect(0,0,canvas.width,canvas.height);

	if(rotate.checked) {
		theta += dtheta;  // Increment rotation
	}

	var eye = [radius*Math.cos(theta), radius*Math.sin(theta), eyeHeight];
	var Tcamera=m4.inverse(m4.lookAt(eye, target, up));

	//Tscale->Tcamera->Tbasic
	var Tview = m4.multiply(Tscale,m4.multiply(Tcamera,Tbasic));

	if(rotate.checked) {
		grid(Tview);
	} else  {
		if(!paint.grid) {
			grid(Tview);
		}
	}

	drawCube(0,0,1,drawColor, Tview);
	
	paint.draw(wire);
	
	if(rotate.checked) {  // Regenerate everything
		paint.clear();
	} else {
		paint.clear("block");
	}

	window.requestAnimationFrame(update);
}

function colorHandler() {
	switch(color.value) {
		case "0":
			drawColor = "blue";
			col.innerHTML = "Blue";
			break;
		case "1":
			drawColor = "red";
			col.innerHTML = "Red";
			break;
		case "2":
			drawColor = "green";
			col.innerHTML = "Green";
			break;
		default:
			drawColor = "black";
			col.innerHTML = "Black";
			break;
	}
}

function speedHandler() {
	dtheta = speed.value/5000;
	spe.innerHTML = speed.value;
}

window.onload=init;

