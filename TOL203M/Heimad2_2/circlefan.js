let gl;

// numCirclePoints er fjöldi punkta á hringnum
// Heildarfjöldi punkta er tveimur meiri (miðpunktur + fyrsti punktur kemur tvisvar)
let numCirclePoints;
const radius = 0.5;
const center = vec2(0, 0);
let points = [];

window.onload = function init()
{
	"use strict";
	const canvas = document.getElementById("gl-canvas");
	const slider = document.getElementById("sldr");
	rfb(slider);
	numCirclePoints = parseInt(slider.value);
	gl = WebGLUtils.setupWebGL(canvas);
	if(!gl){alert("WebGL isn't available");}

	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(1.0,1.0,1.0,1.0);

	//
	//  Load shaders and initialize attribute buffers
	//
	const program = initShaders(gl,"vertex-shader","fragment-shader");
	gl.useProgram(program);

	// Create the circle
	createCirclePoints(center,radius,numCirclePoints);

	const vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,flatten(points),gl.STATIC_DRAW);

	const vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vPosition);

	render();
}

function rfb(DE)
{
	DE.nextSibling.innerText = DE.value;
}

function createCirclePoints(cent,rad,k)// Create the points of the circle
{
	"use strict";
	points = [];
	points.push(center);
	const dAngle = 2*Math.PI/k;
	for(let i=k,a;i>=0;i--)
	{
		a = i*dAngle;
		var p = vec2(rad*Math.sin(a)+cent[0],rad*Math.cos(a)+cent[1]);
		points.push(p);
	}
}

function render()
{
	"use strict";
	gl.clear(gl.COLOR_BUFFER_BIT);
	// Draw circle using Triangle Fan
	gl.drawArrays(gl.TRIANGLE_FAN,0,numCirclePoints+2);

	//window.requestAnimFrame(render);//óþarfi
}

function rerender()
{
	"use strict";
	window.onload();
}