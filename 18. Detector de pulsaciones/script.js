/*eslint-disable*/
AFRAME.registerSystem("input-source", {
  schema: {},
  init: function () {
    this.el.addEventListener("enter-vr", () => {
      if (!this.el.sceneEl.is("ar-mode")) return;

      this.session = this.el.sceneEl.renderer.xr.getSession();

      console.log(this.session.inputSources);

      this.session.addEventListener("selectstart", (e) => {
        console.log(e);
        console.log(this.session.inputSources);
      });

      this.session.addEventListener("select", (e) => {
        console.log(e);
      });

      this.session.addEventListener("selectend", (e) => {
        console.log(e);
      });
    });
  },

  tick: function () {
    if (!this.session) return;
    if (this.session.inputSources.length > 0) {
      this.session.inputSources.forEach((inputSource) => {
        //console.log(inputSource.gamepad.axes[0]);
      });
    }
  }
});
