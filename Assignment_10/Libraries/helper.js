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