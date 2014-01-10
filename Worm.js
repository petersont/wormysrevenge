function Worm(startx, starty, direction, color) {

    this.coords = [{'x': startx, 'y': starty}];
    this.direction = direction;
    this.color = new Color(color || GREEN);
    this.darker = this.color.darken();

    this.directionQueue = [];
    this.controls = {};
    this.scoreLocation = [];
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
    
// Worm.prototype.processEvent = function(event) {
//     if self.controls.has_key(event.key) {
//         self.directionQueue.append(self.controls[event.key]);
//     }
// }
    
// Worm.prototype.advanceDirection = function() {
//     if len(self.directionQueue) {
//         newDirection = self.directionQueue.pop(0)
//         if OPPOSITE[newDirection] != self.direction {
//             self.direction = newDirection
//         }
//     }
// }
    
// Worm.prototype.hasHitBounds = function() {
//     // check if the worm has hit itself or the edge
//     head = self.coords[HEAD]
//     if head['x'] < 0 or head['x'] >= CELLWIDTH or head['y'] < 0 or head['y'] == CELLHEIGHT {
//         return true;
//     }
//     return false;
// }
    
// Worm.prototype.hasEaten = function(opponent) {
//         head = self.coords[HEAD]
//         start = 0
//         if opponent == self {
//             start = 1
//         for wormBody in opponent.coords[start {] {
//             if wormBody['x'] == head['x'] and wormBody['y'] == head['y'] {
//                 return True
//         return False
    
// Worm.prototype.advanceHead = function() {
//         // move the worm by adding a segment in thedirection it is moving
//         head = self.coords[HEAD]
//         newHead = {}
//         if self.direction == UP {
//             newHead = {'x': head['x'], 'y': head['y'] - 1}
//         elif self.direction == DOWN {
//             newHead = {'x': head['x'], 'y': head['y'] + 1}
//         elif self.direction == LEFT {
//             newHead = {'x': head['x'] - 1, 'y': head['y']}
//         elif self.direction == RIGHT {
//             newHead = {'x': head['x'] + 1, 'y': head['y']}
//         if len(self.coords) >= self.length {
//             self.advanceTail()
//         self.coords.insert(0, newHead)
    
// Worm.prototype.advanceTail = function() {
//         del self.coords[-1]
    
// Worm.prototype.drawScore = function() {
//         drawScore(self.score, self.scoreLocation, self.color)
