class Field {
  constructor(boidCount, fieldWidth, fieldHeight) {
    // create DOM element
    this.$field = $('<div class="field" />');
    this.$field.css({ width: fieldWidth, height: fieldHeight });
    $('#app').append($(this.$field));

    // create boids
    this.boids = _.times(boidCount, () => new Boid(
      fieldWidth,
      fieldHeight,
      this.$field,
    ));

    const speeds = this.boids.map((boid) => {
      return vMagnitude(boid.velocity);
    });
    console.log("TCL: Field -> constructor -> speeds", speeds)
    
    
    this.render();
  }

  render() {
    this.boids.forEach((boid) => boid.render());
  }

  updateBoids() {
    this.boids.forEach((boid) => boid.update(this.boids));
  }

  tick() {
    this.updateBoids();
    this.render();
  }
}