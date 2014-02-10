var CANVAS;
var CTX;

var lastEvent;
var heldKeys = {};

var LOOP_ID = null;
var GAME_STATE = null;
var GAME_REF = null;

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

var CURRENT_CHOICE = null;
var START_INDEX = null;
var MAX_INDEX = null;
var MY_INDEX = null;

var MODE = null;

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

var LOBBY_LIST;

// Firebase callbacks
var LOBBY_ADDED;
var LOBBY_REMOVED;

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

        GAME_STATE = 'title';
        titleScreen();
    }
}

function clearScreen() {
    CTX.clearRect(0,0,CANVAS.width,CANVAS.height);
}

function titleScreen() {
    GAME_STATE = 'title';
    LOOP_ID = requestAnimationFrame(titleScreenLoop);
}

function titleScreenLoop(t) {
    LOOP_ID = requestAnimationFrame(titleScreenLoop);

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

    clearScreen();
    drawChoices(["Single Player","Join Game","Create Lobby"],220,40,20);

}

function selectDifficulty() {

    clearScreen();
    drawChoices(["Easy","Normal","Difficult","Insane"],150,40,20);
    
}

function playGame() {

    initializeWorld();
    LOOP_ID = requestAnimationInterval(gameLoop,1000/GAMEFPS);

}

function initializeWorld() {

    WORMS = [];

    WORMS.push(new Worm(COLUMNS-4, Math.floor((ROWS-1)/2), LEFT, BLUE));
    WORMS[0].controls = {37:LEFT, 38:UP, 39:RIGHT, 40:DOWN};
    WORMS[0].scoreLocation = {'x':CANVAS.width - 60, 'y':25};
    
    if( MODE == 'single' ) {

        // on average, 3 apples per 25x25 square
        var n_apples = Math.floor(3/625*ROWS*COLUMNS);
        APPLES = [];
        for( var a=0; a<n_apples; a++ ) {
            APPLES.push(new Apple());
        }

    } else if( MODE == 'multi' ) {

        WORMS.push(new Worm(3, Math.floor((ROWS-1)/2), RIGHT, GREEN));
        WORMS[1].controls = {37:LEFT, 38:UP, 39:RIGHT, 40:DOWN};
        WORMS[1].scoreLocation = {'x':60, 'y':25};

    }
    
}

function drawStarting(countdown) {

    console.log('in drawStarting('+countdown+')');

    if( countdown > 0 ) {
        setTimeout(function(){drawStarting(countdown-1);},1000)
    } else if( countdown == 0 ) {

        // listen to the other player
        var other_index = (MY_INDEX+1)%2;
        GAME_REF.child('player'+other_index)
            .on('value',
                function(snap) {
                    var data = snap.val();
                    for( var i=0; i<data.coords.length; i++ ) {
                        WORMS[other_index].coords[i] = data.coords[i];
                    }
                    WORMS[other_index].lost = data.lost;
                    WORMS[other_index].score = data.score;
                });

        // listen to the apples (how 'bout 'em?)
        GAME_REF.child('apples')
            .on('value',
                function(snap) {
                    var data = snap.val();
                    for( var a=0; a<data.length; a++ ) {
                        APPLES[a].coords = {'x':data[a].x,'y':data[a].y};
                        APPLES[a].born = data[a].born;
                        APPLES[a].lifespan = data[a].lifespan;
                    }
                });

        GAME_STATE = 'playing';
        LOOP_ID = requestAnimationInterval(gameLoop,1000/GAMEFPS);

        return;

    }

    clearScreen();

    drawWorld();

    CTX.save();

    CTX.fillStyle = WASHOUT.rgba();
    CTX.fillRect(0,0,CANVAS.width,CANVAS.height);

    CTX.font = 'bold 30px Arial';
    CTX.textAlign = 'center';
    CTX.textBaseline = 'middle';
    CTX.fillStyle = BLACK.hex();
    CTX.fillText('Starting in '+countdown+'...',0.5*CANVAS.width,0.5*CANVAS.height-20);

    CTX.textAlign = 'start';
    if( MODE == 'multi' ) {
        if( MY_INDEX == 0 ) {
            var lineWidth = CTX.measureText('You are the blue worm!').width;
            var w1 = CTX.measureText('You are the ').width;
            var w2 = CTX.measureText('blue').width;
            CTX.fillStyle = WHITE.hex();
            CTX.fillText('You are the ',0.5*CANVAS.width-0.5*lineWidth,0.5*CANVAS.height+20);
            CTX.fillStyle = BLUE.hex();
            CTX.fillText('blue',0.5*CANVAS.width-0.5*lineWidth+w1,0.5*CANVAS.height+20);
            CTX.fillStyle = WHITE.hex();
            CTX.fillText(' worm!',0.5*CANVAS.width-0.5*lineWidth+w1+w2,0.5*CANVAS.height+20);
        } else if( MY_INDEX == 1 ) {
            var lineWidth = CTX.measureText('You are the green worm!').width;
            var w1 = CTX.measureText('You are the ').width;
            var w2 = CTX.measureText('green').width;
            CTX.fillStyle = WHITE.hex();
            CTX.fillText('You are the ',0.5*CANVAS.width-0.5*lineWidth,0.5*CANVAS.height+20);
            CTX.fillStyle = GREEN.hex();
            CTX.fillText('green',0.5*CANVAS.width-0.5*lineWidth+w1,0.5*CANVAS.height+20);
            CTX.fillStyle = WHITE.hex();
            CTX.fillText(' worm!',0.5*CANVAS.width-0.5*lineWidth+w1+w2,0.5*CANVAS.height+20);
        }
    }

    CTX.restore();

}

