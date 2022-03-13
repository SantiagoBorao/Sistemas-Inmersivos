import * as THREE from "https://cdn.skypack.dev/three";
import { quat } from "https://cdn.skypack.dev/gl-matrix";

const { XRWebGLLayer, XRRigidTransform } = window;

(async function () {
  let xrImmersiveRefSpace = null;
  let xrInlineRefSpace = null;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
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

  if (navigator.xr) {
    try {
      if (await navigator.xr.isSessionSupported("immersive-vr")) {
        enterButton.disabled = false;
        enterButton.addEventListener("click", onEnterImmersiveSession);
      }

      const session = await navigator.xr.requestSession("inline");
      await onSessionStarted(session);
    } catch (e) {
      console.log(e);
    }
  }

  async function onEnterImmersiveSession() {
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

  function onXRFrame(time, frame) {
    //const t = window.performance.now() * 0.0001;
    //box.rotation.y = Math.cos(t) * 10;
    const delta = (time - prevTime) * 0.001;
    box.rotation.y += delta;
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

    let refSpace = session.isImmersive ? xrImmersiveRefSpace : xrInlineRefSpace;

    if (!session.isImmersive) {
      refSpace = getAdjustedRefSpace(refSpace);
    }

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

    addInlineViewListeners(renderer.domElement);

    const xrLayer = new XRWebGLLayer(session, gl);
    session.updateRenderState({ baseLayer: xrLayer });

    let refSpaceType = session.isImmersive ? "local" : "viewer";

    const refSpace = await session.requestReferenceSpace(refSpaceType);

    if (session.isImmersive) {
      xrImmersiveRefSpace = refSpace;
    } else {
      xrInlineRefSpace = refSpace;
    }

    session.requestAnimationFrame(onXRFrame);
  }

  let lookYaw = 0;
  let lookPitch = 0;
  const LOOK_SPEED = 0.0025;

  // XRReferenceSpace offset is immutable, so return a new reference space
  // that has an updated orientation.
  function getAdjustedRefSpace(refSpace) {
    // Represent the rotational component of the reference space as a
    // quaternion.
    let invOrientation = quat.create();
    quat.rotateX(invOrientation, invOrientation, -lookPitch);
    quat.rotateY(invOrientation, invOrientation, -lookYaw);
    let xform = new XRRigidTransform(
      { x: 0, y: 0, z: 0 },
      {
        x: invOrientation[0],
        y: invOrientation[1],
        z: invOrientation[2],
        w: invOrientation[3]
      }
    );
    return refSpace.getOffsetReferenceSpace(xform);
  }

  function rotateView(dx, dy) {
    lookYaw += dx * LOOK_SPEED;
    lookPitch += dy * LOOK_SPEED;
    if (lookPitch < -Math.PI * 0.5) lookPitch = -Math.PI * 0.5;
    if (lookPitch > Math.PI * 0.5) lookPitch = Math.PI * 0.5;
  }

  function addInlineViewListeners(canvas) {
    canvas.addEventListener("mousemove", (event) => {
      // Only rotate when the right button is pressed
      if (event.buttons && 2) {
        rotateView(event.movementX, event.movementY);
      }
    });

    // Keep track of touch-related state so that users can touch and drag on
    // the canvas to adjust the viewer pose in an inline session.
    let primaryTouch = undefined;
    let prevTouchX = undefined;
    let prevTouchY = undefined;

    // Keep track of all active touches, but only use the first touch to
    // adjust the viewer pose.
    canvas.addEventListener("touchstart", (event) => {
      if (primaryTouch == undefined) {
        let touch = event.changedTouches[0];
        primaryTouch = touch.identifier;
        prevTouchX = touch.pageX;
        prevTouchY = touch.pageY;
      }
    });

    // Update the set of active touches now that one or more touches
    // finished. If the primary touch just finished, update the viewer pose
    // based on the final touch movement.
    canvas.addEventListener("touchend", (event) => {
      for (let touch of event.changedTouches) {
        if (primaryTouch == touch.identifier) {
          primaryTouch = undefined;
          rotateView(touch.pageX - prevTouchX, touch.pageY - prevTouchY);
        }
      }
    });

    // Update the set of active touches now that one or more touches was
    // cancelled. Don't update the viewer pose when the primary touch was
    // cancelled.
    canvas.addEventListener("touchcancel", (event) => {
      for (let touch of event.changedTouches) {
        if (primaryTouch == touch.identifier) {
          primaryTouch = undefined;
        }
      }
    });

    // Only use the delta between the most recent and previous events for
    // the primary touch. Ignore the other touches.
    canvas.addEventListener("touchmove", (event) => {
      for (let touch of event.changedTouches) {
        if (primaryTouch == touch.identifier) {
          rotateView(touch.pageX - prevTouchX, touch.pageY - prevTouchY);
          prevTouchX = touch.pageX;
          prevTouchY = touch.pageY;
        }
      }
    });
  }
})();
