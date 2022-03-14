AFRAME.registerSystem("whack", {
  init: function () {
    this.box = document.querySelector("#to-whack");

    this.el.addEventListener("loaded", () => {});

    this.el.addEventListener("mouseenter", (ev) => {
      if (ev.detail.intersetedEl && ev.detail.intersectedEl.id !== "to-whack")
        return;
      const [x, y] = randomPosition(this.box);
    });

    this.el.addEventListener("init", (e) => {
      console.log("init", e);
    });
    this.el.addEventListener("mouseleave", () => {});
  },

  tick: (function () {
    let timer = 0;

    return function (t, td) {
      timer += parseInt(td);
      if (timer >= 1000) {
        const material = this.box.getAttribute("material");
        this.box.setAttribute("material", "opacity", material.opacity - 0.2);
        timer = 0;
        if (material.opacity <= 0.2) {
          randomPosition(this.box);
        }
      }
    };
  })()
});

function randomPosition(entity) {
  entity.setAttribute("material", "opacity", "1.0");
  let x = Math.floor(Math.random() * 6);
  x *= Math.random() > 0.5 ? 1 : -1;

  let y = Math.floor(Math.random() * 4);
  entity.object3D.position.x = x;
  entity.object3D.position.y = y;
  return [x, y];
}
