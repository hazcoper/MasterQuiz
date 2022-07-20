// Meter os numeros a fucnionarem
// meter a cena de mostrar a pagina
// meter a cena para poder andar uma pagina para a frente ou uma para tras
// meter cena que avisa quando troco de pagina
// fazer mais claro quando acerto uma letra
// fazer mais claro quando erro uma letra
// meter cena para skip letter



let connection;
let button;
let button1;
let button2;

let prevInd;
let prevText;

let nextText;
let nextInd;

let myText;
let ind;

let getLineFlag;

let acentos = {};
acentos[65] = [192,193,194,195,196,224,225,226,227]

acentos[67] = [199, 231]
acentos[69] = [200, 201, 202, 203, 232, 233, 234]
acentos[73] = [204,205,206,236,237,238]
acentos[79] = [210,211,212,213,242,243,244,245]
acentos[85] = [217,218,219,249,250,251]


function setup() {
    createCanvas(960, 720);
    background(0);
    button = createButton('close socket');
    button.position(10, 10);
    button.mousePressed(closeSocket);

    button1 = createButton('send message');
    button1.position(110, 10);
    button1.mousePressed(sendData);
    
    button2 = createButton('connect');
    button2.position(225, 10);
    button2.mousePressed(connect);

    prevInd = 0;
    prevText = [];

    nextInd = 0;
    nextText = [];
    myText = "1234567890hello";
    ind = 0;

    getLineFlag = 0;
}

function fillNextLines(){
    getLineFlag = 1;
    sendData("getLine");
    sendData("getLine");
    sendData("getLine");
    sendData("getLine");


}

function conn(){

    var socket = io.connect('http://192.168.1.81');
    socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
    });
}


function connect(){
    console.log("starting connection");
    connection = new WebSocket('ws://192.168.1.81:8765');
    connection.onopen = function () {
        console.log("connection has been made");
        fillNextLines();
    };
    connection.onmessage = function(event) {
        // console.log("A new message has been received: ", event.data);

        if(getLineFlag){
            myText = nextText.shift();
            if(myText == undefined){
                myText = "";
            }
            nextText[3] = event.data;
            console.log(nextText[3]);
            sendData("thanks");
        }
        // alert(`[message] Data received from server: ${event.data}`);
    };
}

function closeSocket(){
    connection.close();

    console.log("socket has been closed");
}

function sendData(message){
    connection.send(message);
    print("message has been sent")
}


function checkLine(){
    //check if I need to change lines or not
    if(ind == myText.length){
        getLineFlag = 1;
        ind = 0;
        prevText.shift();
        prevText[3] = myText;
        // prevText[prevInd] = myText;
        // prevInd = (prevInd + 1)%4;
        connection.send("getLine");

        //move my line to the list

    }
}


function draw(){
    background(0);
    fill(255);

    textAlign(CENTER);
    textSize(25);

    //desenhar o que esta no prev list desenhar de baixo para cima
    var alpha = 200;
    fill(25, 100, 20, alpha);
    var y = 720/2
    for(var counter = 3; counter > 0; counter--){
        text(prevText[counter], 960/2, y-35);
        y-=35;    
        fill(25, 100, 20, 100);
        alpha -= 45;
    }

    fill(200,200,200);
    totalWidht = textWidth(myText);
    unWrittenWidht = textWidth(myText.slice(ind, myText.length));
    // writtenWidht = textWidth(myText.slice(0,ind));
    // quero desenhar duas coisas, o que vem antes do ind + 1 e o que vem depois do ind + 1 
    text(myText, 960/2, 720/2);
    fill(25,200,40);
    text(myText.slice(0,ind), (960-unWrittenWidht)/2, 720/2);

    alpha = 200
    fill(110, 110, 110, alpha);
    var y = 720/2
    for(var counter = 0; counter < 3; counter++){
        text(nextText[counter], 960/2, y+35);
        y+=35;
        fill(100, 100, 100, alpha);
        alpha -= 50;  
    }

    checkLine();

}

function keyPressed() {
    
    // if(keyCode === "A".charCodeAt(0)){
    //     console.log("a  has been pressed");
    // }
    //verify if it was and letter, and it was, verify that it was correct
    print(keyCode);
    if(keyCode >= 48 && keyCode <= 57){
        // check the numbers
        if (keyCode == myText[ind].charCodeAt(0)){
            ind++;
        }
        return false;
    }
    if(keyCode >= 65 && keyCode <= 90){
        // check to see se nao foi um acento
        if(acentos[keyCode] !== undefined){
            if(acentos[keyCode].includes(myText[ind].charCodeAt(0))){
                ind++;
            }
        }

        if(keyCode == myText[ind].charCodeAt(0) || keyCode == myText[ind].charCodeAt(0)-32){
            ind++;
        }
    }else if(keyCode == 32 && myText[ind].charCodeAt(0) == 95){
        // deal with differente values for space
        ind++;
    }else if(keyCode == 188 || keyCode == 190 || keyCode == 189 || keyCode == 186 || keyCode == 222 || keyCode == 191 || keyCode == 49 || keyCode == 222){
        // console.log("isto devia ser uma virgula ou um ponto", myText[ind].charCodeAt(0));
        if(myText[ind].charCodeAt(0) >= 42 && myText[ind].charCodeAt(0) <= 46 || myText[ind].charCodeAt(0) == 58 || myText[ind].charCodeAt(0) == 59 || myText[ind].charCodeAt(0) == 8221 || myText[ind].charCodeAt(0) == 8220){
            ind++;
        }
    }
    if(keyCode == 17){
        // skip this line
        //presing left control
        ind = myText.length;
    }
    if(keyCode == 18){
        // skip this letter
        // pressing left alt
        ind++;
    }
    

    // from [65, 90]
    //backspace and space and enter 8, 32, 13
    //. and , 188, 190
    //hard code os acentos
    //adicionar ; "" ? !

    return false;
}


// À	192
// Á	193
// Â	194
// Ã	195
// Ä	196
// à	224
// á	225
// â	226
// ã	227


// Ç	199
// ç	231



// È	200
// É	201
// Ê	202
// è	232
// é	233
// ê	234


// Ì	204
// Í	205
// Î	206
// ì	236
// í	237
// î	238



// Ò	210
// Ó	211
// Ô	212
// Õ	213
// ò	242
// ó	243
// ô	244
// õ	245


// Ù	217
// Ú	218
// Û	219
// ù	249
// ú	250
// û	251
