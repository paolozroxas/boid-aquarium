const SPEED_FACTOR = 0.001;
const NEIGHBOR_THRESHOLD_FACTOR = 0.15;
const COHESION_FACTOR = 0.001;

class Boid {
  constructor(fieldWidth, fieldHeight, $field) {
    this.position = {
      x: _.random(fieldWidth, true),
      y: _.random(fieldHeight, true),
    };
    this.velocity = {
      x: _.random(-fieldWidth * SPEED_FACTOR, fieldWidth * SPEED_FACTOR, true),
      y: _.random(-fieldHeight * SPEED_FACTOR, fieldHeight * SPEED_FACTOR, true),
    };
    this.fieldWidth = fieldWidth;
    this.fieldHeight = fieldHeight;
    this.neighborThreshold = fieldHeight * NEIGHBOR_THRESHOLD_FACTOR;

    this.$boid = $('<div class="boid" />');
    $field.append(this.$boid);
  }

  getNeighbors(boids) {
    return boids.filter((boid) => (
      this !== boid &&
      distance(this.position, boid.position) <= this.neighborThreshold
    ));
  }

  getCohesionVector(boids) {
    if (boids.length <= 0) {
      return { x: 0, y: 0};
    }

    const centerOfMass = vMultiplyScalar(
      1 / boids.length,
      vAdd(...boids.map(boid => boid.position)),
    );

    return vMultiplyScalar(
      COHESION_FACTOR,
      vSubtract(centerOfMass, this.position),
    );
  }

  getSeparationVector(boids) {

  }

  getAlignmentVector(boids) {

  }

  updateVelocity(boids) {
    // combines velocity and vectors from all three rules
    const neighbors = this.getNeighbors(boids);
    const cohesionVector = this.getCohesionVector(neighbors);

    this.velocity = vAdd(
      this.velocity,
      cohesionVector,
    );
  }

  updatePosition() {
    const newPosition = vAdd(this.position, this.velocity);
    
    if (newPosition.x > 0) {
      this.position.x = newPosition.x % this.fieldWidth;
    } else {
      this.position.x = this.fieldWidth + newPosition.x;
    }

    if (newPosition.y > 0) {
      this.position.y = newPosition.y % this.fieldHeight;
    } else {
      this.position.y = this.fieldHeight + newPosition.y;
    }
  }

  update(boids) {
    this.updateVelocity(boids);
    this.updatePosition();
  }

  render() {
    this.$boid.css({ bottom: this.position.y, left: this.position.x });
  }
  
}