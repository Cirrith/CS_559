function start() {
	var m4 = twgl.m4;
	var canvas = document.getElementById("canvas");
	var gl = twgl.getWebGLContext(canvas);
	
	var target = [0,0,0];  // Always Look at Center
	var up = [0,0,1];  // Z is always up
	var eye = [10, 0, 10];
	
	gl.clearColor(1.0,1.0,1.0,1.0);  // Clear color is black
	gl.enable(gl.DEPTH_TEST);  // Enable z-buffer
	
	//Transforms
		// Perspective -> Scale -> Translate
	var Tproj =  m4.perspective(Math.PI/2,canvas.width/canvas.height,5,10);
	var Tvpscale = m4.scaling([canvas.width/2,-canvas.height/2,1]);
	var Tvptrans = m4.translation([canvas.width/2,canvas.height/2,0]);
	var Tview = m4.multiply(m4.multiply(Tvpscale,Tvptrans),Tproj);

	var Tcamera = m4.inverse(m4.lookAt(eye,target,up));  // Camera
	
	var TMat = m4.multiply(Tcamera,Tview);
	

	// Shaders
	var shader = twgl.createProgramInfo(gl, ["vs", "fs"]);  // Compile and link program
	
	gl.useProgram(shader.program);
	
	if(shader == null) {
		alert("Compile Failed");
		return;
	}
	
	// Objects
	var sphere = twgl.primitives.createSphereVertices(1, 24, 12);  // Create sphere
		// indices, normal, position, texcoord
	
	// Buffers
	sphere.posBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphere.posBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, sphere.position, gl.STATIC_DRAW);  // Let Data flow
	sphere.itemSize = 3;
	sphere.numItems = sphere.position.length/3;
	
	sphere.indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphere.indices, gl.STATIC_DRAW);
	
	// Setup Locations
	shader.posAttribute = gl.getAttribLocation(shader.program,"pos");
	gl.enableVertexAttribArray(shader.posAttribute);
	shader.transUniform = gl.getUniformLocation(shader.program, "projectionMatrix");
	
	// Setup uniform
	gl.uniformMatrix4fv(shader.transUniform, false, TMat);
	
	// Setup Attribute
	gl.bindBuffer(gl.ARRAY_BUFFER, sphere.posBuffer);
	gl.vertexAttribPointer(shader.posAttribute, sphere.itemSize, gl.FLOAT, false, 0, 0);
	
	function draw() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  // Clear Screen and Depth
		
		// Draw Stuff
		
		//gl.drawArrays(gl.TRIANGLES, 0, sphere.numItems);
		gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);
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