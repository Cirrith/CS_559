function Spark(CurX, CurY, CurZ, DX, DY, DZ, Radius, Color) {
	// Basic Stuff
	this.radius = Radius || 5;  // Size of spark
	this.color = Color || "blue";
	
	// Movement Stuff
	this.curX = CurX || 0;
	this.curY = CurY || 0;
	this.curZ = CurZ || 0;
	
	var rand = 0.4 * Math.random() + 0.8;
	
	this.dX = (DX || 1) * rand;
	this.dy = (DY || 1) * rand;
	this.dZ = (DZ || 1) * rand;
}

Spark.prototype.draw = function() {
	this.curX += this.dX;
	this.curY += this.dY;
	this.curZ += this.dZ;
	
	// Draw
}
