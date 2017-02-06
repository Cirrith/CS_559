window.onload=init;



function init() {
	var m4 = twgl.m4;
	
	function drawAxes(Tx) {
		// A little cross on the front face, for identification
		moveToTx(0,0,0,Tx);lineToTx(50,0,0,Tx);cxt.stroke();
		moveToTx(0,0,0,Tx);lineToTx(0,150,0,Tx);cxt.stroke();
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
	
	var canvas = document.getElementById("canvas");
	var cxt = canvas.getContext('2d');
	
	var eye = [500, 200, 200];
	var target = [0, 0, 0];
	var up = [0, 1, 0];
	
	var Tcamera=m4.inverse(m4.lookAt(eye, target, up));
	
	drawAxes(Tcamera);
	// var test = new Firework();
	
	
	
}