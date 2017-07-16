export {onDrag};
// ES6 MODULE IMPORT/EXPORT
////////////////////////////

var posObj = {}

function onDrag(elt, elts, o, instanceArr) { // Drag

  var eltPos = {
    top: elt.currentPos.top,
    left: elt.currentPos.left
  }

  var thisElt = posObj; //must be saved to a global object. (Possibly to avoid random
                        // occurrences of non moving objects on ipad)
  var oldPos = (thisElt.eltPos != null ? thisElt.eltPos : eltPos); //find the old position stored on the $object
  thisElt.eltPos = eltPos; //its current position derived from $draggable object


  if (instanceArr.length > 1 && o.isVertical) {   //vertical
    var adjConElts = instanceArr[elt.movesTo].elts;
    var adjacentDir = instanceArr[elt.belongsTo].crossDistance();
  //  var adjacentDir = instanceArr[elt.movesTo].divOffset.left - instanceArr[elt.belongsTo].divOffset.left;

    var dirSwitch = (elt.belongsTo % 2 == 0 ? thisElt.eltPos.left > adjacentDir / 2 : thisElt.eltPos.left < adjacentDir / 2);
  }
  if (instanceArr.length > 1 && !o.isVertical) {  // horizontal
    var adjConElts = instanceArr[elt.movesTo].elts;
    var adjacentDir = instanceArr[elt.belongsTo].crossDistance()
  //  var adjacentDir = instanceArr[elt.movesTo].divOffset.top - instanceArr[elt.belongsTo].divOffset.top;
    var dirSwitch = (elt.belongsTo % 2 == 0 ? thisElt.eltPos.top > adjacentDir / 2 : thisElt.eltPos.top < adjacentDir / 2);
  }

  /*--------------------------------------------------------------------*/

  // trigger animations for
  // adjacent container if below
  // dropLimit - refactor to add method for horizontal too.

  if (dirSwitch && instanceArr.crossTrigger == false && instanceArr[elt.movesTo].locked == false) {

    if (o.dropLimit == false || !adjConElts[adjConElts.length - 1] || adjConElts[adjConElts.length - 1].pos.top + adjConElts[adjConElts.length - 1].completeHeight <= instanceArr[elt.movesTo].dropLimit) {
      // if droplimit is false - or - if the adjacent container is empty  - or - if the last items position is not above dropLimit then move to new container. Otherwise go back

      var insertPosition = onTrigger.triggerOn(elt, adjConElts, elts, o);
      instanceArr.added = instanceArr[elt.movesTo].addLiElem(elt.textContent, insertPosition, true, elt.completeHeight, elt.completeWidth);
      instanceArr.added.style.display = 'none'
      instanceArr.crossTrigger = true;
      elt.hasCrossed = dirSwitch;
    }
  };

  if (!dirSwitch && instanceArr.crossTrigger == true && Object.keys(elts).length > 1) { // go back to originating container

    instanceArr.crossTrigger = false;
    onTrigger.triggerOff(elt, adjConElts, elts, o);
    elt.hasCrossed = dirSwitch;
  };
  var move;
  /*--------------------------------------------------------------------*/
  if (!o.isVertical && thisElt.eltPos.left != oldPos.left) {             // check whether the move is
    move = (thisElt.eltPos.left > oldPos.left ? 'forward' : 'backward'); // forward, backward, up or down
  } else if (o.isVertical && thisElt.eltPos.top != oldPos.top) {
    move = (thisElt.eltPos.top > oldPos.top ? "down" : "up");
  } else {
    return;
  } // doing nothing

 onDragElts.instanceArr = instanceArr;

  /*--------------------------------------------------------------------*/
  var eltsToMove = instanceArr.crossTrigger ? adjConElts : elts;
  if (move == 'forward') {  onDragElts.eltsMoveForward(elt, eltsToMove, instanceArr.added)  };
  if (move == "backward") {  onDragElts.eltsMoveBack(elt, eltsToMove, instanceArr.added) } ;
  if (move == 'up') { onDragElts.eltsMoveUp(elt, eltsToMove, instanceArr.added) };
  if (move == 'down') { onDragElts.eltsMoveDown(elt, eltsToMove, instanceArr.added) };
 };
  /*----------------------------------------------------------------------------------------------------------------*/

