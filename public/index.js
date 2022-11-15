let canvas;
let context;
let palteau;
let elements =[];

window.onload = function () {
    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    palteau = new Plateau();
    palteau.animate();
    
}

window.addEventListener('resize',function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

class Plateau {
    #listeCarte = {
        listeCarteIa: new Array(4),
        listeCarteJoueur: new Array(4),
    };
    width;
    height;
    x;
    y;
    listeEmplacements = [];
    constructor(){
        this.width = canvas.width/2;
        this.height = canvas.height/2;
        this.x = canvas.width/6;
        this.y = canvas.height/5;
        //this.#draw();

        let tmpY = this.y;
        for (let i = 0; i < 2; i++) {
            let tmpX = this.x;
            for (let index = 0; index < 4; index++) {
                let emplacement = new Emplacement(tmpX,tmpY);
                elements.push(emplacement);
                this.listeEmplacements.push(emplacement);
                tmpX+=this.width/4;
            }
            tmpY+=this.y;
        }
    }

    #draw(){
        context.fillStyle = 'brown';
        console.log(this.width);
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    animate(){
        this.width = canvas.width/2;
        this.height = canvas.height/2;
        this.x = canvas.width/6;
        this.y = canvas.height/5;
        this.#draw();

        let xtmp = this.x;
        for (let i = 0; i < 8; i++) {
            
            this.listeEmplacements[i].animate(xtmp);
            xtmp+=this.width/4;
            if (i===3) {
                xtmp = this.x;
            }
            
        }
        requestAnimationFrame(this.animate.bind(this));
    }
}

class Emplacement{
    #x;
    #y;
    #width;
    #height;

    constructor(x,y){
        this.#x = x;
        this.#y = y;
        this.#width = canvas.width/8;
        this.#height = canvas.height /6;
        this.#draw();
    }

    #draw(){
        context.fillStyle = 'white';
        context.strokeRect(this.#x, this.#y, this.#width, this.#height);
    }
    animate(x){
        this.#x = x;
        //this.#y = y;
        this.#width = canvas.width/8;
        this.#height = canvas.height /6;
        this.#draw();
        //requestAnimationFrame(this.animate.bind(this));
    }
    setX(x){
        this.#x = x;
    }
    setY(y){
        this.#y = y;
    }
}