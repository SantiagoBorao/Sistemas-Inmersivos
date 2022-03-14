/*eslint-disable*/
AFRAME.registerSystem("logger", {
  init: function () {
    this.sceneEl = this.el.sceneEl;
    this.box = document.querySelector("#box");

    this.xr = this.sceneEl.renderer.xr;

    const onEnterVr = async (ev) => {
      if (this.sceneEl.is("ar-mode")) {
        //"vr-mode"
        console.log("Realidad Aumentada Inmersiva");
        this.session = this.xr.getSession();
        const refSpace = await this.session.requestReferenceSpace("viewer");
        console.log(refSpace);
      }
    };

    this.sceneEl.addEventListener("loaded", () => {
      this.camera = this.sceneEl.camera;
    });

    this.sceneEl.addEventListener("enter-vr", onEnterVr);
  },

  tick: (function (t, td) {
    const pLocal = new THREE.Vector3(0, 1.6, -5);
    const pWorld = new THREE.Vector3();

    return function (t, td) {
      if (this.camera) {
        pLocal.applyMatrix4(this.camera.el.object3D.matrixWorld);

        ["x", "y", "z"].forEach((axis) => {
          this.box.object3D.position[axis] = pWorld[axis];
        });

        this.box.object3D.rotation.setFromRotationMatrix(
          this.camera.el.object3D.matrixWorld
        );
      }
    };
  })()
});
