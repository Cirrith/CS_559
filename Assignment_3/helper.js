	function drawAxes(Tx) {
		// A little cross on the front face, for identification
		moveToTx(0,0,0,Tx);lineToTx(100,0,0,Tx);cxt.stroke();
		moveToTx(0,0,0,Tx);lineToTx(0,100,0,Tx);cxt.stroke();
		moveToTx(0,0,0,Tx);lineToTx(0,0,100,Tx);cxt.stroke();
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
		moveToTx(x,y,z,Tx);
		cxt.arc(locTx[0]+250,-locTx[1]+250,radius, sAngle, eAngle);
	}
	
	function translateTx(x,y,z,Tx) {
		return m4.translate(Tx,[x,y,z]);
	}