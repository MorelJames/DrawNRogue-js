let canvas;
let context;
let palteau;
let rect;
let offSetX;
let offSetY;
let elements =[]; //tableau contenant les elements qui peuvent être cliqué à la souris

let drawElement =[]; // tableau contenant les elements à dessiner sur le canvas

let interval = 1000/60; // defini le nombre d'image par seconde du jeu
let timer = 0;
let lastTime =0;

let plateau;
let lineWidth;
let selectedCard;
let main;

let cardWidth;
let cardHeight;

window.onload = function () {
    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    rect = canvas.getBoundingClientRect();
    offSetX = canvas.width / rect.width,
    offSetY = canvas.height / rect.height;




    canvas.addEventListener('mousemove', (event) =>{
        //console.log(event);
        let x = (event.x - rect.left) * offSetX;
        let y = (event. y - rect.top) * offSetY;
        elements.forEach(elem => elem.mouseHover(x,y));
    })



    canvas.addEventListener('click', (event) =>{
        let x = (event.x - rect.left) * offSetX;
        let y = (event. y - rect.top) * offSetY;
        let clicked = false;
        let i =0;
        while (i < elements.length && !clicked) {
            let xElem = elements[i].getX();
            let yElem = elements[i].getY();
            let widthElem = elements[i].getWidth();
            let heightElem = elements[i].getHeight();
            if (x > xElem && x< xElem+ widthElem && y > yElem && y < yElem + heightElem) {
                elements[i].mouseClick();
                clicked = true;
            }
            i++;
        }

        /*elements.forEach(e =>{
            let xElem = e.getX();
            let yElem = e.getY();
            let widthElem = e.getWidth();
            let heightElem = e.getHeight();
            if (x > xElem && x< xElem+ widthElem && y > yElem && y < yElem + heightElem) {
                e.mouseClick();
            }
        });*/
    })

    context.lineWidth = canvas.width/100;

    cardWidth = canvas.width/8*0.8;
    cardHeight = canvas.height/4*0.8;

    plateau = new Plateau();
    drawElement.push(plateau);
    //palteau.animate();

    carte = new Carte('./images/boo.jpg',50,50,'nom');
    drawElement.push(carte);
    elements.push(carte);

    carte2 = new Carte('./images/boo.jpg',200,50,'carte2');
    drawElement.push(carte2);
    elements.push(carte2);
    //selectedCard = carte;

    main = new Main();
    drawElement.push(main);

    let pioche = new Pioche();
    drawElement.push(pioche);
    //elements.push(pioche);

    drawAll(0);
    //carte.animate(50,50,100,200);

    /*var img = new Image();
    img.onload = ()=>{
        context.drawImage(img,0,0);
    };
    img.src = './boo.jpg';*/
    
    
}


//cette fonction redessine les elements du canvas
function drawAll(timeStamp){
    deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    if (timer > interval) {
        context.clearRect(0,0,canvas.width,canvas.height);
        drawElement.forEach(elem => elem.draw())
        timer =0;
    }else{
        timer += deltaTime;
    }
    requestAnimationFrame(drawAll);
}

window.addEventListener('resize',function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.lineWidth = canvas.width/100;
    cardWidth = canvas.width/8*0.8;
    cardHeight = canvas.height/4*0.8;
    context.clearRect(0,0,canvas.width,canvas.height);
    drawElement.forEach(elem => elem.draw());
    main.refreshPosInfo();
})

class Plateau {
    #cardList;
    width;
    height;
    x;
    y;
    listeEmplacements = [];
    constructor(){
        this.width = canvas.width/2;
        this.height = canvas.height/2;
        this.x = canvas.width/4;
        this.y = canvas.height/7;
        //this.#draw();

        let tmpY = this.y;
        let emplacementPos = 0;
        for (let i = 0; i < 2; i++) {
            let tmpX = this.x;
            for (let index = 0; index < 4; index++) {
                let emplacement = new Emplacement(tmpX,tmpY, cardWidth, cardHeight, emplacementPos);
                elements.push(emplacement);
                this.listeEmplacements.push(emplacement);
                emplacementPos++;
                tmpX+=this.width/4;
            }
            tmpY+=this.height/2;
        }
        this.#cardList = [];
    }

    draw(){
        context.fillStyle = 'brown';

        this.width = canvas.width/2;
        this.height = canvas.height/2;
        this.x = canvas.width/4;
        this.y = canvas.height/7;

        //console.log(this.width);
        context.fillRect(this.x, this.y, this.width, this.height);


        let xtmp = this.x + this.width/4*0.1;
        let ytmp = this.y+this.height/2*0.1;
        for (let i = 0; i < 8; i++) {
            
            this.listeEmplacements[i].draw(xtmp,ytmp,this.width/4*0.8,this.height/2*0.8);
            xtmp+=this.width/4;
            if (i===3) {
                xtmp = this.x + this.width/4*0.1;
                ytmp += this.height/2;
            }
            
        }
    }

