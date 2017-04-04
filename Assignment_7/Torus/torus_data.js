/******************************************************************************
File Name:
	sphere_data.js

Purpose: 
	Define the information to build and shade a sphere object

Contains:
	itemSize: 3
	vs: Vertex Shader
	fs: Fragment Shader
	position: Vertexs
	normal: Normals at vertexs
	index: Triangles

******************************************************************************/

function Torus_Data() {

	this.itemSize = 3;

	var data = twgl.primitives.createTorusVertices(2, 1, 100, 100);
	
	// Store Shaders in template literal form
	this.vs = `
		precision highp float;
		attribute vec3 pos;
		attribute vec3 norm;
		uniform mat4 normMat;
		uniform mat4 viewMat;
		uniform mat4 projMat;
		uniform vec3 sunLoc;
		varying vec3 fNormal;
		varying vec3 fPosition;
		varying vec3 sun;
		
		void main() {
			fNormal = normalize(mat3(normMat) * norm);
			vec4 position = viewMat * vec4(pos, 1.0);
			fPosition = position.xyz;
			sun = (normMat * vec4(sunLoc,1.0)).xyz;
			gl_Position = projMat * position;
		}`;
	
	this.fs = `
		precision highp float;
		uniform vec3 color;
		varying vec3 fNormal;
		varying vec3 fPosition;
		varying vec3 sun;
		
		void main() {
			vec3 n = normalize(fNormal);
			vec3 v = normalize(-fPosition);
			vec3 l = normalize(sun);
			vec3 h = normalize(v+l);
			vec3 ambient = 0.5 * color;
			vec3 diffuse = 0.5 * vec3(1.0,1.0,1.0)*max(0.0,dot(n,l));
			vec3 spec = 0.5 * vec3(1.0,1.0,1.0)*pow(max(0.0,dot(n,h)), 2.);
			gl_FragColor = vec4(ambient + diffuse + spec,1.0);
		}`;
		
	this.position = data.position;
	this.normal = data.normal;
	this.index = data.indices;
}