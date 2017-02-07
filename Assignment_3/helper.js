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
	
	function circleTx(x,y,z,radius,Tx) {
		var loc = [x,y,z];
		var locTx = m4.transformPoint(Tx, loc);
		moveToTx(x,y,z,Tx);
		//cxt.beginPath();
		cxt.arc(locTx[0]+250,-locTx[1]+250,radius, 0, 2*Math.PI);
		cxt.fill();
	}
	
	function translateTx(x,y,z,Tx) {
		return m4.translate(Tx,[x,y,z]);
	}