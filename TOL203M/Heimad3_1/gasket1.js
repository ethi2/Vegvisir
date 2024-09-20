"use strict";

let gl;
let points;
const NumPoints = 5000;
let smellhreyfing = false, needsToRender = true, colorUsed = vec4(1.0,0.0,0.0,1.0), shiftMatrix = mat4();
let colorLoc, matrixLoc;

window.onload = function init()
{
	const canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if(!gl){alert("WebGL isn't available");}

	//
	// Initialize our data for the Sierpinski Gasket
	//

	// First, initialize the corners of our gasket with three points.

	const vertices = [
		vec2(-1,-1),
		vec2( 0, 1),
		vec2( 1,-1)
	];

	// Specify a starting point p for our iterations
	// p must lie inside any set of three vertices

	var u = add(vertices[0],vertices[1]);
	var v = add(vertices[0],vertices[2]);
	var p = scale(0.25,add(u,v));

	// And, add our initial point into our array of points

	points = [p];

	// Compute new points
	// Each new point is located midway between
	// last point and a randomly chosen vertex

	for (let i=0;points.length<NumPoints;++i) {
		var j = Math.floor(Math.random()*3);
		p = add(points[i], vertices[j]);
		p = scale(0.5,p);
		points.push(p);
	}

	//
	// Configure WebGL
	//
	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(1.0,1.0,1.0,1.0);

	// Load shaders and initialize attribute buffers

	const program = initShaders(gl,"vertex-shader","fragment-shader");
	gl.useProgram(program);

	// Load the data into the GPU

	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,bufferId);
	gl.bufferData(gl.ARRAY_BUFFER,flatten(points),gl.STATIC_DRAW);

	// Associate out shader variables with our data buffer

	const vPosition = gl.getAttribLocation(program,"vPosition");
	gl.vertexAttribPointer(vPosition,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vPosition);

	window.onkeydown = (e) => {
		if(e.keyCode==32 && e.repeat==false)
		{
			colorUsed = vec4(Math.random(),Math.random(),Math.random(),1.0);
			gl.uniform4fv(colorLoc,colorUsed);
			needsToRender = true;
		}
	};
	canvas.onwheel = (e) => {
		if(e.wheelDelta!=0)
		{
			mZoom(e.wheelDelta>0);
		}
	};
	canvas.onmousedown = (e) => {
		switch(e.buttons)
		{
			case 1:
				smellhreyfing = !smellhreyfing;
				break;
			case 4:
				resetMatrix();
			default://á líka við ef smellt er á marga takka í einu
				smellhreyfing = false;
		}
	};
	canvas.onmouseup = (e) => {
		smellhreyfing = false;
	};
	canvas.onmousemove = (e) => {
		if(smellhreyfing)
		{
			mShift(e.movementX/e.target.width*2,e.movementY/e.target.height*2);
		}
	};
	colorLoc = gl.getUniformLocation(program,"fColor");
	matrixLoc = gl.getUniformLocation(program,"shftMtrx");
	gl.uniform4fv(colorLoc,colorUsed);
	gl.uniformMatrix4fv(matrixLoc,false,flatten(shiftMatrix));
	render();
};

function render()
{
	if(needsToRender)
	{
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.POINTS,0,points.length);
		needsToRender = false;
	}
	window.requestAnimFrame(render);
}

function mZoom(q)
{
	const zFactor = (q?1.1:0.9);
	shiftMatrix[0][0] *= zFactor;
	shiftMatrix[1][1] *= zFactor;
	gl.uniformMatrix4fv(matrixLoc,false,flatten(shiftMatrix));
	needsToRender = true;
}

function mShift(a,b)
{
	shiftMatrix[0][3] += a;
	shiftMatrix[1][3] -= b;
	gl.uniformMatrix4fv(matrixLoc,false,flatten(shiftMatrix));
	needsToRender = true;
}

function resetMatrix()
{
	shiftMatrix = mat4();
	gl.uniformMatrix4fv(matrixLoc,false,flatten(shiftMatrix));
	colorUsed = vec4(1.0,0.0,0.0,1.0);
	gl.uniform4fv(colorLoc,colorUsed);
	needsToRender = true;
}