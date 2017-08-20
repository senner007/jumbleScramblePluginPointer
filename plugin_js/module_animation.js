import {
  setEvents
} from "./module_utils.js"

export {
  _animateBack,
  _transToZero,
  _scaleElems
};
// ES6 MODULE IMPORT/EXPORT
////////////////////////////

function _transToZero(elt, thisInst, speed) {
  if (speed == undefined) { var speed = '250ms ease' }
  window.getComputedStyle(elt)[thisInst.transformPrefix] // needed to apply the transition style dynamically
  elt.style[thisInst.transitionPrefix] = speed;
  elt.style[thisInst.transformPrefix] = thisInst.ifGpu // translateZ doesn't work for ie9
  // Refactor into cssText line !!!!!!!!!!!!!!!
};

function _animateBack(elt, thisInst) {
  var o = thisInst.options;

  var eltMarginLeft = o.isVertical ? 0 : elt.props.completeWidth - elt.offsetWidth; // set margin for horizontal
  if (thisInst.crossFlag && thisInst.newInst) {

    if (o.isVertical) {
      var thisTop = thisInst.added.props.pos.top;
      var thisLeft = thisInst.crossDistance(thisInst, thisInst.newInst);
      var diff = Math.abs ( thisInst.props.divWidth - thisInst.newInst.props.divWidth)


    } else {
      var thisTop = thisInst.crossDistance(thisInst, thisInst.newInst);
      var thisLeft = thisInst.added.props.pos.left;

    }
  } else {
    var thisTop = elt.props.pos.top,
        thisLeft = elt.props.pos.left;
  }

// Refactor into cssText line !!!!!!!!!!!!!!!
console.log(diff)
  if (diff > 2) {
    elt.style.width = thisInst.newInst.props.divWidth + 'px'
    elt.style[thisInst.transitionPrefix] = 'width 200ms';
  }

  elt.style.top = thisTop + 'px';
  elt.style.left = thisLeft + 'px';
  elt.style[thisInst.transformPrefix] = 'translate3d(' + ((elt.props.currentPos.left - thisLeft) - eltMarginLeft) + 'px,' + (elt.props.currentPos.top - thisTop) + 'px,0px)';

};

function _scaleElems(elems, thisInst) {
 if (elems == undefined) { return; }
 var elems = elems, // elems is an array of elements to scale in after they have been added
    thisInst = thisInst;

  scaleElems('off');

  if (thisInst.transSupport && elems.length != 0) { // transition elements  but only if if there are any

     setTimeout(function() {scaleElems('on');}, 1);
      // setTimeout is need because transform properties need time to be set.
  }
  function scaleElems(trigger) {
    for (var i = 0; i < elems.length; i++) {
      // Refactor into cssText line !!!!!!!!!!!!!!!
      elems[i].style[thisInst.transitionPrefix] = trigger == 'on' ? '500ms' : '0ms';
      elems[i].style[thisInst.transformPrefix] = trigger == 'on' ? 'scale(1,1)' : 'scale(0,0)';
    }
  }
  return elems.length
};
