/******************************************************************************
File Name: 
	star.js

Purpose: 
	Define and add a star object to the graphicstown grobojects list

Requires:
	name
	init
	draw
	center
******************************************************************************/

var grobjects = grobjects || [];

var Star = undefined;

(function() {
	"use strict";
	
	var data = new Star_Data();
	
	var texture = new Image();
	texture.src = data.texture;
	
	Star = function(name, position, size, color) {
		this.name = name || "Star";
		this.position = position || [0,0,0];
		this.size = size || 1.0;
		this.color = color || [0.85, 0.85, 0.85];
	};
	
	Star.prototype.init = function(drawingState) {
		var gl = drawingState.gl;

		this.mesh = new OBJ.Mesh(data.source);
		OBJ.initMeshBuffers(gl, this.mesh);
		this.program = createProgram(gl, data);
		this.attributes = findAttribLocations(gl, this.program, ['position', 'normal', 'texCoord']);
		this.uniforms = findUniformLocations(gl, this.program, ['normMat', 'viewMat', 'projMat', 'color', 'sun', 'texture']);
		
		this.texture = createGLTexture(gl, texture, true);
	}
	
	Star.prototype.draw = function(drawingState) {
		var gl = drawingState.gl;
		
		gl.useProgram(this.program);
		
		var position = twgl.m4.translation(this.position);
		var scale = twgl.m4.scaling([this.size,this.size,this.size]);
		var modelM = twgl.m4.multiply(twgl.m4.multiply(scale,position),drawingState.view);
		
		gl.uniformMatrix4fv(this.uniforms.normMat, false, twgl.m4.inverse(twgl.m4.transpose(modelM)));  // Normal Matrix
		gl.uniformMatrix4fv(this.uniforms.viewMat, false, modelM);  // View Matrix
		gl.uniformMatrix4fv(this.uniforms.projMat, false, drawingState.proj);  // Projection Matrix
		gl.uniform3fv(this.uniforms.sun, drawingState.sunDirection);  // Sun
		gl.uniform3fv(this.uniforms.color, this.color);
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.uniform1i(this.uniforms.texture, 0);
		
		enableLocations(gl, this.attributes);
			// Position Link
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
		gl.vertexAttribPointer(this.attributes.position, 3, gl.FLOAT, false, 0, 0);
			// Normal Link
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
		gl.vertexAttribPointer(this.attributes.normal, 3, gl.FLOAT, false, 0, 0);
			// Texture Link
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.textureBuffer);
		gl.vertexAttribPointer(this.attributes.texCoord, this.mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0)
			// Index Link
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
		gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		
		disableLocations(gl, this.attributes);
	}
	
	Star.prototype.center = function(drawingState) {
		return this.position;
	}

})();

grobjects.push(new Star("star1", [-5,1.,0], 0.5));