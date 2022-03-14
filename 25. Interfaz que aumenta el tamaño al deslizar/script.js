/*eslint-disable*/
AFRAME.registerComponent("dom-overlays-system", {
  schema: {},
  init: function () {
    this.el.sceneEl.addEventListener("enter-vr", (e) => {
      if (!this.el.sceneEl.is("ar-mode")) return;

      const range = document.querySelector("#range");
      const boxEl = document.querySelector("a-box");

      range.addEventListener("input", (e) => {
        boxEl.object3D.scale.set(
          e.target.value,
          e.target.value,
          e.target.value
        );
      });

      range.addEventListener("beforexrselect", (e) => {
        e.preventDefault();
      });
    });
  },

  tick: function () {}
});
