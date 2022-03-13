import * as THREE from "https://cdn.skypack.dev/three";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);

const material = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0x00ff00
});
const cube = new THREE.Mesh(geometry, material);

cube.add(new THREE.AxesHelper(3));
scene.add(cube);

scene.add(new THREE.AxesHelper(5));

camera.position.z = 5;

/*
 * Ex 1
 */
cube.position.set(0, 1.6, 1);
//cube.position.y = 1.6;

/*
 * Ex 2
 */
cube.rotation.x = (45 * Math.PI) / 180;

/*
 * Ex 3
 */
cube.scale.set(2, 2, 2);
//cube.scale.copy(new THREE.Vector3(2, 2, 2));

/*
 * Ex 4
 */

const coneGeometry = new THREE.ConeGeometry(2, 2, 32);
const coneMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0x00ffff
});
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
scene.add(cone);

/*
 * Ex 5 y Opcional
 */
const fovControl = document.querySelector("#fovControl");
fovControl.value = fov;
fovControl.addEventListener("input", function (e) {
  //console.log(e.target.value);
  camera.fov = e.target.value;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

const nearControl = document.querySelector("#nearControl");
nearControl.value = camera.near;
console.log(camera.near);
nearControl.addEventListener("input", function (e) {
  //console.log(e.target.value);
  camera.near = parseFloat(e.target.value);
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

const farControl = document.querySelector("#farControl");
farControl.value = camera.far;
console.log(camera.near);
farControl.addEventListener("input", function (e) {
  //console.log(e.target.value);
  camera.far = parseFloat(e.target.value);
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

renderer.render(scene, camera);
