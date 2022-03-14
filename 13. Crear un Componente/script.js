/* eslint-disable no-undef*/
AFRAME.registerComponent("follow", {
  schema: {
    target: { type: "selector" },
    speed: { type: "number" }
  },

  init() {
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

    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const geom = new THREE.BufferGeometry().setFromPoints(this.points);

    this.dir = new THREE.Line(geom, material);

    this.el.sceneEl.object3D.add(this.dir);
  },

  tick(time, timeDelta) {
    let directionVec3 = this.directionVec3;
    let targetPosition = this.data.target.object3D.position;
    let currentPosition = this.el.object3D.position;

    this.points[0].copy(currentPosition);
    this.dir.geometry.setFromPoints(this.points);
    // Subtract the vectors to get the direction the entity should head in.
    directionVec3.copy(targetPosition).sub(currentPosition);

    // Calculate the distance.
    var distance = directionVec3.length();

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

    // Translate the entity in the direction towards the target.
    this.el.setAttribute("position", {
      x: currentPosition.x + directionVec3.x,
      y: currentPosition.y + directionVec3.y,
      z: currentPosition.z + directionVec3.z
    });

    //this.el.object3D.position.x
  }
});
