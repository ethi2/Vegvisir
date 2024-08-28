let gl;
let points;

window.onload = function init()
{
	"use strict";
	const canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if(!gl){alert("WebGL isn't available");}
/*Gamlir punktar
	const vertices = new Float32Array([
		-0.75, -0.75,	//1
		-0.75,  0.75,	//2
		-0.35,  0.75,	//3
		-0.35, -0.35,	//4
		0.45, -0.35,	//5
		0.45, -0.75]);	//6
*/
	const vertices = new Float32Array([
		0.45, -0.75,	//6
		0.45, -0.35,	//5
		-0.75, -0.75,	//1
		-0.35, -0.35,	//4
		-0.75,  0.75,	//2
		-0.35,  0.75]);	//3
    //  Configure WebGL

	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(1.0,1.0,1.0,1.0);

    //  Load shaders and initialize attribute buffers

	const program = initShaders(gl,"vertex-shader","fragment-shader");
	gl.useProgram(program);

    // Load the data into the GPU

	const bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,bufferId);
	gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

	const vPosition = gl.getAttribLocation(program,"vPosition");
	gl.vertexAttribPointer(vPosition,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vPosition);

	render();
};

function render()
{
	"use strict";
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_STRIP,0,6);
}
