// ===== CONFIG =====

const API = "https://trains-api.felixfeger46.workers.dev";

let trains = {};

// ===== BLOCK MAP =====

const blocks = {

AW_USP1:{x:80,y:60},
AW001:{x:180,y:60},
AW002:{x:280,y:60},
AW003:{x:380,y:60},
AW_DLP2:{x:480,y:60},
AW004:{x:580,y:60},
AW005:{x:680,y:60},
AW006:{x:780,y:60},
AW_EQP1:{x:880,y:60},
AW007:{x:980,y:60},
AW008:{x:1080,y:60},
AW009:{x:1180,y:60},
AW_AMP1:{x:1280,y:60},
AW010:{x:1380,y:60},
AW011:{x:1480,y:60},
AW012:{x:1580,y:60},
AW_DSP1:{x:1680,y:60},
AW013:{x:1780,y:60},
AW014:{x:1880,y:60},
AW015:{x:1980,y:60},
AW_SMP1:{x:2080,y:60},

EW_USP2:{x:80,y:180},
EW001:{x:180,y:180},
EW002:{x:280,y:180},
EW003:{x:380,y:180},
EW_DLP2:{x:480,y:180},
EW004:{x:580,y:180},
EW005:{x:680,y:180},
EW006:{x:780,y:180},
EW_EQP1:{x:880,y:180},
EW007:{x:980,y:180},
EW008:{x:1080,y:180},
EW009:{x:1180,y:180},
EW_AMP1:{x:1280,y:180},
EW010:{x:1380,y:180},
EW011:{x:1480,y:180},
EW012:{x:1580,y:180},
EW_DHP1:{x:1680,y:180},
EW013:{x:1780,y:180},
EW014:{x:1880,y:180},
EW015:{x:1980,y:180},
EW_TCP1:{x:2080,y:180},

FW_AMP1:{x:1280,y:300},
FW001:{x:1380,y:300},
FW002:{x:1480,y:300},
FW003:{x:1580,y:300},
FW_FTP2:{x:1680,y:300},

KW_USP3:{x:80,y:420},
KW001:{x:180,y:420},
KW002:{x:280,y:420},
KW003:{x:380,y:420},
KW_ATP1:{x:480,y:420}

};

// ===== DRAW BASE MAP =====

function drawLines(){

const map=document.getElementById("map");

const lines=[
["AW","#1e3a8a"],
["EW","#d4af37"],
["FW","#c2410c"],
["KW","#ff00ff"]
];

lines.forEach(line=>{

const ids=Object.keys(blocks).filter(b=>b.startsWith(line[0]));

for(let i=0;i<ids.length-1;i++){

const a=blocks[ids[i]];
const b=blocks[ids[i+1]];

let el=document.createElement("div");
el.className="line";
el.style.left=a.x+"px";
el.style.top=(a.y+4)+"px";
el.style.width=(b.x-a.x)+"px";
el.style.background=line[1];

map.appendChild(el);

}

});

}

function drawBlocks(){

const map=document.getElementById("map");

for(const id in blocks){

let b=blocks[id];

let dot=document.createElement("div");
dot.className="block";
dot.style.left=b.x+"px";
dot.style.top=b.y+"px";

map.appendChild(dot);

}

}

// ===== STATIONS =====

function drawStations(){

const stations={
USP1:{x:60,y:60,name:"Union Station"},
DLP2:{x:460,y:60,name:"Downtown Lego City"},
EQP1:{x:860,y:60,name:"Emergency HQ"},
AMP1:{x:1260,y:60,name:"Airport Metro"},
DSP1:{x:1660,y:60,name:"Death Star"},
SMP1:{x:2060,y:60,name:"Santa Mooica"},
ATP1:{x:460,y:420,name:"Asiantown"},
FTP2:{x:1660,y:300,name:"FLX Terminal"}
};

const map=document.getElementById("map");

for(const id in stations){

let s=stations[id];

let el=document.createElement("div");
el.className="station";

el.innerText=s.name;

el.style.left=s.x+"px";
el.style.top=(s.y-25)+"px";

map.appendChild(el);

}

}

// ===== TRAINS =====

function drawTrain(train){

const block=blocks[train.location];
if(!block)return;

let dot=document.createElement("div");
dot.className="train";

dot.style.left=block.x+"px";
dot.style.top=block.y+"px";

dot.addEventListener("mouseenter",e=>showInfo(train,e.pageX,e.pageY));
dot.addEventListener("mouseleave",hideInfo);

document.getElementById("map").appendChild(dot);

}

function showInfo(train,x,y){

let box=document.getElementById("infoBox");

if(!box){

box=document.createElement("div");
box.id="infoBox";
document.body.appendChild(box);

}

box.innerHTML=
`Train ${train.number}<br>
Route ${train.route}<br>
Block ${train.location}`;

box.style.left=x+"px";
box.style.top=y+"px";
box.style.display="block";

}

function hideInfo(){

let box=document.getElementById("infoBox");
if(box) box.style.display="none";

}

// ===== REFRESH =====

function refresh(){

const map=document.getElementById("map");
map.innerHTML="";

drawLines();
drawBlocks();
drawStations();

Object.values(trains).forEach(drawTrain);

}

// ===== DATABASE =====

async function loadTrains(){

try{

const res=await fetch(API+"/trains");

const data=await res.json();

trains={};

data.forEach(t=>trains[t.number]=t);

}catch(e){

console.log("API unavailable, map still loads");

}

refresh();

}

async function addTrain(){

const train={
number:trainNumber.value,
route:trainRoute.value,
location:trainLocation.value,
connected:trainConnected.value
};

trains[train.number]=train;

refresh();

fetch(API+"/trains",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(train)
});

}

async function removeTrain(){

const num=trainNumber.value;

delete trains[num];

refresh();

fetch(API+"/trains/"+num,{method:"DELETE"});

}

// ===== INIT =====

loadTrains();
