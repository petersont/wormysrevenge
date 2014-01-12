var CANVAS;
var CONTEXT;

var lastEvent;
var heldKeys = {};

var STARTSCREENLOOP_ID = NaN;
var GAMELOOP_ID = NaN;
var GAMEPAUSED = false;
var GAMEFPS = 10;
//var OPENINGFPS = 30;
var TICK = null;

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
var GRAY      = new Color(100, 100, 100);
var DARKGRAY  = new Color( 40,  40,  40);
var WASHOUT   = new Color(255, 255, 255, 0.5);

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

    CANVAS = document.getElementById("canvas");
    
    if( CANVAS.getContext ) {
        
        CONTEXT = CANVAS.getContext("2d");

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
    CONTEXT.clearRect(0,0,CANVAS.width,CANVAS.height);
}

function loadGame() {
    cancelAnimationFrame(GAMELOOP_ID);
    GAMELOOP_ID = NaN;
    STARTSCREENLOOP_ID = requestAnimationFrame(startScreenLoop);
}

function startScreenLoop(t) {
    STARTSCREENLOOP_ID = requestAnimationFrame(startScreenLoop);

    clearScreen();

    /***** draw the title text *****/
    var angle1 = 0.25 * (2*Math.PI*t/1000);
    var angle2 = 0.15 * (2*Math.PI*t/1000);

    CONTEXT.save();
    
    CONTEXT.font = "80px Arial";
    CONTEXT.textAlign = "center";
    CONTEXT.textBaseline = "middle";
    CONTEXT.translate(CANVAS.width/2, CANVAS.height/2);
    
    CONTEXT.save();
    CONTEXT.fillStyle = LIGHTBLUE.hex();
    CONTEXT.rotate(angle1);
    CONTEXT.fillText("Wormy Online!", 0,0);
    CONTEXT.restore();
    
    CONTEXT.save();
    CONTEXT.fillStyle = DARKBLUE.hex();
    CONTEXT.rotate(angle2);
    CONTEXT.fillText("Wormy Online!", 0,0);
    CONTEXT.restore();
    
    CONTEXT.restore();
    /***** end draw title text *****/

    /***** draw cue text *****/
    CONTEXT.save();

    CONTEXT.font = "40px Arial";
    CONTEXT.fillStyle = GRAY.hex();
    CONTEXT.textAlign = "end";
    CONTEXT.textBaseline = "bottom";
    CONTEXT.fillText("Press a key to play...", CANVAS.width-10, CANVAS.height-10);    

    CONTEXT.restore();
    /***** end draw cue text *****/

}

function playGame() {

    GAMEPAUSED = false;
    WORMS = [];
    APPLES = [];

    var worm1 = new Worm(3, Math.floor((ROWS - 1) / 2), RIGHT);
    worm1.controls = {65:LEFT, 87:UP, 68:RIGHT, 83:DOWN};
    worm1.scoreLocation = {'x':60, 'y':25};
    
    var worm2 = new Worm(COLUMNS - 4, Math.floor((ROWS - 1) / 2), LEFT, BLUE);
    worm2.controls = {37:LEFT, 38:UP, 39:RIGHT, 40:DOWN};
    worm2.scoreLocation = {'x':CANVAS.width - 60, 'y':25};
    
    WORMS = [worm2];
    
    //Start the apple in a random place.
    for( var a=0; a<3; a++ ) {
        APPLES.push(randomLocation());
    }

    GAMELOOP_ID = requestAnimationFrame(gameLoop);

}

