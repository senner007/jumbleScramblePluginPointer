export {onDrag};
// ES6 MODULE IMPORT/EXPORT
////////////////////////////

var posObj = {}

function onDrag(elt, thisInst) { // Drag

 var elts = thisInst.elts,
    o = thisInst.options,
    eltPos = {
      top: elt.currentPos.top,
      left: elt.currentPos.left
    }

 //must be saved to a global object. (Possibly to avoid random
                        // occurrences of non moving objects on ipad)
 var oldPos = posObj; //find the old position stored on the object

  posObj = eltPos; //its current position derived from $draggable object


  if ("adjInst" in thisInst && o.isVertical) {   //vertical
    var adjConElts = thisInst.adjInst.elts;
    var adjacentDir = thisInst.crossDistance();
  //  var adjacentDir = instanceArr[elt.movesTo].divOffset.left - instanceArr[elt.belongsTo].divOffset.left;

    var dirSwitch = (elt.belongsTo % 2 == 0 ? posObj.left > adjacentDir / 2 : posObj.left < adjacentDir / 2);
  }
  if ("adjInst" in thisInst && !o.isVertical) {  // horizontal
    var adjConElts = thisInst.adjInst.elts;
    var adjacentDir = thisInst.crossDistance();
  //  var adjacentDir = instanceArr[elt.movesTo].divOffset.top - instanceArr[elt.belongsTo].divOffset.top;
    var dirSwitch = (elt.belongsTo % 2 == 0 ? posObj.top > adjacentDir / 2 : posObj.top < adjacentDir / 2);
  }

  /*---------------------------------------------------------------------------------------------------------------*/

  // trigger animations for
  // adjacent container if below
  // dropLimit - refactor to add method for horizontal too.


  if (dirSwitch && thisInst.crossTrigger == false && thisInst.adjInst.locked == false) {

    if (o.dropLimit == false || !adjConElts[adjConElts.length - 1] || adjConElts[adjConElts.length - 1].pos.top + adjConElts[adjConElts.length - 1].completeHeight <= thisInst.adjInst.dropLimit) {
      // if droplimit is false - or - if the adjacent container is empty  - or - if the last items position is not above dropLimit then move to new container. Otherwise go back

      var insertPosition = onTrigger.triggerOn(elt, adjConElts, elts, o, thisInst);
      thisInst.added = thisInst.adjInst.addLiElem(elt.textContent, insertPosition, {elt:false,elts:true}, elt.completeHeight, elt.completeWidth);
      thisInst.added.style.display = 'none'
      thisInst.crossTrigger = true;
      elt.hasCrossed = dirSwitch;
    }
  };

  if (!dirSwitch && thisInst.crossTrigger == true && Object.keys(elts).length > 1) { // go back to originating container

    thisInst.crossTrigger = false;
    onTrigger.triggerOff(elt, adjConElts, elts, o, thisInst);
    elt.hasCrossed = dirSwitch;
  };

  /*-------------------------------------------------------------------------------------------------------------*/
  var move;
  if (!o.isVertical && posObj.left != oldPos.left) {             // check whether the move is
    move = (posObj.left > oldPos.left ? 'forward' : 'backward'); // forward, backward, up or down
  } else if (o.isVertical && posObj.top != oldPos.top) {
    move = (posObj.top > oldPos.top ? "down" : "up");
  } else {
    return;
  } // doing nothing


  /*-------------------------------------------------------------------------------------------------------------*/
  var eltsToMove = thisInst.crossTrigger ? adjConElts : elts;
  if (move == 'forward' || 'down') {  onDragElts.eltsMoveForwardOrDown(elt, eltsToMove, thisInst)  };
  if (move == "backward" || 'up') {  onDragElts.eltsMoveBackOrUp(elt, eltsToMove, thisInst) } ;


 };
  /*----------------------------------------------------------------------------------------------------------------*/

var onDragElts = {
  eltsMoveBackOrUp: function(elt, elts, thisInst) {
    var height = thisInst.options.isVertical ? 'completeHeight': 'completeWidth';
    var plane = thisInst.options.isVertical ? 'top': 'left';
    var _elt = elt;
    elt = thisInst.crossTrigger ? thisInst.added : elt;
    if (elt.n > 0) {
      var eltPrev = elts[elt.n - 1];
      var eltPrevBound = eltPrev.pos[plane] + eltPrev[height] / 2;
      if (_elt.currentPos[plane] < eltPrevBound) {
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
  eltsMoveForwardOrDown: function(elt, elts, thisInst, flag) {  // flag disregards elt position check.
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
  /*---------------------------------------------------------------------------------------------------------*/

var onTrigger = {  //These will trigger when the elt is crossing over to connected adjacent container/instance

  triggerOn: function(elt, adjConElts, elts, o, thisInst) {
    var objOffset = o.isVertical ? 'top' : 'left',
        objDimension = o.isVertical ? 'completeHeight' : 'completeWidth';

    for (var i = 0; i < adjConElts.length; i++) { //Loop the array
      if (elt.currentPos[objOffset] <  adjConElts[i].pos[objOffset] +  adjConElts[i][objDimension] / 2) {
          var firstInLoop = i;
          break;
      };
    };
    firstInLoop >= 0 ? firstInLoop : firstInLoop = adjConElts.length;
    // check if firstInLoop is set, if not, set it to the length of the container
    // (dropped after last item)
    // reorder the elements in the originating container
    for (var i = elt.n + 1; i < elts.length; i++) {
      onDragElts.eltsMoveForwardOrDown(elt, elts, thisInst, true);
      // third argument is a flag to override pos check in eltsMoveDown/eltsMoveForward function
    };
    return firstInLoop;
  },
  triggerOff: function(elt, adjConElts, elts, o, thisInst) { // going back to the originating container

     thisInst.adjInst.removeLiElem(thisInst.added, true, false)
     for (var i = 0; i < elts.length - 1; i++) { // Loop over originating Container elements
       onDragElts.eltsMoveBackOrUp(elt, elts, thisInst);
     }
  },
};
