/******************************************************************************
File Name: 
	tree.js

Purpose: 
	Define and add a tree object to the graphicstown grobojects list

Requires:
	name
	init
	draw
	center
******************************************************************************/

var grobjects = grobjects || [];

var Tree = undefined;

(function() {
	"use strict";
	
	var data = new Tree_Data();
	
	Tree = function(name,position,size,color) {
		this.name = name || "tree";
		this.position = position || [0,0,0];
		this.size = size || 1.0;
		this.color = color || [0.85,0.85,0.85];
	}
	
	Tree.prototype.init = function(drawingState) {
		var gl = drawingState.gl;

		this.buffers = [];
		this.buffers['vertexBuffer'] = createGLBuffer(gl, gl.ARRAY_BUFFER, data.vertex, gl.STATIC_DRAW)
		this.buffers['indexBuffer'] = createGLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, data.index, gl.STATIC_DRAW);
		this.program = createProgram(gl, data);
		this.attributes = findAttribLocations(gl, this.program, ['position']);
		this.uniforms = findUniformLocations(gl, this.program, ['viewMat', 'projMat', 'color']);
	}
	
	Tree.prototype.draw = function(drawingState) {
		var gl = drawingState.gl;
		
		gl.useProgram(this.program);
		
		var position = twgl.m4.translation(this.position);
		var scale = twgl.m4.scaling([this.size,this.size,this.size]);
		var modelM = twgl.m4.multiply(twgl.m4.multiply(scale,position),drawingState.view);
		
		gl.uniformMatrix4fv(this.uniforms.normMat, false, twgl.m4.inverse(twgl.m4.transpose(modelM)));  // Normal Matrix
		gl.uniformMatrix4fv(this.uniforms.viewMat, false, modelM);  // View Matrix
		gl.uniformMatrix4fv(this.uniforms.projMat, false, drawingState.proj);  // Projection Matrix
		gl.uniform3fv(this.uniforms.color, this.color);
		
		enableLocations(gl, this.attributes);
			// Position Link
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertexBuffer);
		gl.vertexAttribPointer(this.attributes.position, 3, gl.FLOAT, false, 0, 0);
			// Index Link
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indexBuffer);
		gl.drawElements(gl.TRIANGLES, data.index.length, gl.UNSIGNED_SHORT, 0);
		
		disableLocations(gl, this.attributes);
	}
	
	Tree.prototype.center = function(drawingState) {
		return this.position;
	}

})();

grobjects.push(new Tree("tree1", [0,0.5,5], 0.5, [0.,1.,0.]));