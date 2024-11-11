import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import trails_vert from "./trails_vert.js";
import trails_frag from "./trails_frag.js";

///Development tools
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

///Canvas sizing/layout
let width, height;
if (window.innerHeight >= window.innerWidth) {
    width = roundEven(window.innerWidth);
    height = roundEven(window.innerWidth);
} else {
    width = roundEven(window.innerHeight);
    height = roundEven(window.innerHeight);
}

let camera, scene, renderer;
let b, plane;
let cubeSize = 50;
const rt1 = new THREE.WebGLRenderTarget(width, height, {
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter
});
const rt2 = new THREE.WebGLRenderTarget(width, height, {
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter
});
let currentRt = rt1;

function init() {

    //setup
    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0, 5000);
    camera.position.set(0, 0, -100);
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer({
        antialias: false
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000);
    renderer.autoClear = false;
    document.body.appendChild(renderer.domElement);

    //red box
    let b_g = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    let b_m = new THREE.MeshBasicMaterial({color: 0xff0000});
    b = new THREE.Mesh(b_g, b_m);
    b.position.set(0, 0, 0);
    scene.add(b);

    //plane that renders the prev frame to screen
    const planeGeometry = new THREE.PlaneGeometry(width, height);

    var trails_m = new THREE.ShaderMaterial({
        uniforms: {
            prevFrame: { value: null }
        },
        vertexShader: trails_vert,
        fragmentShader: trails_frag,
        depthWrite: true,
        depthTest: true
    });

    plane = new THREE.Mesh(planeGeometry, trails_m);

    plane.position.set(0, 0, 10);
    plane.rotation.y = Math.PI;
    scene.add(plane);
}

function animate() {
    stats.begin();
    requestAnimationFrame(animate);
    let time = performance.now() * 0.001;
    b.rotation.y = time * 0.2;
    b.position.x = Math.sin(time * 3) * 100;
    b.position.y = Math.cos(time * 2) * 100;    
    render();
    stats.end();
}

function render() {

    // Swap the render targets
    const nextRt = currentRt === rt1 ? rt2 : rt1;
    renderer.setRenderTarget(nextRt);
    renderer.clear();
    renderer.render(scene, camera);

    // Update the current render target for the next frame
    currentRt = nextRt;

    renderer.setRenderTarget(null);
    renderer.clear();
    renderer.render(scene, camera);

    plane.material.uniforms.prevFrame.value = currentRt.texture;
}

init();
animate();

function roundEven(v) {
    return 2 * Math.round(v / 2);
}

function map(value, min1, max1, min2, max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}