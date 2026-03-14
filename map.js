const blockCoordinates = {

USP1:{x:100,y:200},
USP2:{x:100,y:230},
USP3:{x:100,y:120},

AW001:{x:200,y:200},
AW002:{x:300,y:200},
AW003:{x:400,y:200},

DLP2:{x:500,y:200},

AW004:{x:600,y:200},
EQP1:{x:650,y:170},

AW005:{x:700,y:200},

AMP1:{x:800,y:200},
AMP2:{x:800,y:230},
AMP3:{x:800,y:260},

AW007:{x:900,y:200},
AW008:{x:1000,y:200},
AW009:{x:1100,y:200},

DSP1:{x:1150,y:200},
DSP2:{x:1150,y:230},

SMP1:{x:1250,y:200},
SMP2:{x:1250,y:230},

EW006:{x:900,y:260},
DHP1:{x:1000,y:260},
DHP2:{x:1000,y:290},

TCP1:{x:1100,y:260},
TCP2:{x:1100,y:290},

KN001:{x:200,y:120},
KN002:{x:300,y:120},
KN003:{x:400,y:120},

ATP1:{x:500,y:120},

FE001:{x:850,y:260},
FE002:{x:900,y:300},

FTP2:{x:950,y:340}

};

let trains={};

function drawTrain(train){

const block = blockCoordinates[train.location];
if(!block) return;

let dot=document.createElement("div");
dot.className="train";

dot.style.left=block.x+"px";
dot.style.top=block.y+"px";

dot.title=
"Train "+train.number+
"\nModel: "+train.model+
"\nRoute: "+train.route+
"\nLocation: "+train.location;

document.getElementById("map").appendChild(dot);

if(train.connected){

let dot2=document.createElement("div");

dot2.className="train";
dot2.style.left=(block.x+12)+"px";
dot2.style.top=(block.y)+"px";

dot2.title="Connected Train "+train.connected;

document.getElementById("map").appendChild(dot2);

}

}
