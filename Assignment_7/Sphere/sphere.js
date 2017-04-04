/******************************************************************************
File Name: 
	sphere.js

Purpose: 
	Define and add a sphere object to the graphicstown grobojects list

Requires:
	name
	init
	draw
	center
******************************************************************************/

var grobjects = grobjects || [];

var Sphere = undefined;
var MSphere = undefined;

(function() {
    "use strict";

	var sphere_data = new Sphere_Data();
	var shaderProgram = undefined;
	
	Sphere = function Sphere(name, position, size, color) {
		this.name = name;
		this.position = position || [0,0,0];
		this.size = size || 1.0;
		this.color = color || [0.85,0.85,0.85];
	}
	
	Sphere.prototype.init = function(drawingState) {
		var gl = drawingState.gl;

        // Compile Vertex Shader
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader,sphere_data.vs);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
			alert(gl.getShaderInfoLog(vertexShader));
            return null;
        }
        
		// Compile Fragment Shader
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader,sphere_data.fs);
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
        gl.bufferData(gl.ARRAY_BUFFER, sphere_data.position, gl.STATIC_DRAW);
			// Normal
        this.normBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, sphere_data.normal, gl.STATIC_DRAW);
			// Index
		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphere_data.index, gl.STATIC_DRAW);
	}
	
	Sphere.prototype.draw = function(drawingState) {
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
		gl.vertexAttribPointer(this.posLoc,sphere_data.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER,this.normBuffer);
		gl.vertexAttribPointer(this.normLoc,sphere_data.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.drawElements(gl.TRIANGLES, sphere_data.index.length,gl.UNSIGNED_SHORT, 0);
	}
	
	Sphere.prototype.center = function(drawingState) {
		return this.position;
	}
	
    MSphere = function MSphere(name, position, size, color, rotation, phase) {
        Sphere.apply(this,arguments);
		this.rotation = rotation || 0;
		this.phase = phase || 0;
    }
    MSphere.prototype = Object.create(Sphere.prototype);
    MSphere.prototype.draw = function(drawingState) {
        var gl = drawingState.gl;
		
		gl.useProgram(this.shaderProgram);
		
		// enable the attributes we had set up
		gl.enableVertexAttribArray(this.posLoc);
		gl.enableVertexAttribArray(this.normLoc);
		
        var scaling = twgl.m4.scaling([this.size,this.size,this.size]);
		var rotation = twgl.m4.rotationY(this.rotation);
		var movement = twgl.m4.translation([3*Math.sin(drawingState.realtime/400.+this.phase), 0, 0]);
		var position = twgl.m4.translation(this.position);

		var modelM = twgl.m4.multiply(scaling, twgl.m4.multiply(position, twgl.m4.multiply(movement, twgl.m4.multiply(rotation,drawingState.view))));
        
        // set the uniforms
		gl.uniformMatrix4fv(this.normMatLoc,false,twgl.m4.inverse(twgl.m4.transpose(modelM)));
		gl.uniformMatrix4fv(this.viewMatLoc,false,modelM);
		gl.uniformMatrix4fv(this.projMatLoc,false,drawingState.proj);
		gl.uniform3fv(this.sunLoc,drawingState.sunDirection);
		gl.uniform3fv(this.colorLoc,this.color);

		// connect the attributes to the buffer
		gl.bindBuffer(gl.ARRAY_BUFFER,this.posBuffer);
		gl.vertexAttribPointer(this.posLoc,sphere_data.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER,this.normBuffer);
		gl.vertexAttribPointer(this.normLoc,sphere_data.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.drawElements(gl.TRIANGLES, sphere_data.index.length,gl.UNSIGNED_SHORT, 0);
    };
    MSphere.prototype.center = function(drawingState) {
        return this.position;
    }
})();

//grobjects.push(new Sphere('Sphere1', [0,0.5,0], 0.25, [0.,0.,1.0]));
grobjects.push(new MSphere('MSphere1',[0,0.5,0], 0.1, [0.,0.,1.], 0, 0));
grobjects.push(new MSphere('MSphere2',[0,0.5,0], 0.1, [1.,0.,0.], Math.PI/6,Math.PI/6));
grobjects.push(new MSphere('MSphere2',[0,0.5,0], 0.1, [0.,1.,0.], -Math.PI/6,-Math.PI/6));
grobjects.push(new MSphere('MSphere3',[0,0.5,0], 0.1, [0.,1.,0.], Math.PI/3,Math.PI/3));
grobjects.push(new MSphere('MSphere4',[0,0.5,0], 0.1, [1.,0.,0.], -Math.PI/3,-Math.PI/3));
grobjects.push(new MSphere('MSphere5',[0,0.5,0], 0.1, [0.,0.,1.], Math.PI/2,Math.PI/2));
