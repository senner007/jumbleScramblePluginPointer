import {posObj} from "./module_dragging.js"
import {instanceArr} from "./module_main.js"
export {
  transSupport,
  ifGpu,
  transitionPrefix,
  transformPrefix,
  animateBack,
  transToZero
 }


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

function transToZero(elt) {
  var elt = elt[0];

  window.getComputedStyle(elt)[transformPrefix] // needed to apply the transition style dynamically

  elt.style[transitionPrefix] = '250ms ease';

  elt.style[transformPrefix] = ifGpu // translateZ doesn't work for ie9

};

function animateBack(elt, o) {

  var eltMarginLeft = o.isVertical ? 0 : elt.completeWidth - elt[0].offsetWidth; // set margin for horizontal
  if (posObj.crossTrigger) {

    var instMovesTo = instanceArr[elt.movesTo];
    var adjEltBefore = instMovesTo.elts[elt.insertPos - 1];
    if (o.isVertical) {

      var adjacentDir = instMovesTo.divOffset.left - instanceArr[elt.belongsTo].divOffset.left;
      var animateToPos = elt.insertPos > 0 ? adjEltBefore.pos.top + adjEltBefore.completeHeight : 0;

      var thisLeft = adjacentDir,
        thisTop = animateToPos,
        thisX = elt.currentPos.left - adjacentDir,
        thisY = elt.currentPos.top - animateToPos;
    } else {

      var adjacentDir = instMovesTo.divOffset.top - instanceArr[elt.belongsTo].divOffset.top;
      var animateToPos = elt.insertPos > 0 ? adjEltBefore.pos.left + adjEltBefore.completeWidth : 0;

      var thisLeft = animateToPos,
        thisTop = adjacentDir,
        thisX = elt.currentPos.left - animateToPos,
        thisY = elt.currentPos.top - adjacentDir;
    }
  } else {
    var thisLeft = elt.pos.left,
      thisTop = elt.pos.top,
      thisX = elt.currentPos.left - elt.pos.left,
      thisY = elt.currentPos.top - elt.pos.top;
  }

  elt[0].style.left = thisLeft + 'px'
  elt[0].style.top = thisTop + 'px'
  elt[0].style[transformPrefix] = 'translate3d(' + (thisX - eltMarginLeft) + 'px,' + thisY + 'px,0px)';

};
