var m4 = twgl.m4;
var canvas;
var cxt;

function setup() {
	canvas = document.getElementById("canvas");
	cxt = canvas.getContext('2d');
	
	var loc = document.getElementById("loc");  // Random Location?
	var col = document.getElementById("col");  // Random Color?
	var siz = document.getElementById("siz");  // Random Size?
	var spe = document.getElementById("spe");  // Random Speed?
	var nfi = document.getElementById("nfi");  // Number of Fireworks 0-25
	var rot = document.getElementById("rot");  // Speed of Ration 0-100
	
	var num = document.getElementById("num");  // Number of Fireworks Feedback
	var sro = document.getElementById("sro");  // Speed of Rotation Feedback
	
	nfi.value = 1;
	rot.value = 0;
	
	var works = [];
	
	function generate() {
		num.innerHTML = nfi.value;
		sro.innerHTML = rot.value;
		
		works = [];
		
		for(var i=0; i<nfi.value; i++) {
			works.push(genFirework());
		}
		dtheta = rot.value/5000;
	}
	
	function genFirework() {
		var destX = loc.checked?Math.floor(500*Math.random()-250):null;
		var destY = loc.checked?Math.floor(500*Math.random()-250):null;
		var destZ = loc.checked?Math.floor(500*Math.random()-250):null;
		var speed = spe.checked?Math.floor(Math.random()*8) + 2:null;
		var radius = siz.checked?Math.floor(Math.random()*8) + 2:null;
		var color = col.checked?rgb(Math.random()*255,Math.random()*255,Math.random()*255):null;
		return new Firework(destX, destY, destZ, speed, radius, color);
	}
	
	var theta = 0;
	var dtheta = 0.01;
	var radius = 100;
	var eye = [radius*Math.cos(theta), radius*Math.sin(theta), 50];
	var target = [0, 0, 0];
	var up = [0, 0, 1];
	
	var Tcamera=m4.inverse(m4.lookAt(eye, target, up));
	
	generate();
	requestAnimationFrame(update);
	
	function update() {
		cxt.clearRect(0,0,canvas.width,canvas.height);
		theta += dtheta;
		eye = [radius*Math.cos(theta), radius*Math.sin(theta), 50];
		Tcamera=m4.inverse(m4.lookAt(eye, target, up));
		for(var i=0; i<works.length; i++) {
			if(works[i].stat >= 100) {
				//works[i] = new Firework(500*Math.random()-250, 500*Math.random()-250, 250*Math.random(), 2, 2, "blue");
				works[i] = genFirework();
			}
			works[i].draw(Tcamera);
		}
		drawAxes(Tcamera);
		window.requestAnimationFrame(update);
	}
	
	nfi.addEventListener("input", generate);
	rot.addEventListener("input", generate);
	

}

window.onload=setup;

	// Helper Functions
	
	function drawAxes(Tx) {
		cxt.beginPath();
		moveToTx(0,0,0,Tx);lineToTx(50,0,0,Tx);cxt.stroke();
		cxt.beginPath();
		moveToTx(0,0,0,Tx);lineToTx(0,100,0,Tx);cxt.stroke();
		cxt.beginPath();
		moveToTx(0,0,0,Tx);lineToTx(0,0,150,Tx);cxt.stroke();
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
		cxt.beginPath();
		cxt.arc(locTx[0]+250,-locTx[1]+250,radius, 0, 2*Math.PI);
		cxt.fill();
	}
	function translateTx(x,y,z,Tx) {
		return m4.translate(Tx,[x,y,z]);
	}