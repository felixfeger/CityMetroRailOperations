// Diagram-style map with line colors
const blocks = {
    // A Line (blue)
    AW_USP1:{x:80,y:50}, AW001:{x:180,y:50}, AW002:{x:280,y:50}, AW003:{x:380,y:50},
    AW_DLP2:{x:450,y:50}, AW004:{x:550,y:50}, AW005:{x:650,y:50}, AW006:{x:750,y:50},
    AW_EQP1:{x:820,y:50}, AW007:{x:920,y:50}, AW008:{x:1020,y:50}, AW009:{x:1120,y:50},
    AW_AMP1:{x:1180,y:50}, AW010:{x:1280,y:50}, AW011:{x:1380,y:50}, AW012:{x:1480,y:50},
    AW_DSP1:{x:1550,y:50}, AW013:{x:1650,y:50}, AW014:{x:1750,y:50}, AW015:{x:1850,y:50},
    AW_SMP1:{x:1920,y:50},

    // E Line (green)
    EW_USP2:{x:80,y:150}, EW001:{x:180,y:150}, EW002:{x:280,y:150}, EW003:{x:380,y:150},
    EW_DLP2:{x:450,y:150}, EW004:{x:550,y:150}, EW005:{x:650,y:150}, EW006:{x:750,y:150},
    EW_EQP1:{x:820,y:150}, EW007:{x:920,y:150}, EW008:{x:1020,y:150}, EW009:{x:1120,y:150},
    EW_AMP1:{x:1180,y:150}, EW010:{x:1280,y:150}, EW011:{x:1380,y:150}, EW012:{x:1480,y:150},
    EW_DHP1:{x:1550,y:150}, EW013:{x:1650,y:150}, EW014:{x:1750,y:150}, EW015:{x:1850,y:150},
    EW_TCP1:{x:1920,y:150},

    // F Line (orange)
    FW_AMP1:{x:1180,y:250}, FW001:{x:1280,y:250}, FW002:{x:1380,y:250}, FW003:{x:1480,y:250},
    FW_FTP2:{x:1580,y:250},

    // K Line (purple)
    KW_USP3:{x:80,y:350}, KW001:{x:180,y:350}, KW002:{x:280,y:350}, KW003:{x:380,y:350},
    KW_ATP1:{x:450,y:350}
};

let trains = {};

// Draw lines with colors
const lineColors = {
    A: "#1e3a8a",
    E: "#047857",
    F: "#c2410c",
    K: "#6b21a8"
};

function drawLines(){
    const map = document.getElementById("map");

    const lineSets = [
        {blocks:Object.keys(blocks).filter(k=>k.startsWith("AW_")), color:lineColors.A},
        {blocks:Object.keys(blocks).filter(k=>k.startsWith("EW_")), color:lineColors.E},
        {blocks:Object.keys(blocks).filter(k=>k.startsWith("FW_")), color:lineColors.F},
        {blocks:Object.keys(blocks).filter(k=>k.startsWith("KW_")), color:lineColors.K}
    ];

    lineSets.forEach(set=>{
        for(let i=0;i<set.blocks.length-1;i++){
            const b1=blocks[set.blocks[i]];
            const b2=blocks[set.blocks[i+1]];

            let l=document.createElement("div");
            l.className="line";
            l.style.left=b1.x+"px";
            l.style.top=(b1.y+4)+"px";
            l.style.width=(b2.x-b1.x)+"px";
            l.style.background=set.color;
            map.appendChild(l);
        }
    });
}

// Blocks and labels
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

// Stations
function drawStations(){
    const map=document.getElementById("map");
    const stations={
        USP1:{x:60,y:50,name:"Union Station P1"},
        USP3:{x:60,y:350,name:"Union Station P3"},
        DLP2:{x:430,y:50,name:"Downtown Lego City"},
        EQP1:{x:820,y:50,name:"Emergency HQ"},
        AMP1:{x:1180,y:50,name:"Airport Metro Transit Center"},
        DSP1:{x:1550,y:50,name:"Death Star City"},
        SMP1:{x:1920,y:50,name:"Downtown Santa Mooica"},
        DHP1:{x:1550,y:150,name:"Desktop Hills"},
        TCP1:{x:1920,y:150,name:"Table Central"},
        ATP1:{x:450,y:350,name:"Asiantown"},
        FTP2:{x:1580,y:250,name:"FLX Terminal"}
    };

    for(let id in stations){
        let s=stations[id];
        let div=document.createElement("div");
        div.className="station";
        div.innerText=s.name;
        div.style.left=s.x+"px";
        div.style.top=s.y+"px";
        map.appendChild(div);
    }
}

// Trains
function drawTrain(train){
    let block=blocks[train.location];
    if(!block) return;
    let dot=document.createElement("div");
    dot.className="train";
    dot.style.left=block.x+"px";
    dot.style.top=block.y+"px";
    dot.title="Train "+train.number+"\nModel: "+train.model+"\nRoute: "+train.route+"\nBlock: "+train.location;
    document.getElementById("map").appendChild(dot);

    if(train.connected){
        let dot2=document.createElement("div");
        dot2.className="train";
        dot2.style.left=(block.x+18)+"px";
        dot2.style.top=block.y+"px";
        document.getElementById("map").appendChild(dot2);
    }
}

// Refresh
function refresh(){
    const map=document.getElementById("map");
    map.innerHTML="";
    drawLines();
    drawBlocks();
    drawStations();
    for(let t in trains) drawTrain(trains[t]);
}

// Controls
function addTrain(){
    let number=document.getElementById("trainNumber").value.trim();
    if(!number) return;
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
    if(!t){ alert("Train not found"); return; }
    document.getElementById("trainNumber").value=t.number;
    document.getElementById("trainModel").value=t.model;
    document.getElementById("trainRoute").value=t.route;
    document.getElementById("trainLocation").value=t.location;
    document.getElementById("trainConnected").value=t.connected;
}

refresh();
