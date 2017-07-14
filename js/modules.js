export {
  defaults,
  setChars,
  transSupport,
  transitionPrefix,
  transformPrefix,
  ifGpu
};
// ES6 MODULE IMPORT/EXPORT
////////////////////////////

var defaults = {
  isVertical: false,
  setChars: false,
  cutOff: false,
  dropLimit: false,
  hasAdjacent: true,
  // layoutComplete: function() { }
}

function setChars(elt) {
  var left = 0;
  $.each(instanceArr[elt.belongsTo].elts, function(i, e) {
    var v = this.text();
    if (this.hasClass('lower')) {
      // v = v.replace( v.charAt(0), v.charAt(0).toLowerCase());
      this.text(v.replace(v.charAt(0), v.charAt(0).toLowerCase()));
    };
    if (i == 0) {
      //v = v.replace( v.charAt(0), v.charAt(0).toUpperCase() );
      this.text(v.replace(v.charAt(0), v.charAt(0).toUpperCase()));
    };
    this.animate({
      left: left + 'px',
      top: 0
    }, 100);
    left += this.outerWidth(true);
  });
};

var transSupport = (function() {
  var b = document.body || document.documentElement,
    s = b.style,
    p = 'transition';
  if (typeof s[p] == 'string') {
    return true;
  }
  // Tests for vendor specific prop
  var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
  p = p.charAt(0).toUpperCase() + p.substr(1);
  for (var i = 0; i < v.length; i++) {
    if (typeof s[v[i] + p] == 'string') {
      return true;
    }
  }
  return false;
})();

var ifGpu = transSupport ? 'translate3d(0px,0px,0px) translateZ(0)' : 'translate(0px,0px)';
var testElement = document.createElement('div');
var transitionPrefix = "webkitTransition" in testElement.style ? "webkitTransition" : "transition";
var transformPrefix = "webkitTransform" in testElement.style ? "webkitTransform" : "-ms-transform" in testElement.style && transSupport == false ? "-ms-transform" : "transform"; //if ie9
