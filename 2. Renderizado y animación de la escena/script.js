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

//Es un objeto que contiene todos los puntos (vértices) y relleno (caras) del cubo.
const geometry = new THREE.BoxGeometry();
/*
* Además de la geometría, necesitamos un material para colorear las caras del cubo.
* Todos los materiales toman un objeto de propiedades que se les aplicará.
*/
const material = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0x00ff00
});

//Una malla es un objeto Mesh que toma una geometría y le aplica un material, que luego podemos insertar en nuestra escena.
const cube = new THREE.Mesh(geometry, material);
//Cuando llamamos a scene.add(), lo que agregamos estará en las coordenadas
scene.add(cube);

//Movemos un poco la cámara en el eje z hacia nosotros
camera.position.z = 5;

let t = 0;

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.y += 0.01;

  /*
   * Ex1
   * 
   * Posicionar el objeto en una posición distinta de (0,0,0)
   */
  t += 0.01;
  cube.position.x = 2 * Math.sin(t);

  renderer.render(scene, camera);

  

  /*
   * Ex2
   */
  cube.rotation.z += 0.05;

}

animate();
