export {
  _animateBack,
  _transToZero,
  _scaleElems
};
// ES6 MODULE IMPORT/EXPORT
////////////////////////////

function _transToZero(elt, thisInst, speed) {


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
    if (o.isVertical) {
      var thisTop = thisInst.added.pos.top;
      var thisLeft = thisInst.crossDistance(thisInst, thisInst.newInst);
    } else {
      var thisTop = thisInst.crossDistance(thisInst, thisInst.newInst);
      var thisLeft = thisInst.added.pos.left;
    }
  } else {
    var thisTop = elt.pos.top,
        thisLeft = elt.pos.left;
  }


  elt.style.top = thisTop + 'px';
  elt.style.left = thisLeft + 'px';
  elt.style[thisInst.transformPrefix] = 'translate3d(' + ((elt.currentPos.left - thisLeft) - eltMarginLeft) + 'px,' + (elt.currentPos.top - thisTop) + 'px,0px)';

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
