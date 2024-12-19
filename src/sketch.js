const minDepth = 500;
const maxDepth = 800;
const defaultHeight = 50;
const stripDepth = maxDepth - minDepth;
let sun;
let neonPurple;
let strip;

function setup() {
  neonPurple = color(191, 0, 255);
  neonTurquoise = color(0,253,255);
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(24);
  linePerspective(false);
  pixelDensity(2)
  sun = new Sun(minDepth);
  
  const stripWidth = windowWidth/3.0;
  strip = new Strip(stripWidth, stripDepth, neonPurple, neonTurquoise);
}

function draw() {
  background(0, 0, 0);
  camera(-1, -defaultHeight - 22, maxDepth + 100);
  translate(-1, -defaultHeight, minDepth);

  strip.draw();
  sun.draw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  strip.Resize(windowWidth)
}