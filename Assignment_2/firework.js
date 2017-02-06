function Firework(Context, DestX, DestY, Speed, Radius, Color) {
	// Basic Stuff
	this.stat = 0;  // Status of explosion 0 - 100
	this.speed = Speed || 5;
	this.color = Color || "blue";
	this.radius = Radius || 5;

	// Movment Stuff
	this.curX = 0;
	this.curY = 0;
	this.destX = DestX || 250;
	this.destY = DestY || 250;
	this.dX = this.speed * Math.cos(Math.atan((this.destY)/(this.destX)));
	this.dY = this.speed * Math.sin(Math.atan((this.destY)/(this.destX)));
	
	// Spark Stuff
	this.sparkNum =  100;  // SNumber of sparks per level
	this.sparkLvls = 4;  // Number of levels of sparks
	this.sparkAngle = [];
	this.sparkDist = [];

	// Setup Angles and Distances
	for(var i=0; i<this.sparkLvls; i++) {  // 4 Levels of sparks
		this.sparkAngle[i] = [];
		this.sparkDist[i] = new Array(this.sparkNum);
		this.sparkDist[i].fill(i*this.radius);  // Set Distance init to 0
		
		// Generate angles of sparks randomly
		for(var j=0; j<this.sparkNum; j++) {
			this.sparkAngle[i][j] = Math.random()*2*Math.PI;
		}
		this.sparkAngle[i].sort();  // Sort angles for difference calc
		
		// Store Angles as differences between them
		var temp = [];
		for(var j=1; j<this.sparkNum; j++) {
			temp[j] = this.sparkAngle[i][j] - this.sparkAngle[i][j-1];
		}
		this.sparkAngle[i] = temp;
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
	// Explode thing
	this.context.save();
	this.context.beginPath();
	this.context.arc(0,0, this.radius, 0, 2*Math.PI);  // Draw center
	this.context.fill();
	this.context.fillStyle = rgb(Math.random()*255,Math.random()*255,Math.random()*255);
	if(this.stat < 20) {  // Level 0
		for(var i=0; i<this.sparkNum; i++) {
			this.context.beginPath();
			this.sparkDist[0][i] += Math.random()*this.radius;
			this.context.rotate(this.sparkAngle[0][i]);
			this.context.arc(0, this.sparkDist[0][i], this.radius*0.25, 0, 2*Math.PI);
			this.context.fill();
		}
	} else if(this.stat < 40) {  // Level 1
		for(var i=0; i<this.sparkNum; i++) {
			this.context.beginPath();
			this.sparkDist[1][i] += Math.random()*this.radius*2;
			this.context.rotate(this.sparkAngle[1][i]);
			this.context.arc(0, this.sparkDist[1][i], this.radius*0.25, 0, 2*Math.PI);
			this.context.fill();
		}
	} else if(this.stat < 60) {  // Level 2
		for(var i=0; i<this.sparkNum; i++) {
			this.context.beginPath();
			this.sparkDist[2][i] += Math.random()*this.radius*3;
			this.context.rotate(this.sparkAngle[2][i]);
			this.context.arc(0, this.sparkDist[2][i], this.radius*0.25, 0, 2*Math.PI);
			this.context.fill();
		}
	} else if(this.stat < 80) {  // Level 3
		for(var i=0; i<this.sparkNum; i++) {
			this.context.beginPath();
			this.sparkDist[3][i] += Math.random()*this.radius*4;
			this.context.rotate(this.sparkAngle[3][i]);
			this.context.arc(0, this.sparkDist[3][i], this.radius*0.25, 0, 2*Math.PI);
			this.context.fill();
		}
	} else if(this.stat < 100) {  // Level 4
		
	}
	this.context.restore();
}

function rgb(r, g, b) {
	r = Math.floor(r);
	g = Math.floor(g);
	b = Math.floor(b);
	return ["rgb(",r,",",g,",",b,")"].join("");
}