"use strict";
const XL = 10;
const YL = 10;
const ZL = 10;
const initialOdds = 0.2;
const sq3 = 1/Math.sqrt(3);//not sure if will be used

const Xshift = 2.0/XL;//0.2 => -1;-0.8;-0.6;-0.4;-0.2;-0;0.2;0.4;0.6;0.8;1;
const Yshift = 2.0/YL;
const Zshift = 2.0/ZL;
const XboxPadding = 0.05*Xshift;//fasti eða hlutfall?
const YboxPadding = 0.05*Yshift;
const ZboxPadding = 0.05*Zshift;
const XboxSize = Xshift-2*XboxPadding;
const YboxSize = Yshift-2*YboxPadding;
const ZboxSize = Zshift-2*ZboxPadding;

const numVertices = 36, points = [], colors = [];
const vertices = [//gera stærðfræði á föstunum hér til að þeir byrji á réttum stað
/*	upprunalegir hnútar
	vec3(-0.5,-0.5, 0.5),//vinstri botn frá
	vec3(-0.5, 0.5, 0.5),//vinstri topp frá
	vec3( 0.5, 0.5, 0.5),//hægri topp frá
	vec3( 0.5,-0.5, 0.5),//hægri botn frá
	vec3(-0.5,-0.5,-0.5),//vinstri botn að <- grunnstaðan
	vec3(-0.5, 0.5,-0.5),//vinstri topp að
	vec3( 0.5, 0.5,-0.5),//hægri topp að
	vec3( 0.5,-0.5,-0.5)//hægri botn að
ásarnir vaxa: hægri,upp,frá myndavél
*/
	vec3(-1+XboxPadding,         -1+YboxPadding,         -1+ZboxPadding+ZboxSize),
	vec3(-1+XboxPadding,         -1+YboxPadding+YboxSize,-1+ZboxPadding+ZboxSize),
	vec3(-1+XboxPadding+XboxSize,-1+YboxPadding+YboxSize,-1+ZboxPadding+ZboxSize),
	vec3(-1+XboxPadding+XboxSize,-1+YboxPadding,         -1+ZboxPadding+ZboxSize),
	vec3(-1+XboxPadding,         -1+YboxPadding,         -1+ZboxPadding),// <- grunnstaðan
	vec3(-1+XboxPadding,         -1+YboxPadding+YboxSize,-1+ZboxPadding),
	vec3(-1+XboxPadding+XboxSize,-1+YboxPadding+YboxSize,-1+ZboxPadding),
	vec3(-1+XboxPadding+XboxSize,-1+YboxPadding,         -1+ZboxPadding)
];
function colorCube()
{
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
		const indices = [a,b,c,a,c,d];//vertex color assigned by the index of the vertex
		for(let i=0;i<indices.length;++i)
		{
			points.push(vertices[indices[i]]);
			colors.push(vertexColors[a]);
		}
	}
}

const canvas = document.getElementById("gl-canvas");
const gl = WebGLUtils.setupWebGL(canvas);
if(!gl){alert("WebGL isn't available");}
colorCube();
gl.viewport(0,0,canvas.width,canvas.height);
gl.clearColor(1.0,1.0,1.0,1.0);
gl.enable(gl.DEPTH_TEST);
 // Load shaders and initialize attribute buffers
const program = initShaders(gl,"vertex-shader","fragment-shader");
gl.useProgram(program);
	const cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,flatten(colors),gl.STATIC_DRAW);

	const vColor = gl.getAttribLocation(program,"vColor");
	gl.vertexAttribPointer(vColor,4,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vColor);

	const vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,flatten(points),gl.STATIC_DRAW);

	const vPosition = gl.getAttribLocation(program,"vPosition");
	gl.vertexAttribPointer(vPosition,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vPosition);

	const matrixLoc = gl.getUniformLocation(program,"transform");
	let doMouseDrag = false, spinX = 0, spinY = 0, spinZ = 0;
	canvas.onmousedown = (e) => {
		doMouseDrag = !doMouseDrag;
		//console.log(e);
		if(e.buttons===4)
		{
			doMouseDrag = false;
			spinY = 0;
			spinX = 0;
			spinZ = 0;
		}
	};
	canvas.onmouseup = (e) => {
		doMouseDrag = false;
	};
	canvas.onmousemove = (e) => {
		if(doMouseDrag)
		{
			if(e.buttons===1)
			{
				spinY = (spinY-e.movementX)%360;
				spinX = (spinX-e.movementY)%360;
			}
			else if(e.buttons===2)
			{
				spinZ = (spinZ-e.movementX)%360;
			}
		}
	};

