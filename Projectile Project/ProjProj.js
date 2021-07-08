//create canvas
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

//Canvas size variables
var resize = 4; 
canvas.width = 96 * resize;
canvas.height = 64 * resize;
document.body.appendChild(canvas);

//variables for resizing text, lines
ctx.lineWidth = resize/1.5;
const width = canvas.width;
const height = canvas.height;
var resSize = width/96;
var lar_txt_size = 11 * resSize;
var sml_txt_size = 5 * resSize;
const largeFont = lar_txt_size + "px ti-84p";        
const smllFont =  sml_txt_size + "px ti-84p";
ctx.fillStyle = 'black';
var angle = 0;
var velocity = 0;

//random data states
var pageOn = 0;
var state = "menu";
var level = 1;
var sel = 1;
var lvlPick = 1;
var completedLevels = 10;
var pageTotal = 0;
var gameState = 1;
var velBool = false;
var angBool = false;
var curX = 1;
var curY = 0;
var time = 0;
var grav = 9.81;
var distance = 0;
var winDis = 0;
var wonBool = false;

//keyboard controls
var keysDown = {};
document.addEventListener("keydown", function(key) {
    keysDown[key.keyCode] = true;
    var tempState = state;
    //13 = enter
    //40 = down arrow
    //38 = up arrow
    //39 = right arrow
    //37 = left arrow
    //TODO:
    //  refactor code, lot of nested if's
    if(state == "menu") {
        clearScreen();
        (key.keyCode == 40 && sel < 4) ? sel++ :
        (key.keyCode == 38 && sel > 1) ? sel-- : 0;
        if(key.keyCode == 9) {
            var canvasData = ctx.getImageData(0, 0 , width, height); 
            console.log(canvasData.data);
            ctx.putImageData(canvasData, 10, 10);
        }
        if (key.keyCode == 13) {
            sel == 1 ? tempState = "text" : 
            sel == 3 ? tempState = "level-pick" :
            sel == 4 ? tempState = "quit" : 0;
            key.keyCode = 0;
        }
    }
    if(state == "text") {
        clearScreen();
        //console.log("page on: " + pageOn);
        //console.log("total pages: " + pageTotal);
        if(key.keyCode == 37 && pageOn > 0) {
            pageOn--;
        } else if (key.keyCode == 39 && pageOn < pageTotal-1) {
            pageOn++;
        } else if (key.keyCode == 13 && pageOn == pageTotal-1) {
            pageTotal = 0;
            pageOn = 0;
            tempState = "game";
        }  
    }
    if(state == "level-pick") {
        clearScreen();
        //console.log("lvl pick:" + lvlPick);
        //console.log("comp level:", completedLevels);
        //console.log("curr level:", level);
        //displays level selection
        //back goes back to menu
        if(key.keyCode == 39 && lvlPick < completedLevels + 1) lvlPick++;
        if(key.keyCode == 37 && lvlPick > 1) lvlPick--;
        if(key.keyCode == 13 && lvlPick == completedLevels+1) {
            tempState = "menu";
            lvlPick = 1;
        } else if (key.keyCode == 13 && lvlPick < completedLevels) {
            tempState = "text";
            level = 0;
        }
    }
    if(state == "game"){
        if(level == 0) {
            tempState = "shooting";
        }
        if(key.keyCode == 37 && ((gameState > 1 && gameState < 10) || (gameState > 15 && gameState > 10))) {
            gameState--;
        } else if(key.keyCode == 39 && ((gameState < 5 && gameState < 10) || (gameState > 10 && gameState < 17))) {
            gameState++;
        }
        if(key.keyCode == 38 && gameState < 10) {
            var up = 15;
            if(gameState == 1 || gameState == 2) up = 15;
            if(gameState == 3) up = 16;
            if(gameState == 4 || gameState == 5) up = 17;
            gameState = up;
            //if 1,2 goto angle
            //if 3 goto fire
            //if 4,5 goto vel
        } else if(key.keyCode == 40 && gameState == 16) {
            gameState = 3;
            //if on "fire" go down to spec
        } else if(key.keyCode == 13) {
            if(gameState == 16) {
                tempState = "shooting";
                xStart = 10;
                yStart = 75; 
            }
            if(gameState == 2) {
                clearScreen();
                tempState = "text";
            }
            if(gameState == 5) {
                clearScreen();
                tempState = "menu";
            }
        } else if(gameState == 15) { //if on veclocity (state 15) and up/down and unlocked
            if(key.keyCode == 38 && velBool && velocity < 100) {
                velocity += 0.5;
            }
            if(key.keyCode == 40 && velBool && velocity > 0) {
                velocity -= 0.5;
            }
        } else if(gameState == 17) {
            if(key.keyCode == 38 && angBool && angle < 90) {
                angle++;
            }
            if(key.keyCode == 40 && angBool && angle > 0) {
                angle--;
            }
        }
        if(distance == winDis && key.keyCode) state = "check";
    }
    if(state == "check") {
        if(key.keyCode == 13) {
            if(wonBool) {
                clearScreen();
                tempState = "text";
                level += 1;
            } else {
                clearScreen();
                tempState = "text";
            }
        }
    }
    state = tempState; 
    //check state, display correct screen
    (state == "menu" || state == "level-pick") ? mainMenu() :  
    state == "game" ? gameMenu() : 0;
}, false);

