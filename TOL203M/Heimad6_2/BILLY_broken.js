var gl;

const numVertices = 36;

const points = [];
const colors = [];
const pointsArray = [];//viðbót frá PhongCube
const normalsArray = [];//viðbót frá PhongCube

var movement = false;  // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var matrixLoc;

var myNormalMatrixLoc;
const lightPosition = flatten(vec4(1.0,1.0,1.0,0.0));
const lightAmbient =     vec4(0.2,0.2,0.2,1.0);
const lightDiffuse =     vec4(1.0,1.0,1.0,1.0);
const lightSpecular =    vec4(1.0,1.0,1.0,1.0);
const materialAmbient =  vec4(1.0,0.0,1.0,1.0);
const materialDiffuse =  vec4(1.0,0.8,0.0,1.0);
const materialSpecular = vec4(1.0,1.0,1.0,1.0);
const materialShininess = 550.0;

const ambientProduct = flatten(mult(lightAmbient, materialAmbient));
const diffuseProduct = flatten(mult(lightDiffuse, materialDiffuse));
const specularProduct = flatten(mult(lightSpecular, materialSpecular));

window.onload = function init()
{
	"use strict";
	const canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if(!gl){alert("WebGL isn't available");}

	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(0.9,1.0,1.0,1.0);

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);//til hvers er þetta? Veit ekki.

	//
	//  Load shaders and initialize attribute buffers
	//
	var program = initShaders(gl,"vertex-shader","fragment-shader");
	gl.useProgram(program);

	makeCube();//eini tilgangur þessa er að stilla fylkin points,colors,pointsArray,normalsArray

	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,flatten(colors),gl.STATIC_DRAW);
// viðbót frá PhongCube
	var nBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,nBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,flatten(normalsArray),gl.STATIC_DRAW);
//
	var vNormal = gl.getAttribLocation(program,"vNormal");//að bæta þessu við gefur viðvörun
	gl.vertexAttribPointer(vNormal,4,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vNormal);
//
	var vColor = gl.getAttribLocation(program,"vColor");
	gl.vertexAttribPointer(vColor,4,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vColor);

	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,flatten(points),gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program,"vPosition");
	gl.vertexAttribPointer(vPosition,3,gl.FLOAT,false,0,0);//PhongCube breytir þessu frá 3 í 4
	gl.enableVertexAttribArray(vPosition);

	matrixLoc = gl.getUniformLocation(program,"rotation");

	myNormalMatrixLoc = gl.getUniformLocation(program,"myNormalMatrix");//þetta verður bara null
	gl.uniform4fv(gl.getUniformLocation(program,"ambientProduct"),ambientProduct);
	gl.uniform4fv(gl.getUniformLocation(program,"diffuseProduct"),diffuseProduct);
	gl.uniform4fv(gl.getUniformLocation(program,"specularProduct"),specularProduct);
	gl.uniform4fv(gl.getUniformLocation(program,"lightPosition"),lightPosition);
	gl.uniform1f(gl.getUniformLocation(program,"shininess"),materialShininess);
	//event listeners for mouse
	canvas.addEventListener("mousedown",function(e){
		movement = true;
		origX = e.offsetX;
		origY = e.offsetY;
		e.preventDefault(); // Disable drag and drop
	} );

	canvas.addEventListener("mouseup",function(e){
		movement = false;
	} );

	canvas.addEventListener("mousemove",function(e){
		if(movement) {
			spinY = ( spinY + (origX - e.offsetX) ) % 360;
			spinX = ( spinX + (origY - e.offsetY) ) % 360;
			origX = e.offsetX;
			origY = e.offsetY;
		}
	} );

	render();
}

