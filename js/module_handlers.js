import {transitionPrefix, transSupport, transformPrefix} from "./module_animation.js"
import {onDrag} from "./module_dragging.js"
import {instanceArr, onStop} from "./module_main.js"

export {addHandlers}

function addHandlers () {

  var targetOffsetY, targetOffsetX, newDx, newDy;
  var div = this.div;
  var ul = this.ul;
  var adjCon = this.adjCon;
  var o = this.options;
  var thisElts;
  var $this = this;
  var move, elt;
  var movePos = {};
  var eStart = 'pointerdown',
    eMove = 'pointermove',
    eEnd = 'pointerup'
  var dontTouch = false;
  var classDefine = o.isVertical == true ? 'listItem' : 'listItem-horizontal',
    liSelector = o.isVertical == true ? '.listItem' : '.listItem-horizontal';
  var startX, startY;
  var hasMoved;
  var docElem = document.documentElement;

  ul[0].style.zIndex = '1'

  function findIndex() {
    var index;
    for (var i = 0; i < thisElts.length; i++) {
      if (thisElts[i][0].className == classDefine + ' dragging') {
        index = i
      }
    };
    return index;
  }
  ul.on(eStart, liSelector, function(e) {
    if (dontTouch == true) {
      return;
    } // flag to prevent multi
  //	e.stopPropagation();

    e.preventDefault();
    thisElts = $this.elts;

    dontTouch = true;
    move = this;

    move.style[transitionPrefix] = '0s';
    move.style.zIndex = 5;
    //move.addClass('dragging');
    move.className = classDefine + ' dragging';
    elt = thisElts[findIndex()]
    if (instanceArr[adjCon]) {  instanceArr[adjCon].ul[0].style.zIndex = '-1' }
    //will also prevent the adjacent ul from
    // responding to touch events

    //if (e.type == 'touchstart') { e = e.originalEvent.touches[0] }
    startX = e.pageX, startY = e.pageY;
    targetOffsetY = e.target.offsetTop;
    targetOffsetX = e.target.offsetLeft;


    docElem.addEventListener(eEnd, pointerupFunction); // refactor to add the once: true object to similar to jquery once. Wait for browser compatibility
    docElem.addEventListener(eMove, pointermoveFunction);


  });

  function pointermoveFunction(e) {

    if (!dontTouch) {
      return;
    }
    //if ($(move).offset().top <  div.offset().top ) {return;}   //containment
    e.preventDefault();
    hasMoved = true; // hasMoved is a flag to clicking items without moving them

    //if (e.type == 'touchmove') { e = e.originalEvent.changedTouches[0]}
    newDx = e.pageX - startX;
    newDy = e.pageY - startY;

    if (transSupport) {
      move.style[transformPrefix] = 'translate3d(' + newDx + 'px, ' + newDy + 'px, 0px) translateZ(0)';
    } else {
      move.style.top = targetOffsetY + movePos.dy + 'px';
      move.style.left = targetOffsetX + movePos.dx + 'px';
    }

    // we need to save last made offset
    movePos = {
      dx: newDx,
      dy: newDy
    };
    //	console.log(e.pageX)

    elt.currentPos.top = targetOffsetY + newDy;
    elt.currentPos.left = targetOffsetX + newDx;
    //	console.log('moving')

    onDrag(elt, thisElts, o);

  };

  function pointerupFunction(e) {
    if (hasMoved) {
      e.preventDefault();
      hasMoved = false;
      clearClass();
      if (transSupport) {
        move.style[transformPrefix] = 'translateZ(0) translate3d(' + 0 + 'px, ' + 0 + 'px, 0px)';
      }
      move.style.top = targetOffsetY + movePos.dy + 'px';
      move.style.left = targetOffsetX + movePos.dx + 'px';
      if (!elt) {
        return;
      }
      onStop(e, elt, div, o);
    } else { // if it hasn't moved
      clearClass();
    }

    function clearClass() {
      move.style[transitionPrefix] = 'box-shadow 250ms';
      move.style.zIndex = 1;
      if (instanceArr[adjCon]) {
        instanceArr[adjCon].ul[0].style.zIndex = '1'
      };
      ul[0].style.zIndex = '1';

      move.className = classDefine;
      dontTouch = false;
    };
    docElem.removeEventListener(eMove, pointermoveFunction);
    docElem.removeEventListener(eEnd, pointerupFunction);

  }

};
