import * as THREE from "https://cdn.skypack.dev/three";

//Para poder mostrar cualquier cosa con three.js, necesitamos tres cosas: escena, cámara y  renderizador

//Creación Renderizador
const renderer = new THREE.WebGLRenderer();
//Tamaño en el que queremos que renderice
//En este caso, es el de la pantalla que tengamos
renderer.setSize(window.innerWidth, window.innerHeight);
//Agregamos el elemento renderizador a nuestro documento HTML
//De esta manera se creará un nuevo canvas
document.body.appendChild(renderer.domElement);

//Creación Escena
//Todos los elementos 3D se tendrán que añadir a la escena que será lo que se pinta en el canvas.
const scene = new THREE.Scene();

const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
//Creación Cámara 
/*
* El primer atributo es el campo de visión. FOV es la extensión (vertical) de la escena que se ve en la pantalla 
* en un momento dado. 
* El valor está en grados.
* El segundo es la relación de aspecto. Casi siempre se usa el ancho del elemento dividido por la altura.
* Los dos atributos siguientes son el plano de recorte cercano y lejano.
* Lo que eso significa es que los objetos más alejados de la cámara que el valor 
* de lejos o más cerca que cerca no se renderizarán.
*/
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