    addCard(card, pos){
        this.#cardList[pos] = card;
    }
    getCard(pos){
        return this.#cardList[pos];
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
    #color;
    #isMouseHover;
    #isFull;
    #pos;
    #placedCart;

    constructor(x,y,width,height,pos){
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
        this.#color = 'white';
        this.#isMouseHover = false;
        this.#isFull = false;
        this.#pos = pos;
        //this.#draw();
    }

    draw(x,y,width,height){
        this.#x=x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
        if (this.#isMouseHover && !this.#isFull && this.#pos >3) {
            this.#color = 'yellow';
        }else{
            this.#color = 'white';
        }

        if (this.#placedCart != undefined) {
            this.#placedCart.setX(this.#x);
            this.#placedCart.setY(this.#y);
        }
        context.lineWidth = lineWidth;
        context.strokeStyle = this.#color;
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
    setColor(color){
        this.#color = color;
    }

    getX(){
        return this.#x;
    }
    getY(){
        return this.#y;
    }
    getWidth(){
        return this.#width;
    }
    getHeight(){
        return this.#height;
    }

    mouseHover(x,y){
        if (!this.#isFull) {
            if (x > this.#x && x<this.#x+this.#width && y > this.#y && y < this.#y+this.#height) {
                this.#isMouseHover = true;
                //console.log(selectedCard);
            }else{
                this.#isMouseHover = false;
            }
        }  
    }

    mouseClick(){
        if (!this.#isFull && selectedCard != undefined && this.#pos >3) {
            this.#placedCart = selectedCard;
            selectedCard.setPlayed();
            plateau.addCard(selectedCard, this.#pos);
            this.#isFull = true
            selectedCard = undefined;
        }
    }
}

class Carte{
    #img;
    #x;
    #y;
    #width;
    #height;
    #nom;
    #isMouseHover;
    #hp;
    #atk;
    #isPlayed;

    constructor(imgSrc,x,y,nom,hp,atk) {
        this.#img = new Image();
        this.#img.src = imgSrc;
        //console.log(this.#img.src);
        /*this.#img.onload = ()=>{
            context.drawImage(this.#img,0,0);
        };*/
        this.#x = x;
        this.#y = y;
        this.#width = cardWidth;
        this.#height = cardHeight;
        this.#nom = nom;
        this.#isMouseHover = false;
        this.#hp = hp;
        this.#atk = atk;
        this.#isPlayed = false;
        
    }

    draw(){
        
        //console.log(this.#x);
        //console.log(this.#y);
        if (!this.#isMouseHover) {
            this.#width = cardWidth;
            this.#height = cardHeight;
        }
        

        context.fillStyle = 'green';
        context.fillRect(this.#x,this.#y,this.#width,this.#height);
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.font = canvas.width/100;
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

    mouseHover(x,y){
        if (!this.#isPlayed) {
            if (x > this.#x && x<this.#x+this.#width && y > this.#y && y < this.#y+this.#height) {
                if (!this.#isMouseHover) {
                    this.#width = cardWidth*1.25;
                    this.#height = cardHeight*1.25;
                }
                this.#isMouseHover = true;
            }else{
                this.#isMouseHover = false;
            }
        }
        
    }

    mouseClick(){
        console.log(this.#nom);
        console.log(!this.#isPlayed);
        if (!this.#isPlayed) {
            selectedCard = this;
        }
    }

    setX(x){
        this.#x = x;
    }
    setY(y){
        this.#y = y;
    }
    setWidth(width){
        this.#width = width;
    }
    setHeight(height){
        this.#height = height;
    }
    setPlayed(){
        console.log('set played');
        this.#isPlayed = true;
    }

    getX(){
        return this.#x;
    }
    getY(){
        return this.#y;
    }
    getWidth(){
        return this.#width;
    }
    getHeight(){
        return this.#height;
    }
}

class Main{
    #x;
    #y;
    #width;
    #height;
    #listeCartes;
    #cardGap;
    #cardPos;

    constructor(){
        this.#x = canvas.width/4;
        this.#y = canvas.height/1.3;
        this.#width = canvas.width/2;
        this.#height = canvas.height - this.#y;
        this.#listeCartes = []; 
        this.#cardGap = canvas.width/8*0.2;
        this.#cardPos = this.width/2 - cardWidth/2;
    }

    draw(){
        this.#x = canvas.width/4;
        this.#y = canvas.height/1.3;
        this.#width = canvas.width/2;
        this.#height = canvas.height - this.#y;
        context.fillStyle = 'gray';
        context.fillRect(this.#x,this.#y, this.#width,this.#height);
    }

    refreshPosInfo(){

    }
}

class Pioche{
    #x;
    #y;
    #width;
    #height;

    constructor(){
        this.#x = canvas.width - canvas.width/4;
        this.#y = canvas.height/1.3;
        this.#width = plateau.width/4*0.8;
        this.#height = plateau.height/2*0.8;
    }

    draw(){
        this.#x = canvas.width - canvas.width/6;
        this.#y = canvas.height/1.3;
        this.#width = plateau.width/4*0.8;
        this.#height = plateau.height/2*0.8;

        context.fillStyle ='gray';
        context.fillRect(this.#x,this.#y,this.#width,this.#height);
        context.fillStyle = 'darkgray';
        context.fillRect(this.#x,this.#y+this.#height/4,this.#width,this.#height/3);
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.font = canvas.width/50+'px Arial';
        context.fillText('PIOCHE',this.#x+this.#width/2,this.#y+this.#height/2.3);
    }

    mouseHover(){

    }

    mouseClick(){

    }
}

