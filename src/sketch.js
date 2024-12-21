const minDepth = 500;
const maxDepth = 800;
const defaultHeight = 50;
const stripDepth = maxDepth - minDepth;
let sun;
let neonPurple;
let strip;
let myFont;
let textValue;
let glContext;

function preload() {
  myFont = loadFont('neon-world-font.ttf');
}

function setup() {
  neonPurple = color(191, 0, 255);
  neonTurquoise = color(0,253,255);
  let c = createCanvas(windowWidth, windowHeight, WEBGL);
  glContext = c.GL;
  frameRate(24);
  linePerspective(false);
  pixelDensity(2)
  sun = new Sun(minDepth);
  
  textValue = buildGeometry(textNeon)
  const stripWidth = windowWidth/3.0;
  strip = new Strip(stripWidth, stripDepth, neonPurple, neonTurquoise);
}

function draw() {
  background(0, 0, 0);
  camera(-1, -defaultHeight - 32, maxDepth + 100);
  translate(-1, -defaultHeight, minDepth);

  strip.draw();
  sun.draw();

  //glContext.clear(glContext.DEPTH_BUFFER_BIT);
  //model(textValue);
}

function textNeon() {
  //push();
  translate(-1, -defaultHeight, minDepth);
  textFont(myFont);
  textAlign(CENTER);
  textSize(50);
  const baseColor = color(255,159,226);
  fill(baseColor);

  const message = 'Neon Party';
  const x = 0;
  const y = windowHeight / 4.25;
  text(message, x, y);
  //pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  strip.resize(windowWidth);
}