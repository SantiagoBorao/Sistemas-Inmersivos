import * as THREE from "https://cdn.skypack.dev/three";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const far = 0.1;
const near = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, far, near);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0x00ff00
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

let t = 0;

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.y += 0.01;

  /*
   * Ex1
   */

  cube.rotation.z += 0.05;

  /*
   * Ex2
   */

  t += 0.01;
  cube.position.x = 2 * Math.sin(t);

  renderer.render(scene, camera);
}

animate();
