export {eltsReorder, _elemsToCut};

// ES6 MODULE IMPORT/EXPORT
////////////////////////////

var eltsReorder = {
  _eltsMoveForwardOrDown: function(elt, elts, thisInst, flag ) {
    var height = thisInst.options.isVertical ? 'completeHeight': 'completeWidth';
    var plane = thisInst.options.isVertical ? 'top': 'left';
    var _elt = elt;
    elt = thisInst.crossTrigger ? thisInst.added : elt;
    if (elt.n > 0) {
      var eltPrev = elts[elt.n - 1];
      var eltPrevBound = eltPrev.pos[plane] + eltPrev[height] / 2;
      if (_elt.currentPos[plane] < eltPrevBound || flag) {
        elt.pos[plane] = eltPrev.pos[plane];
        eltPrev.pos[plane] += elt[height];
        elts[elt.n] = eltPrev;
        elts[elt.n - 1] = elt;
        elts[elt.n].n = elt.n;
        elt.n = elt.n - 1;

        this.eltsAnimate(-(elt[height]), eltPrev, thisInst)
      }
    }
  },
  _eltsMoveBackOrUp: function(elt, elts, thisInst, flag) {  // flag disregards elt position check.
                                                    // The third argument is the added element on crossTrigger and a boolean
                                                    // when ordering the container the elt is moving from.

    var height = thisInst.options.isVertical ? 'completeHeight': 'completeWidth';
    var plane = thisInst.options.isVertical ? 'top': 'left';
    var _elt = elt;
    elt = thisInst.crossTrigger ? thisInst.added : elt;
      if ( elt.n < elts.length - 1) {

      var eltNext = elts[elt.n +1];
      var eltNextBound = eltNext.pos[plane] + eltNext[height] / 2;
      if (_elt.currentPos[plane] + _elt[height] > eltNextBound || flag) {

        eltNext.pos[plane] = elt.pos[plane];
        elt.pos[plane] += eltNext[height];
        elts[elt.n] = eltNext;
        elts[elt.n + 1] = elt;
        elts[elt.n].n = elt.n;
        elt.n = elt.n + 1;

        this.eltsAnimate(elt[height], eltNext, thisInst)
      }
    }
  },
  eltsAnimate: function(eltDimension, elem, thisInst) {
    var dir = elem.o.isVertical ? 'top' : 'left';
    //var dirTranslate = elem.o.isVertical ? 'translateY(' : 'translateX(';

    elem.style[thisInst.transitionPrefix] = '0s';
    elem.style[dir] = elem.pos[dir] + 'px';
    elem.style[thisInst.transformPrefix] = elem.o.isVertical ? 'translate3d(0px,' + eltDimension + 'px, 0px)' : 'translate3d(' + eltDimension + 'px, 0px, 0px)'
    thisInst.transToZero(elem);
  },
}

function _elemsToCut(thisInst, adjInst) {
  if (adjInst.props.cutOff == false) { return function () {};}

  var elemsToCut = []
  var size =0;
  var height = adjInst.options.isVertical ? 'completeHeight': 'completeWidth';

  for (var i = 0; i<adjInst.elts.length; i++) {
        size += adjInst.elts[i][height]
  }

  var counter = -1;
    while (size > adjInst.props.cutOff) {
      elemsToCut.splice(0, 0, adjInst.elts[adjInst.elts.length + counter])
      size -= adjInst.elts[adjInst.elts.length + counter][height]
      counter -= 1
    }

    var tempArr = [];
    if (elemsToCut.length != 0) {

      for (var i = 0; i< elemsToCut.length; i++) {
        tempArr.push(  thisInst.addLiElem(elemsToCut[i].textContent, 0, {elt: false, elts: true}, elemsToCut[i].completeHeight, elemsToCut[i].completeWidth))
        adjInst.removeLiElem(adjInst.elts[adjInst.elts.length - 1], adjInst.transSupport, false)

      }

    }
    return tempArr;


}
