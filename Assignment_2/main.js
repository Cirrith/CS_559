
function init() {
	var canvas = document.getElementById("canvas");
	var cxt = canvas.getContext('2d');
	var sped = document.getElementById("speed");
	var rad = document.getElementById("radius");
	var loc = document.getElementById("location");
	var col = document.getElementById("color");
	var num = document.getElementById("number");
	var numFire = document.getElementById("num");
	
	num.value = 1;  // Set slider value init
	
	var works = [];
	
	cxt.rotate(Math.PI);
	cxt.translate(-canvas.width, -canvas.height);
	
	function rgb(r, g, b) {
		r = Math.floor(r);
		g = Math.floor(g);
		b = Math.floor(b);
		return ["rgb(",r,",",g,",",b,")"].join("");
	}
	
	function generate() {
		numFire.innerHTML = num.value;
		works = [];  // Clear array
		console.log(num.value);
		for(var i=0; i < num.value; i++) {
			console.log(i);
			var fire = new Firework(cxt);
			works.push(fire);
		}
		//var works = [new Firework(cxt), new Firework(cxt), new Firework(cxt), new Firework(cxt), new Firework(cxt), new Firework(cxt)];
	}
	
	function update() {
		cxt.save();
		cxt.fillStyle = "white";
		cxt.globalAlpha = 0.1;
		cxt.fillRect(0,0, canvas.width, canvas.height);
		cxt.globalAlpha = 1.0;
		cxt.restore();
		
		for(var i = 0; i < works.length; i++) {
			if(works[i].stat >= 100) {
				var destX = loc.checked?Math.random()*canvas.width:null;
				var destY = loc.checked?Math.random()*canvas.height:null;
				var speed = sped.checked?Math.floor(Math.random()*8) + 2:null;
				var radius = rad.checked?Math.floor(Math.random()*8) + 2:null;
				var color = col.checked?rgb(Math.random()*255,Math.random()*255,Math.random()*255):null;
				works[i] = new Firework(cxt, destX, destY, speed, radius, color);
			} else {
				works[i].draw();
			}
		}
		window.requestAnimationFrame(update);
	}
	
	generate();
	num.addEventListener("input",generate);
	update();
	
}

window.onload=init;


//http://www.w3schools.com/tags/canvas_createlineargradient.asp