//helper functions: Emulating Ti-basic
var Text = function(size ,x, y, data, color) {
    //draws text to canvas at x, y
    //size 1: large font
    //size 2: small font
    if(color) {
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
    } else {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
    }
    var offset;
    if (size == 1) {
        ctx.font = largeFont
        //offset = 47;
        offset = (resize * 7) + (resize - 1);
    } else if(size == 2) {
        ctx.font = smllFont;
        //offset = 22;
        offset = (resize * 4) - (resize / 3);
    }
    ctx.fillText(data, x*resSize + 1, y*resSize + offset);
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    return;
}

var  Line = function(x1, y1, x2, y2) {
    //line from x1, y1 to x2, y2
    //update bool updates the canvas with stroke
    ctx.beginPath();
    ctx.moveTo(x1*resSize, y1*resSize);
    ctx.lineTo(x2*resSize, y2*resSize);
    ctx.stroke();
    ctx.closePath();
    return;
}

var  Horizontal = function(y) {
    //Horizontal line across whole canvas
    Line(0, y, width, y);
} 

var  Vertical = function(x) {
    //Vertical line across whole canvas
    Line(x, 0, x, height);
}

var PtOn = function(x, y) {
    ctx.fillRect(x*resSize, y*resSize, resSize, resSize);
}

var PtOff = function(x, y) {
    ctx.clearRect(x*resSize, y*resSize, resSize, resSize);
}

var Rect = function(x, y, width, height) {
    ctx.fillRect(x*resSize, y*resSize, width*resSize, height*resSize);    
}

var drawBox = function(A, B) {
        Line(A+1,B+.5,A+7,B+.5);
        Line(A+.5,B+1,A+.5,B+7);
        Line(A+1,B+7.5,A+7,B+7.5);
        Line(A+7.5,B+1,A+7.5,B+7);
}

var mainMenu = function() {
    clearScreen();
    //everything is scaled to a 96 x 64 screen (ti-84+)
    var str1 = "Continue";
    var str2 = "New Game";
    var str3 = "Lvl Select";
    var str4 = "Quit";

    if(state == "menu") {
        Text(1, 19, 0, "Projectile", 1);
        Text(1, 25, 8, "Project", 1);
    } else if (state == "level-pick") {
        Text(1, 10, 0, "Pick level:", 1);
        if(lvlPick <= completedLevels) { 
            Text(1, 15, 8, "< " + lvlPick + " >", 1);
        } else {
            Text(1, 15, 8, "< Back >", 1);
        }
    }
    Text(2, 13, 57, "Linksoft Productions 2019", 1);
    //options

    sel == 1 ? Text(1, 20, 18, str1, 1) : Text(2, 20, 20, str1, 1);
    sel == 2 ? Text(1, 20, 26, str2, 1) : Text(2, 20, 28, str2, 1);
    sel == 3 ? Text(1, 20, 34, str3, 1) : Text(2, 20, 36, str3, 1);
    sel == 4 ? Text(1, 20, 42, str4, 1) : Text(2, 20, 44, str4, 1);

    ctx.beginPath();
    Horizontal(52, 0);
    Horizontal(54, 0);
    Horizontal(56, 0);
    Horizontal(17, 1);
}

