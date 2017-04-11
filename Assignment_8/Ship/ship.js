/******************************************************************************
File Name: 
	ship.js

Purpose: 
	Define and add a ship object to the graphicstown grobojects list

Requires:
	name
	init
	draw
	center
******************************************************************************/

var grobjects = grobjects || [];

var Ship = undefined;

(function() {
    "use strict";

	var ship_data = new Ship_Data();
	var shaderProgam = undefined;
	
	var image = new Image();
	image.src = ship_data.textureSrc;
	
	Ship = function(name,position,size,color) {
		this.name = name;
		this.position = position || [0,0,0];
		this.size = size || 1.0;
		this.color = color || [0.85,0.85,0.85];
	}
	
	Ship.prototype.init = function(drawingState) {
		var gl = drawingState.gl;
		
		// Compile Vertex Shader
		var vertexShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertexShader,ship_data.vs);
		gl.compileShader(vertexShader);
		if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
				alert(gl.getShaderInfoLog(vertexShader));
				return null;
			}
		// Compile Fragment Shader
		var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragmentShader,ship_data.fs);
		gl.compileShader(fragmentShader);
		if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
			alert(gl.getShaderInfoLog(fragmentShader));
			return null;
		}

		// Create Shader Program
		this.shaderProgram = gl.createProgram();
		gl.attachShader(this.shaderProgram, vertexShader);
		gl.attachShader(this.shaderProgram, fragmentShader);
		gl.linkProgram(this.shaderProgram);
		if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
			alert("Could not initialize shaders");
		}
		
		// Setup Attribute Locations
		this.posLoc = gl.getAttribLocation(this.shaderProgram, "pos");
		this.normLoc = gl.getAttribLocation(this.shaderProgram, "norm");
		this.texCordLoc = gl.getAttribLocation(this.shaderProgram, "atexCord");
		this.normMatLoc = gl.getUniformLocation(this.shaderProgram,"normMat");
		this.viewMatLoc = gl.getUniformLocation(this.shaderProgram,"viewMat");
		this.projMatLoc = gl.getUniformLocation(this.shaderProgram,"projMat");
		this.sunLoc = gl.getUniformLocation(this.shaderProgram,"sunLoc");
		this.colorLoc = gl.getUniformLocation(this.shaderProgram,"color");
		this.texLoc = gl.getUniformLocation(this.shaderProgram, "uTexture");

		// Buffer Data
			// Position
		this.posBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, ship_data.position, gl.STATIC_DRAW);
			// Normal
		this.normBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, ship_data.normal, gl.STATIC_DRAW);
			// Index
		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ship_data.index, gl.STATIC_DRAW);
			// Texture Coords
		this.texCordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, ship_data.textures, gl.STATIC_DRAW);
			// Texture
		this.texture= gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,  gl.LINEAR);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	
	Ship.prototype.draw = function(drawingState) {
		var gl = drawingState.gl;
		// choose the shader program we have compiled
		gl.useProgram(this.shaderProgram);

		// enable the attributes we had set up
		gl.enableVertexAttribArray(this.posLoc);
		gl.enableVertexAttribArray(this.normLoc);
		gl.enableVertexAttribArray(this.texCordLoc);
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		
		var position = twgl.m4.translation(this.position);
		var scale = twgl.m4.scaling([this.size,this.size,this.size]);
		var modelM = twgl.m4.multiply(twgl.m4.multiply(scale,position),drawingState.view);

		// set the uniforms
		gl.uniformMatrix4fv(this.normMatLoc,false,twgl.m4.inverse(twgl.m4.transpose(modelM)));
		gl.uniformMatrix4fv(this.viewMatLoc,false,modelM);
		gl.uniformMatrix4fv(this.projMatLoc,false,drawingState.proj);
		gl.uniform3fv(this.sunLoc,drawingState.sunDirection);
		gl.uniform3fv(this.colorLoc,this.color);
		gl.uniform1i(this.texLoc, 0);
		
		// connect the attributes to the buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
		gl.vertexAttribPointer(this.posLoc, ship_data.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
		gl.vertexAttribPointer(this.normLoc, ship_data.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCordBuffer);
		gl.vertexAttribPointer(this.texCordLoc, 2, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.drawElements(gl.TRIANGLES, ship_data.index.length, gl.UNSIGNED_BYTE, 0);
	}
	
	Ship.prototype.center = function(drawingState) {
		return this.position;
	}
})();

grobjects.push(new Ship("Shipey McShipFace", [5,.5,0], 0.1, [0.,0.,1.]));