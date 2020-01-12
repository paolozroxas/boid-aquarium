const SPEED_FACTOR = 0.005;
const SPEED_LIMIT = 3;

const COHESION_FACTOR = 0.0005;
const SEPARATION_FACTOR = 0.005;
const ALIGNMENT_FACTOR = 0.001;

const NEIGHBOR_DISTANCE_THRESHOLD = 150;
const SEPARATION_DISTANCE_THRESHOLD = 15;

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

    this.$boid = $('<div class="boid" />');
    $field.append(this.$boid);
  }

  getNeighbors(boids) {
    return boids.filter((boid) => (
      this !== boid &&
      distance(this.position, boid.position) <= NEIGHBOR_DISTANCE_THRESHOLD
    ));
  }

  getCohesionVector(boids) {
    if (boids.length <= 0) {
      return { x: 0, y: 0 };
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
    let separationVector = { x: 0, y: 0 };

    boids.forEach((boid) => {
      const displacement = vSubtract(boid.position, this.position);
      if (vMagnitude(displacement) <= SEPARATION_DISTANCE_THRESHOLD) {
        separationVector = vSubtract(separationVector, displacement);
      }
    });

    return vMultiplyScalar(
      SEPARATION_FACTOR,
      separationVector,
    );
  }

  getAlignmentVector(boids) {
    if (boids.length <= 0) {
      return { x: 0, y: 0 };
    }

    const centerOfVelocity = vMultiplyScalar(
      1 / boids.length,
      vAdd(...boids.map(boid => boid.velocity)),
    );

    return vMultiplyScalar(
      ALIGNMENT_FACTOR,
      vSubtract(centerOfVelocity, this.velocity),
    );
  }

  updateVelocity() {
    // combines velocity and vectors from all three rules

    this.velocity = vAdd(
      this.velocity,
      this.getCohesionVector(this.neighbors),
      this.getSeparationVector(this.neighbors),
      this.getAlignmentVector(this.neighbors),
    );

    // account for the speed limit
    const speed = vMagnitude(this.velocity);
    if (speed > SPEED_LIMIT) {
      this.velocity = vMultiplyScalar(1 / speed, this.velocity);
      this.velocity = vMultiplyScalar(SPEED_LIMIT, this.velocity);
    }
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
    this.neighbors = this.getNeighbors(boids);
    this.updateVelocity();
    this.updatePosition();
  }

  render() {
    // render position
    this.$boid.css({ bottom: this.position.y, left: this.position.x });
    // render rotation
    this.$boid.css({ transform: `rotate(${vAngle(this.velocity)}rad)`});
    // render color
    this.$boid.css({ borderBottomColor: mapScalarToColor(this.neighbors.length) });
  }
  
}