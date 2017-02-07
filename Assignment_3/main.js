var m4 = twgl.m4;

var canvas = document.getElementById("canvas");
var cxt = canvas.getContext('2d');

var tester = new Firework(100, 100, 100, 2, 2, "blue");

var fireNum = 5;

var works = [];

for(var i=0; i<fireNum; i++) {
	works.push(new Firework(100, 100, 100, 2, 2, "blue"));
}

var theta = 0;
var radius = 100;
var eye = [radius*Math.cos(theta), radius*Math.sin(theta), 50];

var target = [0, 0, 0];
var up = [0, 0, 1];

var Tcamera=m4.inverse(m4.lookAt(eye, target, up));
drawAxes(Tcamera);

tester.draw(Tcamera);

requestAnimationFrame(draw);

function draw() {
	cxt.clearRect(0,0,canvas.width,canvas.height);
	theta += 0.01;
	eye = [radius*Math.cos(theta), radius*Math.sin(theta), 50];
	Tcamera=m4.inverse(m4.lookAt(eye, target, up));
	for(var i=0; i<fireNum; i++) {
		if(works[i].stat >= 100) {
			works[i] = new Firework(500*Math.random()-250, 500*Math.random()-250, 250*Math.random(), 2, 2, "blue");
			//var destX = loc.checked?Math.floor(500*Math.random()-250):null;
			//var destY = loc.checked?Math.floor(500*Math.random()-250):null;
			//var destZ = loc.checked?Math.floor(500*Math.random()-250):null;
			//var speed = sped.checked?Math.floor(Math.random()*8) + 2:null;
			//var radius = rad.checked?Math.floor(Math.random()*8) + 2:null;
			//var color = col.checked?rgb(Math.random()*255,Math.random()*255,Math.random()*255):null;
		}
		works[i].draw(Tcamera);
	}
	drawAxes(Tcamera);
	window.requestAnimationFrame(draw);
}

	function drawAxes(Tx) {
		// A little cross on the front face, for identification
		cxt.beginPath();
		moveToTx(0,0,0,Tx);lineToTx(50,0,0,Tx);cxt.stroke();
		cxt.beginPath();
		moveToTx(0,0,0,Tx);lineToTx(0,150,0,Tx);cxt.stroke();
		cxt.beginPath();
		moveToTx(0,0,0,Tx);lineToTx(0,0,250,Tx);cxt.stroke();
	}

	function moveToTx(x,y,z,Tx) {
		var loc = [x,y,z];
		var locTx = m4.transformPoint(Tx,loc);
		cxt.moveTo(locTx[0]+250,-locTx[1]+250);
	}

	function lineToTx(x,y,z,Tx) {
		var loc = [x,y,z];
		var locTx = m4.transformPoint(Tx,loc);
		cxt.lineTo(locTx[0]+250,-locTx[1]+250);
	}
	
	function circleTx(x,y,z,radius,Tx) {
		var loc = [x,y,z];
		var locTx = m4.transformPoint(Tx, loc);
		//moveToTx(x,y,z,Tx);
		cxt.beginPath();
		cxt.arc(locTx[0]+250,-locTx[1]+250,radius, 0, 2*Math.PI);
		cxt.fill();
	}
	
	function translateTx(x,y,z,Tx) {
		return m4.translate(Tx,[x,y,z]);
	}

//window.onload=init;