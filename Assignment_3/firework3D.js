function Firework(DestX, DestY, DestZ, Speed, Radius, Color, Opacity) {
	// Basic Stuff
	this.stat = 0;  // Status of explosion 0 - 100
	this.speed = Speed || 5;
	this.color = Color || "blue";
	this.radius = Radius || 5;
	this.opacity = Opacity || 0;

	// Movment Stuff
	this.curX = 0;
	this.curY = 0;
	this.curZ = 0;
	this.destX = DestX || 0;
	this.destY = DestY || 0;
	this.destZ = DestZ || 250;
	this.distance = Math.sqrt(Math.pow(this.destX, 2) + Math.pow(this.destY, 2) + Math.pow(this.destZ, 2));
	this.dX = this.destX * this.speed / this.distance;
	this.dY = this.destY * this.speed / this.distance;
	this.dZ = this.destZ * this.speed / this.distance;
	
	// Spark Stuff
	this.sparkNum =  20;  // SNumber of sparks per level
	this.sparkLvls = 10;  // Number of levels of sparks
	
	this.sparks = [];  // First Index is level, second is spark
	
	for(var i=0; i<this.sparkLvls; i++) {
		this.sparks[i] = [];
		
		// Random color per level of sparks
		var color = rgb(Math.random()*255,Math.random()*255,Math.random()*255);
		
		for(var j=0; j<this.sparkNum; j++) {
			// Generate Cartesian Coordinates from RV
			var theta = 2*Math.PI*Math.random();
			var phi = Math.PI*Math.random();
			var x = this.radius * Math.sin(theta)*Math.cos(phi);
			var y = this.radius * Math.sin(theta)*Math.sin(phi);
			var z = this.radius * Math.cos(theta);
			
			// Starting level
			var curX = i*x;
			var curY = i*y;
			var curZ = i*z;
			
			// Move one radius
			var destX = (i+1)*x;
			var destY = (i+1)*y;
			var destZ = (i+1)*z;
			
			// Change of pos per draw
			var dX = (this.speed/100)*(destX - curX);
			var dY = (this.speed/100)*(destY - curY);
			var dZ = (this.speed/100)*(destZ - curZ);
			
			var radius = this.radius*0.1;  // Add Randomness
			
			this.sparks[i][j] = new Spark(curX, curY, curZ, dX, dY, dZ, radius, color);
		}
	}
}

Firework.prototype.draw = function(Tx) {
	cxt.fillStyle = this.color;
	
	if((this.curX != this.destX) || (this.curY != this.destY) || (this.curZ != this.destZ)) {
		if(Math.abs(this.curX += this.dX) > Math.abs(this.destX)) {
			this.curX = this.destX;
		}
		if(Math.abs(this.curY += this.dY) > Math.abs(this.destY)) {
			this.curY = this.destY;
		}
		if(Math.abs(this.curZ += this.dZ) > Math.abs(this.destZ)) {
			this.curZ = this.destZ;
		}
		var Tcore = translateTx(this.curX,this.curY,this.curZ,Tx);
		circleTx(0,0,0,this.radius, Tcore);
		//cxt.fill();
	} else if(this.stat < 100) {
		var Tcore = translateTx(this.curX,this.curY,this.curZ,Tx);
		for(var i=0; i<this.sparkLvls; i++) {
			for(var j=0; j<this.sparkNum; j++) {
				this.sparks[i][j].draw(Tcore);
			}
		}
		this.stat+=this.speed;
	}
}

function rgb(r, g, b) {
	r = Math.floor(r);
	g = Math.floor(g);
	b = Math.floor(b);
	return ["rgb(",r,",",g,",",b,")"].join("");
}