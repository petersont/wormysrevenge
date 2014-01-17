var CANVAS;
var CTX;

var lastEvent;
var heldKeys = {};

var STARTSCREENLOOP_ID = null;
var SELECTINGPLAYERS = false;
var SELECTINGDIFFICULTY = false;
var GAMELOOP_ID = null;
var GAMEOVERLOOP_ID = null;
var GAMEPAUSED = false;

var GAMEFPS = 10;

var WINDOWWIDTH = 640;
var WINDOWHEIGHT = 480;
var CELLSIZE = 20;
var COLUMNS = 32;
var ROWS = 24;
var CELLWIDTH = 20;
var CELLHEIGHT = 20;

var WHITE     = new Color(255, 255, 255);
var BLACK     = new Color(  0,   0,   0);
var RED       = new Color(255,   0,   0);
var GREEN     = new Color(  0, 255,   0);
var BLUE      = new Color(  0,   0, 255);
var LIGHTBLUE = new Color(150, 150, 255);
var DARKGREEN = new Color(  0, 155,   0);
var DARKBLUE  = new Color(  0,   0, 150);
var LIGHTGRAY = new Color(150, 150, 150);
var GRAY      = new Color(100, 100, 100);
var DARKGRAY  = new Color( 40,  40,  40);
var WASHOUT   = new Color(255, 255, 255, 0.4);

var CURRENT_CHOICE = 0;
var PLAYERS = 1;
var DIFFICULTIES = ["Easy","Normal","Difficult","Insane"];
var DIFFICULTIES_FPS = [5,10,20,35];

var UP = 'up';
var DOWN = 'down';
var LEFT = 'left';
var RIGHT = 'right';
var OPPOSITE = {'up':'down', 'right':'left', 'left':'right', 'down':'up'};

var HEAD = 0; // syntactic sugar: index of the worm's head

var WORMS = [];
var APPLES = [];

function init() {
    
    window.onkeydown = key_down;
    window.onkeyup = key_up;
    // window.onmousemove = mouse_move;

    CANVAS = document.getElementById("canvas");
    
    if( CANVAS.getContext ) {
        
        CTX = CANVAS.getContext("2d");

        CANVAS.width = window.innerWidth;
        CANVAS.height = window.innerHeight;

        COLUMNS = Math.floor(CANVAS.width/CELLSIZE);
        ROWS = Math.floor(CANVAS.height/CELLSIZE);
        CELLWIDTH = CANVAS.width/COLUMNS;
        CELLHEIGHT = CANVAS.height/ROWS;
        
        loadGame();
    }
}

function clearScreen() {
    CTX.clearRect(0,0,CANVAS.width,CANVAS.height);
}

function loadGame() {
    cancelAnimationFrame(GAMELOOP_ID);
    cancelAnimationFrame(STARTSCREENLOOP_ID);
    cancelAnimationFrame(GAMELOOP_ID);
    GAMELOOP_ID = null;
    SELECTINGPLAYERS = false;
    SELECTINGDIFFICULTY = false;
    GAMEOVERLOOP_ID = null;
    CURRENT_CHOICE = 0;
    STARTSCREENLOOP_ID = requestAnimationFrame(startScreenLoop);
}

