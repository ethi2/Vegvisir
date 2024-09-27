let gl;

const numVertices  = 36;

const points = [];
const colors = [];

let movement = false;  // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;
var matrixLoc;

window.onload = function init()
{
	const canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if(!gl){alert("WebGL isn't available");}

	colorCube();

	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(0.9,1.0,1.0,1.0);

	gl.enable(gl.DEPTH_TEST);

	//
	//  Load shaders and initialize attribute buffers
	//
	var program = initShaders(gl,"vertex-shader","fragment-shader");
	gl.useProgram(program);

	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,flatten(colors),gl.STATIC_DRAW);

	var vColor = gl.getAttribLocation(program,"vColor");
	gl.vertexAttribPointer(vColor,4,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vColor);

	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,flatten(points),gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program,"vPosition");
	gl.vertexAttribPointer(vPosition,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vPosition);

	matrixLoc = gl.getUniformLocation(program,"rotation");

	//event listeners for mouse
	canvas.addEventListener("mousedown", function(e){
		movement = true;
		origX = e.offsetX;
		origY = e.offsetY;
		e.preventDefault(); // Disable drag and drop
	} );

	canvas.addEventListener("mouseup", function(e){
		movement = false;
	} );

	canvas.addEventListener("mousemove", function(e){
		if(movement) {
			spinY = ( spinY + (origX - e.offsetX) ) % 360;
			spinX = ( spinX + (origY - e.offsetY) ) % 360;
			origX = e.offsetX;
			origY = e.offsetY;
		}
	} );

	render();
}

function colorCube()
{
	"use strict";
	// We need to parition the quad into two triangles in order for
	// WebGL to be able to render it.  In this case, we create two
	// triangles from the quad indices
	const vertices = [
		vec3(-0.5,-0.5, 0.0),
		vec3(-0.5, 0.5, 0.0),
		vec3( 0.5, 0.5, 0.0),
		vec3( 0.5,-0.5, 0.0),
		vec3(-0.5,-0.5,-1.0),
		vec3(-0.5, 0.5,-1.0),
		vec3( 0.5, 0.5,-1.0),
		vec3( 0.5,-0.5,-1.0)
	];
	const vertexColors = [
		[0.0,0.0,0.0,1.0], // black
		[1.0,0.0,0.0,1.0], // red
		[1.0,1.0,0.0,1.0], // yellow
		[0.0,1.0,0.0,1.0], // green
		[0.0,0.0,1.0,1.0], // blue
		[1.0,0.0,1.0,1.0], // magenta
		[0.0,1.0,1.0,1.0], // cyan
		[1.0,1.0,1.0,1.0]  // white
	];
	quad(1,0,3,2);
	quad(2,3,7,6);
	quad(3,0,4,7);
	quad(6,5,1,2);
	quad(4,5,6,7);
	quad(5,4,0,1);

	function quad(a,b,c,d) 
	{
		//vertex color assigned by the index of the vertex
		const indices = [a,b,c,a,c,d];

		for(let i=0;i<indices.length;++i)
		{
			points.push(vertices[indices[i]]);
			colors.push(vertexColors[a]);
		}
	}
}

const klst = 0.1/12;//gert ráð fyrir að þetta sé 12 tíma veggklukka(en ekki 24)
const mins = 0.1;//(6(sek°)/60)
const seks = 6;//(360° / 60 sek í hring)
const degToRad = Math.PI/180;

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const rotMat = mult(rotateX(spinX),rotateY(spinY));//rotateX*rotateY
	const secondsOfDay = (Math.floor(Date.now()/1000)%86400);
	const s0 = klst*secondsOfDay;
	const s1 = mins*secondsOfDay;
	const s2 = seks*secondsOfDay;
	let mv = scalem(0.045, 0.4, 0.01);//búa til vísir
	mv = mult(translate(0.0,0.175,0.0),mv);//setja vísi á réttan stað
	const Rstack = [
		rotateZ(-s0),
		rotateZ(-s1),
		rotateZ(-s2)
	];
	const Tstack = [
		translate(0.0,0.0,0.0),
		translate(Math.sin(degToRad*s0)*0.35,Math.cos(degToRad*s0)*0.35,-0.01),
		translate(Math.sin(degToRad*s1)*0.35,Math.cos(degToRad*s1)*0.35,-0.01)
	];

	for(let i=0;i<3;i++)
	{
		let currentHand = mult(Rstack[i],mv);
		for(let j=0;j<=i;j++)
		{
			currentHand = mult(Tstack[j],currentHand);
		}
		currentHand = mult(rotMat,currentHand);
		gl.uniformMatrix4fv(matrixLoc,false,flatten(currentHand));
		gl.drawArrays(gl.TRIANGLES,0,numVertices);
	}
	requestAnimFrame(render);
}