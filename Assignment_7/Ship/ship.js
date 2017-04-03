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

(function() {
    "use strict";

	var ship_data = new Ship_Data();
	
		// Define ship object
    var ship = {
        name : "ship",

        init : function(drawingState) {
            var gl = drawingState.gl;

            // Compile Vertex Shader
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader,ship_data.vs);
            gl.compileShader(vertexShader);
              if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                      alert(gl.getShaderInfoLog(vertexShader));
                      return null;
                  }
            // Compile Fragment Shader
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader,ship_data.fs);
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
            this.normLoc = gl.getAttribLocation(this.shaderProgram, "norm");
            this.normMatLoc = gl.getUniformLocation(this.shaderProgram,"normMat");
            this.viewMatLoc = gl.getUniformLocation(this.shaderProgram,"viewMat");
			this.projMatLoc = gl.getUniformLocation(this.shaderProgram,"projMat");
			this.sunLoc = gl.getUniformLocation(this.shaderProgram,"sunLoc");
			this.colorLoc = gl.getUniformLocation(this.shaderProgram,"color");

            // Buffer Data
				// Position
            this.posBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, ship_data.position, gl.STATIC_DRAW);
				// Normal
            this.normBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, ship_data.normal, gl.STATIC_DRAW);
				// Index
			this.indexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ship_data.index, gl.STATIC_DRAW);
			
        },
        draw : function(drawingState) {
            var gl = drawingState.gl;
            // choose the shader program we have compiled
            gl.useProgram(this.shaderProgram);

            // enable the attributes we had set up
            gl.enableVertexAttribArray(this.posLoc);
            gl.enableVertexAttribArray(this.normLoc);

            // set the uniforms
            gl.uniformMatrix4fv(this.normMatLoc,false,twgl.m4.inverse(twgl.m4.transpose(drawingState.view)));
            gl.uniformMatrix4fv(this.viewMatLoc,false,twgl.m4.multiply(twgl.m4.scaling([0.1, 0.1, 0.1]),drawingState.view));
			gl.uniformMatrix4fv(this.projMatLoc,false,drawingState.proj);
			gl.uniform3fv(this.sunLoc,drawingState.sunDirection);

            // connect the attributes to the buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
            gl.vertexAttribPointer(this.posLoc, ship_data.itemSize, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
            gl.vertexAttribPointer(this.normLoc, ship_data.itemSize, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
			gl.drawElements(gl.TRIANGLES, ship_data.index.length, gl.UNSIGNED_BYTE, 0);
        },
        center : function(drawingState) {
            return [0,-.5,0];
        },

        shaderProgram : undefined,
        posBuffer : undefined,
        colorBuffer : undefined,
        posLoc : -1,
        colorLoc : -1,
        projLoc : -1,
        viewLoc : -1
    };

    // Add Object to drawing list
    grobjects.push(ship);
})();