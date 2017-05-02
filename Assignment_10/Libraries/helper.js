var createShader = function(gl, type, src) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
		console.log("warning: shader failed to compile!")
		console.log(gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}

var createProgram = function(gl, data) {
	var program = gl.createProgram();
	// Compile Vertex Shader
	var vs = createShader(gl, gl.VERTEX_SHADER, data.vs);
	// Compile Fragment Shader
	var fs = createShader(gl, gl.FRAGMENT_SHADER, data.fs);

	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);

	if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
		console.log("warning: program failed to link");
		return null;
	}
	return program;
}

var findAttribLocations = function (gl, program, attributes) {
	var out = {};
	for(var i = 0; i < attributes.length;i++){
		var attrib = attributes[i];
		out[attrib] = gl.getAttribLocation(program, attrib);
	}
	return out;
}

var findUniformLocations = function (gl, program, uniforms) {
	var out = {};
	for(var i = 0; i < uniforms.length;i++){
		var uniform = uniforms[i];
		out[uniform] = gl.getUniformLocation(program, uniform);
	}
	return out;
}

var enableLocations = function (gl, attributes) {
	for(var key in attributes){
		var location = attributes[key];
		gl.enableVertexAttribArray(location);
	}
}

var disableLocations = function (gl, attributes) {
	for(var key in attributes){
		var location = attributes[key];
		gl.disableVertexAttribArray(location);
	}
}

var createGLTexture = function (gl, image, flipY) {
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	if(flipY){
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	}
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,  gl.LINEAR);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
	return texture;
}

var createGLBuffer = function (gl, target, data, usage) {
	var buffer = gl.createBuffer();
	gl.bindBuffer(target, buffer);
	gl.bufferData(target, data, usage);
	return buffer;
}

var Bezier = function(t) {
	return [
	(1-t)*(1-t)*(1-t),
	3*t*(1-t)*(1-t),
	3*t*t*(1-t),
	t*t*t
	];
}

var BezierDerivative = function(t) {
	return [
	-3*(1-t)*(1-t),
	3*(1-3*t)*(1-t),
	3*t*(2-3*t),
	3*t*t
	];
}

var Hermite = function(t) {
	return [
		2*t*t*t-3*t*t+1,
		t*t*t-2*t*t+t,
		-2*t*t*t+3*t*t,
		t*t*t-t*t
	];
}

var HermiteDerivative = function(t) {
	return [
		6*t*t-6*t,
		3*t*t-4*t+1,
		-6*t*t+6*t,
		3*t*t-2*t
	];
}

function Cubic(basis,P,t){
	var b = basis(t);
	var result=twgl.v3.mulScalar(P[0],b[0]);
	twgl.v3.add(twgl.v3.mulScalar(P[1],b[1]),result,result);
	twgl.v3.add(twgl.v3.mulScalar(P[2],b[2]),result,result);
	twgl.v3.add(twgl.v3.mulScalar(P[3],b[3]),result,result);
	return result;
}



















