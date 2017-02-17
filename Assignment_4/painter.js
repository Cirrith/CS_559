"use strict";

var squareVerts = [[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0.5,0.5,0]];

// Compare function for painters algorithm sort
function compare(a, b) {
	if (a.center[2] > b.center[2]) { 
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
	this.squares.sort(compare);
	if(Wire) {
		this.cxt.strokeStyle="black";
		this.cxt.lineWidth=1;
	} else {
		this.cxt.strokeStyle="white";
		this.cxt.lineWidth=1;
	}
	for(var i=0; i<this.squares.length; i++) {  // List is sorted, Painters algorithm
		if(this.squares[i].center[2] > 0) {
			this.cxt.fillStyle=this.squares[i].color;
			this.cxt.globalAlpha = this.squares[i].opacity;
			this.cxt.beginPath();
			this.cxt.moveTo(this.squares[i].v1[0], this.squares[i].v1[1]);
			this.cxt.lineTo(this.squares[i].v2[0], this.squares[i].v2[1]);
			this.cxt.lineTo(this.squares[i].v3[0], this.squares[i].v3[1]);
			this.cxt.lineTo(this.squares[i].v4[0], this.squares[i].v4[1]);
			this.cxt.closePath();
			this.cxt.stroke();
			if(!Wire) {			
				this.cxt.fill();
			}
		}
	}
}

Painter.prototype.clear = function(purpose) {
	this.squares = [];
	/*if(typeof(purpose) == 'undefined') {
		this.squares = [];
		return;
	}
	for(var i=0; i<this.squares.length; i++) {
		if(this.squares[i].purpose == purpose) {
			this.squares.splice(i,1);
		}
	}
	return;
	*/
}

