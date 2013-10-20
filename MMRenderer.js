function logGLCall(functionName, args) {
   console.log("gl." + functionName + "(" +
      WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
}

function validateNoneOfTheArgsAreUndefined(functionName, args) {
  for (var ii = 0; ii < args.length; ++ii) {
    if (args[ii] === undefined) {
      console.error("undefined passed to gl." + functionName + "(" +
                     WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
    }
  }
}

MMShaderProgram = function(gl, params) {
    this.gl = gl;
    this.init(params);
    this.uniforms = {};
    this.attributes = {};
};

MMShaderProgram.prototype = {
    init: function(params){
        var gl = this.gl;
        var src;
        src = this.getShaderSourceFromDOM(params.shader_fs);
        var fragmentShader = this.compileShader(src, 'fragment');
        src = this.getShaderSourceFromDOM(params.shader_vs);
        var vertexShader = this.compileShader(src, 'vertex');

        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
            throw new Error("Could not initialize shader program!");
        }

        this.program = program;
    },
    compileShader: function(srccode, type) {
        var gl = this.gl;
        var shader;
        if(type=='fragment'){
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if(type=='vertex'){
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, srccode);
        gl.compileShader(shader);

        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    },
    getShaderSourceFromURI: function(uri) {
        var httpRequest = new XMLHttpRequest();
        if(!httpRequest){
            throw new Error('Could not create XMLHttpRequest object!');
        }
        httpRequest.onreadystatechange = function (){
            if(httpRequest.readyState == 4){
                if(httpRequest.status == 200){
                    console.log(httpRequest.responseText);
                }
                else {
                    console.log(httpRequest.status);
                    throw new Error("There was a problem with the request!");
                }
            }
        };
        httpRequest.open('GET', uri, false);
        httpRequest.send();
    },
    getShaderSourceFromDOM: function(elementid) {
        var shaderScript = document.getElementById(elementid);
        if(!shaderScript){
            throw new Error("No shader in "+elementid);
        }
        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }
        return str;
    },
    setUniform: function(name, value){
        //We check if the uniform location is already cached in the ShaderProgram object
        var ufm = this.uniforms[name];
        if(!ufm){
            ufm = this.gl.getUniformLocation(this.program, name);
            if(!ufm){
                console.log("Could not locate uniform \""+name+ "\" in shader program!");
            }
            this.uniforms[name] = ufm;
        }

        //set the uniform value
        var gl = this.gl;
        gl.uniformMatrix4fv(ufm,false,value);
//        console.log(typeof(value));
    },
    getAttribute: function(name){
        var attr = this.attributes[name];
        if(!attr){
            attr = this.gl.getAttribLocation(this.program,name);
            if(attr == -1){
                console.log("Could not get attribute \""+name+"\" location in shader program!");
            } else {
                this.gl.enableVertexAttribArray(attr);
                this.attributes[name] = attr;
            }
        }
        return attr;
    },
    setBuffer: function(){

    }
};

MMTexture = function(gl) {
    this.gl = gl;
    var self = this;
    var image = new Image();
    image.src = 'star.gif';
    image.onload = function() {
        self.createTexture(image);
    }
}

MMTexture.prototype = {
    createTexture: function(texdata){
        var gl = this.gl;

        //create the WebGL texture object and set parameters
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        //upload texture data to GPU
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texdata);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}

MMMesh = function() {
    var posMat = mat4.create();
    mat4.identity(posMat);

    var xpos=0.0, ypos=0.0, zpos=0.0;

    xpos = Math.random()*500.0;
    ypos = Math.random()*500.0;
    zpos = Math.random()*500.0;
    xpos *= (Math.random()>0.5) ? -1.0 : 1.0;
    ypos *= (Math.random()>0.5) ? -1.0 : 1.0;
    zpos *= (Math.random()>0.5) ? -1.0 : 1.0;

    mat4.translate(posMat,[xpos,ypos,zpos]);
    this.vertices = [
        vec3.create([-2.0, 2.0, 0.0]),
        vec3.create([-2.0, -2.0, 0.0]),
        vec3.create([2.0, -2.0, 0.0]),
        vec3.create([2.0, 2.0, 0.0]),
    ];
    this.UV = [
        0,0,
        0,1,
        1,1,
        1,0
    ],
    this.indices = [0,1,2,0,2,3];

    for(var i=0;i<this.vertices.length;i++){
        mat4.multiplyVec3(posMat,this.vertices[i]);
    }
}

MMMeshA = function() {
    var posMat = mat4.create();
    mat4.identity(posMat);

    var xpos=0.0, ypos=0.0, zpos=0.0;

    xpos = Math.random()*500.0;
    ypos = Math.random()*500.0;
    zpos = Math.random()*500.0;
    xpos *= (Math.random()>0.5) ? -1.0 : 1.0;
    ypos *= (Math.random()>0.5) ? -1.0 : 1.0;
    zpos *= (Math.random()>0.5) ? -1.0 : 1.0;

    mat4.translate(posMat,[xpos,ypos,zpos]);
    this.vertices = [
        vec3.create([-2.0, 2.0, 0.0]),
        vec3.create([-2.0, -2.0, 0.0]),
        vec3.create([2.0, -2.0, 0.0]),
        vec3.create([-2.0, 2.0, 0.0]),
        vec3.create([2.0, -2.0, 0.0]),
        vec3.create([2.0, 2.0, 0.0]),
    ];
    this.UV = [
        0,0,
        0,1,
        1,1,
        0,0,
        1,1,
        1,0
    ];

    for(var i=0;i<this.vertices.length;i++){
        mat4.multiplyVec3(posMat,this.vertices[i]);
    }
}

MMMesh.prototype = {
    init: function() {
        this.position = Vec3.create();
        this.rotation = Vec3.create();
        this.scale = Vec3.create();
    },
    draw: function () {

    }
}

MMRenderBufferArray = function(numVertices) {
    this.vertices = new Float32Array(numVertices*3);
    this.UV = new Float32Array(numVertices*2);
    this.vertices_used = 0;
}

MMRenderBufferArray.prototype = {
    add: function(object) {
        for(var i=0; i<object.vertices.length; i++){
            this.vertices[this.vertices_used*3] = object.vertices[i][0];
            this.vertices[this.vertices_used*3+1] = object.vertices[i][1];
            this.vertices[this.vertices_used*3+2] = object.vertices[i][2];

            this.UV[this.vertices_used*2] = object.UV[i*2];
            this.UV[this.vertices_used*2+1] = object.UV[i*2+1];

            this.vertices_used++;
        }
    },
    setupGLbuffers: function(mm){
        var gl = mm.gl;
        this.GLvertices = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.GLvertices);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices,gl.DYNAMIC_DRAW);
        this.GLvertices.itemSize = 3;
        this.GLvertices.numItems = this.vertices_used;

        this.GLUV = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.GLUV);
        gl.bufferData(gl.ARRAY_BUFFER, this.UV,gl.DYNAMIC_DRAW);
        this.GLUV.itemSize = 2;
        this.GLUV.numItems = this.vertices_used;
    },
    drawBuffer: function(mm){
        var gl = mm.gl;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D,mm.texture.texture);
        mm.useBuffer('texCoord', this.GLUV);
        mm.useBuffer('vertexPosition', this.GLvertices);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices_used);
    }
}

