//Pasamos el nombre de la propiedad que vamos a crear y aplicar a los objetos en el html.
AFRAME.registerComponent("rotatable", {
  //Schema define propiedades del componente. Los atributos de una función por así decirlo.
  schema: {
    //Una propiedad tiene un nombre (si el componente tiene más de una propiedad), un valor predeterminado y un tipo de propiedad
    speed: { type: "number", default: 0.01 }
  },
  //Definimos métodos que manejan el ciclo de vida.
  //Init se llama la primera vez que el componente se conecta a su identidad.
  init() {
    //Los valores del tipo de propiedad del componente están disponibles a través del objeto this.data
    console.log(this.data.speed);
  },
  //tick() se llama en cada fotograma del bucle de renderizado de la escena
  //Modifica continuamente la entidad en cada fotograma o en un intervalo.
  //Obtiene el estado de la entidad en cada fotograma.


  tick() {
    this.el.object3D.rotation.x += this.data.speed;
  }
});
//Ahora podemos usar nuestro componenten rotable en el html. 

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
      //is.el es la referencia a la entidad, en este caso nuestro a-box.
      this.el.emit("right", {});
    } else if (this.t <= -5) {
      document.querySelector("#otherBox").setAttribute("color", "yellow");

      this.direction = 1;
    }

    this.el.object3D.position.x = this.t;
  }
});
