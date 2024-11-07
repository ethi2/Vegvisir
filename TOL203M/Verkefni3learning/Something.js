"use strict";
const myCanvas = document.getElementById("gl-canvas");
const gl = WebGLUtils.setupWebGL(myCanvas);
if(!gl)
{
	alert("WebGL isn't available");
	throw "WebGL isn't available";
}
gl.viewport(0,0,myCanvas.width,myCanvas.height);
gl.clearColor(0.985,0.985,0.985,1.0);
gl.enable(gl.DEPTH_TEST);//notað í 3D, ekki í 2D; eini finnanlegi munur hingað til
const myProgram = initShaders(gl,"vertex-shader","fragment-shader");
gl.useProgram(myProgram);

const myVertices = [
	vec4(-0.7,-0.5, 0.0,1.0),
	vec4( 0.7,-0.5, 0.0,1.0),
	vec4( 0.7, 0.5, 0.0,1.0),
	vec4(-0.7,-0.5, 0.0,1.0),
	vec4( 0.7, 0.5, 0.0,1.0),
	vec4(-0.7, 0.5, 0.0,1.0)
];
//---- fyrir hvern buffer er þetta gert í þessarri röð
const firstBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,firstBuffer);
gl.bufferData(gl.ARRAY_BUFFER,flatten(myVertices),gl.STATIC_DRAW);

const vPosition = gl.getAttribLocation(myProgram,"vPosition");
gl.vertexAttribPointer(vPosition,4,gl.FLOAT,false,0,0);//viðfang 2 er hversu margar breytur eru í "setti". Í 3D er þetta 3 eða 4
gl.enableVertexAttribArray(vPosition);
//----

const bleh = flatten(mat4());
bleh[12] = -0.3;//X-hreyfing

const testMatrixLoc = gl.getUniformLocation(myProgram,"itemProjctn");
gl.uniformMatrix4fv(testMatrixLoc,false,bleh);

render();
function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//gl.bufferSubData(gl.ARRAY_BUFFER,BIN<<3,myChangables);//breyta einhverju
	gl.drawArrays(gl.TRIANGLES,0,myVertices.length);//teikna
}
