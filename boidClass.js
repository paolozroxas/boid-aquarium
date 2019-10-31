const SPEED_FACTOR = 0.001;

class Boid {
  constructor(fieldWidth, fieldHeight, $field) {
    this.x = _.random(fieldWidth, true),
    this. y =_.random(fieldHeight, true),
    this.vx = _.random(-fieldWidth * SPEED_FACTOR, fieldWidth * SPEED_FACTOR, true),
    this.vy = _.random(-fieldHeight * SPEED_FACTOR, fieldHeight * SPEED_FACTOR, true),
    this.fieldWidth = fieldWidth;
    this.fieldHeight = fieldHeight;

    this.$boid = $('<div class="boid" />');
    $field.append(this.$boid);
  }

  render() {
    this.$boid.css({ bottom: this.y, left: this.x });
  }

  updateState() {
    let newX = this.x + this.vx;
    let newY = this.y + this.vy;
    
    if (newX > 0) {
      this.x = newX % this.fieldWidth;
    } else {
      this.x = this.fieldWidth + newX;
    }

    if (newY > 0) {
      this.y = newY % this.fieldHeight;
    } else {
      this.y = this.fieldHeight + newY;
    }
  }
}