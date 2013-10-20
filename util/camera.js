FPSCamera = function(listen_object) {
    var listen_object = listen_object || document;
    //Required to access the FPSCamera object from the event listeners
    //a javascript scope thing
    var self = this;

    var lastX, lastY;
    var width=listen_object.width;
    var height=listen_object.height;

    this.pitch = 0;
    this.yaw = 0;
    this.movement_speed = 50;
    this.rotation_speed = 2;
    this.cameraMat = mat4.create();
    this.rotationMat = mat4.create();
    mat4.identity(this.rotationMat);
    this.position = vec3.create();
    this.lastUpdate;

    this.pressedKeys = new Array(128);

    listen_object.addEventListener('mousedown', function(event){
        lastX=event.pageX;
        lastY=event.pageY;
    }, false);
    listen_object.addEventListener('mousemove', function(event){
        if(lastX && lastY){
            self.doRotation((event.pageX -lastX)/width*self.rotation_speed,
                (event.pageY-lastY)/height*self.rotation_speed);
            lastX = event.pageX;
            lastY = event.pageY;
        }
    }, false);
    listen_object.addEventListener('mouseup', function(event){
        lastX=null;
        lastY=null;
    }, false);

    document.addEventListener('keydown', function(event){
        self.pressedKeys[event.keyCode] = true;
    }, false);

    document.addEventListener('keyup', function(event){
        self.pressedKeys[event.keyCode] = false;
    }, false);
}

FPSCamera.prototype.doRotation = function(delta_x, delta_y){
    this.pitch += delta_y;
    if(this.pitch > Math.PI * 0.5)
        this.pitch = Math.PI * 0.5;
    if(this.pitch < -Math.PI *0.5)
        this.pitch = -Math.PI * 0.5;

    this.yaw += delta_x;
    while(this.yaw >= Math.PI * 2.0)
        this.yaw -= Math.PI * 2.0;
    while(this.yaw <= -Math.PI * 2.0)
        this.yaw += Math.PI * 2.0;

    mat4.identity(this.rotationMat);
    mat4.rotateY(this.rotationMat, this.yaw);
    mat4.rotateX(this.rotationMat, this.pitch);
}

FPSCamera.prototype.update = function (elapsed) {
    var direction = vec3.create();
    var speed = (this.movement_speed/100.0) * elapsed;
    var yaw=0, pitch=0;
    if (this.pressedKeys['W'.charCodeAt(0)]) {
        direction[2] -= speed;
    }
    if (this.pressedKeys['S'.charCodeAt(0)]) {
        direction[2] += speed;
    }
    if (this.pressedKeys['A'.charCodeAt(0)]) {
        direction[0] -= speed;
    }
    if (this.pressedKeys['D'.charCodeAt(0)]) {
        direction[0] += speed;
    }
    if (this.pressedKeys[32]) { // Space, moves up
        direction[1] += speed;
    }
    if (this.pressedKeys[17]) { // Ctrl, moves down
        direction[1] -= speed;
    }
    if (this.pressedKeys[37]) {
        //left
        yaw += 10/360.0;
    }
    if (this.pressedKeys[38]){
        pitch += 10/360.0;
    }
    if (this.pressedKeys[39]){
        yaw -= 10/360.0;
    }
    if (this.pressedKeys[40]){
        pitch -= 10/360.0;
    }
    this.doRotation(yaw, pitch);

    if(direction[0]!==0 || direction[1]!==0 || direction[2]!==0){
        mat4.multiplyVec3(this.rotationMat, direction);
        vec3.add(this.position, direction);
    }
}

FPSCamera.prototype.getViewMat = function() {
    var now = Date.now();
    if(! this.lastUpdate)
        this.lastUpdate = now;
    this.update(now - this.lastUpdate);
    this.lastUpdate = now;
    mat4.identity(this.cameraMat);
    mat4.translate(this.cameraMat, this.position);
    mat4.rotateY(this.cameraMat, this.yaw);
    mat4.rotateX(this.cameraMat, this.pitch);
    return mat4.inverse(this.cameraMat);
}
