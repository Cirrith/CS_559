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
	shader.posAttribute = gl.getAttribLocation(shader.program,"position");
	gl.enableVertexAttribArray(shader.posAttribute);
	gl.bindBuffer(gl.ARRAY_BUFFER,sphere.posBuffer);
	gl.vertexAttribPointer(shader.posAttribute,sphere.itemSize,gl.FLOAT,false,0,0);
		// Normal Attribute
	shader.normAttribute = gl.getAttribLocation(shader.program,"normal");
	gl.enableVertexAttribArray(shader.normAttribute);
	gl.bindBuffer(gl.ARRAY_BUFFER,sphere.normBuffer);
	gl.vertexAttribPointer(shader.normAttribute,sphere.itemSize,gl.FLOAT,false,0,0);
		// Model Transform Uniform
	shader.transUniform = gl.getUniformLocation(shader.program,"modelViewMatrix");  //Mat4
		// Camera Uniform
	shader.cameraUniform = gl.getUniformLocation(shader.program,"cameraViewMatrix");
		// Projection Uniform
	shader.projUnifrom = gl.getUniformLocation(shader.program,"projectionMatrix");  // Mat4
		// Normal Transform Uniform
	shader.normUniform = gl.getUniformLocation(shader.program,"normalMatrix");  // Mat4
		// Color Unfirom
	shader.colorUniform = gl.getUniformLocation(shader.program,"color");  // Vec3
	
	// Clear Behavior
	gl.clearColor(0.1,0,0.1,1.0);  // Clear color is black
	gl.enable(gl.DEPTH_TEST);  // Enable z-buffer	

	var time = 0;

	var tScaleF = m4.scaling([0.25, 0.25, 0.25]);
	var tScaleFM = m4.scaling([0.08, 0.08, 0.08]);
	var tScaleS = m4.scaling([.35, .35, .35]);
	var tScaleSM1 = m4.scaling([0.08, 0.08, 0.08]);
	var tScaleSM2 = m4.scaling([0.06, 0.06, 0.06]);
	var tScalePluto = m4.scaling([.05, .05, .05]);
	var tTrans1 = m4.translation([6,0,0]);
	var tTrans2 = m4.translation([1,0,0]);
	var tTrans3 = m4.translation([-12,0,0]);
	var tTrans4 = m4.translation([1.5,0,0]);
	var tTrans5 = m4.translation([-1,0,0]);
	var tTransPluto = m4.translation([40,0,0]);

	var colorC = [1.0,1.0,0.3];  // Sun Color
	var colorF = [0.4,0.4,0.6];  // First Planet Color
	var colorFM = [0.4,0.8,1.0];
	var colorS = [0.2,0.5,1];
	var colorSM1 = [0.1,0,0.6];
	var colorSM2 = [0,0.6,0.1];
	var colorPluto = [0.9,0.7,0.5];
	
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

		gl.uniformMatrix4fv(shader.transUniform,false,m4.identity());
		gl.uniformMatrix4fv(shader.cameraUniform,false,tCamera);
		gl.uniformMatrix4fv(shader.projUnifrom,false,tProjection)
		gl.uniformMatrix4fv(shader.normUniform,false,m4.inverse(m4.transpose(tCamera)));
		gl.uniform3fv(shader.colorUniform,colorC);

		gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);

	// First Planet
		tRot = m4.rotationZ(2*Math.PI*time/10);
		tBasic = m4.multiply(tTrans1, tRot);
		//tModel = m4.multiply(m4.multiply(tScaleF, tBasic), tCamera);
		tModel = m4.multiply(tScaleF, tBasic);

		gl.uniformMatrix4fv(shader.transUniform,false,tModel);
		gl.uniformMatrix4fv(shader.cameraUniform,false,tCamera);
		gl.uniformMatrix4fv(shader.projUnifrom,false,tProjection)
		gl.uniformMatrix4fv(shader.normUniform,false,m4.inverse(m4.transpose(tModel)));
		gl.uniform3fv(shader.colorUniform,colorF);
		
		gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);
	
	// First Planet Moon
		tRot = m4.rotationZ(2*Math.PI*time/2);
		tBasic = m4.multiply(m4.multiply(tTrans2,tRot),tBasic);
		//tModel = m4.multiply(m4.multiply(tScaleFM,tBasic),tCamera);
		tModel = m4.multiply(tScaleFM,tBasic);

		gl.uniformMatrix4fv(shader.transUniform,false,tModel);
		gl.uniformMatrix4fv(shader.cameraUniform,false,tCamera);
		gl.uniformMatrix4fv(shader.projUnifrom,false,tProjection)
		gl.uniformMatrix4fv(shader.normUniform,false,m4.inverse(m4.transpose(tModel)));
		gl.uniform3fv(shader.colorUniform,colorFM);

		gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);

	// Second Planet
		tRot = m4.rotationZ(2*Math.PI*time/13);
		tBasic = m4.multiply(tTrans3,tRot);
		//tModel = m4.multiply(m4.multiply(tScaleS,tBasic), tCamera);
		tModel = m4.multiply(tScaleS,tBasic);

		gl.uniformMatrix4fv(shader.transUniform,false,tModel);
		gl.uniformMatrix4fv(shader.cameraUniform,false,tCamera);
		gl.uniformMatrix4fv(shader.projUnifrom,false,tProjection)
		gl.uniformMatrix4fv(shader.normUniform,false,m4.inverse(m4.transpose(tModel)));
		gl.uniform3fv(shader.colorUniform,colorS);

		gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);

		var tSave = tBasic;
	// Second Planet Moon 1
		tRot = m4.rotationZ(2*Math.PI*time/4);
		tBasic = m4.multiply(m4.multiply(tTrans4,tRot),tBasic);
		//tModel = m4.multiply(m4.multiply(tScaleSM1,tBasic),tCamera);
		tModel = m4.multiply(tScaleSM1,tBasic);

		gl.uniformMatrix4fv(shader.transUniform,false,tModel);
		gl.uniformMatrix4fv(shader.cameraUniform,false,tCamera);
		gl.uniformMatrix4fv(shader.projUnifrom,false,tProjection)
		gl.uniformMatrix4fv(shader.normUniform,false,m4.inverse(m4.transpose(tModel)));
		gl.uniform3fv(shader.colorUniform,colorSM1);

		gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);

	// Second Planet Moon 2
		tRot = m4.rotationZ(2*Math.PI*time/3);
		tBasic = m4.multiply(m4.multiply(tTrans5,tRot),tSave);
		//tModel = m4.multiply(m4.multiply(tScaleSM2,tBasic),tCamera);
		tModel = m4.multiply(tScaleSM2,tBasic);

		gl.uniformMatrix4fv(shader.transUniform,false,tModel);
		gl.uniformMatrix4fv(shader.cameraUniform,false,tCamera);
		gl.uniformMatrix4fv(shader.projUnifrom,false,tProjection)
		gl.uniformMatrix4fv(shader.normUniform,false,m4.inverse(m4.transpose(tModel)));
		gl.uniform3fv(shader.colorUniform,colorSM2);

		gl.drawElements(gl.TRIANGLES, sphere.indices.length, gl.UNSIGNED_SHORT, 0);

	// Pluto
		tRot = m4.rotationZ(2*Math.PI*time/25);
		tBasic = m4.multiply(tTransPluto,tRot);
		tModel = m4.multiply(tScalePluto, tBasic);

		gl.uniformMatrix4fv(shader.transUniform,false,tModel);
		gl.uniformMatrix4fv(shader.cameraUniform,false,tCamera);
		gl.uniformMatrix4fv(shader.projUnifrom,false,tProjection)
		gl.uniformMatrix4fv(shader.normUniform,false,m4.inverse(m4.transpose(tModel)));
		gl.uniform3fv(shader.colorUniform,colorPluto);

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