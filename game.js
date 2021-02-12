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
        return this.poles[2].length == 0 && this.poles[3].length == 0
    }

    isFinalPosition(){
        return this.poles[1].length == 0 && this.poles[2].length == 0
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
