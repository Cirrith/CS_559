function start() {
	var m4 = twgl.m4;
	var canvas = document.getElementById("canvas");
	var gl = twgl.getWebGLContext(canvas);
	
	var eyeRadius = 10;
	var eyeHeight = 10;
	var eyeThata = 0;
	var eyePhi = 0;
	
	var target = [0,0,0];  // Always Look at Center
	var up = [0,0,1];  // Z is always up
	var eye = [10, 0, 10];

	var mXFactor = 0.5;  // Moving width of window will rotate by 50%
	var mYFactor = 0.5;  // Moving height of window will rotate by 50%
	
	//Transforms	
	var tModel = m4.identity();
	var tCamera = m4.inverse(m4.lookAt(eye, target, up));
	var tBasic = m4.multiply(tModel, tCamera);
	var tProjection = m4.perspective(Math.PI/2, canvas.width/canvas.height, 10, 1000);
	
	var tMat = m4.multiply(tBasic, tProjection);

	// Shaders and Program
	var shader = twgl.createProgramInfo(gl, ["vs", "fs"]);  // Compile and link program
	if(shader == null) {
		alert("Compile Failed");
		return;
	}
	
	gl.useProgram(shader.program);

	// Objects
	var sphere = twgl.primitives.createSphereVertices(3, 24, 12);  // Create sphere
	
	// Buffers
		// Position
	sphere.posBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,sphere.posBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,sphere.position,gl.STATIC_DRAW);  // Let Data flow
	sphere.itemSize = 3;
		// Normal
	sphere.normBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,sphere.normBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,sphere.normal,gl.STATIC_DRAW);
		// Indicies
	sphere.indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphere.indices, gl.STATIC_DRAW);
	
	// Setup Locations
		// Position Attribute
	shader.posAttribute = gl.getAttribLocation(shader.program,"pos");
	gl.enableVertexAttribArray(shader.posAttribute);
	gl.bindBuffer(gl.ARRAY_BUFFER,sphere.posBuffer);
	gl.vertexAttribPointer(shader.posAttribute,sphere.itemSize,gl.FLOAT,false,0,0);
		// Normal Attribute
	shader.normAttribute = gl.getAttribLocation(shader.program,"norm");
	gl.enableVertexAttribArray(shader.normAttribute);
	gl.bindBuffer(gl.ARRAY_BUFFER,sphere.normBuffer);
	gl.vertexAttribPointer(shader.normAttribute,sphere.itemSize,gl.FLOAT,false,0,0);
		// Model Transform Uniform
	shader.transUniform = gl.getUniformLocation(shader.program,"tProj");
	gl.uniformMatrix4fv(shader.transUniform,false,tMat); 
		// Normal Transform Uniform
	shader.normUniform = gl.getUniformLocation(shader.program,"nProj");
	gl.uniformMatrix4fv(shader.normUniform, false, m4.inverse(m4.transpose(tBasic)));  // Transform normal with non-projection transform
	
	// Clear Behavior
	gl.clearColor(1.0,1.0,1.0,1.0);  // Clear color is black
	gl.enable(gl.DEPTH_TEST);  // Enable z-buffer	

	function draw() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  // Clear Screen and Depth

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
		lastMouseX = e.clientX;
		lastMouseY = e.clientY;
		console.log("Down: X:" + e.x + " Y:" + e.y);
	}
	
	function mouseUpHandler(e) {
		mouseDown = false;
		console.log("Up");
	}
	
	function mouseMoveHandler(e) {
		if(!mouseDown)
			return;
		var newX = e.clientX;
		var newY = e.clientY;

		var deltaX = lastMouseX - newX;
		var deltaY = lastMouseY - newY;

		var theta = 2*Math.PI*deltaX/canvas.width * mXFactor;
		var phi = 2*Math.PI*deltaY/canvas.height * mYFactor;

		rotation = m4.multiply(rotation,m4.multiply(m4.rotationZ(theta), m4.rotationY(phi)));

		console.log("X:" + e.x + " Y:" + e.y);
	}
	draw();
}

window.onload=start;