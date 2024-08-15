class Sun {
    #redColor = color(255, 0, 0);
  
    constructor(depth, radius = 50, speed = 0.05, yLimit = 60) {
      this.depth = depth;
      this.radius = radius;
      this.speed = speed;
      this.yLimit = yLimit;
  
      this.direction = 1;
      this.pos = -yLimit;
    }
  
    #calculateNewPosition() {
      let x = sigmoid(
        map(this.pos - this.yLimit / 6.0, -this.yLimit, this.yLimit, -4, 4)
      );
      this.pos += x * this.direction * this.speed * deltaTime;
  
      if (this.pos > this.yLimit && this.direction > 0) this.direction = -1;
      else if (this.pos < -this.yLimit && this.direction < 0) this.direction = 1;
    }
  
    #drawContour() {
      let startAngle;
      let endAngle;
      if (this.pos + this.radius > 0) {
        const angle = Math.asin(-this.pos / this.radius);
        startAngle = PI - angle;
        endAngle = angle;
      } else {
        startAngle = 0;
        endAngle = 2 * PI;
      }
  
      strokeWeight(1);
      stroke(this.#redColor);
      arc(
        0,
        this.pos,
        this.radius * 2,
        this.radius * 2,
        startAngle,
        endAngle,
        OPEN,
        50
      );
    }
  
    #drawContent() {
      const c2 = color(255, 255, 0);
      const amt = map(-this.pos, 0, this.yLimit, 0, 1);
      const c3 = lerpColor(this.#redColor, c2, amt);
  
      stroke(c3);
      const sunTop = this.pos - this.radius + 0.2;
      const sunBottom = this.pos + this.radius + 0.2;
      const step = (sunTop - sunBottom) / 10;
  
      let x;
      for (let y = min(sunTop, 0); y < min(sunBottom, 0); y += 0.7) {
        x = findXCoordFromCircle(y, this.radius, this.pos);
  
        line(-x, y, 0, x, y, 0);
      }
    }
  
    draw() {
      this.#calculateNewPosition();
      if (this.pos - this.radius > 0) {
        return;
      }
  
      push();
      this.#drawContour();
      this.#drawContent();
      pop();
    }
  }
  