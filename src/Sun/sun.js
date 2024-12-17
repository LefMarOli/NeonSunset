class Sun {
  #red = color(255, 0, 0);
  #yellow = color(255, 255, 0);

  constructor(depth, radius = 50, speed = 0.05, yLimit = 60) {
    this.depth = depth;
    this.radius = radius;
    this.diameter = radius * 2;
    this.speed = speed;
    this.yLimit = yLimit;

    this.direction = 1;
    this.pos = -yLimit;
    this.bandsBaseline = radius;
    this.#calculateBands();

    console.log(this.bands);
  }

  #calculateBands() {
    this.bands = [];

    let bandWidth = 2;
    let bandCenter = -this.radius;
    let bandSpacing = 7;
    let bandTop = bandCenter - bandWidth / 2.0;
    let bandBottom = bandCenter + bandWidth / 2.0;

    while (bandTop < this.radius) {
      this.bands.push(new Band(bandTop, bandBottom));

      bandWidth += 1;
      bandSpacing -= 1;

      bandTop = bandBottom + bandSpacing;
      bandBottom = bandTop + bandWidth;
    }
  }

  #calculateNewState() {
    this.#calculateNewPosition();
    this.#calculateNewBorder();
    this.#calculateNewColor();
  }

  #calculateNewPosition() {
    const x = sigmoid(
      map(this.pos - this.yLimit / 6.0, -this.yLimit, this.yLimit, -4, 4)
    );

    const delta = x * this.direction * this.speed * deltaTime;

    this.pos += delta;
    this.bandsBaseline -= delta;

    if (this.pos > this.yLimit && this.direction > 0) this.direction = -1;
    else if (this.pos < -this.yLimit && this.direction < 0) this.direction = 1;
  }

  #calculateNewBorder() {
    if (this.pos + this.radius > 0) {
      const angle = Math.asin(-this.pos / this.radius);
      this.startAngle = PI - angle;
      this.endAngle = angle;
    } else {
      this.startAngle = 0;
      this.endAngle = 2 * PI;
    }
  }
  
  #calculateNewColor() {
    const amt = map(-this.pos, -this.yLimit / 2.0, this.yLimit, 0, 1);
    this.mainColor = lerpColor(this.#red, this.#yellow, amt);
  }

  #drawContour(fillColor) {
    strokeWeight(1);
    fill(fillColor);
    arc(
      0,
      this.pos,
      this.diameter,
      this.diameter,
      this.startAngle,
      this.endAngle,
      OPEN,
      50
    );
  }

  #fill() {
    push();
    beginClip();
    this.bands
      .filter((b) => b.bottom + this.bandsBaseline + b.width < 0)
      .forEach((b) => {
        rect(
          -this.radius,
          b.bottom + this.bandsBaseline,
          this.diameter,
          b.width
        );
      });
    endClip();
    this.#drawContour(this.#red);
    pop();
  }

  draw() {
    this.#calculateNewState();
    if (this.pos - this.radius > 0) {
      return;
    }

    push();
    this.#drawContour(this.mainColor);
    this.#fill();
    pop();
  }
}
