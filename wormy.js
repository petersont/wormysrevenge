var canvas;
var context;

var startscreen_id = NaN;

function init() {
    
    canvas = document.getElementById("canvas");
    
    if( canvas.getContext ) {
        
	context = canvas.getContext("2d");
	context.font = "20px";
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	// int_id = setInterval(draw,DT*100);
	
	// pygame_draw_rect("#f50", pygame_Rect(30, 10, 100, 300));

	showStartScreen(0);
    }
}

function make_rect(x, y, w, h) {
    return {x:x, y:y, w:w, h:h};
}

function draw_rect(color, rect) {

    context.save();
    
    context.fillStyle = color;
    context.rect(rect.x, rect.y, rect.w, rect.h);
    context.fill();
    
    context.restore();
}

function erase() {
    context.clearRect(0,0,canvas.width,canvas.height);
    //draw_rect("#000", make_rect(0,0,canvas.width,canvas.height));
}

function drawTitleText(angle1, angle2) {
	
    context.save();
    
    erase();
    context.font = "100px Arial";
    
    context.save();
    context.fillStyle = "#0f0";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.translate(canvas.width/2, canvas.height/2);
    context.rotate(angle1);
    context.fillText("Wormy Online!", 0,0);
    context.restore();
    
    context.save();
    context.fillStyle = "#05f";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.translate(canvas.width/2, canvas.height/2);
    context.rotate(angle2);
    context.fillText("Wormy Online!", 0,0);
    context.restore();
    
    context.restore();
}

function showStartScreen(t) {
    startscreen_id = requestAnimationFrame(showStartScreen);

    var angle1 = 0.25 * (2*Math.PI*t/1000);
    var angle2 = 0.15 * (2*Math.PI*t/1000);
    drawTitleText(angle1, angle2);    
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
    
    var code = event.keyCode?event.keyCode:event.which;
    
    if( !isNaN(startscreen_id) ) {
	cancelAnimationFrame(startscreen_id);
	startscreen_id = NaN;
    }
    
    switch(code) {
    case 112:
	if( paused == 0 ) {
	    paused = 1;
	} else {
	    paused = 0;
	}
	break;
    }
    
}

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
