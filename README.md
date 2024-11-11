Threejs example: trails effect / feedback looping with frame buffers
====

![screenshot](https://github.com/mccap079/threejs-basic-trails-example/blob/main/info.png?raw=true)

Description
----

A super-simple, commented, noob-friendly example demonstrating how to create a trails effect using a feedback loop, created from a ping-pong buffer with WebGLRenderTargets, in a moduled threejs environment

A WebGLRenderTarget is threejs's version of a frame buffer-- a texture that you can render scene content to (separately from what is rendered to the screen), then treat like any other tex (like pass into a shader)

Control trail intensity using the `ATTENUATION` var in the frag shader. Or, use this feedback mechanism as a jumping off point for a world of other fancy vfx at your disposal

Here's a breakdown of the order-of-operations for successfully pulling off the feedback loop using a ping-pong buffer in threejs:

```
// FRAME 0

// currentRt = rt1
// trails prevFrame = null
// scene rendered to rt2
// currentRt = rt2
// scene rendered to screen
// trails prevFrame = rt1

// FRAME 1

// scene updated
// scene rendered to rt1
// currentRt = rt1
// scene rendered to screen
// trails prevFrame = rt2
```

Setup
----
1. Clone repo
2. cd to repo root
3. `$ npm i` to install pkgs (threejs, webpack, webpack-cli, webpack-dev-server)
4. `$ npm run dev` to run the example via localhost
