//import * as THREE from "https://cdn.skypack.dev/three";
//import threeOrbitControls from "https://cdn.skypack.dev/three-orbit-controls";

import * as THREE from "https://unpkg.com/three@latest/build/three.module.js";
//import { OrbitControls } from "https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js?module";
import { FirstPersonControls } from "https://unpkg.com/three@latest/examples/jsm/controls/FirstPersonControls.js?module";

let camera, controls, scene, renderer;
const clock = new THREE.Clock();

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );

  scene = new THREE.Scene();

  const cubeGeometry = new THREE.BoxGeometry(5, 5, 5, 10, 10, 10);

  const material = new THREE.MeshPhongMaterial({
    wireframe: true,
    color: 0xAABB00
  });
  const cube = new THREE.Mesh(cubeGeometry, material);

  scene.add(cube);
  cube.position.z = -10;
  cube.position.y = 1.6;

  //Luz
  /*
  * Las luces direccionales tienen una posición y un objetivo
  * Ambos valores predeterminados son 0, 0, 0.
  * En nuestro caso, estamos configurando la posición de la luz en (-1, 2, 6)
  * El objetivo sigue siendo 0, 0, 0, por lo que brillará hacia el origen.
  */
 
  const color = 0xFFFFFF;
  const intensity = 5;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 6);
  scene.add(light);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new FirstPersonControls(camera, renderer.domElement);
  controls.movementSpeed = 100;
  controls.lookSpeed = 0.1;


}

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  controls.update(clock.getDelta());
  renderer.render(scene, camera);
}
