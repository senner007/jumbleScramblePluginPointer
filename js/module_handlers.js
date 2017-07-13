import {onDrag} from "./module_dragging.js"


export {addHandlers}

function addHandlers () {

  var instanceArr = this.getInstances();
  var targetOffsetY, targetOffsetX, newDx, newDy;
  var transformPrefix = instanceArr.transformPrefix;
  var transitionPrefix = instanceArr.transitionPrefix;
  var transSupport = instanceArr.transSupport;
  // var ifGpu = this.constructor.instanceArr.ifGpu;
  var ul = this.ul;
  var adjCon = this.adjCon;
  var o = this.options;
  var thisElts;
  var constructorThis = this;
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

  ul.style.zIndex = '1'

    $(ul).on(eStart, liSelector, function(e) {
    if (dontTouch == true || e.target.canBeDragged == false) {
      return;
    }
    console.log(e)
    dontTouch = true;

    // flag to prevent multi
    //	e.stopPropagation();

    instanceArr.start = new Date();

    e.preventDefault();
    thisElts = constructorThis.elts;


    move = this;

    move.style[transitionPrefix] = '0s';
    move.style.zIndex = 5;
    //move.addClass('dragging');
    move.className = classDefine + ' dragging';

    elt = thisElts[move.n]

    //console.log(elt instanceof jQuery)
    if (instanceArr[adjCon]) {  instanceArr[adjCon].ul.style.zIndex = '-1' }
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


    if (!dontTouch || instanceArr.interrupt) {
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

    onDrag(elt, thisElts, o, instanceArr);

  };

  function pointerupFunction(e) {


    if (hasMoved) {
      e.target.canBeDragged = false;
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
      constructorThis.onStop(elt, o);
    } else { // if it hasn't moved
      clearClass();
    }

    function clearClass() {
      move.style[transitionPrefix] = 'box-shadow 250ms';
      move.style.zIndex = 1;
      if (instanceArr[adjCon]) {
        instanceArr[adjCon].ul.style.zIndex = '1'
      };
      ul.style.zIndex = '1';

      move.className = classDefine;
      dontTouch = false;
    };
    docElem.removeEventListener(eMove, pointermoveFunction);
    docElem.removeEventListener(eEnd, pointerupFunction);

  }

};
