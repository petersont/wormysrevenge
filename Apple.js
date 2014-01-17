function Apple() {
    
    this.coords = {'x':-1,'y':-1}
    this.born = new Date().getTime();
    this.lifespan = (4*Math.random()+8)*1000;
    
    var intersects = true;
    while( intersects ) {
        this.coords['x'] = Math.floor(Math.random()*COLUMNS);
        this.coords['y'] = Math.floor(Math.random()*ROWS);
        intersects = false;
        for( var i=0; i<WORMS.length; i++ ) {
            if( this.isInWorm(WORMS[i]) ) {
                intersects = true;
                break;
            }
        }
    }
    
}

Apple.prototype.isInWorm = function(worm) {

    for( var i=0; i<worm.coords.length; i++ ) {
        if( this.coords['x'] == worm.coords[i]['x']
            && this.coords['y'] == worm.coords[i]['y'] ) 
            return true;
    }

    return false;
}

Apple.prototype.draw = function() {

    var x = this.coords['x'] * CELLWIDTH;
    var y = this.coords['y'] * CELLHEIGHT;

    CTX.save();
    CTX.fillStyle = RED.hex();
    CTX.fillRect(x,y,CELLWIDTH,CELLHEIGHT);
    CTX.restore();

}