function startScreenLoop(t) {
    STARTSCREENLOOP_ID = requestAnimationFrame(startScreenLoop);

    clearScreen();

    /***** draw the title text *****/
    var angle1 = -0.25 * (2*Math.PI*t/1000);
    var angle2 = -0.15 * (2*Math.PI*t/1000);

    CTX.save();
    
    CTX.textAlign = "center";
    CTX.textBaseline = "middle";
    CTX.font = "80px Arial";
    CTX.translate(CANVAS.width/2, CANVAS.height/2);

    CTX.save();
    var w = CTX.measureText("Revenge").width;
    var h = 80;
    var coords = [{'x': -0.5*w*Math.cos(angle2)-0.5*h*Math.sin(angle2), 'y': 0.5*w*Math.sin(angle2)-0.5*h*Math.cos(angle2)},
                  {'x':  0.5*w*Math.cos(angle2)-0.5*h*Math.sin(angle2), 'y':-0.5*w*Math.sin(angle2)-0.5*h*Math.cos(angle2)},
                  {'x': -0.5*w*Math.cos(angle2)+0.5*h*Math.sin(angle2), 'y': 0.5*w*Math.sin(angle2)+0.5*h*Math.cos(angle2)},
                  {'x':  0.5*w*Math.cos(angle2)+0.5*h*Math.sin(angle2), 'y':-0.5*w*Math.sin(angle2)+0.5*h*Math.cos(angle2)}];
    var x = Math.min(coords[0].x,coords[1].x,coords[2].x,coords[3].x);
    var y = Math.min(coords[0].y,coords[1].y,coords[2].y,coords[3].y);
    CTX.fillStyle = DARKBLUE.hex();
    CTX.fillRect(x,y,-2*x,-2*y);
    CTX.restore();

    CTX.save();
    CTX.fillStyle = BLACK.hex();
    CTX.rotate(angle2);
    CTX.fillText("Revenge", 0,0);
    CTX.restore();
    
    CTX.save();
    CTX.fillStyle = LIGHTBLUE.hex();
    CTX.rotate(angle1);
    CTX.fillText("Wormy's", 0,0);
    CTX.restore();
    
    CTX.fillStyle = GRAY.hex();
    CTX.font = (20*Math.sin(Math.PI*t/1000)+40)+"px Arial";
    CTX.fillText("Online!", 0,200);

    CTX.restore();

    /***** end draw title text *****/

    /***** draw cue text *****/
    CTX.save();

    CTX.font = "40px Arial";
    CTX.fillStyle = GRAY.hex();
    CTX.textAlign = "end";
    CTX.textBaseline = "bottom";
    CTX.fillText("Press a key to play...", CANVAS.width-10, CANVAS.height-10);    

    CTX.restore();
    /***** end draw cue text *****/

}

function selectPlayers() {

    SELECTINGPLAYERS = true;
    clearScreen();

    CTX.save();

    CTX.textAlign = "center";
    CTX.textBaseline = "middle";
    CTX.lineWidth = 10;
    CTX.translate(CANVAS.width/2, CANVAS.height/2);

    // first button
    CTX.save();
    CTX.translate(0,-30);
    if( CURRENT_CHOICE == 0 ) {
        CTX.strokeStyle = WHITE.hex();
        CTX.strokeRect(-75,-20,150,40);
    }
    CTX.fillStyle = LIGHTGRAY.hex();
    CTX.fillRect(-75,-20,150,40);

    CTX.fillStyle = BLACK.hex();
    CTX.font = "bold 30px Arial";
    CTX.fillText("1 Player",0,0);
    CTX.restore();

    // second button
    CTX.save();
    CTX.translate(0,30);
    if( CURRENT_CHOICE == 1 ) {
        CTX.strokeStyle = WHITE.hex();
        CTX.strokeRect(-75,-20,150,40);
    }
    CTX.fillStyle = LIGHTGRAY.hex();
    CTX.fillRect(-75,-20,150,40);

    CTX.fillStyle = BLACK.hex();
    CTX.font = "bold 30px Arial";
    CTX.fillText("2 Players",0,0);
    CTX.restore();

    CTX.restore();

}

function selectDifficulty() {

    SELECTINGDIFFICULTY = true;
    clearScreen();
    
    CTX.save();
    
    CTX.textAlign = "center";
    CTX.textBaseline = "middle";
    CTX.lineWidth = 10;
    CTX.translate(CANVAS.width/2, CANVAS.height/2);
    
    for( var i=0; i<DIFFICULTIES.length; i++ ) {
        CTX.save();
        CTX.translate(0,60*i-90);
        if( CURRENT_CHOICE == i ) {
            CTX.strokeStyle = WHITE.hex();
            CTX.strokeRect(-75,-20,150,40);
        }
        CTX.fillStyle = LIGHTGRAY.hex();
        CTX.fillRect(-75,-20,150,40);
        
        CTX.fillStyle = BLACK.hex();
        CTX.font = "bold 30px Arial";
        CTX.fillText(DIFFICULTIES[i],0,0);
        CTX.restore();
    }

    CTX.restore();

}

