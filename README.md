pbshading
=========

Physically based shading demo for CG course 2013 fall

This is the starter code for our WebGL based shading engine that tries to implement some form of
physically based shading.

As of now we have a javascript rendering engine written completely from scratch, contained in MMRenderer.js
It is written with performance in mind since javascript is inherently slow.
Right now it only supports vertice and texture coordinates which are kept in large buffers as to minimize
draw calls.
We have written support to load different shaders as needed.
We also implemented a FPS style camera class that let's the user move around the scene
-use WASD for movement and arrow keys for turning

The current demo just renders 100000 textured squares in a cube layout and rotates them (just to be a little less dull)
You can move freely around the scene.
No lighting and shading effect are applied yet.

The demo can just be run by downloading everything into one directory and opening mmtest.html in a browser.
It works with Mozilla Firefox, but if you want to use Chrome for it, then you need to setup a webserver,
because Chrome doesn't allow local files to be server as needed for some security reasons.
