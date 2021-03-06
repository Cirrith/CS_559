/******************************************************************************
File Name: 
	torus.js

Purpose: 
	Define and add a sphere object to the graphicstown grobojects list

Requires:
	name
	init
	draw
	center
******************************************************************************/

var grobjects = grobjects || [];

var Torus = undefined;

(function() {
    "use strict";

	var torus_data = new Torus_Data();
	var shaderProgram = undefined;
	
	Torus = function Torus(name, position, size, color) {
		this.name = name;
		this.position = position || [0,0,0];
		this.size = size || 1.0;
		this.color = color || [0.85,0.85,0.85];
	}
	
	Torus.prototype.init = function(drawingState) {
		var gl = drawingState.gl;

        // Compile Vertex Shader
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader,torus_data.vs);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
			alert(gl.getShaderInfoLog(vertexShader));
            return null;
        }
        
		// Compile Fragment Shader
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader,torus_data.fs);
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
        this.normMatLoc = gl.getUniformLocation(this.shaderProgram,"normMat");
        this.viewMatLoc = gl.getUniformLocation(this.shaderProgram,"viewMat");
		this.projMatLoc = gl.getUniformLocation(this.shaderProgram,"projMat");
		this.sunLoc = gl.getUniformLocation(this.shaderProgram,"sunLoc");
		this.colorLoc = gl.getUniformLocation(this.shaderProgram,"color");

        // Buffer Data
			// Position
        this.posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, torus_data.position, gl.STATIC_DRAW);
			// Normal
        this.normBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, torus_data.normal, gl.STATIC_DRAW);
			// Index
		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, torus_data.index, gl.STATIC_DRAW);
	}
	
	Torus.prototype.draw = function(drawingState) {
		var gl = drawingState.gl;
		// choose the shader program we have compiled
		gl.useProgram(this.shaderProgram);

		// enable the attributes we had set up
		gl.enableVertexAttribArray(this.posLoc);
		gl.enableVertexAttribArray(this.normLoc);

		var position = twgl.m4.translation(this.position);
		var scale = twgl.m4.scaling([this.size,this.size,this.size]);
		var modelM = twgl.m4.multiply(twgl.m4.multiply(scale,position),drawingState.view);

		// set the uniforms
		gl.uniformMatrix4fv(this.normMatLoc,false,twgl.m4.inverse(twgl.m4.transpose(modelM)));
		gl.uniformMatrix4fv(this.viewMatLoc,false,modelM);
		gl.uniformMatrix4fv(this.projMatLoc,false,drawingState.proj);
		gl.uniform3fv(this.sunLoc,drawingState.sunDirection);
		gl.uniform3fv(this.colorLoc,this.color);

		// connect the attributes to the buffer
		gl.bindBuffer(gl.ARRAY_BUFFER,this.posBuffer);
		gl.vertexAttribPointer(this.posLoc,torus_data.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER,this.normBuffer);
		gl.vertexAttribPointer(this.normLoc,torus_data.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.drawElements(gl.TRIANGLES, torus_data.index.length,gl.UNSIGNED_SHORT, 0);
	}
	
	Torus.prototype.center = function(drawingState) {
		return this.position;
	}
})();

grobjects.push(new Torus('Torus1', [0,0.5,0], 0.25, [0.,0.,1.0]));