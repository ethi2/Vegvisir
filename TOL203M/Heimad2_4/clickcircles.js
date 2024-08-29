let gl;

// Þarf hámarksfjölda punkta til að taka frá pláss í grafíkminni
const maxNumPoints = 200, numCirclePoints = 12;
let index = 0;

window.onload = function init()
{
	"use strict";
	let canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if(!gl){alert("WebGL isn't available");}

	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(0.95,1.0,1.0,1.0);

	//
	//  Load shaders and initialize attribute buffers
	//
	const program = initShaders(gl,"vertex-shader","fragment-shader");
	gl.useProgram(program);

	const vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,8*maxNumPoints*numCirclePoints*3,gl.DYNAMIC_DRAW);

	const vPosition = gl.getAttribLocation(program,"vPosition");
	gl.vertexAttribPointer(vPosition,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vPosition);

	canvas.addEventListener(
		"mousedown",
		function(e)
		{
			"use strict";
			gl.bindBuffer(gl.ARRAY_BUFFER,vBuffer);

			// Calculate coordinates of new point
			const t = vec2(2*e.offsetX/canvas.width-1, 2*(canvas.height-e.offsetY)/canvas.height-1);
			const r = 0.01+Math.random()/10;//slembinn radius
			// Add new point behind the others
			//gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));//original recipe
			gl.bufferSubData(gl.ARRAY_BUFFER, 8*index*numCirclePoints*3, flatten(createCirclePoints(t,r,numCirclePoints)));//the remake
			index++;
			render();
		}
	);

	render();
}


function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	//gl.drawArrays(gl.POINTS,0,index);//original recipe
	gl.drawArrays(gl.TRIANGLES,0,index*3*numCirclePoints);//the remake

	//window.requestAnimFrame(render);//óþarfi
}

function createCirclePoints(cent,rad,k)//center=vec(),radius=number,numCirclePoints=number
{
	"use strict";
	const points = [];
	const dAngle = 2*Math.PI/k;
	let a=k*dAngle;
	let erst=vec2(rad*Math.sin(a)+cent[0],rad*Math.cos(a)+cent[1]);
	for(let i=k-1;i>=0;i--)
	{
		a = i*dAngle;
		const p = vec2(rad*Math.sin(a)+cent[0],rad*Math.cos(a)+cent[1]);
		points.push(cent);
		points.push(erst);
		points.push(p);
		erst=p;
	}
	return points;
}
