
/** @type{HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const numberOfDisks = getParam("n", 3);
let editNoD = numberOfDisks;

const config = {
    useTimer: getParam("timer", 1),
    confettis: getParam("confetti", 1),
}

const controlls = {
    mouseSelectedDisk: null,
    keySelectedDisk: null,
    lastPole: null,
};

function start(){

    Hanoi.main.diskHeight = Math.min((Hanoi.main.size.y / numberOfDisks) * .8, 50);

    Hanoi.main.setHanoi();

    setListeners();

    About.setAbout();

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
    if (controlls.mouseSelectedDisk){
        controlls.mouseSelectedDisk.draw();
    }
    if (controlls.keySelectedDisk){
        controlls.keySelectedDisk.draw();
    }
    Confetti.updateConfettis();

    requestAnimationFrame(update);
}

function setListeners(){
    document.addEventListener("mousedown", (e) => {
        if (controlls.keySelectedDisk){
            return;
        }
        if (e.button == 0){
            if (!controlls.mouseSelectedDisk){
                const pole = Hanoi.main.getPoleOnPoint(new Vector2(e.x, e.y));
                if (pole != null){
                    if (Timer.config.interval == null && Hanoi.main.isInitialPosition()){
                        Timer.start();
                    }
                    controlls.mouseSelectedDisk = Hanoi.main.removeDisk(pole);
                    if (!controlls.mouseSelectedDisk) return;
                    controlls.mouseSelectedDisk.position = new Vector2(e.x, e.y);
                    controlls.lastPole = pole;
                    Solver.main.stop();
                }
            }
        }
    });
    document.addEventListener("mouseup", (e) => {
        if (controlls.mouseSelectedDisk){
            const pole = Hanoi.main.getPoleOnPoint(new Vector2(e.x, e.y));
            if (pole != null){
                if (Hanoi.main.placeDisk(controlls.mouseSelectedDisk, pole)){
                    controlls.mouseSelectedDisk = null;

                    playSound("woodsfx", 1, true);

                    if (Hanoi.main.isFinalPosition()){
                        Timer.stop();
                        Confetti.start();
                    }
                    if (Hanoi.main.isInitialPosition()){
                        Timer.reset();
                    }

                    return;
                }
            }
            Hanoi.main.placeDisk(controlls.mouseSelectedDisk, controlls.lastPole);
            controlls.mouseSelectedDisk = null;
        }
    });
    document.addEventListener("mousemove", (e) => {
        if (controlls.mouseSelectedDisk){
            controlls.mouseSelectedDisk.position = new Vector2(e.x, e.y);
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key == "r"){
            Hanoi.main.setHanoi();
        }

        if (!controlls.mouseSelectedDisk){
            const evaluation = /1|2|3/.exec(e.key);
            if (evaluation && evaluation.index == 0){
                const pole = parseInt(e.key);
                if (!controlls.keySelectedDisk){
                    if (Hanoi.main.poles[pole].length > 0){
                        if (Timer.config.interval == null && Hanoi.main.isInitialPosition()){
                            Timer.start();
                        }
                    }
                    controlls.keySelectedDisk = Hanoi.main.removeDisk(pole);
                    if (!controlls.keySelectedDisk) return;

                    controlls.keySelectedDisk.position.y = 
                        Hanoi.main.position.y - Hanoi.main.size.y - 25 - Hanoi.main.diskHeight / 2;
                    controlls.lastPole = pole;
                    Solver.main.stop();
                } else {
                    if (Hanoi.main.placeDisk(controlls.keySelectedDisk, pole)){
                        controlls.keySelectedDisk = null;

                        playSound("woodsfx", 1, true);

                        if (Hanoi.main.isFinalPosition()){
                            Timer.stop();
                            Confetti.start();
                        }
                        if (Hanoi.main.isInitialPosition()){
                            Timer.reset();
                        }
                    } else {
                        const newDisk = Hanoi.main.removeDisk(pole);
                        if (!newDisk) return;

                        playSound("woodsfx", 1, true);

                        Hanoi.main.placeDisk(controlls.keySelectedDisk, controlls.lastPole);
                        controlls.keySelectedDisk = newDisk;
                        controlls.keySelectedDisk.position.y = 
                            Hanoi.main.position.y - Hanoi.main.size.y - 25 - Hanoi.main.diskHeight / 2;
                        controlls.lastPole = pole;
                    }
                }
            }
        }
    });
}
