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

Painter.prototype.addSquare = function(Color,Opacity,Purpose,Tx) {
	var obj = {};
	
	obj.v1 = m4.transformPoint(Tx, squareVerts[0]);
	obj.v2 = m4.transformPoint(Tx, squareVerts[1]);
	obj.v3 = m4.transformPoint(Tx, squareVerts[2]);
	obj.v4 = m4.transformPoint(Tx, squareVerts[3]);
	obj.center = m4.transformPoint(Tx, squareVerts[4]);
	
	obj.color = Color || "blue";
	obj.opacity = Opacity || 1;
	obj.purpose = Purpose;
	
	this.squares.push(obj);
}

Painter.prototype.draw = function(Wire) {
	if(Wire) {
		this.cxt.strokeStyle="black";
		this.cxt.lineWidth=1;
	} else {
		this.cxt.strokeStyle="white";
		this.cxt.lineWidth=1;
	}
	for(var i=0; i<this.squares.length; i++) {  // List is sorted, Painters algorithm
		this.cxt.fillStyle=this.squares[i].color;
		this.cxt.globalAlpha = this.squares[i].opacity;
		this.cxt.beginPath();
		var v1 = this.squares[i].v1;
		var v2 = this.squares[i].v2;
		var v3 = this.squares[i].v3;
		var v4 = this.squares[i].v4;
		var xPlus = this.canvas.width/2;
		var yPlus = this.canvas.height/2;
		this.cxt.moveTo(v1[0] + xPlus, -v1[1] + yPlus);
		this.cxt.lineTo(v2[0] + xPlus, -v2[1] + yPlus);
		this.cxt.lineTo(v3[0] + xPlus, -v3[1] + yPlus);
		this.cxt.lineTo(v4[0] + xPlus, -v4[1] + yPlus);
		this.cxt.closePath();
		this.cxt.stroke();
		if(!Wire) {			
			this.cxt.fill();
		}
	}
}

Painter.prototype.clear = function() {
	this.squares = [];
}

