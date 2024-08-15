function sigmoid(z) {
    return Math.exp(z) / Math.pow(1 + Math.exp(z), 2);
  }
  
  function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
  }
  
  function findXCoordFromCircle(y, R, k) {
    return Math.sqrt(Math.pow(R, 2) - Math.pow(y - k, 2));
  }