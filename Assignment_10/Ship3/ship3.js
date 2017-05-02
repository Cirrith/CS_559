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

var Ship3 = undefined;

(function() {
    "use strict";

	var data = new Ship3_Data();
	
	var texture = new Image();
	texture.src = data.texture;
	
	var sTexture = new Image();
	sTexture.src = data.specTexture;
	
	var bTexture = new Image();
	bTexture.src = data.bumpTexture;
	
	Ship3 = function(name,position,size,color) {
		this.name = name;
		this.position = position || [0,0,0];
		this.size = size || 1.0;
		this.color = color || [0.85,0.85,0.85];
	}
	
	Ship3.prototype.init = function(drawingState) {
		var gl = drawingState.gl;

		this.mesh = new OBJ.Mesh(data.source);
		OBJ.initMeshBuffers(gl, this.mesh);
		this.program = createProgram(gl, data);
		this.attributes = findAttribLocations(gl, this.program, ['position', 'normal', 'texCoord']);
		this.uniforms = findUniformLocations(gl, this.program, ['normMat', 'viewMat', 'projMat', 'color', 'sun', 'texture', 'sTexture', 'bTexture']);
		
		this.texture = createGLTexture(gl, texture, true);
		this.sTexture = createGLTexture(gl, sTexture, true);
		this.bTexture = createGLTexture(gl, bTexture, true);
	}
	
	Ship3.prototype.draw = function(drawingState) {
		var gl = drawingState.gl;
		
		gl.useProgram(this.program);
		
		var position = twgl.m4.multiply(twgl.m4.rotationY(Math.PI/2),data.curve(drawingState.realtime/6000 % 1));
		
		var scale = twgl.m4.scaling([this.size,this.size,this.size]);
		var modelM = twgl.m4.multiply(twgl.m4.multiply(scale,position),drawingState.view);
		
		gl.uniformMatrix4fv(this.uniforms.normMat, false, twgl.m4.inverse(twgl.m4.transpose(modelM)));  // Normal Matrix
		gl.uniformMatrix4fv(this.uniforms.viewMat, false, modelM);  // View Matrix
		gl.uniformMatrix4fv(this.uniforms.projMat, false, drawingState.proj);  // Projection Matrix
		gl.uniform3fv(this.uniforms.sun, drawingState.sunDirection);  // Sun
		gl.uniform3fv(this.uniforms.color, [0.85, 0.85, 0.85]);
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.uniform1i(this.uniforms.texture, 0);
		
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.sTexture);
		gl.uniform1i(this.uniforms.sTexture, 1);
		
		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, this.bTexture);
		gl.uniform1i(this.uniforms.bTexture, 2);
		
		enableLocations(gl, this.attributes);
			// Position Link
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
		gl.vertexAttribPointer(this.attributes.position, 3, gl.FLOAT, false, 0, 0);
			// Normal Link
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
		gl.vertexAttribPointer(this.attributes.normal, 3, gl.FLOAT, false, 0, 0);
			// Texture Link
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.textureBuffer);
		gl.vertexAttribPointer(this.attributes.texCoord, this.mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
			// Index Link
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
		gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		
		disableLocations(gl, this.attributes);
	}
	
	Ship3.prototype.center = function(drawingState) {
		return this.position;
	}
})();

grobjects.push(new Ship3("Ship3", [-5,3,-5], .1, [0.,0.,1.]));