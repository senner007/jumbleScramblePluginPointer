export {
  _animateBack,
  transToZero,
  _scaleElems
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

function _animateBack(elt, o, thisInst) {

  var eltMarginLeft = o.isVertical ? 0 : elt.completeWidth - elt.offsetWidth; // set margin for horizontal
  if (elt.hasCrossed) {
    var adjEltBefore = thisInst.adjInst.elts[thisInst.added.n - 1];
    if (o.isVertical) {
      var thisLeft = thisInst.adjInst.divOffset.left - thisInst.divOffset.left;
      var thisTop = thisInst.added.n > 0 ? adjEltBefore.pos.top + adjEltBefore.completeHeight : 0;
    } else {
      var thisTop = thisInst.adjInst.divOffset.top - thisInst.divOffset.top;
      var thisLeft = thisInst.added.n > 0 ? adjEltBefore.pos.left + adjEltBefore.completeWidth : 0;
    }
    var thisX = elt.currentPos.left - thisLeft,
      thisY = elt.currentPos.top - thisTop;
  } else {
    var thisLeft = elt.pos.left,
      thisTop = elt.pos.top,
      thisX = elt.currentPos.left - thisLeft,
      thisY = elt.currentPos.top - thisTop;
  }

  elt.style.left = thisLeft + 'px'
  elt.style.top = thisTop + 'px'
  elt.style[thisInst.transformPrefix] = 'translate3d(' + (thisX - eltMarginLeft) + 'px,' + thisY + 'px,0px)';

};

function _scaleElems(elems, thisInst) { // should be in animation module, and not on the prototype
 if (elems == undefined) { return; }
  var elems = elems, // elems is an array of elements to scale in after they have been added
    thisInst = thisInst;

  scaleElems('off');

  if (thisInst.transSupport && elems.length != 0) { // transition elements  but only if if there are any

     setTimeout(function() { scaleElems('on'); }, 1);
      // setTimeout is need because transform properties need time to be set.
  }

  function scaleElems(trigger) {
    for (var i = 0; i < elems.length; i++) {
      elems[i].style[thisInst.transitionPrefix] = trigger == 'on' ? '500ms' : '0ms';
      elems[i].style[thisInst.transformPrefix] = trigger == 'on' ? 'scale(1,1)' : 'scale(0,0)';
    }
  }
};
