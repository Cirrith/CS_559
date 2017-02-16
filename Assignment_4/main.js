// Main.js

var m4 = twgl.m4;
var canvas;
var cxt;
var paint;

var theta = 0;
var dtheta = 0.01;
var radius = 20;
var eyeHeight = 400;
var target = [0,0,0];
var up = [0,0,1];

var gridSize = 20;
var wire = false;

// Transform from world to camera
var Tscale;
var Tproj;
var Tview;
var Tlate;

var count = 0;

function init() {
	"use strict";
	canvas = document.getElementById("canvas");
	cxt = canvas.getContext('2d');
	paint = new Painter(canvas, cxt);
	
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
	cxt.clearRect(0,0,canvas.width,canvas.height);  // Clean Canvas
	cxt.fillStyle = "Black";
	cxt.fillRect(0,0,canvas.width,canvas.height);
	theta += dtheta;  // Increment rotation

	var eye = [radius*Math.cos(theta), radius*Math.sin(theta), eyeHeight];
	var Tcamera=m4.inverse(m4.lookAt(eye, target, up));

	var Tscale = m4.scaling([25,25,25]);
	
	var Tproj = m4.perspective(Math.PI/4,canvas.width/canvas.height,50,100);
	var Tvpscale = m4.scaling([canvas.width/2,-canvas.height/2,1]);
	var Tvptrans = m4.translation([canvas.width/2,canvas.height/2,0]);
	
	var Tvp = m4.multiply(Tvptrans,Tvpscale);

	//Tscale->Tcamera->Tproj->Tvp
	var Tviewii = m4.multiply(Tscale,Tcamera);
	var Tviewi = m4.multiply(Tviewii,Tproj);
	var Tbasic = m4.multiply(Tviewi,m4.multiply(Tvpscale,Tvptrans));
	
	for(var i=0; i<gridSize; i++) {
		for(var j=0; j<gridSize; j++) {
			var Trans = m4.translation([i-gridSize/2, j-gridSize/2,0]);
			var Tgrid = m4.multiply(Trans,Tbasic); 
			
			if(i%2 == j%2) {
				paint.addSquare("black", 1, "Grid",Tgrid);
			} else {
				paint.addSquare("black", 0.8, "Grid",Tgrid);
			}
		}
	}
	//drawCube(10,0,1,"red", Tview);
	//drawCube(0,0,1,"blue", Tview);
	
	paint.draw(wire);
	
	paint.clear();
	
	count++;
	if(count == 60) {
		
		count = 0;
	}
	window.requestAnimationFrame(update);
}

window.onload=init;

