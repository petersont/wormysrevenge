var CANVAS;
var CONTEXT;

var STARTSCREENLOOP_ID = NaN;
var GAMELOOP_ID = NaN;

var GAMEPAUSED = 0;

var GAMEFPS = 10;
var OPENINGFPS = 30;
var WINDOWWIDTH = 640;
var WINDOWHEIGHT = 480;
var CELLSIZE = 20;
var COLUMNS = 32;
var ROWS = 24;
var CELLWIDTH = 20;
var CELLHEIGHT = 20;

var WHITE     =  "rgb(255, 255, 255)";
var BLACK     =  "rgb(  0,   0,   0)";
var RED       =  "rgb(255,   0,   0)";
var GREEN     =  "rgb(  0, 255,   0)";
var BLUE      =  "rgb(  0,   0, 255)";
var LIGHTBLUE =  "rgb(150, 150, 255)";
var DARKGREEN =  "rgb(  0, 155,   0)";
var DARKBLUE  =  "rgb(  0,   0, 150)";
var GRAY      =  "rgb(100, 100, 100)";
var DARKGRAY  =  "rgb( 40,  40,  40)";
var WASHOUT   = "rgba(255, 255, 255, 0.25)";
var BGCOLOR   = BLACK;

var UP = 'up';
var DOWN = 'down';
var LEFT = 'left';
var RIGHT = 'right';
var OPPOSITE = {UP:DOWN, RIGHT:LEFT, LEFT:RIGHT, DOWN:UP};

var HEAD = 0; // syntactic sugar: index of the worm's head

function init() {
    
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
    startScreenLoop(0);
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
    CONTEXT.fillStyle = "#029";
    CONTEXT.rotate(angle1);
    CONTEXT.fillText("Wormy Online!", 0,0);
    CONTEXT.restore();
    
    CONTEXT.save();
    CONTEXT.fillStyle = "#08f";
    CONTEXT.rotate(angle2);
    CONTEXT.fillText("Wormy Online!", 0,0);
    CONTEXT.restore();
    
    CONTEXT.restore();
    /***** end draw title text *****/


    /***** draw cue text *****/
    CONTEXT.save();

    CONTEXT.font = "40px Arial";
    CONTEXT.fillStyle = "#aaa";
    CONTEXT.textAlign = "end";
    CONTEXT.textBaseline = "bottom";
    CONTEXT.fillText("Press a key to play...", CANVAS.width-10, CANVAS.height-10);    

    CONTEXT.restore();
    /***** end draw cue text *****/

}

function playGame() {

    // worm1 = Worm(4, int((CELLHEIGHT - 1) / 2), RIGHT)
    // worm1.controls = {K_a:LEFT, K_w:UP, K_s:DOWN, K_d:RIGHT}
    // worm1.color = LIGHTBLUE
    // worm1.scoreLocation = (80, 10)
    
    // worm2 = Worm(CELLWIDTH - 4, int((CELLHEIGHT - 1) / 2), LEFT)
    // worm2.controls = {K_LEFT:LEFT, K_UP:UP, K_DOWN:DOWN, K_RIGHT:RIGHT}
    // worm2.color = GREEN
    // worm2.scoreLocation = (CANVAS.width - 120, 10)
    
    // allWorms = [worm1, worm2]
    
    // # Start the apple in a random place.
    // apples = [getRandomLocation(), getRandomLocation(), getRandomLocation()]
    
    gameLoop(0);
}

function gameLoop(t) {
    GAMELOOP_ID = requestAnimationFrame(gameLoop);

        // allEvents = pygame.event.get()
        
        // for event in allEvents:
        //     if event.type == QUIT or (event.type == KEYDOWN and event.key == K_ESCAPE):
        //         terminate()
        
        // eatenApples = []
        
        // for worm in allWorms:
        //     for event in allEvents: # event handling loop
        //         if event.type == KEYDOWN:
        //             worm.processEvent(event)
            
        //     worm.advanceDirection()
            
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
        
        // gameover = False
        // for worm in allWorms:
        //     if worm.lost:
        //         gameover = True
        // if gameover:
        //     break
        
        // for worm in allWorms:
        //     if not worm.lost:
        //         worm.advanceHead()
        
        // newApples = []
        // for apple in apples:
        //     if apple in eatenApples:
        //         newApples.append(getRandomLocation())
        //     else:
        //         newApples.append(apple)
        // apples = newApples
        
    drawGrid();
        
    //     for worm in allWorms:
    //         worm.draw()
        
    //     for apple in apples:
    //         drawApple(apple)
        
    //     for worm in allWorms:
    //         worm.drawScore()
        
    //     pygame.display.update()
    //     FPSCLOCK.tick(GAMEFPS)
    
    // if worm1.lost and worm2.lost:
    //     return "Cat's game", WHITE
    
    // if worm1.lost:
    //     return 'Worm 2 wins', worm2.color
    
    // if worm2.lost:
    //     return 'Worm 1 wins', worm1.color

}

function drawGrid() {

    clearScreen();

    CONTEXT.save();

    CONTEXT.lineWidth = "2";
    CONTEXT.strokeStyle = DARKGRAY;

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

function drawPaused() {
    
    CONTEXT.save();

    CONTEXT.fillStyle = WASHOUT;
    CONTEXT.fillRect(0,0,CANVAS.width,CANVAS.height);

    CONTEXT.font = "bold 80px Arial";
    CONTEXT.textAlign = "center";
    CONTEXT.textBaseline = "middle";
    CONTEXT.fillStyle = WHITE;
    CONTEXT.fillText("PAUSED", 0.5*CANVAS.width,0.5*CANVAS.height);    

    CONTEXT.restore();

}

function mouse_down(event) {
    
}

function mouse_up(event) {
    
}

function mouse_move(event) {
    
}

function mouse_click(event) {
    
}

function key_press(event) {
    
    // if we're in the start screen
    if( !isNaN(STARTSCREENLOOP_ID) ) {

        cancelAnimationFrame(STARTSCREENLOOP_ID);
        STARTSCREENLOOP_ID = NaN;
        playGame();

    // if we're currently playing the game
    } else if( !isNaN(GAMELOOP_ID) ) {
        
        var code = event.keyCode || event.which;
    
        switch(code) {
        case 112:
            if( !GAMEPAUSED ) {
                GAMEPAUSED = 1;
                cancelAnimationFrame(GAMELOOP_ID);
                drawPaused();
            } else {
                GAMEPAUSED = 0;
                gameLoop(0);
            }
            break;
        }
    }
    
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
