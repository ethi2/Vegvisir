"use strict";
const XL = 15;
const YL = 15;
const ZL = 15;
const defaultInitialOdds = 0.2;

const Xshift = 2.0/XL;//0.2 => -1;-0.8;-0.6;-0.4;-0.2;-0;0.2;0.4;0.6;0.8;1;
const Yshift = 2.0/YL;
const Zshift = 2.0/ZL;
const XboxPadding = 0.05*Xshift;//fasti eða hlutfall?
const YboxPadding = 0.05*Yshift;
const ZboxPadding = 0.05*Zshift;
const XboxSize = Xshift-2*XboxPadding;
const YboxSize = Yshift-2*YboxPadding;
const ZboxSize = Zshift-2*ZboxPadding;
const sq3 = 1/Math.sqrt(3-Math.max(0,Math.min(ZboxPadding,Math.min(YboxPadding,XboxPadding))));

const Dlogger = document.getElementById("logA");
const Dodds = document.getElementById("inpodds");
const Dww = document.getElementById("worldview");
const Dpath = document.getElementById("howfar");

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

const shiftToCenter = translate(1-XboxPadding-XboxSize/2,1-YboxPadding-YboxSize/2,1-ZboxPadding-ZboxSize/2);
const shiftBack = translate(-1+XboxPadding+XboxSize/2,-1+YboxPadding+YboxSize/2,-1+ZboxPadding+ZboxSize/2);
const MsecsAnim = 600;
const IndvCellSizeMats = new Array(MsecsAnim);
for(let i=0;i<MsecsAnim;i++)
{
	const prp = (i+0.5)/MsecsAnim;
	let tempMat = scalem(prp,prp,prp);
	tempMat = mult(tempMat,shiftToCenter);
	IndvCellSizeMats[i] = mult(shiftBack,tempMat);
}

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
gl.clearColor(0.985,0.985,0.985,1.0);
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
		if(e.buttons===4)
		{
			doMouseDrag = false;
			spinY = 0;
			spinX = 0;
			spinZ = 0;
		}
		else
		{
			doMouseDrag = !doMouseDrag;
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
	canvas.onwheel = (e) => {
		if(e.wheelDelta!=0)
		{
			console.log(`Wheel${e.wheelDelta>0?"+":"-"}`);
		}
	};

let Fr1 = new Array(XL);
let Fr2 = new Array(XL);
const Growing = new Array(XL);
const Dying = new Array(XL);
const ShftMat = new Array(XL);
for(let i=0;i<XL;i++)//constructing arrays
{
	Fr1[i] = new Array(YL);
	Fr2[i] = new Array(YL);
	Growing[i] = new Array(YL);
	Dying[i] = new Array(YL);
	ShftMat[i] = new Array(YL);
	for(let j=0;j<YL;j++)
	{
		Fr1[i][j] = new Array(ZL);
		Fr2[i][j] = new Array(ZL);
		Growing[i][j] = new Array(ZL);
		Dying[i][j] = new Array(ZL);
		ShftMat[i][j] = new Array(ZL);
		for(let k=0;k<ZL;k++)
		{
			ShftMat[i][j][k] = translate(Xshift*i,Yshift*j,Zshift*k);
		}
	}
}

function initialSeeding()
{
	let oddsUsed = parseFloat(Dodds.value);
	if(isNaN(oddsUsed) || oddsUsed>1.0 || oddsUsed<=0.0){oddsUsed=defaultInitialOdds;}
	let gen1count = 0;
	for(let i=0;i<XL;i++)
	{
		for(let j=0;j<YL;j++)
		{
			for(let k=0;k<ZL;k++)
			{
				const lavalamp = Math.random()<oddsUsed;
				Fr1[i][j][k] = lavalamp;
				Fr2[i][j][k] = false;
				Growing[i][j][k] = false;
				Dying[i][j][k] = false;
				gen1count+=lavalamp;
			}
		}
	}
	const lt = `${XL}*${YL}*${ZL} world seeded with odds ${oddsUsed}, ${gen1count} initial living cells`;
	if(Dlogger){Dlogger.innerText = lt;}
	console.log(lt);
}
let stepTimestamp = Date.now();
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
				const reslts = rule(Fr1[i][j][k],c);
				Fr2[i][j][k] = reslts[0];
				Growing[i][j][k] = reslts[1];
				Dying[i][j][k] = reslts[2];
				totalLiving+=reslts[0];
			}
		}
	}
	const t = Fr1;
	Fr1 = Fr2;
	Fr2 = t;
	stepTimestamp = Date.now();
	return totalLiving;
}

