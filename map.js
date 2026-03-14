const blocks = {

USP1:{x:50,y:220},

AW001:{x:150,y:220},
AW002:{x:250,y:220},
AW003:{x:350,y:220},

DLP2:{x:400,y:220},

AW004:{x:500,y:220},
AW005:{x:600,y:220},
AW006:{x:700,y:220},

EQP1:{x:750,y:220},

AW007:{x:850,y:220},
AW008:{x:950,y:220},
AW009:{x:1050,y:220},

AMP1:{x:1100,y:220},

AW010:{x:1200,y:220},
AW011:{x:1300,y:220},
AW012:{x:1400,y:220},

DSP1:{x:1450,y:220},

AW013:{x:1550,y:220},
AW014:{x:1650,y:220},
AW015:{x:1750,y:220},

SMP1:{x:1800,y:220},

EW010:{x:1550,y:370},
EW011:{x:1650,y:370},
EW012:{x:1750,y:370},

TCP1:{x:1800,y:370},

EW007:{x:1200,y:370},
EW008:{x:1300,y:370},
EW009:{x:1400,y:370},

DHP1:{x:1450,y:370},

KN001:{x:150,y:120},
KN002:{x:250,y:120},
KN003:{x:350,y:120},

ATP1:{x:400,y:120},

FE001:{x:1150,y:370},
FE002:{x:1200,y:420},
FE003:{x:1250,y:450},

FTP2:{x:1100,y:370}

};

let trains={};

function drawBlocks(){

for(let id in blocks){

let b=blocks[id];

let dot=document.createElement("div");
dot.className="block";

dot.style.left=b.x+"px";
dot.style.top=b.y+"px";

document.getElementById("map").appendChild(dot);

let label=document.createElement("div");
label.className="blockLabel";

label.innerText=id;

label.style.left=(b.x-10)+"px";
label.style.top=(b.y+12)+"px";

document.getElementById("map").appendChild(label);

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
"\nModel "+train.model+
"\nRoute "+train.route+
"\nBlock "+train.location;

document.getElementById("map").appendChild(dot);

if(train.connected){

let dot2=document.createElement("div");

dot2.className="train";

dot2.style.left=(block.x+14)+"px";
dot2.style.top=(block.y)+"px";

dot2.title="Connected Train "+train.connected;

document.getElementById("map").appendChild(dot2);

}

}

function refresh(){

document.getElementById("map").innerHTML="";

drawBlocks();

for(let t in trains){

drawTrain(trains[t]);

}

}

function addTrain(){

let train={

number:document.getElementById("trainNumber").value,
model:document.getElementById("trainModel").value,
route:document.getElementById("trainRoute").value,
location:document.getElementById("trainLocation").value,
connected:document.getElementById("trainConnected").value

};

trains[train.number]=train;

refresh();

}

function updateTrain(){

let num=document.getElementById("trainNumber").value;

if(trains[num]){

trains[num].model=document.getElementById("trainModel").value;
trains[num].route=document.getElementById("trainRoute").value;
trains[num].location=document.getElementById("trainLocation").value;
trains[num].connected=document.getElementById("trainConnected").value;

refresh();

}

}

function removeTrain(){

let num=document.getElementById("trainNumber").value;

delete trains[num];

refresh();

}

function searchTrain(){

let num=document.getElementById("searchTrain").value;

let t=trains[num];

if(!t) return;

document.getElementById("trainNumber").value=t.number;
document.getElementById("trainModel").value=t.model;
document.getElementById("trainRoute").value=t.route;
document.getElementById("trainLocation").value=t.location;
document.getElementById("trainConnected").value=t.connected;

}

drawBlocks();
