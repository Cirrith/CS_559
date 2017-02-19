// Main.js

var m4 = twgl.m4;
var canvas;
var cxt;
var paint;

var theta = 0;
var dtheta = 0.01;
var radius = 500;
var eyeHeight = 200;
var target = [0,0,0];
var up = [0,0,1];

var gridSize = 30;
var background = "black";

// Transform from world to camera
var Tbasic;
var Tscale;
var Trans;

var frame;

var rotate;
	
var speed;
var spe;
	
var color;
var col;

var drawColor = "blue";

var posx = 0;
var posy = 0;

var travel = 0;
var cubex = 0;
var cubey = 0;

var count = 0;

var xdir;
var ydir;

var state;

function init() {
	"use strict";
	canvas = document.getElementById("canvas");
	cxt = canvas.getContext('2d');
	
	frame = document.getElementById("frame");
	
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
	
	var Tproj = m4.perspective(Math.PI/2,canvas.width/canvas.height,50,1000);
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
	
	var direction = Math.round(Math.random() * 3);
	
	switch(direction) {
		case 0:
			state = "left";
			console.log("left");
			xdir = -1;
			ydir = 0;
			break;
		case 1:
			state = "up";
			console.log("up");
			xdir = 0;
			ydir = 1;
			break;
		case 2:
			state = "right";
			console.log("right");
			xdir = 1;
			ydir = 0;
			break;
		case 3:
			state = "down";
			console.log("down");
			xdir = 0;
			ydir = -1;
			break;
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
	
	if(frame.checked) {
		background = "white";
	} else {
		background = "black";
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

	cubex = posx + travel * 1/10 * xdir;
	cubey = posy + travel * 1/10 * ydir;
	travel++;
	
	if(travel == 10) {
		posx = Math.round(cubex);
		posy = Math.round(cubey);
		count++;
		newDirection();
		travel = 0;
	}
	
	drawCube(cubex,cubey,1,drawColor,Tview);
	
	paint.draw(frame.checked);
	
	if(rotate.checked) {  // Regenerate everything
		paint.clear();
	} else {
		paint.clear("block");
	}

	window.requestAnimationFrame(update);
}


// 25, 25 out
// -25, -25 in
function newDirection() {
	var left = check("left");
	var up = check("up");
	var right = check("right");
	var down = check("down");
	
	switch(state) {
		case "left":
			if(Math.random()*count > 3 || count > grid/4 ) {  // New Direction
				if(down && left && up) {  // Can go anywhere
					var dir = Math.round(Math.random()*2);
					if(dir == 0) state = "down";
					else if(dir == 1) state = "left";
					else state = "up";
				} else {
					var dir = Math.round(Math.random());
					if(left && down) {
						if(dir == 0) state = "left";
						else state = "down";
					}
					if(left && up) {
						if(dir == 0) state = "left";
						else state = "up";
					}
					if(up && down) {
						if(dir == 0) state = "down";
						else state = "up";
					}
					if(down)
						state = "down";
					if(up)
						state = "up";	
				}
			}
			break;
		case "up":
			if(Math.random()*count > 3 || count > 7) {  // New Direction
				if(left && up && right) { // Can go anywhere
					var dir = Math.round(Math.random()*2);
					if(dir == 0) state = "left";
					else if(dir == 1) state = "up";
					else state = "right";
				} else {
					var dir = Math.round(Math.random());
					if(up && left) {
						if(dir == 0) state = "up";
						else state = "left";
					}
					if(up && right) {
						if(dir == 0) state = "up";
						else state = "right";
					}
					if(left && right) {
						if(dir == 0) state = "left";
						else state = "right";
					}
					if(left)
						state = "left";
					if(right)
						state = "right";
				}
			}
			break;
		case "right":
			if(Math.random()*count > 3 || count > 7) {  // New Direction
				if(up && right && down) {
					var dir = Math.round(Math.random()*2);
					if(dir == 0) state = "up";
					else if(dir == 1) state = "right";
					else state = "down";
				} else {
					var dir = Math.round(Math.random());
					if(right && up) {
						if(dir == 0) state = "right";
						else state = "up";
					}
					if(right && down) {
						if(dir == 0) state = "right";
						else state = "down";
					}
					if(up && down) {
						if(dir == 0) state = "up";
						else state = "down";
					}
					if(up)
						state = "up";
					if(down)
						state = "down";
				}
			}
			break;
		case "down":
			if(Math.random()*count > 3 || count > 7) {  // New Direction
				if(right && down && left) {
					var dir = Math.round(Math.random()*2);
					if(dir == 0) state = "right";
					else if(dir == 1) state = "down";
					else state = "left";
				} else {
					var dir = Math.round(Math.random());
					if(down && right) {
						if(dir == 0) state = "down";
						else state = "right";
					}
					if(down && left) {
						if(dir == 0) state = "down";
						else state = "left";
					}
					if(right && left) {
						if(dir == 0) state = "right";
						else state = "left";
					}
					if(right)
						state = "right";
					if(left)
						state = "left";
				}
			}
			break;		
	}
	
	switch(state) {
		case  "left":
			console.log("left");
			xdir = -1;
			ydir = 0;
			break;
		case "up":
			console.log("up");
			xdir = 0;
			ydir = 1;
			break;
		case "right":
			console.log("right");
			xdir = 1;
			ydir = 0;
			break;
		case "down":
			console.log("down");
			xdir = 0;
			ydir = -1;
			break;
	}
}

function check(direction) {
	switch(direction) {
		case "left":
			if(posx-gridSize/4 < -gridSize/2)
				return false;
			return true;
			break;
		case "up":
			if(posy+gridSize/4 > (gridSize/2 -1))
				return false;
			return true;
			break;
		case "right":
			if(posx+gridSize/4 > (gridSize/2-1))
				return false;
			return true;
			break;
		case "down":
			if(posy-gridSize/4 < -gridSize/2)
				return false;
			return true;
			break;
	}
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

