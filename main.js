
/** @type{HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const urlParamN = new URL(document.URL).searchParams.get("n");
const numberOfDisks = urlParamN ? parseInt(urlParamN) : 3;
let editNoD = numberOfDisks;

const controlls = {
    selectedDisk: null,
    lastPole: null,
};

function start(){

    Hanoi.main.diskHeight = Math.min((Hanoi.main.size.y / numberOfDisks) * .8, 50);

    Hanoi.main.setHanoi();

    setListeners();

    requestAnimationFrame(update);
}

function update(){

    document.getElementById("ndA").innerHTML = editNoD;
    if (editNoD == numberOfDisks){
        document.getElementById("ndAB").style.visibility = "hidden";
    } else {
        document.getElementById("ndAB").style.visibility = "visible";
    }

    if (Hanoi.main.isInitialPosition()){
        document.getElementById("solveButton").style.visibility = "visible";
        document.getElementById("resetButton").style.visibility = "hidden";
    } else {
        document.getElementById("solveButton").style.visibility = "hidden";
        document.getElementById("resetButton").style.visibility = "visible";
    }
    
    resizeCanvas();
    ctx.fillStyle = "#2a2a2a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    Hanoi.main.draw();
    if (controlls.selectedDisk){
        controlls.selectedDisk.draw();
    }

    requestAnimationFrame(update);
}

function setListeners(){
    document.addEventListener("mousedown", (e) => {
        if (e.button == 0){
            if (!controlls.selectedDisk){
                const pole = Hanoi.main.getPoleOnPoint(new Vector2(e.x, e.y));
                if (pole != null){
                    controlls.selectedDisk = Hanoi.main.removeDisk(pole);
                    if (!controlls.selectedDisk) return;
                    controlls.selectedDisk.position = new Vector2(e.x, e.y);
                    controlls.lastPole = pole;
                    Solver.main.stop();
                }
            }
        }
    });
    document.addEventListener("mouseup", (e) => {
        if (controlls.selectedDisk){
            const pole = Hanoi.main.getPoleOnPoint(new Vector2(e.x, e.y));
            if (pole != null){
                if (Hanoi.main.placeDisk(controlls.selectedDisk, pole)){
                    controlls.selectedDisk = null;
                    return;
                }
            }
            Hanoi.main.placeDisk(controlls.selectedDisk, controlls.lastPole);
            controlls.selectedDisk = null;
        }
    });
    document.addEventListener("mousemove", (e) => {
        if (controlls.selectedDisk){
            controlls.selectedDisk.position = new Vector2(e.x, e.y);
        }
    });
}
