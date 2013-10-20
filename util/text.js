function getPowerOfTwo(value, pow) {
    var pow = pow || 1;
    while(pow<value) {
        pow *= 2;
    }
    return pow;
}

TextTexture = function(canvas){
    this.canvas = canvas || document.createElement("canvas");
    this.ctx = this.canvas.getContext('2d');

    this.backgroundColor = '#000000';
    this.textFillColor = '#FFFFFF';
    this.textStrokeColor = '#FFFFFF';
}

TextTexture.prototype.drawText = function(text, fontSize) {
    this.ctx.font = fontSize + 'px monospace';
    var width = this.canvas.width = getPowerOfTwo(this.ctx.measureText(text).width);
    var height = this.canvas.height = getPowerOfTwo(fontSize);
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0,0, width, height);
    this.ctx.fillStyle = this.textFillColor;
    this.ctx.textAlign = "left";	// This determines the alignment of text, e.g. left, center, right
    this.ctx.textBaseline = "bottom";	// This determines the baseline of the text, e.g. top, middle, bottom
    this.ctx.font = fontSize + 'px monospace';
    this.ctx.fillText(text, 0, height);
}