function gameLoop(t) {
            
    var eatenApples = [];
    
    // check if any of the apples have died yet
    var current_time = new Date().getTime();
    for( var a=0; a<APPLES.length; a++ ) {
        if( current_time-APPLES[a].born > APPLES[a].lifespan ) {
            var old_style = APPLES[a].draw_style;
            APPLES[a] = new Apple();
            APPLES[a].draw_style = old_style;

            if( MODE == 'multi' ) {
                GAME_REF.child('apples/'+a)
                .set({'x':APPLES[a].coords.x,
                      'y':APPLES[a].coords.y,
                      'born':APPLES[a].born,
                      'lifespan':APPLES[a].lifespan});
            }

        }
    }

    if( MODE == 'single' ) {

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
                    var old_style = APPLES[a].draw_style;
                    APPLES[a] = new Apple();
                    APPLES[a].draw_style = old_style;
                }
            }
        }
        
        var gameover = false;
        for( var w=0; w<WORMS.length; w++ )
            if( WORMS[w].lost )
                gameover = true;
        if( gameover ) {
            cancelAnimationInterval(LOOP_ID);
            CURRENT_CHOICE = 0;
            GAME_STATE = 'over';
            gameOver();
            return;
        }
        
        for( var w=0; w<WORMS.length; w++ ) {
            if( !WORMS[w].lost )
                WORMS[w].advanceHead();
        }

    } else if( MODE == 'multi' ) {

        WORMS[MY_INDEX].advanceDirection();
        
        if( WORMS[MY_INDEX].hasHitBounds() ) {
            WORMS[MY_INDEX].lost = true;
        }
        
        for( var other=0; other<WORMS.length; other++ )
            if( WORMS[MY_INDEX].hasEaten(WORMS[other]) )
                WORMS[MY_INDEX].lost = true;
        
        // check if I've eaten an apple
        for( var a=0; a<APPLES.length; a++ ) {
            if( WORMS[MY_INDEX].hasEatenApple(APPLES[a]) ) {
                WORMS[MY_INDEX].length += 3;
                WORMS[MY_INDEX].score += 1;
                var old_style = APPLES[a].draw_style;
                APPLES[a] = new Apple();
                APPLES[a].draw_style = old_style;

                GAME_REF.child('apples/'+a)
                    .set({'x':APPLES[a].coords.x,
                          'y':APPLES[a].coords.y,
                          'born':APPLES[a].born,
                          'lifespan':APPLES[a].lifespan});
            }
        }
        
        GAME_REF.child('player'+MY_INDEX)
            .set({'coords':WORMS[MY_INDEX].coords,
                  'lost':WORMS[MY_INDEX].lost,
                  'score':WORMS[MY_INDEX].score});

        if( !WORMS[MY_INDEX].lost )
            WORMS[MY_INDEX].advanceHead();

        var gameover = false;
        for( var w=0; w<WORMS.length; w++ )
            if( WORMS[w].lost )
                gameover = true;
        if( gameover ) {
            cancelAnimationInterval(LOOP_ID);
            CURRENT_CHOICE = 0;
            GAME_STATE = 'over';
            gameOver();
            return;
        }
                
    }

    drawWorld();
        
}

