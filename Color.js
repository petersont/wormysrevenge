function Color() {
    
    if( arguments.length >=3 ) {
        this.r = Math.max(Math.min(arguments[0],255),0);
        this.g = Math.max(Math.min(arguments[1],255),0);
        this.b = Math.max(Math.min(arguments[2],255),0);
        this.a = arguments[3] ? Math.max(Math.min(arguments[3],1.0),0.0) : 1.0;
    } else {
        this.r = arguments[0].r;
        this.g = arguments[0].g;
        this.b = arguments[0].b;
        this.a = arguments[0].a;
    }

}

Color.prototype.hex = function() {
    return '#'+("0"+this.r.toString(16)).substr(-2)
        +("0"+this.g.toString(16)).substr(-2)
        +("0"+this.b.toString(16)).substr(-2);
}

Color.prototype.rgb = function() {
    return "rgb("+this.r+","+this.g+","+this.b+")";
}

Color.prototype.rgba = function() {
    return "rgba("+this.r+","+this.g+","+this.b+","+this.a+")";
}

Color.prototype.darken = function(multiplier) {
    multiplier = multiplier || 0.5;
    return new Color(Math.floor(multiplier*this.r),Math.floor(multiplier*this.g),Math.floor(multiplier*this.b),this.a);
}