/******************************************************************************
File Name: pyramid.js

Purpose: Define the information to build and shade a pyramid object

Contains:
	itemSize: 3
	vs: Vertex Shader
	fs: Fragment Shader
	vertex: Vertexs
	index: Triangles

******************************************************************************/

function Pyramid_Data() {

	this.itemSize = 3;

	// Store Shaders in template literal form
	this.vs = `
	precision highp float;
	attribute vec3 position;
	uniform mat4 viewMat;
	uniform mat4 projMat;
	
	void main() {
		vec4 pos = viewMat * vec4(position, 1.0);
		gl_Position = projMat * pos;
	}`;
	
	this.fs = `
		precision highp float;
		uniform vec3 color;
		
		void main() {
			gl_FragColor = vec4(color,1.0);
		}`;
	
	this.vertex = new Float32Array([
		-1.00, -1.00, 1.00,
		-2.00, 1.00, 2.00,
		-1.00, -1.00, -1.00,
		-2.00, 1.00, -2.00,
		1.00, -1.00, 1.00,
		2.00, 1.00, 2.00,
		1.00, -1.00, -1.00,
		2.00, 1.00, -2.00 ]);
		
	this.index = new Uint16Array([
		1, 2, 0,
		3, 6, 2,
		7, 4, 6,
		5, 0, 4,
		6, 0, 2,
		3, 5, 7,
		1, 3, 2,
		3, 7, 6,
		7, 5, 4,
		5, 1, 0,
		6, 4, 0,
		2, 1, 5]);
}