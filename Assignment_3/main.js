window.onload=init;



function init() {
	var m4 = twgl.m4;
	
	function drawAxes(Tx) {
		// A little cross on the front face, for identification
		moveToTx(0,0,0,Tx);lineToTx(50,0,0,Tx);cxt.stroke();
		moveToTx(0,0,0,Tx);lineToTx(0,150,0,Tx);cxt.stroke();
		moveToTx(0,0,0,Tx);lineToTx(0,0,250,Tx);cxt.stroke();
		arcTx(100,100,0,25, 0, 2*Math.PI, Tx);cxt.fill();
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
	
	function arcTx(x,y,z,radius,sAngle,eAngle,Tx) {
		var loc = [x,y,z];
		var locTx = m4.transformPoint(Tx, loc);
		moveToTx(x,y,z,Tx)
		cxt.arc(locTx[0]+250,-locTx[1]+250,radius, sAngle, eAngle);
	}
	
	var canvas = document.getElementById("canvas");
	var cxt = canvas.getContext('2d');
	
	var eye = [500, 200, 200];
	var target = [0, 0, 0];
	var up = [0, 0, 1];
	
	var Tcamera=m4.inverse(m4.lookAt(eye, target, up));
	
	drawAxes(Tcamera);
	
	// var test = new Firework();
	
	
	
}