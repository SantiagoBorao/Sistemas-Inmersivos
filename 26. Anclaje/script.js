AFRAME.registerSystem("anchors-system", {
  init: function () {
    const sceneEl = this.el;
    sceneEl.addEventListener("enter-vr", onEnterVR.bind(this));

    function onEnterVR() {
      if (!sceneEl.is("ar-mode")) return;

      const xrSystem = sceneEl.renderer.xr;
      const xrSession = xrSystem.getSession();

      xrSystem.addEventListener("sessionstart", async (ev) => {
        this.viewerSpace = await xrSession.requestReferenceSpace("viewer");
        this.refSpace = this.el.sceneEl.renderer.xr.getReferenceSpace();
        this.xrHitTestSource = await xrSession.requestHitTestSource({
          space: this.viewerSpace
        });
      });

      xrSession.addEventListener("select", onSelect.bind(this));

      this.redBox = document.querySelector("#redBox");
      this.reticle = document.querySelector("#reticle");

      this.reticle.setAttribute("visible", "false");

      this.anchorMode = 0; //0 add floating anchor
      //1 hit-test anchor

      this.allAnchors = {
        hitTestAnchor: null,
        addedAnchors: []
      };

      function createGreenBox() {
        //<a-box id="greenBox" color="green" position="0 0 -1" scale="0.2 0.2 0.2"></a-box>
        const box = document.createElement("a-box");
        box.setAttribute("color", "green");
        box.setAttribute("scale", "0.1 0.1 0.1");
        sceneEl.appendChild(box);
        return box;
      }

      const anchorModeBtn = document.querySelector("#anchorModeBtn");
      anchorModeBtn.addEventListener("click", (e) => {
        this.anchorMode = (this.anchorMode + 1) % 2;
        anchorModeBtn.innerHTML =
          this.anchorMode === 0
            ? "Switch to hit-test anchor"
            : "Switch to floating anchor";
      });

      anchorModeBtn.addEventListener("beforexrselect", function (e) {
        e.preventDefault();
      });

      //Input events
      async function onSelect(e) {
        console.log(e); //XRInputSourceEvent
        const frame = e.frame;
        if (this.anchorMode === 0) {
          const viewerPose = xrSystem.getCameraPose();
          const anchor = await frame.createAnchor(
            viewerPose.transform,
            this.refSpace
          );
          const anchorObject = createGreenBox();
          anchor.myobject = anchorObject;
          this.allAnchors.addedAnchors.push(anchor);
        }

        if (this.anchorMode === 1 && this.xrHitTestSource) {
          const hitTestResults = frame.getHitTestResults(this.xrHitTestSource);

          if (hitTestResults.length > 0) {
            const xrHitTestResult = hitTestResults[0];
            const anchor = await xrHitTestResult.createAnchor();
            if (this.allAnchors.hitTestAnchor)
              this.allAnchors.hitTestAnchor.delete();
            this.allAnchors.hitTestAnchor = anchor;
          }
        }
      }
    }
  },

  tick: (function () {
    const pos = new THREE.Vector3();
    const mat4 = new THREE.Matrix4();
    return function () {
      const sceneEl = this.el;
      if (!sceneEl.is("ar-mode")) return;

      this.reticle.setAttribute("visible", "false");
      const frame = sceneEl.frame;

      if (frame) {
        const viewerPose = frame.getViewerPose(this.refSpace);

        if (this.anchorMode === 1 && this.xrHitTestSource && viewerPose) {
          const hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
          if (hitTestResults.length > 0) {
            const hitTestPose = hitTestResults[0].getPose(this.refSpace);

            ["x", "y", "z"].forEach((axis) => {
              this.reticle.object3D.position[axis] =
                hitTestPose.transform.position[axis];
            });

            this.reticle.object3D.quaternion.copy(
              hitTestPose.transform.orientation
            );
            this.reticle.setAttribute("visible", "true");
          }
        }

        if (frame.trackedAnchors.size > 0 && viewerPose) {
          if (
            this.allAnchors.hitTestAnchor &&
            frame.trackedAnchors.has(this.allAnchors.hitTestAnchor)
          ) {
            const anchor = this.allAnchors.hitTestAnchor;
            const anchorPose = frame.getPose(anchor.anchorSpace, this.refSpace);
            if (anchorPose) {
              ["x", "y", "z"].forEach((axis) => {
                this.redBox.object3D.position[axis] =
                  anchorPose.transform.position[axis];
              });
            }
          }

          this.allAnchors.addedAnchors.forEach((a) => {
            if (frame.trackedAnchors.has(a)) {
              const anchorPose = frame.getPose(a.anchorSpace, this.refSpace);
              if (anchorPose) {
                pos.set(0, 0, -1); //Vector3
                pos.applyMatrix4(mat4.fromArray(anchorPose.transform.matrix));

                a.myobject.object3D.position.copy(pos);
              }
            }
          });
        }
      }
    };
  })()
});
