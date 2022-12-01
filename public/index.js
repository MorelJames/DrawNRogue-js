const canvas = document.querySelector("canvas");
let context;
let palteau;
let rect;
let offSetX;
let offSetY;
let elements; //tableau contenant les elements qui peuvent être cliqué à la souris

let drawElement; // tableau contenant les elements à dessiner sur le canvas

let interval = 1000 / 60; // defini le nombre d'image par seconde du jeu
let timer = 0;
let lastTime = 0;
let deltaTime;

let plateau;
let lineWidth;
let selectedCard;
let main;
let ia;

let cardWidth;
let cardHeight;

let endTurn;

let canDraw;
let canPlay;

let aspectRatio;

let maxWidth;
let maxHeight;

var imgFondCarte = new Image();
imgFondCarte.src = './images/fondCarte.png';

const demarrer = document.getElementById("demarrer");
const regles = document.getElementById("regles");
const finPartiePage = document.getElementById("fin");
const recommencer = document.getElementById("btnRecommencer");
const voirRegle = document.getElementById("btnRegle");
const REQUEST_ALL_CARTE = 0;
const REQUEST_ALL_EFFET = 1;
let inAnimationCard;

let carteFinTour = false;

let requesteDrawAll;

var listCarte = [];

var donnerCarte = requestToBDD(REQUEST_ALL_CARTE);
donnerCarte.then((data)=>{
    for(let i = 0; i<Object.keys(data).length; i++){
        let effet = getEffet(data[i]["_ideffet"]);
        listCarte.push(new Carte(data[i]["_lienImg"],data[i]["_nom"],data[i]["_pv"],data[i]["_atk"],effet))
    }
});


function lancerPartie() {
    context = canvas.getContext("2d");
    maxWidth = 1920;
    maxHeight = 1080;
    let ratioW = maxWidth / window.innerWidth;
    let ratioH = maxHeight / window.innerHeight;

    if (ratioW < ratioH) {
        (canvas.width = (maxWidth * 1) / ratioH),
            (canvas.height = (maxHeight * 1) / ratioH);
    } else {
        (canvas.width = (maxWidth * 1) / ratioW),
            (canvas.height = (maxHeight * 1) / ratioW);
    }

    aspectRatio = 16 / 9;

    rect = canvas.getBoundingClientRect();
    (offSetX = canvas.width / rect.width),
        (offSetY = canvas.height / rect.height);

    canvas.addEventListener("mousemove", (event) => {
        //console.log(event);
        let x = (event.x - rect.left) * offSetX;
        let y = (event.y - rect.top) * offSetY;
        elements.forEach((elem) => elem.mouseHover(x, y));
    });

    canvas.addEventListener("click", (event) => {
        let x = (event.x - rect.left) * offSetX;
        let y = (event.y - rect.top) * offSetY;
        let clicked = false;
        let i = 0;
        while (i < elements.length && !clicked) {
            let xElem = elements[i].getX();
            let yElem = elements[i].getY();
            let widthElem = elements[i].getWidth();
            let heightElem = elements[i].getHeight();
            if (
                x > xElem &&
                x < xElem + widthElem &&
                y > yElem &&
                y < yElem + heightElem
            ) {
                elements[i].mouseClick();
                clicked = true;
            }
            i++;
        }
    });

    context.lineWidth = canvas.width / 100;

    endTurn = false;

    canDraw = true;
    canPlay = true;

    drawElement = [];
    elements = [];
    inAnimationCard = [];

    plateau = new Plateau();
    drawElement.push(plateau);
    //palteau.animate();

    jaugeVie = new JaugeVie();
    drawElement.push(jaugeVie);

    ia = new Ia();

    main = new Main();
    drawElement.push(main);

    pioche = new Pioche();

    endTurnButton = new EndTurnButton();

    public/index.js
    pA = new pointsAction();
    pA.ajoutPA(1);



    //let carteTest = new Carte('./images/boo.jpg', 1, 1, 'Carte test',8,1);
    //plateau.addCard(carteTest,0);

    //elements.push(pioche);

    drawAll(0);
    //carte.animate(50,50,100,200);

    /*var img = new Image();
    img.onload = ()=>{
        context.drawImage(img,0,0);
    };
    img.src = './boo.jpg';*/
}

demarrer.onclick = function () {
    regles.style.display = "none";
    canvas.style.display = "block";
    lancerPartie();
};

recommencer.onclick = function () {
    finPartiePage.style.display = "none";
    canvas.style.display = "block";
    document.body.style.backgroundColor = "white";
    lancerPartie();
};

voirRegle.onclick = function () {
    finPartiePage.style.display = "none";
    regles.style.display = "flex";
    document.body.style.backgroundColor = "white";
};

//cette fonction redessine les elements du canvas
function drawAll() {
    deltaTime = window.performance.now() - lastTime;
    lastTime = window.performance.now();

    if (timer > interval) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawElement.forEach((elem) => elem.draw());
        timer = timer - interval;
    } else {
        timer += deltaTime;
    }
    requesteDrawAll = requestAnimationFrame(() => {
        drawAll();
    });
}

