    
var grobjects = grobjects || [];

var Sky = undefined;

var size = 10;
	
(function(){	
	// vertex positions
    var vertexPos = new Float32Array(
        [  size, size, size,  -size, size, size,  -size,-size, size,   size,-size, size,
           size, size, size,   size,-size, size,   size,-size,-size,   size, size,-size,
           size, size, size,   size, size,-size,  -size, size,-size,  -size, size, size,
          -size, size, size,  -size, size,-size,  -size,-size,-size,  -size,-size, size,
          -size,-size,-size,   size,-size,-size,   size,-size, size,  -size,-size, size,
           size,-size,-size,  -size,-size,-size,  -size, size,-size,   size, size,-size]);

    // vertex colors
    var vertexColors = new Float32Array(
        [  0.149, 0.6, 0.929,		0.149, 0.6, 0.929, 	0.149, 0.6, 0.929, 	0.149, 0.6, 0.929,
           0.149, 0.6, 0.929, 		0.149, 0.6, 0.929, 	0.149, 0.6, 0.929, 	0.149, 0.6, 0.929,
           0.149, 0.6, 0.929, 		0.149, 0.6, 0.929, 	0.149, 0.6, 0.929, 	0.149, 0.6, 0.929,
           0.149, 0.6, 0.929, 		0.149, 0.6, 0.929, 	0.149, 0.6, 0.929, 	0.149, 0.6, 0.929,
           0.105, 0.513, 0.129,   0.105, 0.513, 0.129,   0.105, 0.513, 0.129,   0.105, 0.513, 0.129,
           0.149, 0.6, 0.929, 		0.149, 0.6, 0.929, 	0.149, 0.6, 0.929,		0.149, 0.6, 0.929]);
    
    // element index array
    var triangleIndices = new Uint8Array(
        [  0, 1, 2,   0, 2, 3,    // front
           4, 5, 6,   4, 6, 7,    // right
           8, 9,10,   8,10,11,    // top
          12,13,14,  12,14,15,    // left
          16,17,18,  16,18,19,    // bottom
	      20,21,22,  20,22,23 ]); // back
		  
	var vs = `
		precision highp float;
		attribute vec3 pos;
		attribute vec3 color;
		uniform mat4 viewMat;
		uniform mat4 projMat;
		varying vec3 col;
		void main(){
			col = color;
			gl_Position = projMat * viewMat * vec4(pos, 1.0);
		}
	`;
	
	var fs = `
		precision highp float;
		varying vec3 col;
		void main() {
			gl_FragColor = vec4(col,1.0);
		}
	
	`;
	
	var shaderProgram = undefined;
	
	Sky = function Sky(){
		this.name = 'sky';
	}
	
	Sky.prototype.init = function(drawingState){
		var gl = drawingState.gl;

        // Compile Vertex Shader
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader,vs);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
			alert(gl.getShaderInfoLog(vertexShader));
            return null;
        }
        
		// Compile Fragment Shader
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader,fs);
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
		this.colLoc = gl.getAttribLocation(this.shaderProgram, "color");
        this.viewMatLoc = gl.getUniformLocation(this.shaderProgram,"viewMat");
		this.projMatLoc = gl.getUniformLocation(this.shaderProgram,"projMat");

        // Buffer Data
			// Position
        this.posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);
			// Color
		this.colBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.colBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);
			// Index
		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices, gl.STATIC_DRAW);
	}
	
	Sky.prototype.draw = function(drawingState){
		var gl = drawingState.gl;
		// choose the shader program we have compiled
		gl.useProgram(this.shaderProgram);

		// enable the attributes we had set up
		gl.enableVertexAttribArray(this.posLoc);
		gl.enableVertexAttribArray(this.colLoc);

		var modelM = twgl.m4.translation([0,size,0]);
		
		// set the uniforms
		gl.uniformMatrix4fv(this.viewMatLoc,false,twgl.m4.multiply(modelM,drawingState.view));
		gl.uniformMatrix4fv(this.projMatLoc,false,drawingState.proj);
		
		// connect the attributes to the buffer
		gl.bindBuffer(gl.ARRAY_BUFFER,this.posBuffer);
		gl.vertexAttribPointer(this.posLoc,3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER,this.colBuffer);
		gl.vertexAttribPointer(this.colLoc,3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.drawElements(gl.TRIANGLES, triangleIndices.length,gl.UNSIGNED_BYTE, 0);
	}
	
	Sky.prototype.center = function(drawingState){
		return [0,size,0];
	}
})();

grobjects.push(new Sky());