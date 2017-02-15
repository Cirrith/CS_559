// Main.js

var m4 = twgl.m4;
var canvas;
var cxt;
var paint;

var theta = 0;
var dtheta = 0.01;
var radius = 100;
var eyeHeight = 100;
var target = [0,0,0];
var up = [0,0,1];

var gridSize = 50;
var wire = false;

// Transform from world to camera
var Tscale = m4.scale(m4.identity(), [50, 50, 50]);
var Tproj = m4.perspective(Math.PI/2, 1, 5, 400);
var Tview = m4.multiply(m4.scaling([canvas.width/2,-canvas.height/2,1]), m4.translation([canvas.width/2,canvas.height/2,0]));
var Tvp = m4.multiply(Tproj, Tview);
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
	theta += dtheta;  // Increment rotation

	var eye = [radius*Math.cos(theta), radius*Math.sin(theta), eyeHeight];
	var Tcamera=m4.inverse(m4.lookAt(eye, target, up));
<<<<<<< HEAD
<<<<<<< HEAD
	
	//var Tmodel = m4.multiply(m4.scaling([50,50,50]),m4.translation([1,0,0]));
	var Tproj = m4.perspective(Math.PI/3,2,5,400);
	//var Tviewport = m4.multiply(m4.scaling([canvas.width/2,canvas.height/2,1]),m4.translation([canvas.width/2,canvas.height/2,0]));
	//var Tvp = m4.multiply(m4.translation([canvas.width/2,-canvas.height/2,0]),m4.scaling([canvas.wdith/2,canvas.height/2,1]));
=======
>>>>>>> parent of 18bb02a... TA
	
	var Tproj = m4.perspective(Math.PI/3,2,5,400);
	var Tvpscale = m4.translation([canvas.width/2,canvas.height/2,1]);
	var Tvptrans = m4.translation([canvas.width/2,-canvas.height/2,0]);
	
	var Tvp = m4.multiply(Tvptrans,Tvpscale);
=======
>>>>>>> parent of 18bb02a... TA
	
<<<<<<< HEAD
	var Trb = m4.translation([1,0,0]);
	var Trr = m4.translation([0,0,0]);
	//Tscale->Tcamera->Trans
	//var Tview = m4.multiply(Tscale, Tcamera);
	//var Tsqb = m4.multiply(Tview, Trb);
	//var Tsqr = m4.multiply(Tview, Trr);
	
	//Tcamera->Tscale->Trans
	var Tview = m4.multiply(Tcamera, Tscale);
	var Tsqb = m4.multiply(Tview,Trb);
	var Tsqr = m4.multiply(Tview,Trr);
	
<<<<<<< HEAD
	//Tprojection->Tcamera->Tscale->Trans
	var Tviewii = m4.multiply(Tcamera, Tscale);
	var Tviewi = m4.multiply(Tproj,Tviewii);
	var Tview = m4.multiply(Tvp,Tviewi);
	var Tsqb = m4.multiply(Tview,Trb);
	var Tsqr = m4.multiply(Tview,Trr);
	
	//Tprojection->Tcamera->Tscale->Trans
	var Tviewii = m4.multiply(Tvp, Tproj);
	var Tviewi = m4.multiply(Tviewii,Tcamera);
	var Tview = m4.multiply(Tviewi,Tscale);
	var Tsqb = m4.multiply(Tview,Trb);
	var Tsqr = m4.multiply(Tview,Trr);
	
	paint.addSquare("black", 1, "Grid", Tsqb);
	paint.addSquare("red", 1, "Grid", Tsqr);
	
	/*for(var i=0; i<gridSize; i++) {
=======
	//var Tndc = m4.frustum(canvas.width/2, canvas.width/2, this.canvas.height/2, this.canvas.height/2, -10, -50);
	var Tvp = m4.scaling([canvas.width/2,-canvas.height/2,1]);
	Tvp = m4.setTranslation(Tvp,[canvas.width/2,canvas.height/2,0]);
	
	// Transform for Scale -> Tcamera -> Tndc -> Tvp
	var Tviewii = m4.multiply(m4.identity(),Tcamera);
	var Tviewi = m4.multiply(Tviewii,Tndc);
	var Tview = m4.multiply(Tviewi,Tvp);
	
	for(var i=0; i<gridSize; i++) {
>>>>>>> parent of 18bb02a... TA
=======
	//var Tndc = m4.frustum(canvas.width/2, canvas.width/2, this.canvas.height/2, this.canvas.height/2, -10, -50);
	var Tvp = m4.scaling([canvas.width/2,-canvas.height/2,1]);
	Tvp = m4.setTranslation(Tvp,[canvas.width/2,canvas.height/2,0]);
	
	// Transform for Scale -> Tcamera -> Tndc -> Tvp
	var Tviewii = m4.multiply(m4.identity(),Tcamera);
	var Tviewi = m4.multiply(Tviewii,Tndc);
	var Tview = m4.multiply(Tviewi,Tvp);
	
	for(var i=0; i<gridSize; i++) {
>>>>>>> parent of 18bb02a... TA
		for(var j=0; j<gridSize; j++) {
			var Trans = m4.translate(m4.identity(), [i-gridSize/2, j-gridSize/2,0]);
			var Tnew = m4.multiply(Trans, Tview);
			if(i%2 == j%2) {
				paint.addSquare("black", 1, "Grid",Tnew);
			} else {
				paint.addSquare("black", 0.8, "Grid",Tnew);
			}
		}
	}
	//drawCube(10,0,1,"red", Tview);
	//drawCube(0,0,1,"blue", Tview);
	
	paint.draw(m4.identity(), wire);
	
	paint.clear();
	
	count++;
	if(count == 60) {
		
		count = 0;
	}
	window.requestAnimationFrame(update);
}

window.onload=init;

