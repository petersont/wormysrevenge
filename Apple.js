function Apple() {
    
    this.coords = {'x':-1,'y':-1}
    this.born = new Date().getTime();
    this.lifespan = (4*Math.random()+18)*1000;
    this.img = new Image();
    this.img.src = 'sparkle.png';
    this.draw_style = 'default';
    
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

    if( this.draw_style == 'sparkle' ) {
        var t = new Date().getTime() - this.born;
        var multiplier = 1.5+0.25*Math.sin(2*Math.PI*t/1000);
        CTX.drawImage(this.img,
                      x-0.5*(multiplier-1.0)*CELLWIDTH,
                      y-0.5*(multiplier-1.0)*CELLHEIGHT,
                      multiplier*CELLWIDTH,multiplier*CELLHEIGHT);
    } else {
        CTX.fillStyle = RED.hex();
        CTX.fillRect(x,y,CELLWIDTH,CELLHEIGHT);
    }
    CTX.restore();

}