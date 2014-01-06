var canvas;
var context;

var m_x = 100;
var m_y = 100;

var m_down = 0;
var grabbed = 0;
var paused = 0;

var M=new Number(1);
var L=new Number(100);
var DT=new Number(0.05);
var THETA1=new Number(Math.PI/2);
var THETA2=new Number(Math.PI/2);
var PTHETA1=new Number(0);
var PTHETA2=new Number(0);

var m_input;
var l_input;
var int_id = NaN;
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
		
		showStartScreen();
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
    draw_rect("#000", make_rect(0,0,canvas.width,canvas.height));
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

function showStartScreen() {
	
	var angle1 = 0.0;
    var angle2 = 0.0;
    
	startscreen_id = setInterval(function() {
		angle1 += 0.05;
		angle2 += 0.09;
		
		drawTitleText(angle1, angle2);
	}, 50);
        
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
		clearInterval(startscreen_id);
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


