class Hanoi
{

    static main = new Hanoi();

    constructor(){
        this.poles;

        this.size = new Vector2(300, Math.min(lerp(50, 300, numberOfDisks / 15), 500));
        this.position = new Vector2();
        this.reposSystem();
        this.diskHeight = this.size.y == 500 ? this.size.y / numberOfDisks : 50;
        this.minDiskWidth = 20;
        this.maxDiskWidth = 100;

    }

    setHanoi(){
        this.poles = {
            1: [],
            2: [],
            3: [],
        }
        for (let i = numberOfDisks; i > 0; i--){
            this.placeDisk(
                new Disk(i, `hsl(${Math.floor(i / numberOfDisks * 360)}, 60%, 50%)`),
                1
            );
        }
        Solver.main.stop();
        Timer.reset();
    }

    move(originIndex, destinyIndex){
        const disk = this.removeDisk(originIndex);
        if (!this.placeDisk(disk, destinyIndex)){
            this.placeDisk(disk, originIndex);
        }
    }

    placeDisk(disk, poleIndex){
        const pole = this.poles[poleIndex];
        if (pole[0]){
            if (pole[pole.length - 1].size < disk.size){
                return false;
            }
        }
        pole.push(disk);
        return true;
    }

    removeDisk(poleIndex){
        return this.poles[poleIndex].pop();
    }

    draw(){
        for (let i = 0; i < 3; i++){
            const pos = new Vector2(
                (this.position.x - this.size.x / 2) + i * (this.size.x / 2),
                this.position.y - this.size.y
            );
            const width = Math.min(20, this.minDiskWidth);
            ctx.beginPath();
            ctx.fillStyle = "#3c3c3c";
            ctx.fillRect(pos.x - 10, pos.y, 20, this.size.y + this.diskHeight / 2);
        }

        for (let i = 1; i <= 3; i++){
            const pole = this.poles[i];
            for (let j = 0; j < numberOfDisks; j++){
                if (pole[j]){
                    this.drawDisk(i, pole[j], j);
                } else {
                    break;
                }
            }
        }
    }

    drawDisk(poleIndex, disk, diskIndex){
        const pole = this.poles[poleIndex];
        const size = new Vector2(lerp(this.minDiskWidth, this.maxDiskWidth, disk.size / numberOfDisks), this.diskHeight);
        let position = new Vector2(
            (this.position.x - this.size.x / 2) + (poleIndex - 1) * (this.size.x / 2),
            this.position.y - (diskIndex * this.diskHeight)
        );
        ctx.beginPath();
        ctx.fillStyle = disk.color;
        ctx.fillRect(position.x - size.x / 2, position.y - size.y / 2, size.x , size.y);
    }

    reposSystem(){
        this.position = new Vector2(window.innerWidth / 2, window.innerHeight / 2 + this.size.y / 2);
    }

    getPoleOnPoint(point){
        const pos = point.sub(this.position.sub(new Vector2(this.size.x * (3 / 4), this.size.y + 40)));
        if (pos.x < 0 || pos.x > this.size.x * (3 / 2) || pos.y < 0 || pos.y > this.size.y + 80){
            return null;
        }
        return Math.floor((pos.x / (this.size.x * (3 / 2))) * 3) + 1;
    }

    isInitialPosition(){
        return this.poles[1].length == numberOfDisks && this.poles[2].length == 0 && this.poles[3].length == 0
    }

    isFinalPosition(){
        return this.poles[1].length == 0 && this.poles[2].length == 0 && this.poles[3].length == numberOfDisks
    }
    
}

class Disk
{

    constructor(size, color){
        this.size = size;
        this.color = color;
        this.position = new Vector2();
    }

    draw(){
        const hanoi = Hanoi.main;
        const size = new Vector2(lerp(hanoi.minDiskWidth, hanoi.maxDiskWidth, this.size / numberOfDisks), hanoi.diskHeight);
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x - size.x / 2, this.position.y - size.y / 2, size.x , size.y);
    }

}

class Confetti
{

    static config = {
        rows: 10,
        numberPerRow: 30,
        duration: 2000,
        delay: 16,
        interval: null,
        tick: 1,
    }

    static confettis = [];

    static spawnConfettis(){
        for (let i = 0; i < Confetti.config.numberPerRow; i++){
            const confetti = new Confetti(
                new Vector2(Math.random() * window.innerWidth, -50),
                Math.random() * Math.PI,
                `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`
            );
            Confetti.confettis.push(confetti);
        }
    }

    static updateConfettis(){
        for (let i = 0; i < Confetti.confettis.length; i++){
            const confetti = Confetti.confettis[i];
            confetti.update();
            confetti.draw();
        }
    }

    static controllConfettis(){
        if (Confetti.config.tick > Confetti.config.duration){
            Confetti.stop();
            return;
        }
        if (
            Math.floor(
                (Confetti.config.tick %
                (Confetti.config.duration / Confetti.config.rows) / Confetti.config.delay)
            ) == 0
            ){
            Confetti.spawnConfettis();
        }
        Confetti.config.tick += Confetti.config.delay;
    }

    static start(){
        if (config.confettis < 1){
            return;
        }
        document.getElementById("partyhorn").play();
        Confetti.stop();
        Confetti.config.interval = setInterval(Confetti.controllConfettis, Confetti.config.delay);
    }

    static stop(){
        clearInterval(Confetti.config.interval);
        Confetti.config.interval = null;
        Confetti.config.tick = 1;
    }

    constructor(position, orientation, color){
        this.position = position;
        this.orientation = orientation;
        this.color = color;

        this.size = Math.random() * 15 + 10;

        this.movement = new Vector2();
        this.movement = new Vector2();
        this.rotation = 0;
        this.life = 4000;
    }

    update(){
        this.life -= Confetti.config.delay;
        if (this.life <= 0){
            Confetti.confettis.splice(Confetti.confettis.indexOf(this), 1);
            return;
        }
        this.movement = this.movement.add(Vector2.random().scale(0.5)).normalized().scale(5);
        this.movement.y = Math.abs(this.movement.y);
        this.position = this.position.add(this.movement);

        this.orientation += (Math.random() * 2 - 1) * (Math.PI / 16);
    }

    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = lerp(0, 1, clamp((this.life - 1000) / 1000, 0, 1));
        ctx.translate(this.position.x + this.size / 2, this.position.y + this.size / 2);
        ctx.rotate(this.orientation);
        ctx.translate(-this.position.x - this.size / 2, -this.position.y - this.size / 2);
        ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
        // ctx.fillRect(this.position.x - this.size / 2, this.position.y - this.size / 2, this.size, this.size);
        ctx.globalAlpha = 1;
        ctx.resetTransform();
    }

}

class Timer
{

    static start(){
        if (config.useTimer < 1){
            return;
        }
        Timer.reset();
        Timer.config.start = Date.now();
        Timer.config.interval = setInterval(Timer.update, 1);
    }

    static stop(){
        clearInterval(Timer.config.interval);
        Timer.config.interval = null;
    }

    static reset(){
        Timer.stop();
        Timer.time = 0;
        document.getElementById("timer").innerHTML = "";
    }

    static update(){
        Timer.time = Date.now() - Timer.config.start;
        const element = document.getElementById("timer");
        element.innerHTML = Timer.format();
        element.style.top = `${Hanoi.main.position.y + 30}px`;
    }

    static config = {
        interval: null,
        start: 0,
    }

    static time = 0;

    static format(){
        const min = Math.floor(Timer.time / 1000 / 60);
        const sec = Math.floor(Timer.time / 1000) - min * 60;
        const ms = Timer.time - sec * 1000;
        return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
    }

}
