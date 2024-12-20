function sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
  }
  
  function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
  }
  
  function findXCoordFromCircle(y, R, k) {
    return Math.sqrt(Math.pow(R, 2) - Math.pow(y - k, 2));
  }