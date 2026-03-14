const blocks = {

USP1:{x:80,y:200},

AW001:{x:180,y:200},
AW002:{x:280,y:200},
AW003:{x:380,y:200},

DLP2:{x:450,y:200},

AW004:{x:550,y:200},
AW005:{x:650,y:200},
AW006:{x:750,y:200},

EQP1:{x:820,y:200},

AW007:{x:920,y:200},
AW008:{x:1020,y:200},
AW009:{x:1120,y:200},

AMP1:{x:1180,y:200},

AW010:{x:1280,y:200},
AW011:{x:1380,y:200},
AW012:{x:1480,y:200},

DSP1:{x:1550,y:200},

AW013:{x:1650,y:200},
AW014:{x:1750,y:200},
AW015:{x:1850,y:200},

SMP1:{x:1920,y:200}

};

let trains={};

function drawLines(){

const map=document.getElementById("map");

function line(x1,x2,y){

let l=document.createElement("div");

l.className="line";

l.style.left=x1+"px";
l.style.top=y+"px";
l.style.width=(x2-x1)+"px";

map.appendChild(l);

}

line(80,450,205);
line(450,820,205);
line(820,1180,205);
line(1180,1550,205);
line(1550,1920,205);

}

function drawBlocks(){

const map=document.getElementById("map");

for(let id in blocks){

let b=blocks[id];

let dot=document.createElement("div");
dot.className="block";

dot.style.left=b.x+"px";
dot.style.top=b.y+"px";

map.appendChild(dot);

let label=document.createElement("div");
label.className="blockLabel";

label.innerText=id;

label.style.left=(b.x-10)+"px";
label.style.top=(b.y+14)+"px";

map.appendChild(label);

}

}

function drawStations(){

const map=document.getElementById("map");

const stations={

USP1:{x:60,y:160,name:"Union Station"},
DLP2:{x:430,y:160,name:"Downtown Lego City"},
EQP1:{x:800,y:160,name:"Emergency HQ"},
AMP1:{x:1160,y:160,name:"Airport Metro Transit Center"},
DSP1:{x:1530,y:160,name:"Death Star City"},
SMP1:{x:1900,y:160,name:"Downtown Santa Mooica"}

};

for(let id in stations){

let s=stations[id];

let div=document.createElement("div");

div.className="station";

div.innerText=s.name+"\n"+id;

div.style.left=s.x+"px";
div.style.top=s.y+"px";

map.appendChild(div);

}

}

function drawTrain(train){

let block=blocks[train.location];

if(!block) return;

let dot=document.createElement("div");

dot.className="train";

dot.style.left=block.x+"px";
dot.style.top=block.y+"px";

dot.title="Train "+train.number+
"\nModel: "+train.model+
"\nRoute: "+train.route+
"\nBlock: "+train.location;

document.getElementById("map").appendChild(dot);

if(train.connected){

let dot2=document.createElement("div");

dot2.className="train";

dot2.style.left=(block.x+18)+"px";
dot2.style.top=block.y+"px";

document.getElementById("map").appendChild(dot2);

}

}

function refresh(){

const map=document.getElementById("map");

map.innerHTML="";

drawLines();
drawBlocks();
drawStations();

for(let t in trains){

drawTrain(trains[t]);

}

}

function addTrain(){

let number=document.getElementById("trainNumber").value.trim();

if(number==="") return;

let train={

number:number,
model:document.getElementById("trainModel").value,
route:document.getElementById("trainRoute").value,
location:document.getElementById("trainLocation").value,
connected:document.getElementById("trainConnected").value

};

trains[number]=train;

refresh();

}

function updateTrain(){

let num=document.getElementById("trainNumber").value;

if(!trains[num]) return;

trains[num].model=document.getElementById("trainModel").value;
trains[num].route=document.getElementById("trainRoute").value;
trains[num].location=document.getElementById("trainLocation").value;
trains[num].connected=document.getElementById("trainConnected").value;

refresh();

}

function removeTrain(){

let num=document.getElementById("trainNumber").value;

delete trains[num];

refresh();

}

function searchTrain(){

let num=document.getElementById("searchTrain").value.trim();

let t=trains[num];

if(!t){

alert("Train not found");

return;

}

document.getElementById("trainNumber").value=t.number;
document.getElementById("trainModel").value=t.model;
document.getElementById("trainRoute").value=t.route;
document.getElementById("trainLocation").value=t.location;
document.getElementById("trainConnected").value=t.connected;

}

refresh();
