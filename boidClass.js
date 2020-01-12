const SPEED_FACTOR = 0.005;
const SPEED_LIMIT = 3;

const COHESION_FACTOR = 0.0005;
const SEPARATION_FACTOR = 0.005;
const ALIGNMENT_FACTOR = 0.0012;

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

    this.$boid = $('<svg class="boid" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="fish" class="svg-inline--fa fa-fish fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M327.1 96c-89.97 0-168.54 54.77-212.27 101.63L27.5 131.58c-12.13-9.18-30.24.6-27.14 14.66L24.54 256 .35 365.77c-3.1 14.06 15.01 23.83 27.14 14.66l87.33-66.05C158.55 361.23 237.13 416 327.1 416 464.56 416 576 288 576 256S464.56 96 327.1 96zm87.43 184c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24 13.26 0 24 10.74 24 24 0 13.25-10.75 24-24 24z"></path></svg>');
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
    this.$boid.css({ transform: `rotate(${vAngle(this.velocity) - 1.57079632679}rad)`});
    // render color
    this.$boid.css({ color: mapScalarToColor(this.neighbors.length) });
  }
  
}