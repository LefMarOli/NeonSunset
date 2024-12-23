class Sun {
  #red = color(255, 0, 0);
  #black = color(0, 0, 0);
  #yellow = color(255, 255, 0);

  constructor(depth, radius = 50, speed = 0.03, yLimit = 80, numRings = 10) {
    this.depth = depth;
    this.radius = radius;
    this.diameter = radius * 2;
    this.speed = speed;
    this.yLimit = yLimit;
    this.numRings = numRings;

    this.direction = 1;
    this.pos = -yLimit;
    this.posPercent = 1.0;
    this.bandsBaseline = radius;
    this.#calculateStripes();

    this.ringRadius = this.radius + 2;
    this.maxRingRadius = Math.max(this.radius + (10 * this.numRings), this.diameter);
    this.ringSpeed = 0.005;
  }

  #calculateStripes() {
    this.stripes = [];

    let stripeWidth = 1;
    let stripeSpacing = 7;
    let stripeTop = -this.radius;
    let stripeBottom = stripeTop + stripeWidth;

    while (stripeTop < this.radius) {
      this.stripes.push(new Stripe(stripeTop, stripeBottom));

      stripeWidth += 0.5;
      stripeSpacing -= 0.5;

      stripeTop = stripeBottom + stripeSpacing;
      stripeBottom = stripeTop + stripeWidth;
    }
  }

  #calculateNewState() {
    this.#resolveHeight();
    this.posPercent = map(-this.pos, -this.yLimit / 2.0, this.yLimit, 0, 1);
    this.mainColor = lerpColor(this.#red, this.#yellow, this.posPercent);
  }

  #resolveHeight() {
    const x = map(this.pos, -this.yLimit, this.yLimit, -4, 4)
    const y = sigmoid(x);

    let delta = y * this.direction * this.speed * deltaTime;
    if(this.pos + delta > this.yLimit)
      delta = this.yLimit - this.pos;
    if(this.pos + delta < -this.yLimit)
      delta = -this.yLimit - this.pos;

    this.pos += delta;
    this.bandsBaseline -= delta;

    if (this.pos >= this.yLimit && this.direction > 0) this.direction = -1;
    else if (this.pos <= -this.yLimit && this.direction < 0) this.direction = 1;
  }

  #calculateBorder(radius) {
    let startAngle, endAngle;
    if (this.pos + radius > 0) {
      const angle = Math.asin(-this.pos / radius);
      startAngle = PI - angle;
      endAngle = angle;
    } else {
      startAngle = 0;
      endAngle = TWO_PI;
    }
    return [startAngle, endAngle];
  }

  #drawMainCircle() {
    const [startAngle, endAngle] = this.#calculateBorder(this.radius);
    //Draws main color of circle
    push();
    this.#stripesClip(true)
    fill(this.mainColor);
    arc(0, this.pos, this.diameter, this.diameter, startAngle, endAngle, OPEN, 50);
    pop();

    //Draws inside stripes
    const alphaStripes = map(this.posPercent, 0, 1, alpha(this.mainColor), 0);
    const stripeColor = this.mainColor;
    stripeColor.setAlpha(alphaStripes);
    push();
    this.#stripesClip(false)
    fill(stripeColor);
    arc(0, this.pos, this.diameter, this.diameter, startAngle, endAngle, OPEN, 50);
    pop();
  }

  #stripesClip(invert){
    beginClip({ invert: invert});
    this.stripes
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
  }

  #drawRing(color, radius, weight) {
    stroke(color);
    strokeWeight(weight);
    const [startAngle, endAngle] = this.#calculateBorder(radius);
    const diameter = radius * 2;
    arc(0, this.pos, diameter, diameter, startAngle, endAngle, OPEN, 50);
  }

  #drawRings() {
    const  upperAlphaBorder = map(this.posPercent, 0, 1, 50, 175);
    let glowColor = this.mainColor;

    noFill();
    blendMode(LIGHTEST);

    this.ringRadius = this.#shiftRings(this.ringRadius, deltaTime * this.ringSpeed);
    for (let l = 0; l < this.numRings; l++) {


      let r = this.#shiftRings(this.ringRadius, (10 * l));
      
      //Fading with distance
      const alphaAmount = map(r, this.radius, this.maxRingRadius, upperAlphaBorder, 0);
      glowColor.setAlpha(alphaAmount);
      const weight = map(r, this.radius, this.maxRingRadius, 3, 0.1);
      this.#drawRing(glowColor, r, weight);
    }
  }

  #shiftRings(startingValue, offset){
    return ((startingValue - this.radius - 2 + offset) % (this.maxRingRadius - this.radius - 2)) + this.radius + 2;
  }

  draw() {
    this.#calculateNewState();
    push();
    this.#drawMainCircle();
    this.#drawRings();
    pop();
  }
}
