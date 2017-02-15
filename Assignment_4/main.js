// Main.js

var m4 = twgl.m4;
var canvas;
var cxt;
var paint;

var theta = 0;
var dtheta = 0.01;
var radius = 100;
var eyeHeight = 20;
var target = [0,0,0];
var up = [0,0,1];

var gridSize = 50;
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
	
	Tscale = m4.scaling([50, 50, 50]);
	Tproj = m4.identity(); //m4.perspective(Math.PI/2, 1, 5, 400);
	Tview = m4.identity(); //m4.multiply(m4.scaling([canvas.width/2,-canvas.height/2,1]), m4.translation([canvas.width/2,canvas.height/2,0]));
	Tlate = m4.multiply(Tproj, Tview);
	
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
	theta += dtheta;  // Increment rotation

	var eye = [radius*Math.cos(theta), radius*Math.sin(theta), eyeHeight];
	var Tcamera=m4.inverse(m4.lookAt(eye, target, up));
	
	//var Tmodel = m4.multiply(m4.scaling([50,50,50]),m4.translation([1,0,0]));
	//var Tprojection = m4.identity();//m4.perspective(Math.PI/3,2,5,400);
	//var Tviewport = m4.identity();//m4.multiply(m4.scaling([canvas.width/2,canvas.height/2,1]),m4.translation([canvas.width/2,canvas.height/2,0]));
	
	
	
	//var Tcpv = m4.multiply(m4.multiply(Tcamera,Tprojection),Tviewport);
	//var Tmcpv = m4.multiply(Tmodel,Tcpv);
	
	var Trans = m4.translation([1,0,0]);
	var Ttemp = m4.multiply(Tscale, Tcamera);
	//var Texp = m4.scale(Trans, [50,50,0]);
	var Tadd = m4.multiply(Ttemp, Trans);
	//var Tadd = m4.translate(Ttemp,[1,0,0]);
	//var Tadd = m4.multiply(m4.multiply(Trans,Tscale), Tcamera);
	//var Tadd = m4.multiply(Texp, Tcamera);
	
	paint.addSquare("black", 1, "Grid", Tadd);
	paint.addSquare("red", 1, "Grid", Ttemp);
	
	/*for(var i=0; i<gridSize; i++) {
		for(var j=0; j<gridSize; j++) {
			var Trans = m4.translation([i-gridSize/2, j-gridSize/2,0]);
			var Tinter = m4.multiply(Tscale,Trans)
			var Tnew = m4.multiply(Trans, Tnope);
			
			if(i%2 == j%2) {
				paint.addSquare("black", 1, "Grid",Tnew);
			} else {
				paint.addSquare("black", 0.8, "Grid",Tnew);
			}
		}
	}*/
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

