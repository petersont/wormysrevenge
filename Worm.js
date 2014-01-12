function Worm(startx, starty, direction, color) {

    this.coords = [{'x': startx, 'y': starty}];
    this.direction = direction;
    this.color = new Color(color || GREEN);
    this.darker = this.color.darken();

    this.directionQueue = [];
    this.controls = {};
    this.scoreLocation = {};
    this.length = 3;
    this.score = 0;
    this.lost = false;
    
}

Worm.prototype.draw = function() {

    for( var i=0; i<this.coords.length; i++ ) {
        
        x = this.coords[i]['x'] * CELLWIDTH;
        y = this.coords[i]['y'] * CELLHEIGHT;

        CONTEXT.save();
        
        CONTEXT.fillStyle = this.color.hex();
        CONTEXT.fillRect(x, y, CELLWIDTH, CELLHEIGHT);
        
        CONTEXT.fillStyle = this.darker.hex();
        CONTEXT.fillRect(x+0.2*CELLWIDTH, y+0.2*CELLHEIGHT, 0.6*CELLWIDTH, 0.6*CELLHEIGHT);

        CONTEXT.restore();
    }
}    

Worm.prototype.hasEatenApple = function(apple) {
    return this.coords[HEAD]['x'] == apple['x'] && this.coords[HEAD]['y'] == apple['y'];
}
    
Worm.prototype.processEvent = function(event) {
    if( event.which && event.which in this.controls ) {
        this.directionQueue.push(this.controls[event.which]);
    }
}
    
Worm.prototype.advanceDirection = function() {
    if( this.directionQueue.length > 0 ) {
        var newDirection = this.directionQueue.pop();
        if( OPPOSITE[newDirection] != this.direction ) {
            this.direction = newDirection
        }
    }
}
    
Worm.prototype.hasHitBounds = function() {
    // check if the worm has hit itself or the edge
    head = this.coords[HEAD]
    if( head['x'] < 0 || head['x'] >= COLUMNS || head['y'] < 0 || head['y'] >= ROWS ) {
        return true;
    }
    return false;
}
    
Worm.prototype.hasEaten = function(opponent) {
    
    head = this.coords[HEAD];
    start = opponent==this?1:0;

    for( var i=start; i<opponent.coords.length; i++ )
        if( opponent.coords[i]['x'] == head['x'] && opponent.coords[i]['y'] == head['y'] )
            return true;

    return false;
}
    
Worm.prototype.advanceHead = function() {

    // move the worm by adding a segment in thedirection it is moving
    head = this.coords[HEAD];
    newHead = {};

    switch( this.direction ) {
    case UP:
        newHead = {'x': head['x'], 'y': head['y'] - 1};
        break;
    case DOWN:
        newHead = {'x': head['x'], 'y': head['y'] + 1};
        break;
    case LEFT:
        newHead = {'x': head['x'] - 1, 'y': head['y']};
        break;
    case RIGHT:
        newHead = {'x': head['x'] + 1, 'y': head['y']};
        break;
    }
    if( this.coords.length >= this.length ) {
        this.advanceTail();
    }
    this.coords.unshift(newHead);
}
    
Worm.prototype.advanceTail = function() {
    this.coords.pop();
}
    
Worm.prototype.drawScore = function() {

    CONTEXT.save();

    CONTEXT.font = "20px Arial";
    CONTEXT.textAlign = "center";
    CONTEXT.textBaseline = "middle";
    CONTEXT.fillStyle = this.color.hex();
    CONTEXT.fillText("Apples: "+this.score,+this.scoreLocation['x'],this.scoreLocation['y']);    

    CONTEXT.restore();

}