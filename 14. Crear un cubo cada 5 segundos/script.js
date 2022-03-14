/* eslint-disable */
AFRAME.registerSystem("spawn", {
  init: function () {
    this.sceneEl = this.el.sceneEl;
    this.xr = this.sceneEl.renderer.xr;

    const onEnterVr = async (ev) => {
      if (this.sceneEl.is("ar-mode")) {
        console.log("Realidad Aumentada Inmersiva");
        this.session = this.xr.getSession();
      }
    };

    this.sceneEl.addEventListener("loaded", () => {
      this.camera = this.sceneEl.camera;
    });

    this.sceneEl.addEventListener("enter-vr", onEnterVr);
  },

  tick: (function (t, td) {
    const worldPos = new THREE.Vector3();
    const worldRot = new THREE.Euler();

    const worldPosXRManager = new THREE.Vector3();
    const worldRotXRManager = new THREE.Euler();

    const worldPosXrFrame = new THREE.Vector3();
    const worldRotXrFrame = new THREE.Euler();
    const quat = new THREE.Quaternion();

    function createElement(scene, pos) {
      const box = document.createElement("a-box");
      console.log(pos);
      box.setAttribute("position", { x: pos.x, y: pos.y, z: pos.z });
      box.setAttribute("scale", "0.2 0.2 0.2");
      box.setAttribute("color", "red");
      scene.appendChild(box);
    }

    let time = 0;
    const TIMEOUT = 5000;
    const pos = new THREE.Vector3();

    return function (t, td) {
      if (!this.sceneEl.is("ar-mode")) return;

      if (time >= TIMEOUT) {
        time = 0;
        const viewerPose = this.sceneEl.frame.getViewerPose(
          this.xr.getReferenceSpace()
        );

        if (viewerPose)
          createElement(this.sceneEl, viewerPose.transform.position);
      } else {
        time += td;
      }
    };
  })()
});
