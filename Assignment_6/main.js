function start() {
	var m4 = twgl.m4;
	var canvas = document.getElementById("canvas");
	var gl = twgl.getWebGLContext(canvas);
	
	var eyeRadius = 10;
	var eyeRadiusDelta = 0.5;
	var eyeTheta = 0;
	var eyePhi = Math.PI/2;

	var up = [0,0,1];
	var target = [0,0,0];  // Always Look at Center
	var mXFactor = 0.5;  // Moving width of window will rotate by 50%
	var mYFactor = 0.5;  // Moving height of window will rotate by 50%
	
	//Transforms	
	var tProjection = m4.perspective(Math.PI/2, canvas.width/canvas.height, 1, 1000);

	// Shaders and Program
	var shader = twgl.createProgramInfo(gl, ["vs", "fs"]);  // Compile and link program
	if(shader == null) {
		alert("Compile Failed");
		return;
	}
	
	gl.useProgram(shader.program);

	// Objects
	var sphere = twgl.primitives.createSphereVertices(2, 100, 100);  // Create sphere
	
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
	
		// Normal Transform Uniform
	shader.normUniform = gl.getUniformLocation(shader.program,"nProj");
	
	
	// Clear Behavior
	gl.clearColor(1.0,1.0,1.0,1.0);  // Clear color is black
	gl.enable(gl.DEPTH_TEST);  // Enable z-buffer	

	var time = 0;

	var tScaleHalf = m4.scaling([0.5, 0.5, 0.5]);
	var tScaleQuat = m4.scaling([0.25, 0.25, 0.25]);
	var tTrans1 = m4.translation([10,0,0]);
	var tTrans2 = m4.translation([3,0,0]);
	
	var eye;
	var tCamera;
	var tMat;  // Model + Camera + Projection
	var tRot;
	var tBasic;
	var tModel;

	function draw() {
	// Clear Screen and Depth
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Draw Star
		eye = [eyeRadius*Math.sin(eyePhi)*Math.cos(eyeTheta),eyeRadius*Math.sin(eyePhi)*Math.sin(eyeTheta),eyeRadius*Math.cos(eyePhi)];
		tCamera = m4.inverse(m4.lookAt(eye,target,up));
		tMat = m4.multiply(tCamera, tProjection);

		gl.uniformMatrix4fv(shader.transUniform,false,tMat); 
		gl.uniformMatrix4fv(shader.normUniform, false, m4.inverse(m4.transpose(tCamera)));  // Transform normal with non-projection transform

		gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);

	// First Planet
		tRot = m4.rotationZ(2*Math.PI*time/10);
		tBasic = m4.multiply(tTrans1, tRot);
		tModel = m4.multiply(m4.multiply(tScaleHalf, tBasic), tCamera);

		tMat = m4.multiply(tModel,tProjection);

		gl.uniformMatrix4fv(shader.transUniform,false,tMat); 
		gl.uniformMatrix4fv(shader.normUniform, false, m4.inverse(m4.transpose(tModel)));  // Transform normal with non-projection transform
		
		gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);
	
	// First Planet Moon
		tRot = m4.rotationZ(2*Math.PI*time/2);
		tBasic = m4.multiply(m4.multiply(tTrans2,tRot),tBasic);
		tModel = m4.multiply(m4.multiply(tScaleQuat,tBasic), tCamera);

		tMat = m4.multiply(tModel,tProjection);

		gl.uniformMatrix4fv(shader.transUniform,false,tMat); 
		gl.uniformMatrix4fv(shader.normUniform, false, m4.inverse(m4.transpose(tModel)));  // Transform normal with non-projection transform

		gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);

		time += 0.01;
		window.requestAnimationFrame(draw);
	}
	
	var mouseDown = false;
	var lastMouseX;
	var lastMouseY;

	canvas.onmousedown = mouseDownHandler;
	canvas.onwheel = mouseWheelHandler;
	document.onmouseup = mouseUpHandler;
	document.onmousemove = mouseMoveHandler;

	function mouseDownHandler(e) {
		mouseDown = true;
		lastMouseX = e.clientX;
		lastMouseY = e.clientY;
	}

	function mouseWheelHandler(e) {
		if(e.wheelDeltaY < 0) {
			if((eyeRadius -= eyeRadiusDelta) < 5)
				eyeRadius = 5;
		} else {
			if((eyeRadius += eyeRadiusDelta) > 50)
				eyeRadius = 50;
		}
	}
	
	function mouseUpHandler(e) {
		mouseDown = false;
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

		eyeTheta = (eyeTheta + theta) % (2*Math.PI);
		if((eyePhi + phi) > Math.PI) {
			eyePhi = Math.PI - 1e-3;
		} else if((eyePhi + phi) < 0) {
			eyePhi = 1e-3;
		} else {
			eyePhi = eyePhi + phi;
		}

		lastMouseX = newX;
		lastMouseY = newY;
	}
	draw();
}

window.onload=start;