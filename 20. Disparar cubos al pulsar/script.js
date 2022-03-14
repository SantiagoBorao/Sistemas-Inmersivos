/*eslint-disable*/
AFRAME.registerComponent("input-source", {
  schema: {},
  init: function () {
    this.el.addEventListener("enter-vr", () => {
      if (!this.el.sceneEl.is("ar-mode")) return;

      const session = this.el.sceneEl.renderer.xr.getSession();

      this.direction = new THREE.Vector3(0, 0, -1);
      this.box = document.querySelector("#box");

      session.addEventListener("selectstart", (e) => {
        const refSpace = this.el.sceneEl.renderer.xr.getReferenceSpace();
        const rayPose = e.frame.getPose(e.inputSource.targetRaySpace, refSpace);

        if (!rayPose) return;
        ["x", "y", "z"].forEach((axis) => {
          this.box.object3D.position[axis] = rayPose.transform.position[axis];
        });

        this.direction.set(0, 0, -1);

        const matrixWorld = new THREE.Matrix4().fromArray(
          rayPose.transform.matrix
        );
        this.direction.applyMatrix4(matrixWorld);
        this.direction.sub(this.box.object3D.position).normalize();

        ["x", "y", "z"].forEach((axis) => {
          this.box.object3D.position[axis] += this.direction[axis];
        });
      });
    });
  },

  tick: function () {
    if (!this.el.sceneEl.is("ar-mode")) return;

    ["x", "y", "z"].forEach((axis) => {
      this.box.object3D.position[axis] += this.direction[axis];
    });
  }
});