function resize() {
    let ratioW = maxWidth / window.innerWidth;
    let ratioH = maxHeight / window.innerHeight;

    if (ratioW < ratioH) {
        (canvas.width = (maxWidth * 1) / ratioH),
            (canvas.height = (maxHeight * 1) / ratioH);
    } else {
        (canvas.width = (maxWidth * 1) / ratioW),
            (canvas.height = (maxHeight * 1) / ratioW);
    }
    console.log("win");
    console.log(window.innerWidth);
    console.log(window.innerHeight);

    console.log("can");
    console.log(canvas.width);

    console.log(canvas.height);

    context.lineWidth = canvas.width / 100;
    cardWidth = (canvas.width / 8) * 0.8;
    cardHeight = (plateau.height / 2) * 0.8;
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawElement.forEach((elem) => elem.draw());
    main.refreshPosInfo();

    main.reajusterCartes();
}

window.addEventListener("resize", resize);

function finPartie() {
    canvas.style.display = "none";
    finPartiePage.style.display = "flex";
    let p = document.getElementById("message");

    if (plateau.jaugeVie < 1) {
        p.innerText = "Victoire";
        document.body.style.backgroundColor = "darkgreen";
    } else {
        p.innerText = "Défaite";
        document.body.style.backgroundColor = "darkred";
    }
    drawElement = null;
    elements = null;
    plateau = null;
    main = null;
    pioche = null;
    endTurnButton = null;
    ia = null;
    jaugeVie = null;
    cancelAnimationFrame(requesteDrawAll);
    context = null;
    window.removeEventListener("resize", resize);
}

class Plateau {
    #cardListJoueur;
    #cardListEnemie;
    pvJauge;
    width;
    height;
    x;
    y;
    listeEmplacements = [];
    constructor() {
        this.width = canvas.width / 2;
        this.height = canvas.height / 1.5;
        this.x = canvas.width / 4;
        this.y = canvas.height / 7;
        //this.#draw();
        this.pvJauge = 5;
        cardWidth = (canvas.width / 8) * 0.8;
        cardHeight = (this.height / 2) * 0.8;
        let tmpY = this.y;
        let emplacementPos = 0;
        for (let i = 0; i < 2; i++) {
            let tmpX = this.x;
            for (let index = 0; index < 4; index++) {
                let emplacement = new Emplacement(
                    tmpX,
                    tmpY,
                    cardWidth,
                    cardHeight,
                    emplacementPos
                );
                elements.push(emplacement);
                this.listeEmplacements.push(emplacement);
                emplacementPos++;
                tmpX += this.width / 4;
            }
            tmpY += this.height / 2;
        }
        this.#cardListEnemie = new Array(4);
        this.#cardListJoueur = new Array(4);
    }

