const minDepth = 500;
const maxDepth = 800;
const defaultHeight = 50;
const stripWidth = 200;
const stripDepth = maxDepth - minDepth;
let sun;
let neonPurple;
let strip;

function setup() {
  neonPurple = color(191, 0, 255);
  neonTurquoise = color(0,253,255);
  createCanvas(900, 600, WEBGL);
  frameRate(24);
  linePerspective(false);
  sun = new Sun(minDepth);
  strip = new Strip(stripWidth, stripDepth, neonPurple, neonTurquoise);
}

function draw() {
  background(0, 0, 0);

  camera(0, -defaultHeight - 22, maxDepth + 100);
  translate(0, -defaultHeight, minDepth);

  strip.draw();
  sun.draw();
}