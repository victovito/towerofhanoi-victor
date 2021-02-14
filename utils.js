function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    Hanoi.main.reposSystem();
}

function lerp (start, end, amt){
    return (1-amt)*start+amt*end;
}

function clamp (value, min, max){
    return Math.min(Math.max(min, value), max);
}

function changeNoD(value){
    editNoD = clamp(editNoD + value, 1, 15);
}

function reloadHanoi(){
    let url = new URL(document.location);
    url.searchParams.delete("n");
    url.searchParams.append("n", editNoD);
    document.location.assign(url);
}

function getParam(name, defaultValue){
    const param = new URL(document.URL).searchParams.get(name);
    return param ? parseInt(param) : defaultValue
}

function playSound(name, volume = 1, force = false){
    const audio = document.getElementById(name);
    if (force){
        audio.pause();
        audio.currentTime = 0;
    }
    audio.volume = volume;
    audio.play();
}

class Vector2
{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

    static random(){
        return new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1);
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

    magnitude(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    normalized(){
        return this.scale(1 / this.magnitude());
    }

}