    draw() {
        context.fillStyle = "brown";

        this.width = canvas.width / 2;
        this.height = canvas.height / 1.5;
        this.x = canvas.width / 4;
        this.y = canvas.height / 50;

        //console.log(this.width);
        context.fillRect(this.x, this.y, this.width, this.height);

        cardWidth = (canvas.width / 8) * 0.8;
        cardHeight = (this.height / 2) * 0.8;

        let xtmp = this.x + (this.width / 4) * 0.1;
        let ytmp = this.y + (this.height / 2) * 0.1;
        for (let i = 0; i < 8; i++) {
            this.listeEmplacements[i].draw(
                xtmp,
                ytmp,
                (this.width / 4) * 0.8,
                (this.height / 2) * 0.8
            );
            xtmp += this.width / 4;
            if (i === 3) {
                xtmp = this.x + (this.width / 4) * 0.1;
                ytmp += this.height / 2;
            }
        }
        for (let i = 0; i < this.#cardListEnemie.length; i++) {
            if (this.#cardListEnemie[i] != undefined) {
                let ind = inAnimationCard.indexOf(this.#cardListEnemie[i]);
                if (ind < 0) {
                    this.#cardListEnemie[i].setX(
                        this.listeEmplacements[i].getX()
                    );
                    this.#cardListEnemie[i].setY(
                        this.listeEmplacements[i].getY()
                    );
                }
            }
        }
    }

    addCard(card, pos, joueur) {
        if (joueur) {
            card.setPlayed();
            card.setPos(pos);
            pA.retirerPA(card.getCout());
            
            let distance = card.calculMoveDistance(
                this.listeEmplacements[card.getPos() + 4].getX(),
                this.listeEmplacements[card.getPos() + 4].getY(),
                0.5
            );
            card.moveCard(
                distance["x"],
                distance["y"],
                this.listeEmplacements[card.getPos() + 4].getX(),
                this.listeEmplacements[card.getPos() + 4].getY()
            );

            this.#cardListJoueur[pos] = card;
        } else {
            card.setX(this.listeEmplacements[pos].getX());
            card.setY(this.listeEmplacements[pos].getY());
            card.setPos(pos);
            card.setPlayed();
            this.#cardListEnemie[pos] = card;
        }
    }
    getCard(pos, joueur) {
        if (joueur) {
            return this.#cardListJoueur[pos];
        } else {
            return this.#cardListEnemie[pos];
        }
    }

    action() {
        endTurn = false;
        canDraw = true;
        canPlay = true;

        var i = 0;

        var fonctionAtk = () => {
            if (i < this.#cardListJoueur.length) {
                let joueurAttaque = new Promise((resolve) => {
                    console.log("tour " + i);
                    console.log("attaque joueur");
                    if (this.#cardListJoueur[i] != undefined) {
                        this.#cardListJoueur[i].attakAnimation();
                    } else {
                        resolve();
                    }
                    var verif = () => {
                        if (carteFinTour) {
                            console.log("fin tour joueur");
                            resolve();
                        } else {
                            setTimeout(() => {
                                verif();
                            }, 100);
                        }
                    };
                    verif();
                });
                joueurAttaque.then(() => {
                    if (this.#cardListJoueur[i] != undefined) {
                        this.#cardListJoueur[i].tourCarte(
                            this.#cardListJoueur,
                            this.#cardListEnemie,
                            true
                        );
                    }
                    carteFinTour = false;

                    let ennemieAttaque = new Promise((resolve) => {
                        console.log("attaque enemie");
                        if (this.#cardListEnemie[i] != undefined) {
                            console.log("entre dans anim enemie");
                            console.log(this.#cardListEnemie[i]);
                            this.#cardListEnemie[i].attakAnimation();
                        } else {
                            console.log("va dans le resolve undefined");
                            resolve();
                        }
                        var verif = () => {
                            if (carteFinTour) {
                                console.log("fin tour enemie");
                                resolve();
                            } else {
                                setTimeout(() => {
                                    verif();
                                }, 100);
                            }
                        };
                        verif();
                    });
                    ennemieAttaque.then(() => {
                        console.log("resove enemie");
                        if (this.#cardListEnemie[i] != undefined) {
                            this.#cardListEnemie[i].tourCarte(
                                this.#cardListEnemie,
                                this.#cardListJoueur,
                                false
                            );
                        }
                        carteFinTour = false;

                        for (let j = 0; j < this.#cardListJoueur.length; j++) {
                            if (this.#cardListJoueur[j] != undefined) {
                                if (this.#cardListJoueur[j].getHp() <= 0) {
                                    this.listeEmplacements[j].setFree();
                                    this.#cardListJoueur[j] = undefined;
                                }
                                if (this.#cardListEnemie[j] != undefined)
                                    if (this.#cardListEnemie[j].getHp() <= 0) {
                                        this.listeEmplacements[j].setFree();
                                        this.#cardListEnemie[j] = undefined;
                                    }
                            }
                        }
                        i++;
                        fonctionAtk();
                    });
                });
            } else {
                console.log("fin total");
                if (this.pvJauge > 10 || this.pvJauge < 1) {
                    console.log("partie finie");
                    finPartie();
                }
            }
        };

        pA.ajoutPA(1);
        fonctionAtk();

        console.log("entré dans action");
        /*for (let i = 0; i < this.#cardListJoueur.length; i++) {
            console.log('tour' + i);
            console.log('j');
            console.log(this.#cardListJoueur[i]);
            if (this.#cardListJoueur[i] != undefined) {
                this.#cardListJoueur[i].tourCarte(this.#cardListJoueur, this.#cardListEnemie, true);
            }
            console.log('e');
            console.log(this.#cardListEnemie[i]);
            if (this.#cardListEnemie[i] != undefined) {
                this.#cardListEnemie[i].tourCarte(this.#cardListEnemie, this.#cardListJoueur, false);
            }


            for (let i = 0; i < this.#cardListJoueur.length; i++) {
                if (this.#cardListJoueur[i] != undefined) {
                    if (this.#cardListJoueur[i].getHp() <= 0) {
                        this.listeEmplacements[i].setFree();
                        this.#cardListJoueur[i] = undefined;
                    }
                    if (this.#cardListEnemie[i] != undefined)
                        if (this.#cardListEnemie[i].getHp() <= 0) {
                            this.listeEmplacements[i].setFree();
                            this.#cardListEnemie[i] = undefined;
                        }
                }

            }

        }*/
    }
}

class JaugeVie {
    #x;
    #y;
    #width;
    #height;
    constructor() {
        this.#x = canvas.width / 8;
        this.#y = plateau.y;
        this.#height = canvas.height / 2;
        this.#width = cardWidth / 7;
    }

