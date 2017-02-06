function Firework(Context, DestX, DestY, DestZ, Speed, Radius, Color, Opacity) {
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
	this.destX = DestX || 250;
	this.destY = DestY || 250;
	this.destZ = DestZ || 250;
	this.distance = Math.sqrt(Math.pow(this.destX, 2) + Math.pow(this.destY, 2) + Math.pow(this.destZ, 2));
	this.dX = this.destX * this.speed / this.distance;
	this.dY = this.destY * this.speed / this.distance;
	this.dZ = this.destZ * this.speed / this.distance;
	
	// Spark Stuff
	this.sparkNum =  25;  // SNumber of sparks per level
	this.sparkLvls = 4;  // Number of levels of sparks
	
	this.sparks = [];  // First Index is level, second is spark
	
	for(var i=0; i<this.sparkLvls; i++) {
		this.sparks[i] = [];
		
		// Random color per level of sparks
		var color = rgb(Math.random()*255,Math.random()*255,Math.random()*255);
		
		for(var j=0; j<this.sparkNum; j++) {
			// Generate Cartesian Coordinates from RV
			var theta = 2 * Math.PI * Math.random();
			var phi = Math.acos(2*Math.random() - 1);
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
			
			var radius = this.radius*0.5;  // Add Randomness
			
			sparks[i][j] = new Firework(curX, curY, curZ, dX, dY, dZ, radius, color);
		}
	}
	
	this.context = Context;
}

Firework.prototype.draw = function() {
	this.context.save();
	this.context.fillStyle = this.color;
	this.context.translate(this.curX, this.curY);  // Translate to current pos of fw
	if((this.curX != this.destX) && (this.curY != this.destY)) {  // Check if at explode state
		if((this.curX += this.dX) > this.destX) {  // Ensure no overshoot and increment
			this.curX = this.destX;
		}
		if((this.curY += this.dY) > this.destY) {  // Ensure no overshoot and increment
			this.curY = this.destY;
		}
		this.context.beginPath();
		this.context.arc(0,0, this.radius, 0, 2*Math.PI);
		this.context.fill();
	} else if(this.stat != 100) {
		this.explode();
		this.stat += this.speed;
	}
	this.context.restore();
}

Firework.prototype.explode = function() {
	// Draw sparks
	for(var i=0; i<this.sparkLvls; i++) {
		for(var j=0; j<this.sparkNum; j++) {
			
		}
	}
}

function rgb(r, g, b) {
	r = Math.floor(r);
	g = Math.floor(g);
	b = Math.floor(b);
	return ["rgb(",r,",",g,",",b,")"].join("");
}