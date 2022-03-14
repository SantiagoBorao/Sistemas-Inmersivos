AFRAME.registerComponent("change-color-on-gaze", {
  schema: {
    color: { type: "string", default: "#0000ff" }
  },
  init() {
    this.originalColor = this.el.getAttribute("color");
    //this.originalColor = this.el.getAttribute('material').color;
    this.el.addEventListener("mouseenter", () => {
      this.el.setAttribute("color", this.data.color);
    });

    this.el.addEventListener("mouseleave", () => {
      this.el.setAttribute("color", this.originalColor);
    });
  }
});
