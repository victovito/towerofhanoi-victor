function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    Hanoi.main.reposSystem();
}

function lerp (start, end, amt){
    return (1-amt)*start+amt*end;
}

function changeNoD(value){
    editNoD = Math.min(Math.max(1, editNoD + value), 15);
}

function reloadHanoi(){
    let url = new URL(document.location);
    url.search = "";
    url.searchParams.append("n", editNoD);
    document.location.assign(url);
}

class Vector2
{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

    add(vector2){
        return new Vector2(this.x + vector2.x, this.y + vector2.y);
    }
    
    sub(vector2){
        return new Vector2(this.x - vector2.x, this.y - vector2.y);
    }

    scale(factor){
        return new Vector2(this.x * factor, this.y * factor);
    }

}