function playGame() {

    GAMEPAUSED = false;
    WORMS = [];
    APPLES = [];

    var worm1 = new Worm(COLUMNS-4, Math.floor((ROWS-1)/2), LEFT, BLUE);
    worm1.controls = {37:LEFT, 38:UP, 39:RIGHT, 40:DOWN};
    worm1.scoreLocation = {'x':CANVAS.width - 60, 'y':25};

    var worm2 = new Worm(3, Math.floor((ROWS-1)/2), RIGHT, GREEN);
    worm2.controls = {65:LEFT, 87:UP, 68:RIGHT, 83:DOWN};
    worm2.scoreLocation = {'x':60, 'y':25};    

    if( PLAYERS == 2 )
        WORMS = [worm1,worm2];
    else
        WORMS = [worm1];
    
    //Start the apple in a random place.
    for( var a=0; a<3; a++ ) {
        APPLES.push(randomLocation());
    }

    GAMELOOP_ID = requestAnimationInterval(gameLoop,1000/GAMEFPS);

}

function gameLoop(t) {
            
    var eatenApples = [];
    
    for( var w=0; w<WORMS.length; w++ ) {
        
        WORMS[w].advanceDirection();
        
        if( WORMS[w].hasHitBounds() ) {
            WORMS[w].lost = true;
        }
        
        for( var other=0; other<WORMS.length; other++ )
            if( WORMS[w].hasEaten(WORMS[other]) )
                WORMS[w].lost = true;
        
        // check if worm has eaten an apple
        for( var a=0; a<APPLES.length; a++ ) {
            if( WORMS[w].hasEatenApple(APPLES[a]) ) {
                WORMS[w].length += 3;
                WORMS[w].score += 1;
                newApple(a);
            }
        }
    }
    
    var gameover = false;
    for( var w=0; w<WORMS.length; w++ )
        if( WORMS[w].lost )
            gameover = true;
    if( gameover ) {
        cancelAnimationInterval(GAMELOOP_ID);
        GAMELOOP_ID = null;
        gameOver();
        return;
    }
    
    for( var w=0; w<WORMS.length; w++ ) {
        if( !WORMS[w].lost )
            WORMS[w].advanceHead();
    }

    drawWorld();
        
}

function drawWorld() {
    drawGrid();
    
    for(var a=0; a<APPLES.length; a++ ) {
        drawApple(APPLES[a]);
    }
    
    for( var w=0; w<WORMS.length; w++ ) {
        WORMS[w].draw();
    }
    
    for( var w=0; w<WORMS.length; w++ ) {
        WORMS[w].drawScore();
    }
}

function gameOver() {
    GAMEOVER = true;

    clearScreen();
    drawWorld();

    var winner = "", color;
    if( PLAYERS == 2 ) {
        if( WORMS[0].lost && WORMS[1].lost ) {
            winner = "Tie game!";
            color = new Color(WHITE);
        } else if( WORMS[0].lost ) {
            winner = "Worm 2 wins!";
            color = new Color(WORMS[1].color);
        } else if( WORMS[1].lost ) {
            winner = "Worm 1 wins!";
            color = new Color(WORMS[0].color);
        }
    } else if( PLAYERS == 1 ) {
        winner = "Score: "+WORMS[0].score;
        color = WHITE;
    }

    CTX.save();

    CTX.fillStyle = WASHOUT.rgba();
    CTX.fillRect(0,0,CANVAS.width,CANVAS.height);

    CTX.translate(0.5*CANVAS.width,0.5*CANVAS.height);
    CTX.font = "bold 60px Arial";
    CTX.textAlign = "center";
    CTX.textBaseline = "middle";
    CTX.fillStyle = BLACK.hex();
    CTX.fillText("GAME OVER",0,-70);    

    CTX.font = "bold 40px Arial";
    CTX.fillStyle = color.hex();
    CTX.strokeStyle = BLACK.hex();
    CTX.strokeWidth = 2;
    CTX.fillText(winner,0,-25);    
    CTX.strokeText(winner,0,-25);

    CTX.lineWidth = 10;
    var choices = ["Retry","Exit"];
    for( var i=0; i<choices.length; i++ ) {
        CTX.save();
        CTX.translate(0,60*i+30);
        if( CURRENT_CHOICE == i ) {
            CTX.strokeStyle = WHITE.hex();
            CTX.strokeRect(-85,-20,170,40);
        }
        CTX.fillStyle = LIGHTGRAY.hex();
        CTX.fillRect(-85,-20,170,40);
        
        CTX.fillStyle = BLACK.hex();
        CTX.font = "bold 30px Arial";
        CTX.fillText(choices[i],0,0);
        CTX.restore();
    }

    CTX.restore();
    
}

