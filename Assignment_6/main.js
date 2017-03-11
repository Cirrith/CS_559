function start() {
	var m4 = twgl.m4;
	var canvas = document.getElementById("canvas");
	var gl = twgl.getWebGLContext(canvas);
	
	var target = [0,0,0];  // Always Look at Center
	var up = [0,0,1];  // Z is always up
	var eye = [10, 0, 10];
	
	//Transforms	
	var tModel = m4.identity();
	var tCamera = m4.inverse(m4.lookAt(eye, target, up));
	var tProjection = m4.perspective(Math.PI/2, canvas.width/canvas.height, 10, 1000);
	
	var tMat = m4.multiply(m4.multiply(tModel,tCamera), tProjection);

	// Shaders and Program
	var shader = twgl.createProgramInfo(gl, ["vs", "fs"]);  // Compile and link program
	if(shader == null) {
		alert("Compile Failed");
		return;
	}
	
	gl.useProgram(shader.program);
	
	// Objects
	var sphere = twgl.primitives.createSphereVertices(1, 24, 12);  // Create sphere
	
	// Buffers
		// Position
	sphere.posBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphere.posBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, sphere.position, gl.STATIC_DRAW);  // Let Data flow
	sphere.itemSize = 3;
	sphere.numItems = sphere.position.length/3;
		// Normal
	//sphere.normBuffer = gl.createBuffer();
	//gl.bindBuffer(gl.ARRAY_BUFFER, sphere.normBuffer);
	//gl.bufferData(gl.ARRAY_BUFFER, sphere.normal, gl.STATIC_DRAW);

	
	sphere.indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphere.indices, gl.STATIC_DRAW);
	
	// Setup Locations
		// Position Attribute
	shader.posAttribute = gl.getAttribLocation(shader.program,"pos");
	gl.enableVertexAttribArray(shader.posAttribute);
		// Transform Uniform
	shader.transUniform = gl.getUniformLocation(shader.program, "tProj");

	gl.clearColor(1.0,1.0,1.0,1.0);  // Clear color is black
	gl.enable(gl.DEPTH_TEST);  // Enable z-buffer
	
	function draw() {

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  // Clear Screen and Depth

		// Setup Attributes and Uniform
		gl.uniformMatrix4fv(shader.transUniform,false,tMat);  // Uniform
		
		gl.bindBuffer(gl.ARRAY_BUFFER, sphere.posBuffer);
		gl.vertexAttribPointer(shader.posAttribute,sphere.itemSize, gl.FLOAT, false, 0, 0);
		
		// Draw Stuff
		gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);
		
		
		window.requestAnimationFrame(draw);
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