class Solver
{
    static main = new Solver();

    static h(n, start, end){
        if (n == 1){
            Solver.main.moves.push(new Vector2(start, end));
        } else {
            let other = 6 - (start + end);
            Solver.h(n - 1, start, other);
            Solver.main.moves.push(new Vector2(start, end));
            Solver.h(n - 1, other, end);
        }
    }

    constructor(){
        this.moves = [];
        this.step = 0;
        this.interval = null;
    }

    solve(){
        if (!Hanoi.main.isInitialPosition()){
            return;
        }
        Solver.h(numberOfDisks, 1, 3);
        this.interval = setInterval(this.move, Math.min(10000 / this.moves.length, 500));
    }

    move(){
        if (Solver.main.step == Solver.main.moves.length){
            Confetti.start();
            Solver.main.stop();
            return;
        }
        const move = Solver.main.moves[Solver.main.step++];
        Hanoi.main.move(move.x, move.y);
        if (Solver.main.moves.length < 100){
        } else {
            playSound("woodsfx", 1, false);
        }
    }

    stop(){
        clearInterval(Solver.main.interval);
        Solver.main.moves = [];
        Solver.main.step = 0;
        Solver.main.interval = null;
    }

}