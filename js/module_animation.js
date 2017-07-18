export {
  animateBack,
  transToZero
};
// ES6 MODULE IMPORT/EXPORT
////////////////////////////




function transToZero(elt, speed) {

  var thisInst = this;
if (speed == undefined) {
  var speed = '250ms ease'
}

  window.getComputedStyle(elt)[thisInst.transformPrefix] // needed to apply the transition style dynamically

  elt.style[thisInst.transitionPrefix] = speed;

  elt.style[thisInst.transformPrefix] = thisInst.ifGpu // translateZ doesn't work for ie9

};

function animateBack(elt, o, thisInst) {



  var eltMarginLeft = o.isVertical ? 0 : elt.completeWidth - elt.offsetWidth; // set margin for horizontal
  if (elt.hasCrossed) {

    var instMovesTo = thisInst.adjInst;

    var adjEltBefore = instMovesTo.elts[thisInst.added.n - 1];
    if (o.isVertical) {

      var adjacentDir = instMovesTo.divOffset.left - thisInst.divOffset.left;
      var animateToPos = thisInst.added.n > 0 ? adjEltBefore.pos.top + adjEltBefore.completeHeight : 0;

      var thisLeft = adjacentDir,
        thisTop = animateToPos,
        thisX = elt.currentPos.left - adjacentDir,
        thisY = elt.currentPos.top - animateToPos;
    } else {

      var adjacentDir = instMovesTo.divOffset.top - thisInst.divOffset.top;
      var animateToPos = thisInst.added.n > 0 ? adjEltBefore.pos.left + adjEltBefore.completeWidth : 0;

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

  elt.style.left = thisLeft + 'px'
  elt.style.top = thisTop + 'px'
  elt.style[thisInst.transformPrefix] = 'translate3d(' + (thisX - eltMarginLeft) + 'px,' + thisY + 'px,0px)';

};