function drawGrid() {

    clearScreen();

    CTX.save();

    CTX.lineWidth = "2";
    CTX.strokeStyle = DARKGRAY.hex();

    // draw vertical lines
    for(var i=0; i<=COLUMNS; i++ ) {
        CTX.beginPath();
        CTX.moveTo(i*CELLWIDTH,0);
        CTX.lineTo(i*CELLWIDTH,CELLHEIGHT*ROWS);
        CTX.stroke();
    }
    
    // draw horizontal lines
    for(var i=0; i<=ROWS; i++ ) {
        CTX.beginPath();
        CTX.moveTo(0,i*CELLHEIGHT);
        CTX.lineTo(CELLWIDTH*COLUMNS,i*CELLHEIGHT);
        CTX.stroke();
    }
    
    CTX.restore();
    
}

function drawApple(coord) {

    var x = coord['x'] * CELLWIDTH;
    var y = coord['y'] * CELLHEIGHT;

    CTX.save();

    CTX.fillStyle = RED.hex();
    CTX.fillRect(x,y,CELLWIDTH,CELLHEIGHT);

    CTX.restore();

}

function newApple(index) {
    APPLES[index] = randomLocation();
}

function drawPaused() {

    clearScreen();
    drawWorld();
    
    CTX.save();

    CTX.fillStyle = WASHOUT.rgba();
    CTX.fillRect(0,0,CANVAS.width,CANVAS.height);

    CTX.translate(0.5*CANVAS.width,0.5*CANVAS.height);
    CTX.font = "bold 50px Arial";
    CTX.textAlign = "center";
    CTX.textBaseline = "middle";
    CTX.fillStyle = BLACK.hex();
    CTX.fillText("PAUSED", 0,-50);    
    CTX.lineWidth = 10;

    var paused_choices = ["Resume","New Game","Exit"];
    for( var i=0; i<paused_choices.length; i++ ) {
        CTX.save();
        CTX.translate(0,60*i+10);
        if( CURRENT_CHOICE == i ) {
            CTX.strokeStyle = WHITE.hex();
            CTX.strokeRect(-85,-20,170,40);
        }
        CTX.fillStyle = LIGHTGRAY.hex();
        CTX.fillRect(-85,-20,170,40);
        
        CTX.fillStyle = BLACK.hex();
        CTX.font = "bold 30px Arial";
        CTX.fillText(paused_choices[i],0,0);
        CTX.restore();
    }

    CTX.restore();

}

function randomLocation() {
    return {'x': Math.floor(Math.random()*COLUMNS), 'y': Math.floor(Math.random()*ROWS)};
}

