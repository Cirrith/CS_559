var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

var center = canvas.width / 2;

var radius = center * 0.45;  // Radius of clock circle

var clockTop = 90;
var tower = (canvas.width/2)*0.8;
var bottom = canvas.height;

function drawTower() {
	context.save();

	context.translate(center, 0);
	
	context.lineWidth = 3;
	context.strokeStyle = "black";
	
	context.fillStyle = "#bfb685";
	context.fillRect(-tower, clockTop, 2*tower, (canvas.height-clockTop));
	context.strokeRect(-tower, clockTop, 2*tower, (canvas.height-clockTop));
	
	context.fillStyle = "#7e7f79";
	
	context.beginPath();
	context.moveTo(-tower, clockTop);
	context.lineTo(0, 10);
	context.lineTo(tower, clockTop);
	context.lineTo(-tower, clockTop);
	
	context.fill();
	context.stroke();
	
	context.restore();
}


function drawClock() {
	context.save();
	context.translate(center, center*1.25);  // Move Origin to Center of canvas
	var date = new Date();
	var hour = date.getHours();
	var min = date.getMinutes();
	var sec = date.getSeconds();

	console.log("Hour: " + hour + " Minutes: " + min + " Seconds: " + sec);

	context.lineWidth = 3;
	context.strokeStyle = "black";
	context.fillStyle = "white";
	
	// Circle
	context.beginPath();
	context.arc(0, 0, radius, 0, 2 * Math.PI);
	context.fill();
	context.beginPath();
	context.arc(0, 0, radius, 0, 2 * Math.PI);
	context.stroke();
	
	context.fillStyle = "black";
	
	// Numbers
	context.save();
	context.beginPath();
	for(i = 1; i <= 12; i++) {
		context.rotate((1/6)*Math.PI);
		context.fillText(i, -5, -radius*0.8);
	}
	context.stroke();
	context.restore();
	
	// Hour
	context.beginPath();
	context.moveTo(0,0);
	context.rotate(((hour%12)/6)*Math.PI);
	context.lineTo(0, -radius*0.9);
	context.rotate(-((hour%12)/6)*Math.PI);
	context.stroke();

	context.lineWidth = 2;
	
	// Minute
	context.beginPath();
	context.moveTo(0,0);
	context.rotate((min/30)*Math.PI);
	context.lineTo(0, -radius*0.85);
	context.rotate(-(min/30)*Math.PI);
	context.stroke();
	
	context.lineWidth = 1;
	context.strokeStyle = "red";
	
	// Second
	context.beginPath();
	context.moveTo(0,0);
	context.rotate((sec/30)*Math.PI);
	context.lineTo(0, -radius*0.8);
	context.rotate(-(sec/30)*Math.PI);
	context.stroke();
	context.restore();
}

function update() {
	// Clear Board for Update
		// This isn't very efficient but I don't know enough to be able to
		// keep the background around during draws
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawTower();
	drawClock();
}

// Update clock twice a second
setInterval(update, 500);