function gameLoop(t) {

    GAMELOOP_ID = requestAnimationFrame(gameLoop);

    // the TICK business handles setting the specific FPS
    if( !TICK || t-TICK > 1000/GAMEFPS ) {
        
        TICK = TICK || t;
        while( TICK < t-1000 / GAMEFPS )
            TICK += 1000 / GAMEFPS;
            
        // allEvents = pygame.event.get()
        
        // for event in allEvents:
        //     if event.type == QUIT or (event.type == KEYDOWN and event.key == K_ESCAPE):
        //         terminate()
        
        // eatenApples = []
        
        for( var w=0; w<WORMS.length; w++ ) {
            //     for event in allEvents: # event handling loop
            //         if event.type == KEYDOWN:
            //             worm.processEvent(event)
            
            WORMS[w].advanceDirection()
            
            //     if worm.hasHitBounds():
            //         worm.lost = True
            
            //     for opponent in allWorms:
            //         if worm.hasEaten(opponent):
            //             worm.lost = True
            
            //     # check if worm has eaten an apple
            //     for apple in apples:
            //         if worm.hasEatenApple(apple):
            //             worm.length += 3
            //             worm.score += 1
            //             eatenApples.append(apple)
        }
        
        // gameover = False
        // for worm in allWorms:
        //     if worm.lost:
        //         gameover = True
        // if gameover:
        //     break
        
        for( var w=0; w<WORMS.length; w++ ) {
            if( !WORMS[w].lost )
                WORMS[w].advanceHead();
        }
        
        // newApples = []
        // for apple in apples:
        //     if apple in eatenApples:
        //         newApples.append(randomLocation())
        //     else:
        //         newApples.append(apple)
        // apples = newApples
        
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
        //     pygame.display.update()
        //     FPSCLOCK.tick(GAMEFPS)
        
        // if worm1.lost and worm2.lost:
        //     return "Cat's game", WHITE
        
        // if worm1.lost:
        //     return 'Worm 2 wins', worm2.color
        
        // if worm2.lost:
        //     return 'Worm 1 wins', worm1.color
    }

}

function drawGrid() {

    clearScreen();

    CONTEXT.save();

    CONTEXT.lineWidth = "2";
    CONTEXT.strokeStyle = DARKGRAY.hex();

    // draw vertical lines
    for(var i=0; i<=COLUMNS; i++ ) {
        CONTEXT.beginPath();
        CONTEXT.moveTo(i*CELLWIDTH,0);
        CONTEXT.lineTo(i*CELLWIDTH,CELLHEIGHT*ROWS);
        CONTEXT.stroke();
    }
    
    // draw horizontal lines
    for(var i=0; i<=ROWS; i++ ) {
        CONTEXT.beginPath();
        CONTEXT.moveTo(0,i*CELLHEIGHT);
        CONTEXT.lineTo(CELLWIDTH*COLUMNS,i*CELLHEIGHT);
        CONTEXT.stroke();
    }
    
    CONTEXT.restore();
    
}

function drawApple(coord) {

    var x = coord['x'] * CELLWIDTH;
    var y = coord['y'] * CELLHEIGHT;

    CONTEXT.save();

    CONTEXT.fillStyle = RED.hex();
    CONTEXT.fillRect(x,y,CELLWIDTH,CELLHEIGHT);

    CONTEXT.restore();

}

function drawPaused() {
    
    CONTEXT.save();

    CONTEXT.fillStyle = WASHOUT.rgba();
    CONTEXT.fillRect(0,0,CANVAS.width,CANVAS.height);

    CONTEXT.font = "bold 80px Arial";
    CONTEXT.textAlign = "center";
    CONTEXT.textBaseline = "middle";
    CONTEXT.fillStyle = WHITE.hex();
    CONTEXT.fillText("PAUSED", 0.5*CANVAS.width,0.5*CANVAS.height);    

    CONTEXT.restore();

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
    if( !isNaN(STARTSCREENLOOP_ID) ) {

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
        STARTSCREENLOOP_ID = NaN;
        playGame();

    // if we're currently playing the game
    } else if( !isNaN(GAMELOOP_ID) ) {
        
        var code = event.which;
    
        switch(code) {
        case 32: // spacebar
            GAMEPAUSED = !GAMEPAUSED;
            if( GAMEPAUSED ) {
                cancelAnimationFrame(GAMELOOP_ID);
                drawPaused();
            } else {
                gameLoop(0);
            }
            return;
        case 27:
            loadGame();
            return;
        }

        for( var w=0; w<WORMS.length; w++ ) {
            WORMS[w].processEvent(event);
        }
        
    }
    
}

function key_up() {
    lastEvent = null;
    delete(heldKeys[event.keyCode]);
}

// the animation timer
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

}());
