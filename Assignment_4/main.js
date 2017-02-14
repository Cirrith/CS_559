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
	
	var projM = m4.perspective(Math.PI/2, 1, 0.1, 100);
	
		var viewport = m4.scaling([xsize/2,-ysize/2,1]);
		m4.setTranslation(viewport,[xsize/2,ysize/2,0],viewport);

		// get the projection
		var projM;
		if (mySliders.perspective.value > 0) {
			var fov = toRadians(mySliders.fov.value);
			projM = m4.perspective(fov, 1, 0.1, 100);
		} else {
			projM = m4.scaling([.1,.1,1]);
		}
		// don't forget... lookat give the CAMERA matrix, not the view matrix
		var lookAtPt = [mySliders.lookAtX.value, mySliders.lookAtY.value, mySliders.lookAtZ.value];
		var lookFromPt = [mySliders.lookFromX.value, mySliders.lookFromY.value, mySliders.lookFromZ.value];
		var lookatI = m4.lookAt(lookFromPt, lookAtPt, [0,1,0]);
		var lookatM = m4.inverse(lookatI);

		// the whole transform
        var viewii = m4.multiply(ab.getMatrix(),lookatM);
		var viewi = m4.multiply(viewii,projM);
		var view = m4.multiply(viewi,viewport);
	
	
	var Tinter = m4.multiply(Tcamera, scale);
	
	for(var i=0; i<gridSize; i++) {
		for(var j=0; j<gridSize; j++) {
			var Trans = m4.translate(m4.identity(), [i-gridSize/2, j-gridSize/2,0]);
			var Tnew = m4.multiply(Trans, Tinter);
			if(i%2 == j%2) {
				paint.addSquare("black", 1, "Grid",Tnew);
			} else {
				paint.addSquare("black", 0.8, "Grid",Tnew);
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

