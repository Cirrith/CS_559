function start() {
	var m4 = twgl.m4;
	var canvas = document.getElementById("canvas");
	var gl = twgl.getWebGLContext(canvas);
	
	var target = [0,0,0];  // Always Look at Center
	var up = [0,0,1];  // Z is always up
	var eye = [1, 3, -20];
	
	//Transforms
		// Perspective -> Scale -> Translate
	var Tproj =  m4.perspective(Math.PI/2,canvas.width/canvas.height,0.5,100);
	var Tvpscale = m4.scaling([canvas.width/2,-canvas.height/2,1]);
	var Tvptrans = m4.translation([canvas.width/2,canvas.height/2,0]);
	var Tview = m4.multiply(m4.multiply(Tvpscale,Tvptrans),Tproj);
	var Tcamera = m4.inverse(m4.lookAt(eye,target,up));  // Camera
	var TMat = m4.multiply(Tcamera,Tview);
	
	// WebGL
	var shader = twgl.createProgramInfo(gl, ["vs", "fs"]);
	
	var sphere = twgl.primitives.createSphereBufferInfo(gl, 1, 24, 12);

	
	function draw() {
		gl.clearColor(1.0,1.0,1.0,1.0);  // Clear color is black
		gl.enable(gl.DEPTH_TEST);  // Enable z-buffer
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  // Clear Screen and Depth
		
		gl.useProgram(shader.program);
		twgl.setUniforms(shader, {transform: TMat});
		twgl.setBuffersAndAttributes(gl,shader,sphere);
		twgl.drawBufferInfo(gl, gl.TRIANGLES, sphere);
		// Draw Stuff
		
		//gl.drawArrays(gl.TRIANGLES, 0, sphere.numItems);
		//gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);
		//window.requestAnimationFrame(draw);
	}
	
	
	// Mouse Stuff - Ignore until drawing	
	var mouseDown = false;
	var lastMouseX;
	var lastMouseY;

	canvas.onmousedown = mouseDownHandler;
	document.onmouseup = mouseUpHandler;
	document.onmousemove = mouseMoveHandler;

	
	function mouseDownHandler(e) {
		mouseDown = true;
		lastMouseX = e.x;
		lastMouseY = e.y;
	}
	
	function mouseUpHandler(e) {
		mouseDown = false;
	}
	
	function mouseMoveHandler(e) {
	}
	draw();
}

window.onload=start;