function start() {
	var canvas = document.getElementById("canvas");
	var gl = canvas.getContext("webgl");
	
	// Define Shader Source
	var vertexSource = ""+
    "attribute vec3 pos;" +
    "void main(void) {" + 
    "  gl_Position = vec4(pos, 1.0);" +
    "}";
	
	// If defined in HTML
	var vertexSource = document.getElementById("vs").text;
	
	// Vertex Shader
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);  // Create shader object
	gl.shaderSource(vertexShader, vertexSource);  // Attach source to shader
	gl.compileShader(vertexShader);  // Compile, done by graphics driver
	
	if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(vertexShader));  // Something went wrong
		return null;
	}
	
	// Fragment Shader
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragmentSource);
	gl.compileShader(fragmentShader);
	
	if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(fragmentShader));  // Something went wrong
		return null;
	}
	
	// Put everything together and link
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	
	if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Link Failed");
	}
	
	// with the vertex shader, we need to pass it positions
	// as an attribute - so set up that communication
	var posAttributeLoc =  gl.getAttribLocation(shaderProgram, "pos");
	gl.enableVertexAttribArray(posAttributeLoc);
  
	// now that we have programs to run on the hardware, we can 
	// make our triangle

	// let's define the vertex positions
	var vertexPos = [
		0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
	];  
	
	// Can make Vertex Shader do the transforms instead of giving it NDC
	// Can also have a vetex shared between triangles
	
	// Link data from CPU to GPU/Shader Program
	// Associate CPU 
	var trianglePosBuffer = gl.createBuffer();
	// Create link/hose between webgl and GPU memory
	gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
	// Open link and let data flow through link/hose
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);  // Put in recently bound area of GPU memory
	
	// Have yet to connect pos attribute to the flow of data
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Not a clear but a definition of what to do
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER__BIT | gl.DEPTH_BUFFER_BIT);
	
	gl.useProgram(shaderProgram);
	gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);  // 
	gl.vertexAttribPointer(posAttributeLoc, 3, gl.FLOAT, false, 0, 0);  // Link data with input to shader
	gl.drawArrays(gl.TRIANGLES, 0, 3);
}