var onDragElts = {
  eltsMoveUp: function(elt, elts, added) { // added is the added element when crossing to adjacent conrtainer.
                                            // Disregarded if elt has not crossed over
    var _elt = elt;
    if (instanceArr.crossTrigger) { elt = added };
    if (  elt.n > 0) {
      var eltPrev = elts[elt.n - 1] ;
      var eltPrevBound = eltPrev.pos.top + eltPrev.completeHeight / 2;
      if (_elt.currentPos.top < eltPrevBound) {
        elt.pos.top = eltPrev.pos.top;
        eltPrev.pos.top += elt.completeHeight;
        elts[elt.n] = eltPrev;
        elts[elt.n - 1] = elt;
        elts[elt.n].n = elt.n;
        elt.n = elt.n - 1;

        this.eltsAnimate(-(elt.completeHeight), eltPrev)
      }
    }
  },
  eltsMoveDown: function(elt, elts, addedOrFlag) {  // flag disregards elt position check.
                                                    // The third argument is the added element on crossTrigger and a boolean
                                                    // when ordering the container the elt is moving from.

    var _elt = elt;
    var flag;

    typeof addedOrFlag == 'boolean' ? flag = addedOrFlag : flag = false;
    instanceArr.crossTrigger ? elt = addedOrFlag : elt = elt;
      if ( elt.n < elts.length - 1) {

      var eltNext = elts[elt.n +1];
      var eltNextBound = eltNext.pos.top + eltNext.completeHeight / 2;
      if (_elt.currentPos.top + _elt.completeHeight > eltNextBound || flag) {
        eltNext.pos.top = elt.pos.top;
        elt.pos.top += eltNext.completeHeight;
        elts[elt.n] = eltNext;
        elts[elt.n + 1] = elt;
        elts[elt.n].n = elt.n;
        elt.n = elt.n + 1;

        this.eltsAnimate(elt.completeHeight, eltNext)
      }
    }
  },
  eltsMoveBack: function(elt, elts, added) {

    var _elt = elt;
    if (instanceArr.crossTrigger) { elt = added;};
    if (elt.n > 0) {
      var eltPrev = elts[elt.n - 1];
      var eltPrevBound = eltPrev.pos.left + eltPrev.completeWidth / 2;
      if (_elt.currentPos.left < eltPrevBound) {
        elt.pos.left = eltPrev.pos.left;
        eltPrev.pos.left += elt.completeWidth;
        elts[elt.n] = eltPrev;
        elts[elt.n - 1] = elt;
        elts[elt.n].n = elt.n;
        elt.n = elt.n - 1;

        this.eltsAnimate(-(elt.completeWidth), eltPrev)
      }
    }
  },
  eltsMoveForward: function(elt, elts, addedOrFlag) {
    var _elt = elt;
    var flag;
    typeof addedOrFlag == 'boolean' ? flag = addedOrFlag : flag = false;
    instanceArr.crossTrigger ? elt = addedOrFlag : elt = elt;
    if (elt.n < elts.length - 1) {

      var eltNext = elts[elt.n + 1];
      var eltNextBound = eltNext.pos.left + eltNext.completeWidth / 2;
      if (_elt.currentPos.left + (elt.completeWidth/1.2)  > eltNextBound || flag) { // (elt.completeWidth/1.2) - tweak me!

        eltNext.pos.left = elt.pos.left;
        elt.pos.left += eltNext.completeWidth; //invert datas in the correspondence array
        elts[elt.n] = eltNext;
        elts[elt.n + 1] = elt; //update the n of the elements
        elts[elt.n].n = elt.n;
        elt.n = elt.n + 1;

        this.eltsAnimate(elt.completeWidth, eltNext)
      }
    }
  },
  eltsAnimate: function(eltDimension, elem) {
    var dir = elem.o.isVertical ? 'top' : 'left';
    //var dirTranslate = elem.o.isVertical ? 'translateY(' : 'translateX(';

    elem.style[this.instanceArr.transitionPrefix] = '0s';
    elem.style[dir] = elem.pos[dir] + 'px';
    elem.style[this.instanceArr.transformPrefix] = elem.o.isVertical ? 'translate3d(0px,' + eltDimension + 'px, 0px)' : 'translate3d(' + eltDimension + 'px, 0px, 0px)'
    this.instanceArr[0].transToZero(elem);
  },
}
  /*-----------------------------------------------------------------------------------------------------------------------------------*/

var onTrigger = {  //These will trigger when the elt is crossing over to connected adjacent container/instance

  triggerOn: function(elt, adjConElts, elts, o) {
    var objOffset = o.isVertical ? 'top' : 'left',
        objDimension = o.isVertical ? 'completeHeight' : 'completeWidth';

    for (var i = 0; i < adjConElts.length; i++) { //Loop the array
      var obj = adjConElts[i]
      if (elt.currentPos[objOffset] < obj.pos[objOffset] + obj[objDimension] / 2) {
          var firstInLoop = i;
          break;
      };
    };
    firstInLoop >= 0 ? firstInLoop : firstInLoop = adjConElts.length; // REFACTOR !!!!!!!!!!!
    // reorder the elements in the originating container
    for (var i = elt.n + 1; i < elts.length; i++) {
      o.isVertical ? onDragElts.eltsMoveDown(elt, elts, true) : onDragElts.eltsMoveForward(elt, elts, true);
      // third argument is a flag to override pos check in eltsMoveDown/eltsMoveForward function
    };
    return firstInLoop;
  },
  triggerOff: function(elt, adjConElts, elts, o) { // going back to the originating container
     instanceArr[elt.movesTo].removeLiElem(instanceArr.added, true, false)
     for (var i = 0; i < elts.length - 1; i++) { // Loop over originating Container elements
       o.isVertical ? onDragElts.eltsMoveUp(elt, elts) : onDragElts.eltsMoveBack(elt, elts);
     }
  },
};
