"use strict";
var canvas;
var gl;

var index = 0;

var pointsArray = [];
var normalsArray = [];

var movement = false; // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var zDist = -4.0;

var fovy = 60.0;
var near = 0.2;
var far = 100.0;

var lightPosition = vec4(10.0, 10.0, 10.0, 1.0 );
var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 0.2, 0.0, 0.2, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 50.0;

var ctm;
var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var normalMatrix, normalMatrixLoc;

var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

let points,normals;//þarf fyrir strict mode
let meltLimit, mlLoc, cHue;//viðbót
const IL1 = document.getElementById("infoline1");
const IL2 = document.getElementById("infoline2");
let dfPloc;

window.onload = function init(){

	canvas = document.getElementById( "gl-canvas" );

	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL isn't available" ); }

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.9, 1.0, 1.0, 1.0 );

	gl.enable(gl.DEPTH_TEST);
//	gl.enable(gl.CULL_FACE);
//	gl.cullFace(gl.BACK);


	var myTeapot = teapot(15);
	myTeapot.scale(0.5, 0.5, 0.5);

	//console.log(myTeapot.TriangleVertices.length);

	points = myTeapot.TriangleVertices;
	normals = myTeapot.Normals;

	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram(program);


	const ambientProduct = mult(lightAmbient, materialAmbient);
	const diffuseProduct = mult(lightDiffuse, materialDiffuse);
	const specularProduct = mult(lightSpecular, materialSpecular);


	var nBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );

	var vNormal = gl.getAttribLocation( program, "vNormal" );
	gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vNormal);

	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation( program, "vPosition");
	gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
	projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
	normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );

	projectionMatrix = perspective( fovy, 1.0, near, far );
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );

	dfPloc = gl.getUniformLocation(program, "diffuseProduct");//auka-viðbót

	gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct) );
	gl.uniform4fv( dfPloc, flatten(diffuseProduct) );
	gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct) );
	gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition) );
	gl.uniform1f( gl.getUniformLocation(program, "shininess"), materialShininess );

	meltLimit = 1.8;//viðbót byrjar
	mlLoc = gl.getUniformLocation(program, "ml");
	gl.uniform1f(mlLoc,meltLimit);
	cHue = 48;//viðbót endar

	//event listeners for mouse
	canvas.addEventListener("mousedown", function(e){
		movement = true;
		origX = e.clientX;
		origY = e.clientY;
		e.preventDefault();		 // Disable drag and drop
	} );

	canvas.addEventListener("mouseup", function(e){
		movement = false;
	} );

	canvas.addEventListener("mousemove", function(e){
		if(movement) {
			spinY = ( spinY + (origX - e.clientX) ) % 360;
			spinX = ( spinX + (origY - e.clientY) ) % 360;
			origX = e.clientX;
			origY = e.clientY;
		}
	} );

	// Event listener for mousewheel
	 window.addEventListener("wheel", function(e){
		 if( e.deltaY > 0.0 ) {
			 zDist += 0.2;
		 } else {
			 zDist -= 0.2;
		 }
	 }  );

	window.onkeydown = (e) => {
		//console.log(e.keyCode);
		if(e.keyCode==38)//upp
		{
			cml(meltLimit+0.05);
		}
		else if(e.keyCode==40)//niður
		{
			cml(meltLimit-0.05);
		}
		else if(e.keyCode==37)//vinstri
		{
			cH(cHue-1);
		}
		else if(e.keyCode==39)//hægri
		{
			cH(cHue+1);
		}
	};
	cml(meltLimit);
	cH(cHue);

	render();
}

function cml(a)//viðbót_a
{
	meltLimit = Math.max(0.0,Math.min(4.0,a));
	if(IL1){IL1.innerText = `meltlimit is ${meltLimit.toFixed(2)}`;}
	gl.uniform1f(mlLoc,meltLimit);
}
function cH(a)//viðbót_b
{
	cHue = Math.max(0,Math.min(360,a));
	if(IL2){IL2.innerText = `Hue is ${cHue}`;}
	const temp = hsv2rgb(a,1.0,1.0);
	gl.uniform4fv(dfPloc,flatten(mult(lightDiffuse, vec4( temp[0], temp[1], temp[2], 1.0 ) )));
}

function hsv2rgb(h,s,v) 
{
	let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
	return [f(5),f(3),f(1)];       
}

function render() {

	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	modelViewMatrix = lookAt( vec3(0.0, 0.0, zDist), at, up );
	modelViewMatrix = mult( modelViewMatrix, rotateY( -spinY ) );
	modelViewMatrix = mult( modelViewMatrix, rotateX( spinX ) );

	normalMatrix = [
		vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
		vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
		vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
	];
	normalMatrix.matrix = true;

	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
	gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

	gl.drawArrays( gl.TRIANGLES, 0, points.length );
	window.requestAnimFrame(render);
}