var lvlData = function(lvl) {
    if(lvl == 0) {   
        var data = {
            name: "A debrief on Newton",
            char: "Professor Zelda",
            angB: false,
            velB: false,
            angS: 45,
            velS: 30,
            pages: 4,
            distance: 82,
            text: [[
                "Professor Zelda",
                "Goodmorning!",
                "I am Prof. Zelda, yes",
                "yes, it's a girls name.",
                "I am here to guide you in",
                "the next couple days.",
                "have you been debriefed?..",
                "No? I'll go get that",
                "right away!",
                ], [
                "Debrief",
                "Welcome to the wonderful",
                "world of Pokem.. Oops wrong",
                "page.. Ahem. We are at war",
                "with our enemies, and have",
                "been told by Mr. President",
                "to undergo a secret mission.",
                "Sadly our numbers guy died",
                "last mission. Don't worry!!",
                "You are totally 79*pi% safe!",
                ],[
                "Debrief",
                "Well, we need your brain,",
                "even if we have to train it.",
                "Oh.. and you have no choice",
                "we just landed in Area 51.",
                "Our first test will begin",
                "tomorrow, goodnight!",
                ],[
                "Day 1: Newton said what?", 
                "How'd you sleep??",
                "Well the beds are made of",
                "recycled UFO pieces,",
                "so that does make sense.",
                "Well today you start",
                "your training. ",
                "Here watch this..",
            ]]
        }
    }
    else if(lvl == 1) {
        var data = {
            name: "A debrief on Newton",
            char: "Professor Zelda",
            angB: false,
            velB: false,
            angS: 45,
            velS: 25,
            pages: 1,
            distance: 57,
            text: [[
                "Professor Zelda", 
                "Well hopefully you", 
                "got the hang of it.",
                "Our next test is to",
                "Hit a target. Scared??",
                "Don't worry, if you miss",
                "it will only cost us",
                "1500 dollars..", 
                "Kidding.",
                "I already lined it up", 
                "for you.", 
            ]]
        }
    }
    else if(lvl == 2) {
        var data = {
            name: "Gravity",
            char: "Professor Zelda",
            angB: false,
            velB: false,
            angS: 45,
            velS: 15,
            pages: 3,
            distance: 21,
            text: [[
                "Professor Zelda",
                "Well well. Look who is",
                "growing up so fast. Time",
                "to explain a few things.",
                "The object we launched is",
                "called a projectile. What's",
                "with the French??",
                "No silly it is a real word!",   
            ],[ 
                "What is a projectile?",
                "A projectile is an object,",
                "or particle that gravity acts",
                "upon. When you shoot the",
                "missile, did you notice the",
                "curve?",
                "That is because we launched",
                "it into the air, and gravity",
                "pulled it back down.",
            ],[
                "Professor Zelda",
                "Well, enough talking!",
                "Let's go see some more",
                "beautiful arches.",
            ]]
        }
    }     
    else if(lvl == 3) {
        var data = {
            name: "A review",
            char: "Professor Zelda",
            angB: true,
            velB: true,
            angS: 45,
            velS: 32,
            pages: 1,
            distance: 94,
            text: [[
                "Professor Zelda",
                "If you remember",
                "anything, then this",
                "should be a breeze.",
                "Again just sit back and",
                "watch the show.",
            ]]
        }
    } 
    else if(lvl == 4) {
            var data = {
                name: "Your turn!",
                char: "Professor Zelda",
                angB: false,
                velB: true,
                angS: 45,
                velS: 20,
                pages: 1,
                distance: 72,
                text: [[
                    "Your turn!",
                    "Hey! Why don't you give it a",
                    "whirl? I want you to change the",
                    "velocity to hit the target.",
                    "I did the calculations for you",
                    "this time (sigh).",
                    "I suggest somewhere between",
                    "26 and 30",
                    "I'll let you fine tune it.",
                ]]
            }
    }
    else if(lvl > 5) {
        var data = {
            name: "Free Play",
            char: "Professor Zelda",
            angB: false,
            velB: true,
            angS: 45,
            velS: 20,
            pages: 1,
            distance: Math.floor(Math.random() * 93) + 5,
            text: [[
                "Free play!",
                "You finished the demo levels.",
                "You can just have fun shooting",
                "At random velocities.",
                "Eventually you will have to",
                "solve equations. For now...",
                "you are safe to have fun!",
            ]]
        }
    }
    angBool = data.angB;
    velBool = data.velB;
    angle = data.angS;
    velocity = data.velS;
    winDis = data.distance;
    return data; //can be large, change to global reference?
}

var clearScreen = function() {
    ctx.clearRect(0, 0, width, height);
}

var displayPage = function(currPage, totalPages, pageOn) {
    //displays the page passed in
    //for each line, display
    Horizontal(6, 1);
    var i = 0;
    currPage.forEach(element => {
        //if first item, display as title, else output
        !i ? Text(2, 1, 1, currPage[0], 1) :  Text(2, 4, (i * 5) + 2, element, 1);
        i++;
    });
    if(pageOn < totalPages - 1) Text(2, 85, 58, ">", 1);
    if(pageOn == totalPages - 1) Text(2, 73, 58, "|Enter|", 1)
    if(pageOn > 0) Text(2, 9, 58, "<", 1);
}

