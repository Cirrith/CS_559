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

var Test = undefined;

(function() {
	"use strict";
	
	var test_data = new Test_Data();
	var shaderProgram = undefined;
	
	Test = function() {
		this.name = "Tester";
	};
	
	Test.prototype.init = function(drawingState) {
		var gl = drawingState.gl;

		this.mesh = new OBJ.Mesh(test_data.source);
		OBJ.initMeshBuffers(gl, this.mesh);
		this.program = createProgram(gl, test_data);
		this.attributes = findAttribLocations(gl, this.program, ['position', 'normal']);
		this.uniforms = findUniformLocations(gl, this.program, ['normMat', 'viewMat', 'projMat', 'color', 'sun']);
	}
	
	Test.prototype.draw = function(drawingState) {
		var gl = drawingState.gl;
		
		gl.useProgram(this.program);
		
		var modelM = drawingState.view;
		
		gl.uniformMatrix4fv(this.uniforms.normMat, false, twgl.m4.inverse(twgl.m4.transpose(modelM)));  // Normal Matrix
		gl.uniformMatrix4fv(this.uniforms.viewMat, false, modelM);  // View Matrix
		gl.uniformMatrix4fv(this.uniforms.projMat, false, drawingState.proj);  // Projection Matrix
		gl.uniform3fv(this.uniforms.sun, drawingState.sunDirection);  // Sun
		gl.uniform3fv(this.uniforms.color, [0.85, 0.85, 0.85]);
		
		enableLocations(gl, this.attributes);
		
		enableLocations(gl, this.attributes);
			// Position Link
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
		gl.vertexAttribPointer(this.attributes.position, 3, gl.FLOAT, false, 0, 0);
			// Normal Link
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
		gl.vertexAttribPointer(this.attributes.normal, 3, gl.FLOAT, false, 0, 0);
			// Index Link
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
		gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		
		disableLocations(gl, this.attributes);
	}
	
	Test.prototype.center = function(drawingState) {
		return ([0,0,0]);
	}

})();

grobjects.push(new Test());