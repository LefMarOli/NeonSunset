class Strip {
    #offset = 0;
  
    constructor(width, depth, color, edgeColor, scl = 10, speed = 0.005) {
      this.width = width;
      this.widthHalf = width / 2.0;
      this.depth = depth;
      this.color = color;
      this.edgeColor = edgeColor;
      this.scl = scl;
      this.speed = speed;
      this.roadWidth = 10;
  
      this.rows = floor(depth / scl);
      this.cols = ceil(width / scl);
      this.map = new Array(this.rows)
        .fill(0)
        .map(() => new Array(this.cols).fill(0));
  
      this.zPos = new Array(this.rows)
        .fill(0)
        .map((_, i) => map(i, 0, this.rows - 1, 0, this.depth));
  
      this.xPos = new Array(this.cols)
        .fill(0)
        .map((_, i) => map(i, 0, this.cols - 1, -this.widthHalf, this.widthHalf));
  
      this.roadLeftEdge = floor(this.cols / 2) - floor(this.roadWidth / 2);
      this.roadRightEdge = floor(this.cols / 2) + floor(this.roadWidth / 2) - 1;
    }

    resize(windowWidth){
      this.width = windowWidth / 4.0;
      this.widthHalf = this.width / 2.0;
    }
  
    draw() {
      push();
  
      linePerspective(false);
      noFill();
      ///this.#drawSkeleton();
      ///this.#drawRoad();
      this.#moveMap();
      this.#drawStrip();
      pop();
    }
  
    #drawSkeleton() {
      stroke(this.color);
      strokeWeight(2);
      line(-this.widthHalf, 0, 0, -this.widthHalf, 0, this.depth);
      line(this.widthHalf, 0, 0, this.widthHalf, 0, this.depth);
      line(-this.widthHalf, 0, 0, this.widthHalf, 0, 0);
    }
  
    #drawRoad() {
      stroke(this.edgeColor);
      strokeWeight(14);
      line(
        this.xPos[this.roadLeftEdge],
        0,
        0,
        this.xPos[this.roadLeftEdge],
        0,
        this.depth
      );
      line(
        this.xPos[this.roadRightEdge],
        0,
        0,
        this.xPos[this.roadRightEdge],
        0,
        this.depth
      );
    }
  
    #moveMap() {
      this.#offset += this.speed * deltaTime;
  
      for (let z = 0; z < this.rows; z++) {
        if (z - this.#offset >= 0) continue;
  
        for (let x = 0; x < this.cols; x++) {
          let value = noise(x * 0.3, (z - this.#offset) * 0.1);
          value = 10 + map(value, 0, 1, 0, -25);
          if (value > 5) value = 5;
  
          if (
            x >= floor(this.cols / 2) - floor(this.roadWidth / 2) &&
            x < floor(this.cols / 2) + floor(this.roadWidth / 2)
          )
            value = 0;
  
          this.map[z][x] = value;
        }
      }
    }
  
    #drawStrip() {
      strokeWeight(2);
      for (let z = 0; z < this.rows - 1; z++) {
        const posPercent = map(z, 0, this.rows - 1, 0, 1);
        const color = lerpColor(this.color, this.edgeColor, posPercent);
        stroke(color)
        beginShape(QUAD_STRIP);
        for (let x = 0; x < this.cols; x++) {
          vertex(this.xPos[x], this.map[z][x], this.zPos[z]);
          vertex(this.xPos[x], this.map[z + 1][x], this.zPos[z + 1]);
        }
  
        endShape();
      }
    }
  }
  