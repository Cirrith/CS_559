/******************************************************************************
File Name: tree_data.js

Purpose: Define the information to build and shade a tree object

Contains:
	itemSize: 3
	vs: Vertex Shader
	fs: Fragment Shader
	vertex: Vertexs
	index: Triangles

******************************************************************************/

function Tree_Data() {

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
		-1.00, 1.00, 1.00,
		-1.00, -1.00, -1.00,
		-1.00, 1.00, -1.00,
		1.00, -1.00, 1.00,
		1.00, 1.00, 1.00,
		1.00, -1.00, -1.00,
		1.00, 1.00, -1.00,
		-1.00, 1.00, -2.50,
		1.00, 1.00, -2.50,
		2.50, 1.00, 1.00,
		2.50, 1.00, -1.00,
		-1.00, 1.00, 2.50,
		1.00, 1.00, 2.50,
		-2.50, 1.00, 1.00,
		-2.50, 1.00, -1.00,
		-1.00, 1.00, 0.00,
		0.00, 1.00, -1.00,
		1.00, 1.00, 0.00,
		0.00, 1.00, 1.00,
		0.00, 5.00, 0.00 ]);
		
	this.index = new Uint16Array([
		1, 16, 0,
		3, 17, 2,
		7, 18, 6,
		5, 19, 4,
		6, 0, 2,
		17, 9, 8,
		18, 10, 11,
		19, 12, 13,
		16, 15, 14,
		11, 10, 20,
		8, 9, 20,
		14, 15, 20,
		13, 12, 20,
		2, 0, 16,
		16, 3, 2,
		6, 2, 17,
		17, 7, 6,
		4, 6, 18,
		18, 5, 4,
		0, 4, 19,
		19, 1, 0,
		6, 4, 0,
		8, 3, 17,
		17, 7, 9,
		11, 7, 18,
		18, 5, 10,
		13, 5, 19,
		19, 1, 12,
		14, 1, 16,
		16, 3, 15 ]);

}