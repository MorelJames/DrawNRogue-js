let canvas;
let context;
let palteau;
let elements =[]; //tableau contenant les elements qui peuvent être cliqué à la souris

let drawElement =[];

window.onload = function () {
    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    plateau = new Plateau();
    drawElement.push(plateau);
    //palteau.animate();

    carte = new Carte('./images/boo.jpg',50,50,100,200,'nom');
    drawElement.push(carte);

    drawAll();
    //carte.animate(50,50,100,200);

    /*var img = new Image();
    img.onload = ()=>{
        context.drawImage(img,0,0);
    };
    img.src = './boo.jpg';*/
    
    
}

function drawAll(){
    context.clearRect(0,0,canvas.width,canvas.height);
    drawElement.forEach(elem => elem.draw())
    requestAnimationFrame(drawAll);
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

    draw(){
        context.fillStyle = 'brown';

        this.width = canvas.width/2;
        this.height = canvas.height/2;
        this.x = canvas.width/6;
        this.y = canvas.height/5;

        console.log(this.width);
        context.fillRect(this.x, this.y, this.width, this.height);


        let xtmp = this.x;
        for (let i = 0; i < 8; i++) {
            
            this.listeEmplacements[i].draw(xtmp);
            xtmp+=this.width/4;
            if (i===3) {
                xtmp = this.x;
            }
            
        }
    }
    /*animate(){
        this.width = canvas.width/2;
        this.height = canvas.height/2;
        this.x = canvas.width/6;
        this.y = canvas.height/5;
        this.#draw();

        let xtmp = this.x;
        for (let i = 0; i < 8; i++) {
            
            this.listeEmplacements[i].draw(xtmp);
            xtmp+=this.width/4;
            if (i===3) {
                xtmp = this.x;
            }
            
        }
        requestAnimationFrame(this.animate.bind(this));
    }*/
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
        //this.#draw();
    }

    draw(x){
        this.#x=x;
        this.#width = canvas.width/8;
        this.#height = canvas.height /6;
        context.fillStyle = 'white';
        context.strokeRect(this.#x, this.#y, this.#width, this.#height);
    }
    /*animate(x){
        this.#x = x;
        //this.#y = y;
        this.#width = canvas.width/8;
        this.#height = canvas.height /6;
        this.#draw();
        //requestAnimationFrame(this.animate.bind(this));
    }*/
    setX(x){
        this.#x = x;
    }
    setY(y){
        this.#y = y;
    }
}

class Carte{
    #img;
    #x;
    #y;
    #width;
    #height;
    #nom;

    constructor(imgSrc,x,y,width,height,nom) {
        this.#img = new Image();
        this.#img.src = imgSrc;
        console.log(this.#img.src);
        /*this.#img.onload = ()=>{
            context.drawImage(this.#img,0,0);
        };*/
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
        this.#nom = nom;
        
    }

    draw(){
        
        console.log(this.#x);
        console.log(this.#y);

        context.fillStyle = 'green';
        context.fillRect(this.#x,this.#y,this.#width,this.#height);
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.fillText(this.#nom,this.#x+this.#width/2,this.#y+this.#height/8);
        context.drawImage(this.#img,this.#x,this.#y+this.#height/4,this.#width,this.#height/3);
        /*this.#img.onload = ()=>{
            console.log(this.#x);
            console.log(this.#y);
            
        };*/
    }

    /*animate(x,y,width,height){
        this.#draw(x,y,width,height);
        requestAnimationFrame(this.animate.bind(this))
    }*/
}