function Spark(CurX, CurY, CurZ, DX, DY, DZ, Radius, Color) {
	// Basic Stuff
	this.radius = Radius || 5;  // Size of spark
	this.color = Color || "blue";
	
	// Movement Stuff
	this.curX = CurX || 0;
	this.curY = CurY || 0;
	this.curZ = CurZ || 0;
	
	this.dX = DX || 1;
	this.dy = DY || 1;
	this.dZ = DZ || 1;
	
	/*
	this.distance = Math.sqrt(Math.pow(this.destX-this.curX, 2) + Math.pow(this.destY-this.curY, 2) + Math.pow(this.destZ-this.curZ, 2));
	
	this.maxX = (this.curX / this.distance) * 1.2 * this.radius;  // Unit * max distance
	this.maxY = (this.curY / this.distance) * 1.2 * this.radius;
	this.maxZ = (this.curZ / this.distance) * 1.2 * this.radius;
	
	this.dX = (this.speed/100) * this.maxX * Math.random();  // % steps
	this.dX = (this.speed/100) * this.maxY * Math.random();
	this.dX = (this.speed/100) * this.maxZ * Math.random();
	*/
}

Spark.prototype.draw = function() {
	
}