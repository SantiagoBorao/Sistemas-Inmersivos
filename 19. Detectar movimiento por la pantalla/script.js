/*eslint-disable*/

function map(n, in_min, in_max, out_min, out_max) {
  return ((n - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

AFRAME.registerSystem("input-source", {
  schema: {},
  init: function () {
    this.el.addEventListener("enter-vr", () => {
      if (!this.el.sceneEl.is("ar-mode")) return;

      this.session = this.el.sceneEl.renderer.xr.getSession();
    });
  },

  tick: function () {
    if (!this.session) return;
    if (this.session.inputSources.length > 0) {
      const inputSource = this.session.inputSources[0];
      const [x, y] = inputSource.gamepad.axes;
      let touch_x = map(x, -1, 1, 0, window.innerWidth);
      let touch_y = map(y, -1, 1, 0, window.innerHeight);
      console.log(touch_x, touch_y);
    }
  }
});
