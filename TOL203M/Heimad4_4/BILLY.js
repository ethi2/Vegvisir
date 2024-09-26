var gl;

var numVertices  = 36;

var points = [];
var colors = [];

var movement = false;  // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var matrixLoc;

window.onload = function init()
{
	const canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if ( !gl ) { alert( "WebGL isn't available" ); }

	colorCube();

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.9, 1.0, 1.0, 1.0 );

	gl.enable(gl.DEPTH_TEST);

	//
	//  Load shaders and initialize attribute buffers
	//
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	var cBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

	var vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );

	var vBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	matrixLoc = gl.getUniformLocation( program, "rotation" );

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
	quad(1,0,3,2);
	quad(2,3,7,6);
	quad(3,0,4,7);
	quad(6,5,1,2);
	quad(4,5,6,7);
	quad(5,4,0,1);
}

function quad(a,b,c,d) 
{
	var vertices = [
		vec3(-0.5,-0.5, 0.5),
		vec3(-0.5, 0.5, 0.5),
		vec3( 0.5, 0.5, 0.5),
		vec3( 0.5,-0.5, 0.5),
		vec3(-0.5,-0.5,-0.5),
		vec3(-0.5, 0.5,-0.5),
		vec3( 0.5, 0.5,-0.5),
		vec3( 0.5,-0.5,-0.5)
	];

	var vertexColors = [
		[0.0,0.0,0.0,1.0], // black
		[1.0,0.0,0.0,1.0], // red
		[1.0,1.0,0.0,1.0], // yellow
		[0.0,1.0,0.0,1.0], // green
		[0.0,0.0,1.0,1.0], // blue
		[1.0,0.0,1.0,1.0], // magenta
		[0.0,1.0,1.0,1.0], // cyan
		[1.0,1.0,1.0,1.0]  // white
	];

	// We need to parition the quad into two triangles in order for
	// WebGL to be able to render it.  In this case, we create two
	// triangles from the quad indices

	//vertex color assigned by the index of the vertex

	var indices = [a,b,c,a,c,d];

	for(var i=0;i<indices.length;++i)
	{
		points.push(vertices[indices[i]]);
		colors.push(vertexColors[a]);
	}
}
const bakhlidMatrix = mult(mult(mult(mat4(),translate(-0.5,-0.5,0.0)),scalem(1.0,1.0,0.02)),translate(0.5,0.5,0.0));
function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	let mva;
	let mv = mult(mat4(), rotateX(spinX));
	mv = mult(mv, rotateY(spinY));//(I*rotateX)*rotateY

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
