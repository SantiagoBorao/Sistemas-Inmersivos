/* eslint-disable no-undef*/
AFRAME.registerComponent("follow", {
  schema: {
    //id de la entidad
    target: { type: "selector" },
    //Velocidad a la que seguirá al objeto.
    speed: { type: "number" }
  },

  init() {
    //Vector para calcular dirección y velocidad de una entidad a la otra
    this.directionVec3 = new THREE.Vector3();
    console.log(this.directionVec3);
    //THREE.Object3D
    const currentPos = this.el.object3D.position;
    const targetPos = this.data.target.object3D.position;
    this.points = [];
    this.points.push(
      new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z)
    );
    this.points.push(new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z));

    //Creamos una línea entre las dos entidades
    const material = new THREE.LineBasicMaterial({ color: 0xAA00ff });
    const geom = new THREE.BufferGeometry().setFromPoints(this.points);

    this.dir = new THREE.Line(geom, material);

    this.el.sceneEl.object3D.add(this.dir);
  },

  //Tiempo global y tiempo delta del último fotograma en ms
  //Usamos delta para calcular qué tan lejos debe trasladarse la entidad hacia el objetivo en este fotograma, 
  //dada la velocidad speed
  tick(time, timeDelta) {
    //Lógica de seguimiento que se llamará en cada fotograma
    /*Almacenamos el vector de dirección en this.directionVec3 que 
    *previamente habías asignado al componente en el controlador init
    */
    let directionVec3 = this.directionVec3;
    let targetPosition = this.data.target.object3D.position;
    let currentPosition = this.el.object3D.position;

    //Actualizamos la línea por fotograma.
    this.points[0].copy(currentPosition);
    //Actualizamos la línea cuando la entidad cambie de objetivo.
    this.dir.geometry.setFromPoints(this.points);
    // Subtract the vectors to get the direction the entity should head in.
    /*Para calcular la dirección en la que debe dirigirse la entidad, restamos el vector de posición 
    * de la entidad al vector de dirección de la entidad objetivo.
    */
    directionVec3.copy(targetPosition).sub(currentPosition);

    // Distancia a recorrer
    var distance = directionVec3.length();

    //Para la entidad cuando llegue a su objetivo.
    if (distance < 1) {
      targetPosition.set(
        THREE.MathUtils.randInt(-3, 3),
        THREE.MathUtils.randInt(-3, 3),
        THREE.MathUtils.randInt(-3, 3)
      );
      this.points[1].copy(targetPosition);
      return;
    }

    // Scale the direction vector's magnitude down to match the speed.
    var factor = this.data.speed / distance;

    ["x", "y", "z"].forEach(function (axis) {
      directionVec3[axis] *= factor * (timeDelta / 1000);
    });

    // Actualizamos la posición por fotograma en función de la velocidad.
    this.el.setAttribute("position", {
      x: currentPosition.x + directionVec3.x,
      y: currentPosition.y + directionVec3.y,
      z: currentPosition.z + directionVec3.z
    });

    //this.el.object3D.position.x
  }
});