function key_down(event) {
    
    if (lastEvent && lastEvent.which == event.which) {
        return;
    }
    lastEvent = event;
    heldKeys[event.which] = true;

    // if we're in the start screen
    if( STARTSCREENLOOP_ID != null ) {

        // we don't want actual command keys actually starting the game
        switch( event.which ) {
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
        case 37: // left
        case 38: // up
        case 39: // right
        case 40: // down
            return;
        }

        cancelAnimationFrame(STARTSCREENLOOP_ID);
        STARTSCREENLOOP_ID = null;
        selectPlayers();
        //playGame();

    // if we're selecting the number of players
    } else if( SELECTINGPLAYERS ) {

        switch(event.which) {
        case 37: // left
        case 38: // up
            CURRENT_CHOICE = Math.max(CURRENT_CHOICE-1,0);
            selectPlayers();
            break;
        case 39: // right
        case 40: // down
            CURRENT_CHOICE = Math.min(CURRENT_CHOICE+1,1);
            selectPlayers();
            break;
        case 13: // enter
            SELECTINGPLAYERS = false;
            PLAYERS = CURRENT_CHOICE+1;
            CURRENT_CHOICE = 1;
            selectDifficulty();
            break;
        }

    // if we're selecting the difficulty
    } else if( SELECTINGDIFFICULTY ) {

        switch(event.which) {
        case 37: // left
        case 38: // up
            CURRENT_CHOICE = Math.max(CURRENT_CHOICE-1,0);
            selectDifficulty();
            break;
        case 39: // right
        case 40: // down
            CURRENT_CHOICE = Math.min(CURRENT_CHOICE+1,3);
            selectDifficulty();
            break;
        case 32: // space
        case 13: // enter
            SELECTINGDIFFICULTY = false;
            GAMEFPS = DIFFICULTIES_FPS[CURRENT_CHOICE];
            CURRENT_CHOICE = 0;
            playGame();
            break;
        }

    // if we're currently playing the game
    } else if( GAMELOOP_ID != null ) {
        
        switch(event.which) {
        case 32: // spacebar
            if( !GAMEPAUSED ) {
                GAMEPAUSED = true;
                cancelAnimationInterval(GAMELOOP_ID);
                CURRENT_CHOICE = 0;
                drawPaused();
                return;
            }
        }
        
        // accept no input if the game is paused
        if( GAMEPAUSED ) {
            switch(event.which) {
            case 37: // left
            case 38: // up
                CURRENT_CHOICE = Math.max(CURRENT_CHOICE-1,0);
                break;
            case 39: // right
            case 40: // down
                CURRENT_CHOICE = Math.min(CURRENT_CHOICE+1,2);
                break;
            case 13: // enter
                GAMEPAUSED = false;
                switch( CURRENT_CHOICE ) {
                case 0: // resume
                    GAMELOOP_ID = requestAnimationInterval(gameLoop,1000/GAMEFPS);
                    break;
                case 1: // new game
                    playGame();
                    break;
                case 2: // exit
                    loadGame();
                    break;
                }
                return;
            }
            drawPaused();
            return; 
        }
        
        for( var w=0; w<WORMS.length; w++ ) {
            WORMS[w].processEvent(event);
        }
        
    // if the game is over
    } else if( GAMEOVER ) {

        switch(event.which) {
        case 37: // left
        case 38: // up
            CURRENT_CHOICE = Math.max(CURRENT_CHOICE-1,0);
            break;
        case 39: // right
        case 40: // down
            CURRENT_CHOICE = Math.min(CURRENT_CHOICE+1,2);
            break;
        case 13: // enter
            GAMEOVER = false;
            switch( CURRENT_CHOICE ) {
            case 0: // retry
                playGame();
                break;
            case 1: // exit
                loadGame();
                break;
            }
            return;
        }
        
        gameOver();
        return; 
        
    }
    
}

function key_up() {
    lastEvent = null;
    delete(heldKeys[event.keyCode]);
}

// requestAnimationFrame and cancelAnimationFrame polyfill by Erik Möller
// see: http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var v = 0; v < vendors.length && !window.requestAnimationFrame; v++) {
        window.requestAnimationFrame = window[vendors[v]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[v]+'CancelAnimationFrame'] || window[vendors[v]+'CancelRequestAnimationFrame'];
    }
    
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                                       timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };

    window.requestAnimationInterval = function(fn,ms) {
        
        var tick = -1000.0;
        var handle = {};
        
        var callback;
        callback = function(t) {
            handle.value = requestAnimationFrame(callback);            
            if( t-tick > ms ) {
                while( tick < t-ms )
                    tick += ms;
                fn(t);
            }            
        };
        
        handle.value = requestAnimationFrame(callback);
        
        return handle;
        
    };
    
    window.cancelAnimationInterval = function(handle) {
        cancelAnimationFrame(handle.value);        
    };
    
}());
