"use strict";

var squareVerts = [[0,0,0],[50,0,0],[50,50,0],[0,50,0],[0.5,0.5,0]];

// Compare function for painters algorithm sort
function compare(a, b) {
	if (a.center[2] < b.center[2]) { 
		return -1;
	}
	return 1;
}

function Painter(Canvas, Cxt) {
	this.squares = [];
	this.canvas = Canvas
	this.cxt = Cxt || Canvas.getContext('2d');
}

Painter.prototype.addSquare = function(Color,Opacity,Tx) {
	var obj = {};
	
	obj.v1 = m4.transformPoint(Tx, squareVerts[0]);
	obj.v2 = m4.transformPoint(Tx, squareVerts[1]);
	obj.v3 = m4.transformPoint(Tx, squareVerts[2]);
	obj.v4 = m4.transformPoint(Tx, squareVerts[3]);
	obj.center = m4.transformPoint(Tx, squareVerts[4]);
	
	//for(var i=0; i<squareVerts.length; i++) {
	//	obj.verts[i] = m4.transformPoint(Tx, squareVerts[i]);
	//}
	
	obj.color = Color || "blue";
	obj.opacity = Opacity || 1;
	
	this.squares.push(obj);
}

Painter.prototype.draw = function(Cam) {
	//Tndc = m4.frustum(this.canvas.width/2, this.canvas.width/2, this.canvas.height/2, this.canvas.height/2, -10, -50);
	//this.squares.sort(compare);
	for(var i=0; i<this.squares.length; i++) {  // List is sorted, Painters algorithm
		this.cxt.fillStyle=this.squares[i].color;
		this.cxt.globalAlpha = this.squares[i].opacity;
		//this.cxt.moveTo(m4.transformPoint(Cam, this.squares[i].v1));
		//this.cxt.lineTo(m4.transformPoint(Cam, this.squares[i].v2));
		//this.cxt.lineTo(m4.transformPoint(Cam, this.squares[i].v3));
		//this.cxt.lineTo(m4.transformPoint(Cam, this.squares[i].v4));
		this.cxt.moveTo(this.squares[i].v1[0] + 250, -this.squares[i].v1[1] + 250);
		this.cxt.lineTo(this.squares[i].v2[0] + 250, -this.squares[i].v2[1] + 250);
		this.cxt.lineTo(this.squares[i].v3[0] + 250, -this.squares[i].v3[1] + 250);
		this.cxt.lineTo(this.squares[i].v4[0] + 250, -this.squares[i].v4[1] + 250);
		this.cxt.closePath();
		this.cxt.fill();
	}
}

