AFRAME.registerComponent("change-color-on-gaze", {
  schema: {
    color: { type: "string", default: "#0000ff" }
  },
  init() {
    this.originalColor = this.el.getAttribute("color");
    //this.originalColor = this.el.getAttribute('material').color;
    
    /*
    * Los eventos mouseenter y mouseleave se dispararán cuando el cursor “se cruce” con la entidad
    * que tenga un componente change-color-on-gaze y cuando “salga” de la entidad.
    */
    this.el.addEventListener("mouseenter", () => {
      this.el.setAttribute("color", this.data.color);
    });

    this.el.addEventListener("mouseleave", () => {
      this.el.setAttribute("color", this.originalColor);
    });
  }
});