function drawWorld() {
    drawGrid();
    
    for(var a=0; a<APPLES.length; a++ ) {
        APPLES[a].draw();
    }
    
    for( var w=0; w<WORMS.length; w++ ) {
        WORMS[w].draw();
    }
    
    for( var w=0; w<WORMS.length; w++ ) {
        WORMS[w].drawScore();
    }
}

function gameOver() {

    clearScreen();
    drawWorld();

    var winner = "", color;
    if( MODE == 'multi' ) {
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
    } else if( MODE == 'single' ) {
        winner = "Score: "+WORMS[0].score;
        color = WHITE;
    }

    CTX.save();
    CTX.fillStyle = WASHOUT.rgba();
    CTX.fillRect(0,0,CANVAS.width,CANVAS.height);
    CTX.restore();

    drawChoices(["Play Again","Exit"],180,40,20);
 
    CTX.save();

    CTX.translate(0.5*CANVAS.width,0.5*CANVAS.height);
    CTX.font = "bold 60px Arial";
    CTX.textAlign = "center";
    CTX.textBaseline = "middle";
    CTX.fillStyle = BLACK.hex();
    CTX.fillText("GAME OVER",0,-140);

    CTX.font = "bold 40px Arial";
    CTX.fillStyle = color.hex();
    CTX.strokeStyle = BLACK.hex();
    CTX.strokeWidth = 2;
    CTX.fillText(winner,0,-95);    
    CTX.strokeText(winner,0,-95);

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

function drawChoices(choices,w,h,spacing) {

    w = w || 150;
    h = h || 40;
    spacing = spacing || 20;

    CTX.save();

    CTX.textAlign = "center";
    CTX.textBaseline = "middle";
    CTX.lineWidth = 10;
    CTX.translate(0.5*CANVAS.width, 0.5*CANVAS.height);

    for( var i=0; i<choices.length; i++ ) {
        CTX.save();
        if( CURRENT_CHOICE == i ) {
            CTX.strokeStyle = WHITE.hex();
            CTX.strokeRect(-0.5*w,-(0.5*h*choices.length+0.5*spacing*(choices.length-1))+i*(h+spacing),w,h);
        }
        CTX.fillStyle = LIGHTGRAY.hex();
        CTX.fillRect(-0.5*w,-(0.5*h*choices.length+0.5*spacing*(choices.length-1))+i*(h+spacing),w,h);
        
        CTX.fillStyle = BLACK.hex();
        CTX.font = "bold "+(h-10)+"px Arial";
        CTX.fillText(choices[i],0,-(0.5*h*choices.length+0.5*spacing*(choices.length-1))+i*(h+spacing)+0.5*h);
        CTX.restore();
    }
    
    CTX.restore();

}

function drawLobbyList() {

    var btn_w = 130;
    var btn_h = 30;
    var btn_spacing = 20;
    var num_offset = 60;
    MAX_INDEX = Math.floor(CANVAS.height/(btn_h+btn_spacing))-1;
    btn_spacing = (CANVAS.height-btn_h*(MAX_INDEX+1))/(MAX_INDEX+2);

    clearScreen();

    CTX.save();
    CTX.font = 'bold '+(0.75*btn_h)+'px Arial';
    CTX.textBaseline = 'middle';
    CTX.lineWidth = 10;

    if( LOBBY_LIST.length == 0 ) {
        CTX.save();
        CTX.textAlign = 'start';
        CTX.fillStyle = WHITE.hex();
        CTX.fillText('No games are currently available...',num_offset+btn_spacing,btn_spacing+0.5*btn_h);
        CTX.restore();
        CURRENT_CHOICE = 0;
    }

    for( var i=START_INDEX; i<Math.min(LOBBY_LIST.length,START_INDEX+MAX_INDEX+1); i++ ) {

        var y = btn_spacing+(i-START_INDEX)*(btn_h+btn_spacing);
        
        CTX.save();
        
        if( CURRENT_CHOICE == i-START_INDEX ) {
            CTX.strokeStyle = WHITE.hex();
            CTX.strokeRect(num_offset+btn_spacing,y,btn_w,btn_h);
        }
        CTX.fillStyle = GRAY.hex();
        CTX.fillRect(num_offset+btn_spacing,y,btn_w,btn_h);

        CTX.textAlign = 'end';
        CTX.fillStyle = WHITE.hex();
        CTX.fillText((i+1)+'.',num_offset,y+0.5*btn_h);
        
        CTX.textAlign = 'center';
        CTX.fillStyle = BLACK.hex();
        CTX.fillText('Join Game',num_offset+btn_spacing+0.5*btn_w,y+0.5*btn_h);

        CTX.textAlign = 'start';
        CTX.fillStyle = WHITE.hex();
        CTX.fillText('Difficulty: '+DIFFICULTIES[LOBBY_LIST[i].difficulty],num_offset+2*btn_spacing+btn_w,y+0.5*btn_h);
        CTX.restore();

    }

    CTX.restore();

}


function drawWaiting() {

    clearScreen();
    
    CTX.save();

    CTX.translate(0.5*CANVAS.width,0.5*CANVAS.height);
    
    CTX.font = 'bold 40px Arial';
    CTX.textAlign = 'center';
    CTX.textBaseline = 'middle';
    CTX.fillStyle = WHITE.hex();
    
    CTX.fillText("Waiting for a player to join...",0,0);

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

    CTX.font = "bold 50px Arial";
    CTX.textAlign = "center";
    CTX.textBaseline = "middle";
    CTX.fillStyle = BLACK.hex();
    CTX.fillText("PAUSED", 0.5*CANVAS.width,0.5*CANVAS.height-120);    
    CTX.lineWidth = 10;

    CTX.restore();

    drawChoices(["Resume","Restart","Exit"]);

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

    // if we're in the title screen
    if( GAME_STATE == 'title' ) {

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

        cancelAnimationFrame(LOOP_ID);
        CURRENT_CHOICE = 0;
        GAME_STATE = 'mode';
        selectPlayers();

    // if we're selecting single vs. multiplayer
    } else if( GAME_STATE == 'mode' ) {

        switch(event.which) {
        case 37: // left
        case 38: // up
            CURRENT_CHOICE = Math.max(CURRENT_CHOICE-1,0);
            selectPlayers();
            break;
        case 39: // right
        case 40: // down
            CURRENT_CHOICE = Math.min(CURRENT_CHOICE+1,2);
            selectPlayers();
            break;
        case 13: // enter
            switch( CURRENT_CHOICE ) {
            case 0: // single player
                MODE = 'single';
                CURRENT_CHOICE = 1;
                GAME_STATE = 'difficulty';
                selectDifficulty();
                break;
            case 1: // join game
                MODE = 'multi';
                CURRENT_CHOICE = 0;
                GAME_STATE = 'joining';

                var waitingRef = new Firebase('https://crackling-fire-6808.firebaseio.com/wormy/waiting');
                LOBBY_LIST = [];
                START_INDEX = 0;
                LOBBY_ADDED = waitingRef.on('child_added',function(snapshot) {
                    var v = snapshot.val();
                    v.name = snapshot.name();
                    LOBBY_LIST.push(v);
                    drawLobbyList();
                });
                LOBBY_REMOVED = waitingRef.on('child_removed',function(snapshot) {
                    var n = snapshot.name();
                    for( var i=0; i<LOBBY_LIST.length; i++ ) {
                        if( LOBBY_LIST[i].name == n ) {
                            LOBBY_LIST.splice(i,1);
                            break;
                        }
                    }
                    drawLobbyList();
                });
                drawLobbyList();

                break;

            case 2: // create game
                MODE = 'multi';
                CURRENT_CHOICE = 1;
                GAME_STATE = 'difficulty';
                selectDifficulty();
                break;
            }
            break;
        }

    // if we're selecting the difficulty
    } else if( GAME_STATE == 'difficulty' ) {

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
            GAMEFPS = DIFFICULTIES_FPS[CURRENT_CHOICE];

            // if we're creating a lobby
            if( MODE == 'multi' ) {
                var waitingRef = new Firebase('https://crackling-fire-6808.firebaseio.com/wormy/waiting');
                var pushRef = waitingRef.push();
                var gameID = pushRef.name();
                pushRef.set({difficulty:CURRENT_CHOICE,fps:GAMEFPS,dim:[ROWS,COLUMNS]},function(error){
                    pushRef.on('value',function(snapshot) {

                        // wait until the second player has removed this game
                        // from the 'waiting' list to the 'games' list
                        if( snapshot.val() == null ) {
                            GAME_REF = new Firebase('https://crackling-fire-6808.firebaseio.com/wormy/games').child(gameID);
                            GAME_REF.onDisconnect().remove();
                            
                            GAME_REF.transaction(function(snappy) {
                                
                                if( snappy != null ) {

                                    ROWS = snappy.dim[0];
                                    COLUMNS = snappy.dim[1];
                                    
                                    // try to be player 1, if possible
                                    if( !('player0' in snappy) ) {
                                        MY_INDEX = 0;

                                        // since I got access to the game first, I'll set up the apples
                                        APPLES = [];
                                        snappy.apples = [];
                                        var n_apples = Math.floor(3/625*ROWS*COLUMNS);
                                        for( var a=0; a<n_apples; a++ ) {
                                            APPLES.push(new Apple());
                                            snappy.apples.push(APPLES[a].coords);
                                            snappy.apples[a].born = APPLES[a].born;
                                            snappy.apples[a].lifespan = APPLES[a].lifespan;
                                        }

                                    } else { // otherwise we're player 2
                                        MY_INDEX = 1;

                                        // otherwise I got to the game second, so I'll read the apples
                                        APPLES = [];
                                        for( var a=0; a<snappy.apples.length; a++ ) {
                                            APPLES.push(new Apple());
                                            APPLES[a].coords = {'x':snappy.apples[a].x,'y':snappy.apples[a].y};
                                            APPLES[a].born = snappy.apples[a].born;
                                            APPLES[a].lifespan = snappy.apples[a].lifespan;
                                        }

                                    }

                                    // correct playing field size, if necessary
                                    var d = snappy.dim;

                                    initializeWorld();
                                    snappy['player'+MY_INDEX] = new Object();
                                    snappy['player'+MY_INDEX].coords = WORMS[MY_INDEX].coords;
                                    snappy['player'+MY_INDEX].lost = WORMS[MY_INDEX].lost;
                                    snappy['player'+MY_INDEX].score = WORMS[MY_INDEX].score;
                                    
                                }
                                    
                                return snappy;
                                
                            }, function(error,commited,snap){
                                if( commited ) {
                                    GAME_STATE = 'starting';
                                    drawStarting(5);
                                }
                            });
                        }

                    });

                });
                pushRef.onDisconnect().remove();
                GAME_STATE = 'waiting';
                drawWaiting();

            // otherwise we're in single-player mode
            } else if( MODE == 'single' ) {
                GAME_STATE = 'playing';
                playGame();
            }
            break;
        }

    // if we're choosing a game to join
    } else if( GAME_STATE == 'joining' ) {
 
        switch(event.which) {

        case 37: // left
        case 38: // up
            if( CURRENT_CHOICE == 0 ) {
                START_INDEX = Math.max(START_INDEX-1,0);
            }
            CURRENT_CHOICE = Math.max(CURRENT_CHOICE-1,0);
            drawLobbyList();
            break;

        case 39: // right
        case 40: // down
            if( CURRENT_CHOICE == MAX_INDEX ) {
                START_INDEX = Math.min(START_INDEX+1,LOBBY_LIST.length-MAX_INDEX-1);
            }
            CURRENT_CHOICE = Math.min(CURRENT_CHOICE+1,Math.min(MAX_INDEX,LOBBY_LIST.length-1));
            drawLobbyList();
            break;
        case 32: // space
        case 13: // enter

            var waitingRef = new Firebase('https://crackling-fire-6808.firebaseio.com/wormy/waiting');
            waitingRef.off('child_added');
            waitingRef.off('child_removed');

            // correct the size of the playing field, if needed
            var d = LOBBY_LIST[CURRENT_CHOICE+START_INDEX].dim;
            ROWS = Math.min(d[0],ROWS);
            COLUMNS = Math.min(d[1],COLUMNS);
            LOBBY_LIST[CURRENT_CHOICE+START_INDEX].dim = [ROWS,COLUMNS];

            // first create the GAME_REF
            var gameID = LOBBY_LIST[CURRENT_CHOICE+START_INDEX].name;
            GAME_REF = new Firebase('https://crackling-fire-6808.firebaseio.com/wormy/games/'+gameID);
            GAME_REF.onDisconnect().remove();
            GAME_REF.set(LOBBY_LIST[CURRENT_CHOICE+START_INDEX],function(error){
                GAME_REF.transaction(function(snappy) {
                    
                    if( snappy != null ) {
                        
                        // try to be first player, if possible
                        if( !('player0' in snappy) ) {
                            MY_INDEX = 0;

                            // since I got access to the game first, I'll set up the apples
                            APPLES = [];
                            snappy.apples = [];
                            var n_apples = Math.floor(3/625*ROWS*COLUMNS);
                            for( var a=0; a<n_apples; a++ ) {
                                APPLES.push(new Apple());
                                snappy.apples.push(APPLES[a].coords);
                                snappy.apples[a].born = APPLES[a].born;
                                snappy.apples[a].lifespan = APPLES[a].lifespan;
                            }                            
                            
                        } else { // otherwise we're player 2
                            MY_INDEX = 1;

                            // otherwise I got to the game second, so I'll read the apples
                            APPLES = [];
                            for( var a=0; a<snappy.apples.length; a++ ) {
                                APPLES.push(new Apple());
                                APPLES[a].coords = {'x':snappy.apples[a].x,'y':snappy.apples[a].y};
                                APPLES[a].born = snappy.apples[a].born;
                                APPLES[a].lifespan = snappy.apples[a].lifespan;
                            }
                            
                        }
                        
                        initializeWorld();
                        snappy['player'+MY_INDEX] = new Object();
                        snappy['player'+MY_INDEX].coords = WORMS[MY_INDEX].coords;
                        snappy['player'+MY_INDEX].lost = WORMS[MY_INDEX].lost;
                        snappy['player'+MY_INDEX].score = WORMS[MY_INDEX].score;
                        
                    }
                    
                    return snappy;

                }, function(error,commited,snap){
                    if( commited ) {
                        GAME_STATE = 'starting';
                        drawStarting(5);    
                    }                            
                });
            });
            
            // then remove the waitingRef, notifying the other player to begin
            waitingRef.child(gameID).remove();

            break;
        }       

    // if we're waiting for someone to join our game
    } else if( GAME_STATE == 'waiting' ) {


    // if we're currently playing the game
    } else if( GAME_STATE == 'playing' ) {
        
        switch(event.which) {
        case 32: // spacebar
            if( MODE == 'single' ) {
                cancelAnimationInterval(LOOP_ID);
                CURRENT_CHOICE = 0;
                GAME_STATE = 'paused';
                drawPaused();
                return;
            }
        case 83: // 's'
            
            // toggle the color style/draw style
            if( MODE == 'single' ) {
                if( WORMS[0].color_style == 'rainbow' ) {
                    WORMS[0].color_style = 'default';
                    for( var a=0; a<APPLES.length; a++ ) {
                        APPLES[a].draw_style = 'default';
                    }
                } else {
                    WORMS[0].color_style = 'rainbow';
                    for( var a=0; a<APPLES.length; a++ ) {
                        APPLES[a].draw_style = 'sparkle';
                    }
                }
            }
            break;
        }        
        
        for( var w=0; w<WORMS.length; w++ ) {
            WORMS[w].processEvent(event);
        }
        
        // accept no input if the game is paused
    } else if( GAME_STATE == 'paused' ) {
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
            switch( CURRENT_CHOICE ) {
            case 0: // resume
                GAME_STATE = 'playing';
                LOOP_ID = requestAnimationInterval(gameLoop,1000/GAMEFPS);
                break;
            case 1: // new game
                GAME_STATE = 'playing';
                playGame();
                break;
            case 2: // exit
                GAME_STATE = 'title';
                titleScreen();
                break;
            }
            return;
        }
        drawPaused();
        return; 
        
    // if the game is over
    } else if( GAME_STATE == 'over' ) {

        switch(event.which) {
        case 37: // left
        case 38: // up
            CURRENT_CHOICE = Math.max(CURRENT_CHOICE-1,0);
            break;
        case 39: // right
        case 40: // down
            CURRENT_CHOICE = Math.min(CURRENT_CHOICE+1,1);
            break;
        case 13: // enter
            switch( CURRENT_CHOICE ) {
            case 0: // retry
                GAME_STATE = 'playing';
                playGame();
                break;
            case 1: // exit
                GAME_STATE = 'title';
                titleScreen();
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