var gameMenu = function() {
    ctx.clearRect(0, 49*resSize, width, height);
    if(state == "shooting") {

        //Physics
        curX = (velocity * Math.cos(angle) * time);
        curY = (velocity * Math.sin(angle) * time) - (0.5*(grav*Math.pow(time, 2)));
        PtOn(curX, -curY + 48);
        time += 0.025;
       /*
        curX += 0.2;
        var first = (curX * Math.tan(angle)); 
        var num = grav * Math.pow(curX, 2);
        var scd =  2 * (Math.pow(velocity * Math.cos(angle), 2));
        scd = num / scd;
        curY = first - scd;
        PtOn(curX, -curY + 48);
        console.log(curX + "   " + curY);
        */
        if(-curY + 48 > 48) { //screenbounds
            distance = Math.round(curX);
            console.log(distance);
            state = "check";
        } 
    }
    Rect(0, 47, 1.5, 2);
    PtOff(0, 47.5);

    Rect(winDis -.5, 47, 2, 2);
    PtOff(winDis, 47.5);
    Line(winDis+.5, 47.5, winDis+.5, 42);
    Rect(winDis+.5, 42, 3.5, 2.5);

    Text(2, 0, 59," Equ   Txt   Specs   Help   Quit", 1);
    Text(2, 38.5, 51, "FIRE!", 1);
    Text(2, 2, 51, "Vel: " + velocity, 1);
    Text(2, 61.5, 51, "Ang: " + angle, 1);
    Horizontal(49);
    Horizontal(57);
    Line(16, 57.5, 16, height);
    Line(33.5, 57.5, 33.5, height);
    Line(57, 57.5, 57, height);
    Line(78.5, 57.5, 78.5, height);
    Line(33.5, 56.5, 33.5, 49);
    Line(57, 56.5, 57, 49);
    var vloc = " ";
    var aloc = " ";
    if (!angBool) aloc = "L";
    if (!velBool) vloc = "L";

    switch(gameState) {
        case 1:
            Rect(0, 57, 16, 11);
            Text(2, 0, 59, " Equ", 0);
            break;
        case 2:
            Rect(16, 57, 18, 11);
            Text(2, 20.5, 59, "Txt", 0);
            break;
        case 3:
            Rect(33.5, 57, 23.5, 11);
            Text(2, 38.5, 59, "Specs", 0);
            break;
        case 4:
            Rect(57, 57, 21.5, 11);
            Text(2, 61.5, 59, "Help", 0);
            break;
        case 5:
            Rect(78.5, 57, 18, 11);
            Text(2, 82, 59, "Quit", 0); 
            break;
        case 16:
            Rect(33.5, 49, 23.5, 8);
            Text(2, 38.5, 51, "FIRE!", 0);
            break;
        case 15:
            Rect(0, 49, 34, 8);
            Text(2, 2, 51, "Vel: " + velocity, 0);
            Text(2, 29, 51, vloc, 0);
            break;
        case 17:
            Rect(57, 49, width, 8);
            Text(2, 61.5, 51, "Ang: " + angle, 0);
            Text(2, 92, 51, aloc, 0);
            break;
    }
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    PtOff(15.5, 56.5);
    PtOff(33, 56.5);
    PtOff(56.5, 56.5);
    PtOff(78, 56.5);
    PtOff(33, 48.5);
    PtOff(56.5, 48.5);
}

var checkGame = function() {
    var str = "You missed the target!";
    var st2 = "|Enter|";
    wonBool = false;
    if((curX > winDis - 1) && (curX < winDis + 1)){
        str = "You hit the target!";
        wonBool = true;
    }
    time = 0;
    ctx.clearRect(0, 0, width, 45);
    Text(2, 5, 5, str, 1);
    Text(2, 75, 12, st2, 1);
}

var stateController = function() {
    var controller = setInterval(() => {
        switch(state) {
            case "quit":
                clearInterval(controller);
                break;
            case "menu":
                mainMenu();
                break;
            case "text":
                var textData = lvlData(level);
                pageTotal = textData.pages;
                displayPage(textData.text[pageOn], pageTotal, pageOn);
                break;
            case "shooting":
                gameMenu();
                break;
            case "check":
                checkGame();
                break;
            default:
                break;
        }

    },1000/60); //refresh
}

stateController();