"use strict";
const myCanvas = document.getElementById("gl-canvas");
const gl = WebGLUtils.setupWebGL(myCanvas);
if(!gl)
{
	alert("WebGL isn't available");
	throw "WebGL isn't available";
}
gl.viewport(0,0,myCanvas.width,myCanvas.height);
gl.clearColor(0.95,0.95,0.95,1.0);
const myProgram = initShaders(gl,"vertex-shader","fragment-shader");
gl.useProgram(myProgram);
const myBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,myBuffer);
//--------
const pþ = 0.03;//prikaþykkt
const pl = 0.12;//prikalengd
const vb = 0.1;//vinstri buffer prika
const tb = 0.08;//top buffer prika
const pb = 0.1;//bil milli prika, óháð prikaþykkt
const hp = 5;//hámarks prikafjöldi(ekki breyta þessu)
const bbb = 0.1;//botn-buffer byssu
const hb = 0.1;//hæð byssu
const rb = 0.1;//radíus byssu
let nxb = 0;//núverandi-x byssu(þessi skilgreining segir til um hvar byssan byrjar)
//--------
const pty = 1-tb;//prikatoppur-y
const pby = 1-tb-pl;//prikabotn-y
const phx = 1-vb;//prik-hægri-x
const pvx = 1-vb-pþ;//prik-vinstri-x
const BIN = hp*6;//byssu-index í myVertices
const bby = bbb-1;//byssa-botn-y
const bty = bbb+hb-1;//byssa-toppur-y
const lxb = rb-1;//lægsta x byssu(mest til vinstri)
const hxb = 1-rb;//hæsta x byssu(mest til hægri)
//--------
if(lxb>hxb)
{
	alert("gun doesn't fit");
	throw "gun doesn't fit";
}
nxb = Math.max(Math.min(nxb,hxb),lxb);//ef ske kynni að byssan byrji út af kortinu
const myVertices = flatten([
	vec2(phx-pb*4,pty),vec2(phx-pb*4,pby),vec2(pvx-pb*4,pby),vec2(phx-pb*4,pty),vec2(pvx-pb*4,pby),vec2(pvx-pb*4,pty),//fimmta prik
	vec2(phx-pb*3,pty),vec2(phx-pb*3,pby),vec2(pvx-pb*3,pby),vec2(phx-pb*3,pty),vec2(pvx-pb*3,pby),vec2(pvx-pb*3,pty),//fjórða prik
	vec2(phx-pb*2,pty),vec2(phx-pb*2,pby),vec2(pvx-pb*2,pby),vec2(phx-pb*2,pty),vec2(pvx-pb*2,pby),vec2(pvx-pb*2,pty),//þriðja prik
	vec2(phx-pb*1,pty),vec2(phx-pb*1,pby),vec2(pvx-pb*1,pby),vec2(phx-pb*1,pty),vec2(pvx-pb*1,pby),vec2(pvx-pb*1,pty),//annað prik
	vec2(phx-pb*0,pty),vec2(phx-pb*0,pby),vec2(pvx-pb*0,pby),vec2(phx-pb*0,pty),vec2(pvx-pb*0,pby),vec2(pvx-pb*0,pty),//fyrsta prik
	vec2(nxb,bty),vec2(nxb+rb,bby),vec2(nxb-rb,bby) //staðsetning byssu
]);
gl.bufferData(gl.ARRAY_BUFFER,myVertices,gl.STATIC_DRAW);//getur endað á gl.STATIC_DRAW eða gl.DYNAMIC_DRAW
/*                            ^
clickcircles notar harðkóðaðann fasta
carpet, spadi og circlefan nota flatten() á fylki af vec2; flatten skilar Float32Array fylki
L-shape-fan notar envítt Float32Array beint
*/
const vPosition = gl.getAttribLocation(myProgram,"vPosition");
gl.vertexAttribPointer(vPosition,2,gl.FLOAT,false,0,0);//hef ekki enn skoðað hvað viðföngin þýða
gl.enableVertexAttribArray(vPosition);

const myChangables = myVertices.subarray(BIN<<1);//það þarf að gera ráð fyrir muninum á hvernig drawArrays gerir hlutina

let prikafjöldi = 5;
let renderLoop = true;
render();

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	prerender();
	const prkshft = BIN-Math.max(0,Math.min(hp,parseInt(prikafjöldi)))*6;//prikafjöldi er það eina sem getur breyst
	gl.drawArrays(gl.TRIANGLES,prkshft,(myVertices.length>>1)-prkshft);//aðferð,byrjun,endir; aðferð segir til um hvernig lesið er úr punktum
	if(renderLoop){window.setTimeout(render, 1000/60);}
}

function placeGun()
{
	nxb = Math.max(Math.min(nxb,hxb),lxb);
	myChangables[0] = nxb;
	myChangables[2] = nxb+rb;
	myChangables[4] = nxb-rb;
}
function prerender()
{
	placeGun();
	gl.bufferSubData(gl.ARRAY_BUFFER,BIN<<3,myChangables);//viðfang 2 er hrár bætafjöldi
}

let groovin = false;
myCanvas.onmousedown = (e) => {
	groovin = !groovin;
}
myCanvas.onmouseup = (e) => {
	groovin = false;
}
myCanvas.onmousemove = (e) => {
	if(groovin)
	{
		nxb+=(e.movementX/myCanvas.width*2);
	}
}