    draw() {
        this.#x = canvas.width / 8;
        this.#y = plateau.y;
        this.#height = plateau.height;
        this.#width = cardWidth / 7;

        context.lineWidth = lineWidth;
        context.strokeStyle = "gray";
        context.strokeRect(this.#x, this.#y, this.#width, this.#height);
        let increment = this.#height / 10;
        context.fillStyle = "gray";
        context.beginPath();
        for (let i = 0; i <= 10; i++) {
            context.moveTo(this.#x + this.#width, this.#y + i * increment);
            if (i === 0 || i === 5 || i === 10) {
                context.lineTo(
                    this.#x + 4 * this.#width,
                    this.#y + i * increment
                );
            } else {
                context.lineTo(
                    this.#x + 2 * this.#width,
                    this.#y + i * increment
                );
            }
        }
        context.closePath();
        context.stroke();

        let proportionBleu = (this.#height / 10) * (10 - plateau.pvJauge);
        context.fillStyle = "lightblue";
        context.fillRect(this.#x, this.#y, this.#width, proportionBleu);
        context.fillStyle = "red";
        context.fillRect(
            this.#x,
            this.#y + proportionBleu,
            this.#width,
            this.#height - proportionBleu
        );
    }
}

class Emplacement {
    #x;
    #y;
    #width;
    #height;
    #color;
    #isMouseHover;
    #isFull;
    #pos;
    #placedCart;

    constructor(x, y, width, height, pos) {
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
        this.#color = "white";
        this.#isMouseHover = false;
        this.#isFull = false;
        this.#pos = pos;
        //this.#draw();
    }

    draw(x, y, width, height) {
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
        if (this.#isMouseHover && !this.#isFull && this.#pos > 3) {
            this.#color = "yellow";
        } else {
            this.#color = "white";
        }

        if (this.#placedCart != undefined) {
            let i = inAnimationCard.indexOf(this.#placedCart);
            if (i < 0) {
                this.#placedCart.setX(this.#x);
                this.#placedCart.setY(this.#y);
            }
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
    getX() {
        return this.#x;
    }
    getY() {
        return this.#y;
    }
    setX(x) {
        this.#x = x;
    }
    setY(y) {
        this.#y = y;
    }
    setColor(color) {
        this.#color = color;
    }
    setFree() {
        this.#isFull = false;
    }
    getWidth() {
        return this.#width;
    }
    getHeight() {
        return this.#height;
    }

    mouseHover(x, y) {
        if (!this.#isFull) {
            if (
                x > this.#x &&
                x < this.#x + this.#width &&
                y > this.#y &&
                y < this.#y + this.#height
            ) {
                this.#isMouseHover = true;
                //console.log(selectedCard);
            } else {
                this.#isMouseHover = false;
            }
        }
    }

    mouseClick() {
        if (
            !this.#isFull &&
            selectedCard != undefined &&
            this.#pos > 3 &&
            canPlay &&
            inAnimationCard.length == 0
        ) {
            inAnimationCard.push(selectedCard);
            this.#placedCart = selectedCard;
            main.retirerCarte(selectedCard);
            //selectedCard.setPlayed();
            //selectedCard.setPos(this.#pos - 4);
            plateau.addCard(selectedCard, this.#pos - 4, true);
            this.#isFull = true;

            selectedCard = undefined;
            //canPlay = false;
            console.log("test");
        }
    }
}

class Carte {
    #img;
    #x;
    #y;
    #width;
    #height;
    #nom;
    #isMouseHover;
    #hp;
    #hpmax;
    #atk;
    #isPlayed;
    #effet;
    #cout;
    #pos;
    #PlayerCard;
    #imgsrc;


    constructor(imgSrc, nom, hp, atk, cout, effet) {
        this.#img = new Image();
        this.#imgsrc = imgSrc;
        this.#img.src = "./images/"+imgSrc;
        //console.log(this.#img.src);
        /*this.#img.onload = ()=>{
            context.drawImage(this.#img,0,0);
        };*/
        this.#width = cardWidth;
        this.#height = cardHeight;
        this.#nom = nom;
        this.#isMouseHover = false;
        this.#hp = hp;
        this.#hpmax = this.#hp;
        this.#atk = atk;
        this.#isPlayed = false;
        this.#cout = cout;
        this.#effet = effet;
    }

    visible(x, y, playerCard){
        this.#x = x;
        this.#y = y;
        this.#PlayerCard = playerCard;
        drawElement.push(this);
        elements.push(this);
    }

    draw() {
        if (this.#hp <= 0) {
            let i = drawElement.indexOf(this);
            if (i > -1) {
                drawElement.splice(i, 1);
            }
        }

        //console.log(this.#x);
        //console.log(this.#y);
        if (!this.#isMouseHover) {
            this.#width = cardWidth;
            this.#height = cardHeight;
        }

        context.drawImage(
            imgFondCarte,
            this.#x,
            this.#y,
            this.#width,
            this.#height,
            
        )

        context.fillStyle = "black";
        context.textAlign = "center";
        context.font = canvas.width / 100;
        context.fillText(
            this.#nom,
            this.#x + this.#width / 2,
            this.#y + this.#height / 10
        );
        context.drawImage(
            this.#img,
            this.#x + (this.#width/1.35)/6,
            this.#y + this.#height / 7,
            this.#width/1.3,
            this.#width/1.50,
        );

        context.fillText(
            this.#hp + "hp",
            this.#x + this.#width / 5.5,
            this.#y + this.#height / 1.3
        );
        context.fillText(
            this.#atk + "atk",
            this.#x + this.#width / 1.2,
            this.#y + this.#height / 1.05
        );

        /*this.#img.onload = ()=>{
            console.log(this.#x);
            console.log(this.#y);
            
        };*/
    }

    /*animate(x,y,width,height){
        this.#draw(x,y,width,height);
        requestAnimationFrame(this.animate.bind(this))
    }*/

    mouseHover(x, y) {
        if (!this.#isPlayed) {
            if (
                x > this.#x &&
                x < this.#x + this.#width &&
                y > this.#y &&
                y < this.#y + this.#height
            ) {
                if (!this.#isMouseHover) {
                    this.#width = cardWidth * 1.05;
                    this.#height = cardHeight * 1.05;
                }
                this.#isMouseHover = true;
            } else {
                this.#isMouseHover = false;
            }
        }
    }

    mouseClick() {
        console.log(this.#nom);
        console.log(!this.#isPlayed);
        if (!this.#isPlayed && this.#cout <= pA.getPA()) {
            selectedCard = this;
        }
    }

    getX() {
        return this.#x;
    }

    getImageSrc(){
        return this.#imgsrc;
    }

    getNom(){
        return this.#nom;
    }

    getEffet(){
        return this.#effet;
    }
    getY() {
        return this.#y;
    }

    setX(x) {
        this.#x = x;
    }
    setY(y) {
        this.#y = y;
    }
    setWidth(width) {
        this.#width = width;
    }
    setHeight(height) {
        this.#height = height;
    }
    setPlayed() {
        console.log("set played");
        this.#isPlayed = true;
    }

    setHp(hp) {
        this.#hp = hp;
    }

    getX() {
        return this.#x;
    }
    getY() {
        return this.#y;
    }
    getWidth() {
        return this.#width;
    }
    getHeight() {
        return this.#height;
    }
    getPos() {
        return this.#pos;
    }

    setDamage(damage) {
        this.#hp -= damage;
    }
    setPos(pos) {
        this.#pos = pos;
    }
    getAtk() {
        return this.#atk;
    }
    getHp() {
        return this.#hp;
    }

    getHpmax() {
        return this.#hpmax;
    }

    getCout(){
        return this.#cout;
    }
    isPlayerCard() {
        return this.#PlayerCard;
    }

    tourCarte(listCarteJoueur, listCarteEnemie, joueur) {
        console.log("est dans tourCarte");
        console.log("liste J");
        console.log(listCarteJoueur);
        console.log("liste e");
        console.log(listCarteEnemie);
        let intensite;
        let listCarteImpacter = this.#effet.getCartImpacter(
            listCarteJoueur,
            listCarteEnemie,
            this.#pos
        );
        console.log("liste carte impacté");
        console.log(listCarteImpacter);
        for (let i = 0; i < listCarteImpacter.length; i++) {
            intensite = this.#effet.actionCarte(this, listCarteImpacter[i]);
            if (intensite < 0 && listCarteImpacter[i] != null) {
                intensite = this.#effet.soin(
                    this,
                    listCarteImpacter[i],
                    intensite
                );
                this.soin(listCarteImpacter[1], intensite);
            } else {
                if (listCarteImpacter[i] != null)
                    intensite = listCarteImpacter[i].#effet.defence(
                        listCarteImpacter[i],
                        this,
                        intensite
                    );
                this.attaque(listCarteImpacter[i], intensite, joueur);
            }
        }
    }
    soin(carteImpacter, intensite) {
        carteImpacter.setHp(Math.min(carteImpacter.getHpmax(), hp + intensite));
    }

    attaque(carteImpacter, intensite, joueur) {
        if (carteImpacter != null) {
            carteImpacter.setHp(Math.max(0, carteImpacter.getHp() - intensite));
            if (carteImpacter.getHp() == 0) {
                if (carteImpacter.isPlayerCard()) {
                    plateau.listeEmplacements[
                        carteImpacter.getPos() + 4
                    ].setFree();
                }
            }
        } else {
            if (joueur) plateau.pvJauge += intensite;
            else plateau.pvJauge -= intensite;
        }
    }

    //pour l'instant le temps est considéré en seconde
    moveCard(xDistancePerFrame, yDistancePerFrame, x, y) {
        if (timer > interval) {
            if (this.x != x) {
                if (this.#x - x < 2 && this.#x - x > -2) {
                    this.#x = x;
                } else {
                    this.#x -= xDistancePerFrame;
                }
            }
            if (this.#y != y) {
                if (this.#y - y < 2 && this.#y - y > -2) {
                    this.#y = y;
                } else {
                    this.#y -= yDistancePerFrame;
                }
            }
        }

        if (this.#x != x || this.#y != y) {
            requestAnimationFrame(() => {
                this.moveCard(xDistancePerFrame, yDistancePerFrame, x, y);
            });
        } else {
            let i = inAnimationCard.indexOf(this);
            if (i > -1) {
                inAnimationCard.splice(i, 1);
            }
            console.log("fini");
        }
    }

    calculMoveDistance(x, y, time) {
        let distance = {
            x: (this.#x - x) / (60 * time),
            y: (this.#y - y) / (60 * time),
        };
        return distance;
    }

    attakAnimation() {
        console.log("entré dans animation");
        var distanceY = cardHeight / (60 * 0.05);
        if (this.#PlayerCard) {
            var y = this.#y - cardHeight;
        } else {
            var y = this.#y + cardHeight;
        }

        var deplacementFin = false;

        var fonc = (direction) => {
            console.log("entré dans la fonction");
            if (timer > interval) {
                if (this.#y != y) {
                    if (this.#y - y < 2 && this.#y - y > -2) {
                        this.#y = y;
                    } else {
                        if (direction === "up") {
                            if (this.#PlayerCard) {
                                this.#y -= distanceY;
                            } else {
                                this.#y += distanceY;
                            }
                        } else {
                            if (this.#PlayerCard) {
                                this.#y += distanceY;
                            } else {
                                this.#y -= distanceY;
                            }
                        }
                    }
                }
            }
            if (this.#y != y) {
                requestAnimationFrame(() => {
                    fonc(direction);
                });
            } else {
                if (direction === "down") {
                    let i = inAnimationCard.indexOf(this);
                    if (i > -1) {
                        inAnimationCard.splice(i, 1);
                    }
                    carteFinTour = true;
                }
                console.log("fini fini");
                deplacementFin = true;
            }
        };
        var promise = new Promise((resolve) => {
            console.log("entré dans la promesse");
            let i = inAnimationCard.indexOf(this);
            if (i < 0) {
                console.log("ajout dans la liste");
                inAnimationCard.push(this);
            }

            fonc("up");
            let verif = () => {
                if (deplacementFin) {
                    resolve();
                } else {
                    setTimeout(() => {
                        verif();
                    }, 100);
                }
            };
            verif();
        });
        promise.then(() => {
            console.log("azertyfdsdfghgdsdfgh");
            if (this.#PlayerCard) {
                y = this.#y + cardHeight;
            } else {
                y = this.#y - cardHeight;
            }

            fonc("down");
        });
    }
}

class Main {
    #x;
    #y;
    #width;
    #height;
    #listeCartes;
    #cardGap;
    #cardPos;

    constructor() {
        this.#x = canvas.width / 4;
        this.#y = canvas.height / 1.3;
        this.#width = canvas.width / 2;
        this.#height = canvas.height - this.#y;
        this.#listeCartes = [];
        this.#cardGap = (canvas.width / 8) * 0.2;
        this.#cardPos = this.#x + (this.#width / 2 - cardWidth / 2);
    }

    draw() {
        this.#x = canvas.width / 4;
        this.#y = canvas.height / 1.4;
        this.#width = canvas.width / 2;
        this.#height = canvas.height - this.#y;
        this.#cardGap = (canvas.width / 8) * 0.2;
        this.#cardPos = this.#x + (this.#width / 2 - cardWidth / 2);
        context.fillStyle = "gray";
        context.fillRect(this.#x, this.#y, this.#width, this.#height);
    }

    reajusterCartes() {
        this.#cardPos = this.#x + (this.#width / 2 - cardWidth / 2);
        if (this.#listeCartes[0] != undefined) {
            let carte = this.#listeCartes[0];
            let nouvCarte;
            carte.setX(this.#cardPos);
            carte.setY(this.#y);

            let i;
            for (i = 1; i < this.#listeCartes.length; i++) {
                nouvCarte = this.#listeCartes[i];
                for (let index = i; index >= 0; index--) {
                    carte = this.#listeCartes[index];
                    carte.setX(
                        carte.getX() - (cardWidth / 2 + this.#cardGap / 2)
                    );
                }
                nouvCarte.setX(
                    this.#listeCartes[i - 1].getX() + cardWidth + this.#cardGap
                );
                nouvCarte.setY(this.#y);
            }
        }
    }

    getListeCartes() {
        return this.#listeCartes;
    }

    retirerCarte(carte) {
        let carteTrouvee = false;
        let distance;
        for (let i = 0; i < this.#listeCartes.length; i++) {
            if (this.#listeCartes[i] != carte) {
                if (carteTrouvee == false) {
                    let tempX =
                        this.#listeCartes[i].getX() +
                        (cardWidth / 2 + this.#cardGap / 2);
                    distance = this.#listeCartes[i].calculMoveDistance(
                        tempX,
                        this.#listeCartes[i].getY(),
                        0.5
                    );
                    this.#listeCartes[i].moveCard(
                        distance["x"],
                        distance["y"],
                        tempX,
                        this.#y
                    );
                    //this.#listeCartes[i].setX(this.#listeCartes[i].getX() + (cardWidth / 2 + this.#cardGap / 2));
                } else {
                    let tempX =
                        this.#listeCartes[i].getX() -
                        (cardWidth / 2 + this.#cardGap / 2);
                    distance = this.#listeCartes[i].calculMoveDistance(
                        tempX,
                        this.#listeCartes[i].getY(),
                        0.5
                    );
                    this.#listeCartes[i].moveCard(
                        distance["x"],
                        distance["y"],
                        tempX,
                        this.#y
                    );
                    //this.#listeCartes[i].setX(this.#listeCartes[i].getX() - (cardWidth / 2 + this.#cardGap / 2));
                }
            } else {
                console.log(this.#listeCartes);
                carteTrouvee = true;
                this.#listeCartes.splice(i, 1);
                console.log(this.#listeCartes);
                i--;
            }
        }

        let j = elements.indexOf(carte);
        if (j > -1) {
            elements.splice(j, 1);
        }
    }

    ajoutCarte(nouvCarte) {
        let distance;
        inAnimationCard.push(nouvCarte);
        if (this.#listeCartes.length == 0) {
            //console.log("feur");
            distance = nouvCarte.calculMoveDistance(this.#cardPos, this.#y, 0.5);
            nouvCarte.moveCard(
                distance["x"],
                distance["y"],
                this.#cardPos,
                this.#y
            );
            console.log("move");
            //nouvCarte.setX(this.#cardPos);
            //nouvCarte.setY(this.#y);
            console.log(nouvCarte.getX());
            this.#listeCartes.push(nouvCarte);
        } else {
            for (let i = 0; i < this.#listeCartes.length; i++) {
                let carte = this.#listeCartes[i];
                //console.log(carte);
                let tempX = carte.getX() - (cardWidth / 2 + this.#cardGap / 2);
                distance = carte.calculMoveDistance(tempX, carte.getY(), 0.5);
                carte.moveCard(distance["x"], distance["y"], tempX, this.#y);
                //carte.setX(carte.getX() - (cardWidth / 2 + this.#cardGap / 2));
            }
            //nouvCarte.setX(this.#listeCartes[this.#listeCartes.length - 1].getX() + cardWidth + this.#cardGap);
            //nouvCarte.setY(this.#y);

            let tempX =
                this.#listeCartes[this.#listeCartes.length - 1].getX() +
                (cardWidth / 2 + this.#cardGap / 2);
            distance = nouvCarte.calculMoveDistance(tempX, this.#y, 0.5);
            nouvCarte.moveCard(distance["x"], distance["y"], tempX, this.#y);
            this.#listeCartes.push(nouvCarte);
        }
    }

    refreshPosInfo() {}
}

class Pioche {
    #x;
    #y;
    #width;
    #height;

    constructor() {
        this.#x = canvas.width - canvas.width / 4;
        this.#y = canvas.height / 1.3;
        this.#width = (plateau.width / 4) * 0.8;
        this.#height = (plateau.height / 2) * 0.8;
        elements.push(this);
        drawElement.push(this);
    }

    getX() {
        return this.#x;
    }
    getY() {
        return this.#y;
    }
    getWidth() {
        return this.#width;
    }
    getHeight() {
        return this.#height;
    }

    draw() {
        this.#x = canvas.width - canvas.width / 6;
        this.#y = canvas.height / 3;
        this.#width = (plateau.width / 4) * 0.8;
        this.#height = (plateau.height / 2) * 0.8;

        context.fillStyle = "gray";
        context.fillRect(this.#x, this.#y, this.#width, this.#height);
        context.fillStyle = "darkgray";
        context.fillRect(
            this.#x,
            this.#y + this.#height / 4,
            this.#width,
            this.#height / 3
        );
        context.fillStyle = "black";
        context.textAlign = "center";
        context.font = canvas.width / 50 + "px Arial";
        context.fillText(
            "PIOCHE",
            this.#x + this.#width / 2,
            this.#y + this.#height / 2.3
        );
    }

    mouseHover() {}

    mouseClick() {
        if (
            main.getListeCartes().length < 5 &&
            canDraw &&
            inAnimationCard.length == 0
        ) {
            let randCard = listCarte[Math.floor(Math.random() * listCarte.length)];
            let newCard = new Carte(randCard.getImageSrc(),randCard.getNom(), randCard.getHpmax(),randCard.getAtk(),randCard.getEffet());
            newCard.visible(this.#x, this.#y, true);
            main.ajoutCarte(newCard);
            canDraw = false;
        }
    }
}

class EndTurnButton {
    #x;
    #y;
    #width;
    #height;

    constructor() {
        this.#x = canvas.width - canvas.width / 6;
        this.#y = canvas.height / 1.2;
        this.#width = canvas.width / 8;
        this.#height = canvas.height / 10;
        drawElement.push(this);
        elements.push(this);
    }

    draw() {
        this.#x = canvas.width - canvas.width / 6;
        this.#y = canvas.height / 1.2;
        this.#width = canvas.width / 8;
        this.#height = canvas.height / 10;

        context.fillStyle = "gray";
        context.beginPath();
        context.moveTo(this.#x, this.#y);
        context.lineTo(this.#x + this.#width / 1.5, this.#y);
        context.lineTo(this.#x + this.#width, this.#y + this.#height / 2);
        context.lineTo(this.#x + this.#width / 1.5, this.#y + this.#height);
        context.lineTo(this.#x, this.#y + this.#height);
        context.lineTo(this.#x, this.#y);
        context.closePath();
        context.fill();
        context.font = canvas.width / 65 + "px Arial";
        context.fillStyle = "black";
        context.fillText(
            "Terminer le tour",
            this.#x + this.#width / 2.2,
            this.#y + this.#height / 1.8
        );
    }

    mouseHover() {}

    mouseClick() {
        if (inAnimationCard.length == 0) {
            endTurn = true;
            ia.play();
            plateau.action();
        }
    }

    getX() {
        return this.#x;
    }
    getY() {
        return this.#y;
    }

    getWidth() {
        return this.#width;
    }
    getHeight() {
        return this.#height;
    }
}

class Ia {
    #hp;
    #cardList;
    constructor() {
        this.#hp = 10;
        this.#cardList = [
            { name: "card1", atk: 1, hp: 5 },
            { name: "card2", atk: 1, hp: 5 },
            { name: "card3", atk: 1, hp: 5 },
            { name: "card4", atk: 1, hp: 5 },
        ];
    }

    play() {
        let card =
            this.#cardList[Math.floor(Math.random() * this.#cardList.length)];
        let availablePlace = [];
        for (let i = 0; i < 4; i++) {
            if (plateau.getCard(i) == undefined) {
                console.log(i);
                availablePlace.push(i);
            }
        }
        if (availablePlace.length > 0) {
            let pos =
                availablePlace[
                    Math.floor(Math.random() * availablePlace.length)
                ];
            let randCard = listCarte[Math.floor(Math.random() * listCarte.length)];
            let newCard = new Carte(randCard.getImageSrc(),randCard.getNom(), randCard.getHpmax(),randCard.getAtk(),randCard.getEffet());
            newCard.visible(1, 1, false);
            plateau.addCard(newCard, pos);

        }
    }
}


class pointsAction {
    #x;
    #y;
    #pA;
    #width;
    #height;

    constructor() {
        this.#x = canvas.width - canvas.width / 1.1;
        this.#y = canvas.height / 1.2;
        this.#width = canvas.width / 20;
        this.#height = canvas.height / 10;
        this.#pA = 0;
        drawElement.push(this);
        elements.push(this);
    }

    draw() {

        this.#x = canvas.width - canvas.width / 1.1;
        this.#y = canvas.height / 1.2;
        this.#width = canvas.width / 20;
        this.#height = canvas.height / 10;

        context.fillStyle = 'gray';
        context.beginPath();
        context.moveTo(this.#x, this.#y);
        context.lineTo(this.#x + this.#width / 1.5, this.#y);
        context.lineTo(this.#x + this.#width, this.#y + this.#height / 3);
        context.lineTo(this.#x + this.#width, this.#y + this.#height / 1.5);
        context.lineTo(this.#x + this.#width / 1.5, this.#y + this.#height);
        context.lineTo(this.#x, this.#y + this.#height);
        context.lineTo(this.#x - this.#width / 3, this.#y + this.#height / 1.5);
        context.lineTo(this.#x - this.#width / 3, this.#y + this.#height / 3);
        context.lineTo(this.#x, this.#y);
        context.closePath();
        context.fill();
        context.font = canvas.width / 65 + 'px Arial';
        context.fillStyle = 'black';
        context.fillText(this.#pA + " PA", this.#x + this.#width / 3, this.#y + this.#height / 1.75);
    }

    mouseHover() {

    }

    mouseClick() {
    }

    getX() {
        return this.#x;
    }
    getY() {
        return this.#y;
    }

    getWidth() {
        return this.#width;
    }
    getHeight() {
        return this.#height;
    }

    getPA() {
        return this.#pA;
    }

    ajoutPA(i) {
        this.#pA += i;
    }

    retirerPA(i){
        this.#pA -= i;
    }
}

/// - Effets - ////////////////////////////////////////////////////////////////

class Effet {
    nomEffet = "Effet par défaut";
    idEffet = 0; 
    imgEffet;
    constructor() {
    }

    getCartImpacter(listCarteJoueur, listCarteEnemie, pos) {
        console.log("est dans carteImpacter");
        console.log(pos);
        console.log(listCarteEnemie[pos]);
        let listCarteReturn = new Array(0);
        listCarteReturn.push(listCarteEnemie[pos]);
        return listCarteReturn;
    }

    actionCarte(carteJoueur, carteImpacter) {
        return carteJoueur.getAtk();
    }

    defence(carteJoueur, carteImpacter, intensite) {
        return intensite;
    }

    soin(carteJoueur, carteImpacter, intensite) {
        return intensite;
    }
}

class Vol extends Effet {
    constructor() {
        super();
        this.nomEffet = "vol";
        this.idEffet = 1; 
    }
    getCartImpacter(listCarteJoueur, listCarteEnemie, pos) {
        return null;
    }
}

/// - API - ////////////////////////////////////////////////////////////////

async function requestToBDD(requeste, parameter) {
    let requestFile;
    let requestParameter;
    switch (requeste) {
        case REQUEST_ALL_CARTE:
            requestFile = "carteJson.php";
            break;

        case REQUEST_ALL_EFFET:
            requestFile = "effetJson.php";
            break;

        default:
            return null;
    }
    let request = await fetch(`http://saejvjmmh.duckdns.org/sae-on-trouvera-plus-tard/site_web/JSON/${requestFile}`, { method: "post", });
    return await request.json();

}

function getEffet(effetid){
    switch (effetid) {
        case null:
            return new Effet();
            break;
        case 1:
            return new Vol();
            break;
        default:
            return new Effet();
            break;
    }
}