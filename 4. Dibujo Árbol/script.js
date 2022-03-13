//import * as THREE from "https://cdn.skypack.dev/three";
//import threeOrbitControls from "https://cdn.skypack.dev/three-orbit-controls";

import * as THREE from "https://unpkg.com/three@latest/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js?module";

//const OrbitControls = threeOrbitControls(THREE);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const far = 0.1;
const near = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, far, near);

const controls = new OrbitControls(camera, renderer.domElement);

/*const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);*/

createBox(0, -1, 0, 2, 2, 0x501b00);
createBox(0, -2, 0, 2, 2, 0x501b00);

let offset = 3;
let layer = 0;
for (let i = 0; i < 5; i++) {
  createBox(offset, layer, 0, 1, 5 - layer);
  createBox(0, layer, 0, 5 - layer, 7 - layer);
  createBox(-offset, layer, 0, 1, 5 - layer);

  createPlane(offset, 0.51 + layer, 0, 1, 5 - layer);
  createPlane(0, 0.51 + layer, 0, 5 - layer, 7 - layer);
  createPlane(-offset, 0.51 + layer, 0, 1, 5 - layer);

  layer += 1;
  offset -= 0.5;
}
createBox(0, layer, 0, 1, 1);
createPlane(0, 0.51 + layer, 0, 1, 1);

/*
createBox(2.5, 1, 0, 1, 4);
createBox(0, 1, 0, 4, 6);
createBox(-2.5, 1, 0, 1, 4);

createPlane(2.5, 1.51, 0, 1, 4);
createPlane(0, 1.51, 0, 4, 6);
createPlane(-2.5, 1.51, 0, 1, 4);

createBox(2, 2, 0, 1, 3);
createBox(0, 2, 0, 3, 5);
createBox(-2, 2, 0, 1, 3);

createPlane(2, 2.51, 0, 1, 3);
createPlane(0, 2.51, 0, 3, 5);
createPlane(-2, 2.51, 0, 1, 3);

createBox(1.5, 3, 0, 1, 2);
createBox(0, 3, 0, 2, 4);
createBox(-1.5, 3, 0, 1, 2);

createPlane(1.5, 3.51, 0, 1, 2);
createPlane(0, 3.51, 0, 2, 4);
createPlane(-1.5, 3.51, 0, 1, 2);

createBox(1, 4, 0, 1, 1);
createBox(0, 4, 0, 1, 3);
createBox(-1, 4, 0, 1, 1);

createPlane(1, 4.51, 0, 1, 1);
createPlane(0, 4.51, 0, 1, 3);
createPlane(-1, 4.51, 0, 1, 1);
*/

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

function createPlane(x, y, z, w, d) {
  const geometry = new THREE.PlaneGeometry(w, d);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(x, y, z);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);
}

function createBox(x, y, z, w, d, color) {
  const geometry = new THREE.BoxGeometry(w, 1, d);
  const material = new THREE.MeshBasicMaterial({ color: color || 0x013220 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, z);
  scene.add(cube);
}