function rule(cc,ln)
{
	const staysLiving = (ln>=5 && ln<=7);
	const bornAgain = (ln==6);
	if(cc)//lifandi reitur
	{
		return [staysLiving,false,(staysLiving===false)];
	}
	else//tómur reitur
	{
		return [bornAgain,(bornAgain===true),false];
	}
	//skilagildi er [lífstatus,Growing,Dying]
}

const neutralMat = mat4();
const OutsideScaler = scalem(sq3,sq3,sq3);
const InsideScaler = perspective(70.0,1.0,0.01,3.7);
let worldScaler = mat4();//this default should never be used, it is only here in case everything fails
let path = Dpath?.value??-2.0;
function viewsetter()
{
	worldScaler = [OutsideScaler,mult(InsideScaler,translate(0.0,0.0,path))][Dww?.selectedIndex??0];
	//potential for other views as well, like lookAt
}
function walker(Sldr)
{
	path = parseFloat(Sldr.value);
	if((Dww?.selectedIndex??0)===1){viewsetter();}
}
function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	let mv = mult(rotateX(spinX),rotateY(spinY));//(rotateX*rotateY)
	mv = mult(rotateZ(spinZ),mv);//spursmál hvort þetta eigi heima hér
	mv = mult(worldScaler,mv);//kremja heiminn svo endareitir detti ekki úr við snúning
	const timeOfChange = Date.now() - stepTimestamp;
	const unstableGraphics = timeOfChange<MsecsAnim;
	const growingMat = unstableGraphics?IndvCellSizeMats[timeOfChange]:neutralMat;
	const dyingMat = unstableGraphics?IndvCellSizeMats[MsecsAnim-timeOfChange-1]:neutralMat;

	for(let i=0;i<XL;i++)
	{
		for(let j=0;j<YL;j++)
		{
			for(let k=0;k<ZL;k++)
			{
				if(Fr1[i][j][k])
				{
					let temp = mult(mv,ShftMat[i][j][k]);
					if(Growing[i][j][k])
					{
						temp = mult(temp,growingMat);
					}
					gl.uniformMatrix4fv(matrixLoc,false,flatten(temp));
					gl.drawArrays(gl.TRIANGLES,0,numVertices);
				}
				else if(unstableGraphics && Dying[i][j][k])
				{
					let temp = mult(mv,mult(ShftMat[i][j][k],dyingMat));
					gl.uniformMatrix4fv(matrixLoc,false,flatten(temp));
					gl.drawArrays(gl.TRIANGLES,0,numVertices);
				}
			}
		}
	}
	requestAnimFrame(render);
}
function manualstep()
{
	const cl = step();
	const ctD = countTheDying();
	const ctG = countTheGrowing();
	const logStr = `${cl} living cells, ${ctD} died, ${ctG} grew, net change: ${ctG-ctD}`;
	if(Dlogger){Dlogger.innerText = logStr;}
	console.log(logStr);
}
viewsetter();
initialSeeding();
render();
//----
function countTheDying()
{
	let c = 0;
	for(let i=0;i<Dying.length;i++)
	{
		for(let j=0;j<Dying[i].length;j++)
		{
			for(let k=0;k<Dying[i][j].length;k++)
			{
				c+=Dying[i][j][k];
			}
		}
	}
	return c;
}
function countTheGrowing()
{
	let c = 0;
	for(let i=0;i<Growing.length;i++)
	{
		for(let j=0;j<Growing[i].length;j++)
		{
			for(let k=0;k<Growing[i][j].length;k++)
			{
				c+=Growing[i][j][k];
			}
		}
	}
	return c;
}