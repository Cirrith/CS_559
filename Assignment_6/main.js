// draw a triangle using WebGL
// write everything out, step at a time
//
// written by gleicher on October 3, 2015

function start() {
  "use strict";

  // first we need to get the canvas and make an OpenGL context
	// in practice, you need to do error checking
	var canvas = document.getElementById("canvas");
	var gl =twgl.getWebGLContext(canvas);

  // with twgl, the shaders get moved to the html file
  var shaders = twgl.createProgramInfo(gl, ["vs", "fs"]);
  
  // let's define the vertex positions
  var vertexPos = [
         0.0,  1.0,  0.0,
        -1.0,  0.0,  0.0,
         0.5,  0.0,  0.0,
         0.0, -1.0,  0.0,
        -0.5,  0.0,  0.0,
         1.0,  0.0,  0.0,
   ];  
  var vertexColors = [
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 0.0, 1.0,    
    1.0, 0.0, 1.0,    
    1.0, 0.0, 1.0    
    ];
  var arrays = {pos:vertexPos, 
                inColor:vertexColors};
  var buffers = twgl.createBufferInfoFromArrays(gl, arrays);
  
  // this is the "draw scene" function, but since this 
  // is execute once...
  
  var theta = 0.25;
  
  function draw() {
	  // first, let's clear the screen
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
	  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // now we draw the triangle(s)
    // we tell GL what program to use, and what memory block
    // to use for the data, and that the data goes to the pos
    // attribute
    gl.useProgram(shaders.program);	    
  
    var mytrans = twgl.m4.rotationZ(theta);
    twgl.setUniforms(shaders,{transf : mytrans});
    twgl.setBuffersAndAttributes(gl,shaders,buffers);
    twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    theta += 0.01;
    window.requestAnimationFrame(draw);
  }
  draw();
}
start();
  