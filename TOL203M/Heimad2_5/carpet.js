"use strict";

let gl;
const points = [];
const NumTimesToSubdivide = 5;
const stutt=0.3333, langt=0.6667;

window.onload = function init()
{
	"use strict";
	const canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if(!gl){alert("WebGL isn't available");}

	// Initialize our data for the Sierpinski Carpet

	const vertices = [vec2(-1,1),vec2(1,1),vec2(-1,-1),vec2(1,-1)];

	divideCarpet(vertices[0],vertices[1],vertices[2],vertices[3],NumTimesToSubdivide);

	//  Configure WebGL
	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(1.0,1.0,1.0,1.0);

	//  Load shaders and initialize attribute buffers
	const program = initShaders(gl,"vertex-shader","fragment-shader");
	gl.useProgram(program);

	// Load the data into the GPU
	const bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,bufferId);
	gl.bufferData(gl.ARRAY_BUFFER,flatten(points),gl.STATIC_DRAW);

	// Associate out shader variables with our data buffer
	const vPosition = gl.getAttribLocation(program,"vPosition");
	gl.vertexAttribPointer(vPosition,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vPosition);

	render();
};

function divideCarpet(a,b,c,d,count)
{
	// check for end of recursion

	if(count===0)
	{
		addPatch();
	}
	else
	{
		//bisect the sides
		const uppi1 = mix(a,b,stutt);
		const uppi2 = mix(a,b,langt);
		const vinstri1 = mix(a,c,stutt);
		const vinstri2 = mix(a,c,langt);
		const hægri1 = mix(b,d,stutt);
		const hægri2 = mix(b,d,langt);
		const niðri1 = mix(c,d,stutt);
		const niðri2 = mix(c,d,langt);
		const miðja1 = mix(vinstri1,hægri1,stutt);
		const miðja2 = mix(vinstri1,hægri1,langt);
		const miðja3 = mix(vinstri2,hægri2,stutt);
		const miðja4 = mix(vinstri2,hægri2,langt);

		--count;

		divideCarpet(a,uppi1,vinstri1,miðja1,count);
		divideCarpet(uppi1,uppi2,miðja1,miðja2,count);
		divideCarpet(uppi2,b,miðja2,hægri1,count);

		divideCarpet(vinstri1,miðja1,vinstri2,miðja3,count);
		//miðju-kassi undanskilinn
		divideCarpet(miðja2,hægri1,miðja4,hægri2,count);

		divideCarpet(vinstri2,miðja3,c,niðri1,count);
		divideCarpet(miðja3,miðja4,niðri1,niðri2,count);
		divideCarpet(miðja4,hægri2,niðri2,d,count);
	}

	function addPatch()
	{
		points.push(a,b,c);
		points.push(b,c,d);
	}
}

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES,0,points.length);
}