MAX_INDEX = 65536;
MMRenderBuffer = function() {
    this.init();
}

MMRenderBuffer.prototype = {
    init: function() {
        this.buffers = [];
        this.buffers.push( {
            vertices: new Float32Array(MAX_INDEX*3),
            indices: new Uint16Array(MAX_INDEX),
            UV: new Float32Array(MAX_INDEX*2),
            vertices_used: 0,
            indices_used: 0,
            });
        this.current_buffer = this.buffers[0];
    },
    add: function(object) {
        var buf = this.current_buffer;
        var freeverts = MAX_INDEX - buf.vertices_used;
        var freeindices = MAX_INDEX - buf.indices_used;
        var vertices_used;
        if(object.vertices.length <= freeverts && object.indices.length <= freeindices){
            vertices_used = buf.vertices_used;
            for(var i=0; i<object.vertices.length; i++, buf.vertices_used++){
                buf.vertices[buf.vertices_used*3] = object.vertices[i][0];
                buf.vertices[buf.vertices_used*3+1] = object.vertices[i][1];
                buf.vertices[buf.vertices_used*3+2] = object.vertices[i][2];

                buf.UV[buf.vertices_used*2] = object.UV[i*2];
                buf.UV[buf.vertices_used*2+1] = object.UV[i*2+1];
            }
            for(var i=0; i<object.indices.length; i++){
                buf.indices[buf.indices_used+i] = object.indices[i] + vertices_used;
            }
            buf.indices_used += object.indices.length;
        } else {
            this.buffers.push( {
                vertices: new Float32Array(MAX_INDEX*3),
                indices: new Uint16Array(MAX_INDEX),
                UV: new Float32Array(MAX_INDEX*2),
                vertices_used: 0,
                indices_used: 0,
            });
            this.current_buffer = this.buffers[this.buffers.length-1];
            this.add(object);
        }

//        console.log("Added object, vertices_used: "+buf.vertices_used +" indices_used: "+buf.indices_used);
    },
    drawBuffer: function(mm){
        mm.gl.activeTexture(mm.gl.TEXTURE0);
        mm.gl.bindTexture(mm.gl.TEXTURE_2D,mm.texture.texture);
        for(var i = 0; i<this.buffers.length;i++){
            var buffer = this.buffers[i];
            mm.useBuffer('texCoord', buffer.glUV);
            mm.useBuffer('vertexPosition', buffer.glVertices);
            mm.gl.bindBuffer(mm.gl.ELEMENT_ARRAY_BUFFER, buffer.glIndices);
            mm.gl.drawElements(mm.gl.TRIANGLES, buffer.indices_used,mm.gl.UNSIGNED_SHORT,0);
        }
    },
    setupBuffer: function(mm) {
        for(var i = 0; i<this.buffers.length;i++){
            var buffer = this.buffers[i];
            buffer.glVertices = mm.gl.createBuffer();
            mm.gl.bindBuffer(mm.gl.ARRAY_BUFFER, buffer.glVertices);
            mm.gl.bufferData(mm.gl.ARRAY_BUFFER, buffer.vertices,mm.gl.DYNAMIC_DRAW);
            buffer.glVertices.itemSize = 3;
            buffer.glVertices.numItems = buffer.vertices_used;

            buffer.glIndices = mm.gl.createBuffer();
            mm.gl.bindBuffer(mm.gl.ELEMENT_ARRAY_BUFFER,buffer.glIndices);
            mm.gl.bufferData(mm.gl.ELEMENT_ARRAY_BUFFER,buffer.indices,mm.gl.DYNAMIC_DRAW);

            buffer.glUV = mm.gl.createBuffer();
            mm.gl.bindBuffer(mm.gl.ARRAY_BUFFER, buffer.glUV);
            mm.gl.bufferData(mm.gl.ARRAY_BUFFER, buffer.UV, mm.gl.DYNAMIC_DRAW);
            buffer.glUV.itemSize = 2;
            buffer.glUV.numItems = buffer.vertices_used;
        }
    },
}

MMRenderer = function(canvasid, params) {
    this.initGL(canvasid);
    this.shaderProgram = new MMShaderProgram(this.gl, params.shaders);
    this.gl.useProgram(this.shaderProgram.program);

    this.PMatrix = mat4.create();
    mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 8000.0, this.PMatrix);
    this.MVMatrix = mat4.create();

    params.onLoad(this);
}

MMRenderer.prototype = {
    initGL: function(canvasid) {
        var canvas = document.getElementById(canvasid);
        if(!canvas){
            throw new Error('No canvas element with id '+canvasid);
        }
        var gl;
        try{
            gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("experimental-webgl"), undefined, validateNoneOfTheArgsAreUndefined);
//            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {}
        if(!gl) {
            alert("Could not initialize WebGL!");
        }
        this.canvas = canvas;
        this.gl = gl;

        this.texture = new MMTexture(gl);
    },
    useBuffer: function(attributeName, buffer){
        var gl = this.gl;
        var attr = this.shaderProgram.getAttribute(attributeName);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(attr, buffer.itemSize, gl.FLOAT, false, 0,0);
    }
};
