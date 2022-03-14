/*eslint-disable*/
AFRAME.registerComponent("dom-overlays-system", {
  schema: {},
  init: function () {
    this.el.sceneEl.addEventListener("enter-vr", (e) => {
      if (!this.el.sceneEl.is("ar-mode")) return;

      const button = document.querySelector("#btn-change-color");
      const boxEl = document.querySelector("a-box");

      button.addEventListener("click", function () {
        boxEl.setAttribute(
          "color",
          "#" + (((1 << 24) * Math.random()) | 0).toString(16)
        );
      });

      button.addEventListener("beforexrselect", (e) => {
        e.preventDefault();
      });
    });
  },

  tick: function () {}
});
