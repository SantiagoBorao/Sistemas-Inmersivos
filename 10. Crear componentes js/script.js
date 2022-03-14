AFRAME.registerComponent("rotatable", {
  schema: {
    speed: { type: "number", default: 0.01 }
  },
  init() {
    console.log(this.data.speed);
  },
  tick() {
    this.el.object3D.rotation.x += this.data.speed;
  }
});

AFRAME.registerComponent("movable", {
  schema: {
    speed: { type: "number", default: 1 }
  },
  init() {
    this.t = 0;
    this.direction = 1;
    this.then = 0;
    console.log(this.data);
  },

  tick(now) {
    let delta = (now - this.then) / 1000;
    this.t += this.data.speed * this.direction * delta;

    this.then = now;
    if (this.t >= 5) {
      document.querySelector("#otherBox").setAttribute("color", "blue");
      this.direction = -1;
      this.el.emit("right", {});
    } else if (this.t <= -5) {
      document.querySelector("#otherBox").setAttribute("color", "yellow");

      this.direction = 1;
    }

    this.el.object3D.position.x = this.t;
  }
});