let Fr1 = new Array(XL);
const Fr2 = new Array(XL);
const ShftMat = new Array(XL);
for(let i=0;i<XL;i++)
{
	Fr1[i] = new Array(YL);
	Fr2[i] = new Array(YL);
	ShftMat[i] = new Array(YL);
	for(let j=0;j<YL;j++)
	{
		Fr1[i][j] = new Array(ZL);
		Fr2[i][j] = new Array(ZL);
		ShftMat[i][j] = new Array(ZL);
		for(let k=0;k<ZL;k++)
		{
			Fr1[i][j][k] = Math.random()<initialOdds;
			Fr2[i][j][k] = false;
			ShftMat[i][j][k] = translate(Xshift*i,Yshift*j,Zshift*k);
		}
	}
}

function step()
{
	let totalLiving = 0;
	for(let i=0;i<XL;i++)
	{
		for(let j=0;j<YL;j++)
		{
			for(let k=0;k<ZL;k++)
			{
				let c = 0;
				c+=Fr1[i]?.[j]?.[k+1]??0;
				c+=Fr1[i]?.[j]?.[k-1]??0;
				c+=Fr1[i]?.[j+1]?.[k]??0;
				c+=Fr1[i]?.[j-1]?.[k]??0;
				c+=Fr1[i]?.[j+1]?.[k+1]??0;
				c+=Fr1[i]?.[j-1]?.[k+1]??0;
				c+=Fr1[i]?.[j+1]?.[k-1]??0;
				c+=Fr1[i]?.[j-1]?.[k-1]??0;
				c+=Fr1[i+1]?.[j]?.[k]??0;
				c+=Fr1[i-1]?.[j]?.[k]??0;
				c+=Fr1[i+1]?.[j+1]?.[k]??0;
				c+=Fr1[i+1]?.[j-1]?.[k]??0;
				c+=Fr1[i-1]?.[j+1]?.[k]??0;
				c+=Fr1[i-1]?.[j-1]?.[k]??0;
				c+=Fr1[i+1]?.[j+1]?.[k+1]??0;
				c+=Fr1[i+1]?.[j+1]?.[k-1]??0;
				c+=Fr1[i+1]?.[j-1]?.[k+1]??0;
				c+=Fr1[i+1]?.[j-1]?.[k-1]??0;
				c+=Fr1[i+1]?.[j]?.[k+1]??0;
				c+=Fr1[i+1]?.[j]?.[k-1]??0;
				c+=Fr1[i-1]?.[j+1]?.[k+1]??0;
				c+=Fr1[i-1]?.[j+1]?.[k-1]??0;
				c+=Fr1[i-1]?.[j-1]?.[k+1]??0;
				c+=Fr1[i-1]?.[j-1]?.[k-1]??0;
				c+=Fr1[i-1]?.[j]?.[k+1]??0;
				c+=Fr1[i-1]?.[j]?.[k-1]??0;
				Fr2[i][j][k] = rule(Fr2[i][j][k],c);
				totalLiving+=Fr2[i][j][k];
			}
		}
	}
	Fr1 = Fr2;
	return totalLiving;
	function rule(cc,ln)
	{
		if(cc)//lifandi reitur
		{
			return (ln>=5 && ln<=7);
		}
		else//tómur reitur
		{
			return (ln==6);
		}
	}
}

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	let mv = mult(rotateX(spinX),rotateY(spinY));//(rotateX*rotateY)
	mv = mult(rotateZ(spinZ),mv);//spursmál hvort þetta eigi heima hér
	mv = mult(scalem(sq3,sq3,sq3),mv);//kremja heiminn svo endareitir detti ekki úr við snúning

	for(let i=0;i<XL;i++)
	{
		for(let j=0;j<YL;j++)
		{
			for(let k=0;k<ZL;k++)
			{
				if(Fr1[i][j][k])
				{
					gl.uniformMatrix4fv(matrixLoc,false,flatten(mult(mv,ShftMat[i][j][k])));
					gl.drawArrays(gl.TRIANGLES,0,numVertices);
				}
			}
		}
	}
	requestAnimFrame(render);
}
function manualstep(Dn)
{
	Dn.nextSibling.innerText = `${step()} living cells`;
}
render();