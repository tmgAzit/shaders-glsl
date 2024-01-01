import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import nebula from './image/nebula.jpg';

// create renderer and add renderer element to domElement
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// sets the color of the background
// renderer.setClearColor(0xfefefe);

// create scene
const scene = new THREE.Scene();

// create camera to check the renderer and its scene.
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
scene.add(camera);

// // we need light
// const ambientLight = new THREE.AmbientLight(0xffffff, 10);
// scene.add(ambientLight);

// orbit controls
const orbit = new OrbitControls(camera, renderer.domElement);

// by defualt camera position is at (0,0), so we change the position of the camera
camera.position.set(0, 0, 14);
orbit.update();

// create uniform object
const uniforms = {
  u_time: { type: 'f', value: 0.0 },
  u_resolution: {
    type: 'v2',
    value: new THREE.Vector2(
      window.innerWidth,
      window.innerHeight
    ).multiplyScalar(window.devicePixelRatio),
  },
  u_mouse: { type: 'v2', value: new THREE.Vector2(0.0, 0.0) },
  image: { type: 't', value: new THREE.TextureLoader().load(nebula) },
};

// let get the mouse coordinate and assign it the u_mouse value. For this we need event listener to target mouse movement
window.addEventListener('mousemove', (e) => {
  uniforms.u_mouse.value.set(
    e.screenX / window.innerWidth,
    1 - e.screenY / window.innerHeight
  );
  // console.log(uniforms.u_mouse.value);
});

// lets add some object in the scene - for this we need geometry and meshMaterial
const planeGeometry = new THREE.PlaneGeometry(10, 10, 30, 30);
const planeMaterial = new THREE.ShaderMaterial({
  vertexShader: document.getElementById('vertexShader').textContent,
  fragmentShader: document.getElementById('fragmentShader').textContent,
  wireframe: false,
  uniforms,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

// update elapsed time form js to shader u_time
const clock = new THREE.Clock();

// animation
function animate() {
  uniforms.u_time.value = clock.getElapsedTime();
  renderer.render(scene, camera);
}

// Render
renderer.setAnimationLoop(animate);

// resizing renderer
window.addEventListener('resize', function (e) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
