

export {
  animateBack,
  transToZero
 }




function transToZero(elt) {

  var instanceArr = this.constructor.instanceArr;


  window.getComputedStyle(elt)[instanceArr.transformPrefix] // needed to apply the transition style dynamically

  elt.style[instanceArr.transitionPrefix] = '250ms ease';

  elt.style[instanceArr.transformPrefix] = instanceArr.ifGpu // translateZ doesn't work for ie9

};

function animateBack(elt, o, instanceArr) {



  var eltMarginLeft = o.isVertical ? 0 : elt.completeWidth - elt.offsetWidth; // set margin for horizontal
  if (instanceArr.crossTrigger) {

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

  elt.style.left = thisLeft + 'px'
  elt.style.top = thisTop + 'px'
  elt.style[instanceArr.transformPrefix] = 'translate3d(' + (thisX - eltMarginLeft) + 'px,' + thisY + 'px,0px)';

};
