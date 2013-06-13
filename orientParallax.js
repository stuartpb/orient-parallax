function orientParallax(element,opts){
  opts = opts || {};
  var yFactor = opts.yFactor === undefined ? 50 : opts.yFactor;
  var yOffset = opts.yOffset === undefined ? 50 : opts.yOffset;
  var xFactor = opts.xFactor === undefined ? 50 : opts.xFactor;
  var xOffset = opts.xOffset === undefined ? 50 : opts.xOffset;
  
  var centerAlpha = null;
  
  function orientationListener(evt){
    var alpha = evt.alpha;
    
    // Set center alpha the first time
    if (centerAlpha === null) centerAlpha = alpha;
    
    var alphaDelta = (centerAlpha + 180 - alpha) % 360 - 180;
    
    // Lock to a 90-degree cone
    if (Math.abs(alphaDelta) > 45) {
      centerAlpha = alpha + (alphaDelta < 0 ? -45 : 45);
    }
    var beta = evt.beta;
    
    //Firefox fixes
    if (/Firefox/.test(navigator.userAgent)) {
      beta = -beta;
    }
    
    element.style.backgroundPosition =
      ((alphaDelta / 45) * xFactor + xOffset) + '% '
      + ((-1 + (beta / 90)) * yFactor + yOffset) + '%';
  }
  window.addEventListener('deviceorientation',orientationListener);
  
  return orientationListener;
}