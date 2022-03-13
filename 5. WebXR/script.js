import * as THREE from "https://cdn.skypack.dev/three";

const { XRWebGLLayer } = window;

(async function () {
  let xrImmersiveRefSpace = null;
  let xrInlineRefSpace = null;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const fov = 75;
  const aspectRatio = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera({ fov, aspectRatio, near, far });

  const geometry = new THREE.BoxGeometry();
  const cubeMaterials = new Array(6);
  for (let i = 0; i < cubeMaterials.length; i++) {
    cubeMaterials[i] = new THREE.MeshBasicMaterial({
      color: Math.random() * 0xffffff
    });
  }
  const box = new THREE.Mesh(geometry, cubeMaterials);
  box.position.z = -5;
  box.position.y = 1;
  box.rotation.x = (45 * Math.PI) / 180;
  box.rotation.y = (45 * Math.PI) / 180;
  scene.add(box);

  const enterButton = document.querySelector("#enter-vr-button");
  enterButton.disabled = true;

  // async/await
  // then()
  if (navigator.xr) {
    try {
      if (await navigator.xr.isSessionSupported("immersive-vr")) {
        enterButton.disabled = false;
        enterButton.addEventListener("click", onEnterImmersiveSession);
      }

      //XRSession
      const session = await navigator.xr.requestSession("inline");
      await onSessionStarted(session);
    } catch (e) {
      console.log(e);
    }
    // Poner aquí el código para proporcionar un mensaje al usuario de que
    // el navegador no tiene webxr
  }

  async function onEnterImmersiveSession() {
    console.log("enter immersive session");
    //XRSession
    const session = await navigator.xr.requestSession("immersive-vr");
    enterButton.style.display = "none";

    session.isImmersive = true;
    await onSessionStarted(session);
  }

  function onSessionEnded(event) {
    // Only reset the button when the immersive session ends.
    if (event.session.isImmersive) {
      enterButton.style.display = "block";
      enterButton.disabled = false;
    }
  }

  let prevTime = 0;

  //XRFrame
  function onXRFrame(time, frame) {
    box.rotation.y += 0.01;
    prevTime = time;
    const session = frame.session;
    if (!session) {
      scene.matrixAutoUpdate = true;
      renderer.render(scene, camera);
    }

    if (!frame) return;

    renderer.autoClear = false;
    camera.matrixAutoUpdate = false;
    renderer.clear();

    //XRReferenceSpace
    let refSpace = session.isImmersive ? xrImmersiveRefSpace : xrInlineRefSpace;

    let pose = frame.getViewerPose(refSpace);

    if (pose) {
      const xrLayer = session.renderState.baseLayer;
      for (let view of pose.views) {
        const viewport = xrLayer.getViewport(view);
        renderer.setViewport(
          viewport.x,
          viewport.y,
          viewport.width,
          viewport.height
        );
        const viewMatrix = view.transform.inverse.matrix;
        camera.projectionMatrix.fromArray(view.projectionMatrix);
        camera.matrix.fromArray(viewMatrix).invert();
        camera.updateMatrixWorld(true);
        renderer.render(scene, camera);
      }
    }

    session.requestAnimationFrame(onXRFrame);
  }

  async function onSessionStarted(session) {
    session.addEventListener("end", onSessionEnded);

    renderer.xr.enabled = true;
    const gl = renderer.getContext("webgl2", { xrCompatible: true });

    function onResize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.devicePixelRatio;
      camera.updateProjectionMatrix();
    }

    window.addEventListener("resize", onResize);
    onResize();

    const xrLayer = new XRWebGLLayer(session, gl);
    session.updateRenderState({ baseLayer: xrLayer });

    let refSpaceType = session.isImmersive ? "local" : "viewer";

    //XRReferenceSpace
    const refSpace = await session.requestReferenceSpace(refSpaceType);

    if (session.isImmersive) {
      xrImmersiveRefSpace = refSpace;
    } else {
      xrInlineRefSpace = refSpace;
    }

    session.requestAnimationFrame(onXRFrame);
  }
})();