function makeCube()
{
	"use strict";
	const vertices = [
		vec3(-0.5,-0.5, 0.5),
		vec3(-0.5, 0.5, 0.5),
		vec3( 0.5, 0.5, 0.5),
		vec3( 0.5,-0.5, 0.5),
		vec3(-0.5,-0.5,-0.5),
		vec3(-0.5, 0.5,-0.5),
		vec3( 0.5, 0.5,-0.5),
		vec3( 0.5,-0.5,-0.5)
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

	const NewVertices = [
		vec3(-0.5,-0.5, 0.5,1.0),
		vec3(-0.5, 0.5, 0.5,1.0),
		vec3( 0.5, 0.5, 0.5,1.0),
		vec3( 0.5,-0.5, 0.5,1.0),
		vec3(-0.5,-0.5,-0.5,1.0),
		vec3(-0.5, 0.5,-0.5,1.0),
		vec3( 0.5, 0.5,-0.5,1.0),
		vec3( 0.5,-0.5,-0.5,1.0)
	];

	const faceNormals = [
		vec4( 0.0, 0.0, 1.0,0.0),// front
		vec4( 1.0, 0.0, 0.0,0.0),// right
		vec4( 0.0,-1.0, 0.0,0.0),// down
		vec4( 0.0, 1.0, 0.0,0.0),// up
		vec4( 0.0, 0.0,-1.0,0.0),// back
		vec4(-1.0, 0.0, 0.0,0.0) // left
	];

	quad(1,0,3,2,0);
	quad(2,3,7,6,1);
	quad(3,0,4,7,2);
	quad(6,5,1,2,3);
	quad(4,5,6,7,4);
	quad(5,4,0,1,5);
	function quad(a,b,c,d,n) 
	{
		// We need to parition the quad into two triangles in order for
		// WebGL to be able to render it.  In this case, we create two
		// triangles from the quad indices

		//vertex color assigned by the index of the vertex
		//face normals assigned using the parameter n

		const indices = [a,b,c,a,c,d];

		for(var i=0;i<indices.length;++i)
		{
			points.push(vertices[indices[i]]);
			colors.push(vertexColors[a]);
			pointsArray.push(vertices[indices[i]]);
			normalsArray.push(faceNormals[n]);
		}
	}
}

const bakhlidMatrix = mult(mult(mult(mat4(),translate(-0.5,-0.5,0.0)),scalem(1.0,1.0,0.02)),translate(0.5,0.5,0.0));
function render()
{
	"use strict";
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	let mva;
	let mv = mult(rotateX(spinX), rotateY(spinY));//(rotateX*rotateY)

	const myNormalMatrix = [
		vec3(mv[0][0], mv[0][1], mv[0][2]),
		vec3(mv[1][0], mv[1][1], mv[1][2]),
		vec3(mv[2][0], mv[2][1], mv[2][2])
	];

	//"bakhlið"
/*
	mva = mult(mv,translate(-0.5,-0.5,0.0));
	mva = mult(mva,scalem(1.0,1.0,0.02));
	mva = mult(mva,translate(0.5,0.5,0.0));
*/
	mva = mult(mv,bakhlidMatrix);//til að gera render auðveldara fyrir
	gl.uniformMatrix4fv(matrixLoc,false,flatten(mva));
	gl.drawArrays(gl.TRIANGLES,0,numVertices);

	//"hlið1"
	mva = mult(mv,translate(-0.5,-0.5,-0.14));
	mva = mult(mva,scalem(0.04,1.0,0.28));
	mva = mult(mva,translate(0.5,0.5,0.0));
	gl.uniformMatrix4fv(matrixLoc,false,flatten(mva));
	gl.drawArrays(gl.TRIANGLES,0,numVertices);
	//"hlið2"
	mva = mult(mva,translate(24.0,0.0,0.0));
	gl.uniformMatrix4fv(matrixLoc,false,flatten(mva));
	gl.drawArrays(gl.TRIANGLES,0,numVertices);

	//"fletir"
	mva = mult(mv,translate(-0.5,-0.5,-0.14));
	mva = mult(mva,scalem(1.0,0.04,0.28));
	mva = mult(mva,translate(0.5,0.5,0.0));
	gl.uniformMatrix4fv(matrixLoc,false,flatten(mva));
	gl.drawArrays(gl.TRIANGLES,0,numVertices);

	for(let i=0;i<4;i++)
	{
		mva = mult(mva,translate(0.0,6.0,0.0));
		gl.uniformMatrix4fv(matrixLoc,false,flatten(mva));
		gl.drawArrays(gl.TRIANGLES,0,numVertices);
	}
	requestAnimFrame(render);
}
