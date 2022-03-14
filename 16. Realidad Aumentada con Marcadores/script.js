/*eslint-disable*/
AFRAME.registerComponent("xr-tracked-image", {
  schema: {
    element: { type: "selector" },
    widthInMeters: { type: "number" }
  },
  init: function () {
    console.log("xr-tracked-image init");
    this.el.emit("register-xr-tracked-image", { node: this });
  }
});

AFRAME.registerSystem("xr-image-tracker", {
  init: function () {
    console.log("xr-tracked-images init");
    this.trackedNodesByImageIdNum = {};
    this.trackedImageList = [];
    this.trackedImagesPreviousFrame = {};
    /*  Es importante observar en la línea 19 del código, que la lista de imágenes se vincula a una 
    * propiedad trackedImages del sistema webxr. 
    * Esta propiedad, en el API de WebXR, es un array de objetos que contiene las imágenes. 
    * Es una propiedad obligatoria. Si no la configuramos tendremos un error al iniciar la sesión.*/
    this.el.sceneEl.systems.webxr.sessionConfiguration.trackedImages = this.trackedImageList; 
    this.el.sceneEl.addEventListener(
      "register-xr-tracked-image",
      async (ev) => {
        let node = ev.detail.node;
        console.log("register", node);
        let trackedData = node.data;
        //Añade la imagen a la lista de imágenes de las que se hará el seguimiento en la sesión inmersiva
        let bitmap = await createImageBitmap(trackedData.element);
        let idNum = this.trackedImageList.length;
        this.trackedImageList.push({
          image: bitmap,
          widthInMeters: trackedData.widthInMeters
        });
        this.trackedNodesByImageIdNum[idNum] = node;
      }
    );

    this.el.sceneEl.addEventListener("enter-vr", async (ev) => {
      if (this.el.sceneEl.is("ar-mode")) {
        console.log("ar-mode start");

        let session = this.el.sceneEl.renderer.xr.getSession();
        let refSpaceType =
          this.el.sceneEl.systems.webxr.sessionReferenceSpaceType ||
          "local-floor";
        this.refSpace = await session.requestReferenceSpace(refSpaceType);
      }
    });
  },

  tick: (function () {
    const pos1 = new THREE.Vector3();
    const pos2 = new THREE.Vector3();

    return function () {
      let session = this.el.sceneEl.renderer.xr.getSession();
      if (!session) return;
      let frame = this.el.sceneEl.frame;
      let imagesTrackedThisFrame = {};
      //El array contiene objetos con la imagén (bitmap) y una estimación de su tamaño (en metros) en el mundo real.
      let results = frame.getImageTrackingResults();
      for (let i = 0; i < results.length; ++i) {
        let result = results[i];
        let pose = frame.getPose(result.imageSpace, this.refSpace);
        let idNum = result.index;
        imagesTrackedThisFrame[idNum] = true;
        //console.log("pose", pose, "for image", idNum, " state=" + result.trackingState, " width=", result.measuredWidthInMeters);
        let node = this.trackedNodesByImageIdNum[idNum];
        if (!node) continue;

        if (pose) {
          let object3D = node.el.object3D;
          object3D.visible = true;
          object3D.matrix.elements = pose.transform.matrix;
          object3D.matrix.decompose(
            object3D.position,
            object3D.rotation,
            object3D.scale
          );
        }
      }

      if (
        results.length == 2 &&
        results[0].trackingState === "tracked" &&
        results[1].trackingState === "tracked"
      ) {
        const pose1 = frame.getPose(results[0].imageSpace, this.refSpace);
        const pose2 = frame.getPose(results[1].imageSpace, this.refSpace);
        ["x", "y", "z"].forEach((axis) => {
          pos1[axis] = pose1.transform.position[axis];
          pos2[axis] = pose2.transform.position[axis];
        });

        console.log(pos1.distanceTo(pos2));
      }

      for (const index in this.imagesTrackedPreviousFrame) {
        if (!imagesTrackedThisFrame[index]) {
          this.trackedNodesByImageIdNum[index].el.object3D.visible = false;
        }
      }
      this.imagesTrackedPreviousFrame = imagesTrackedThisFrame;
    };
  })()
});
