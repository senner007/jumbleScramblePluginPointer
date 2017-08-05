export {
  _onDrag,
  eltsReorder,
  _onStop,
  _elemsToCut
};
import {
  _elemsToCut,
  setEvents
} from "./module_utils.js"
import {
  _animateBack,
  _scaleElems,
  _transToZero
} from "./module_animation.js"


// ES6 MODULE IMPORT/EXPORT
////////////////////////////

var posObj = {}

function _onDrag(elt, thisInst) { // Drag

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

  if (thisInst.adjInst1) { //if it has adjacent instances and is vertical

    var dir = o.isVertical ? 'left' : 'top',
        measure = o.isVertical ? 'divWidth' : 'divHeight',
        adjConLenght = thisInst.adjCon.length;


    for (var i = 0; i < adjConLenght; i++) {
      var p = thisInst.adjCon[i];
      //  console.log(posObj[dir])

      if (posObj[dir] <= (  thisInst[p].distanceTo + thisInst[p].props[measure] / 2  ) && posObj[dir] >= ( thisInst[p].distanceTo - thisInst[p].props[measure] / 2 )   ) {

        for (var ii = 0; ii < adjConLenght; ii++) {

          if (thisInst.adjCon[ii] != p && thisInst[thisInst.adjCon[ii]].currentlyIn == true) {  // all the instances that elt is currently not moving in that have their ptoperty currentlyIn set to true

            thisInst.crossFlag = false;
            thisInst.removeLiElem.call(thisInst.newInst, thisInst.added, false)
            delete thisInst.added
            thisInst[thisInst.adjCon[ii]].currentlyIn = false;
            break;
          }

        }
        var adjConElts = thisInst[p].elts;
        thisInst.newInst = thisInst[p]
        thisInst[p].currentlyIn = true;
        var dirSwitch = true;

        break;
      }
    }
  }
/*-------------------------------------------------------------------------------------------------------------*/

  if (dirSwitch && thisInst.crossFlag == false) {

    //  if (o.dropLimit == false || !adjConElts[adjConElts.length - 1] || adjConElts[adjConElts.length - 1].pos.top + adjConElts[adjConElts.length - 1].completeHeight <= thisInst.adjInst.props.dropLimit) {
    // if droplimit is false - or - if the adjacent container is empty  - or - if the last items position is not above dropLimit then move to new container. Otherwise go back
    if (thisInst.newInst.props.ulSize < thisInst.newInst.props.dropLimit || thisInst.newInst.props.dropLimit == false) {

      onTrigger.triggerOn(elt, adjConElts, elts, o, thisInst);
    }

  };

  var home = posObj[dir] > (  0 - thisInst.props[measure] /2   )  && posObj[dir] < (  thisInst.props[measure] /2)  ; // only execute if moving within home instance distance
                                                                                                                    // of home instance -/+ instance (width/height /2)

  if (!dirSwitch && thisInst.crossFlag == true) { // go back to originating container

    if (home) {
      console.log('triggeroff')

      onTrigger.triggerOff(elt, elts, thisInst);
    }
    else { return;}
  };

  /*-------------------------------------------------------------------------------------------------------------*/
  var move;
  if (!o.isVertical && posObj.left != oldPos.left) { // check whether the move is
    move = (posObj.left > oldPos.left ? 'forward' : 'backward'); // forward, backward, up or down
  } else if (o.isVertical && posObj.top != oldPos.top) {
    move = (posObj.top > oldPos.top ? "down" : "up");
  } else {
    return;
  } // doing nothing

  /*-------------------------------------------------------------------------------------------------------------*/

  if (thisInst.crossFlag) {
    elts = adjConElts;
    thisInst.added.currentPos = elt.currentPos
    elt = thisInst.added
  }
  if (move == 'forward' || move == 'down') {
    eltsReorder._eltsMoveBackOrUp(elt, elts, thisInst);
  };
  if (move == "backward" || move == 'up') {
    eltsReorder._eltsMoveForwardOrDown(elt, elts, thisInst);
  }

};
/*----------------------------------------------------------------------------------------------------------------*/


var onTrigger = { //These will trigger when the elt is crossing over to connected adjacent container/instance

  triggerOn: function(elt, adjConElts, elts, o, thisInst) {
    var objOffset = o.isVertical ? 'top' : 'left',
      dims = o.isVertical ? 'completeHeight' : 'completeWidth';

    for (var i = 0; i < adjConElts.length; i++) { //Loop the array
      if (elt.currentPos[objOffset] < adjConElts[i].pos[objOffset] + adjConElts[i][dims] / 2) {
        var firstInLoop = i;
        break;
      };
    };
    firstInLoop = (firstInLoop >= 0) ? firstInLoop : adjConElts.length; // firstInLoop is the insert position
    // check if firstInLoop is set, if not, set it to the length of the container
    // (dropped after last item)
    // reorder the elements in the originating container


      for (var i = elt.n + 1; i < elts.length; i++) { // originating
        eltsReorder._eltsMoveBackOrUp(elt, elts, thisInst, true);
        // third argument is a flag to override pos check in eltsMoveDown/eltsMoveForward function
      }

    thisInst.crossFlag = true;
    var display = 'none'

    thisInst.added = thisInst.addLiElem.call(thisInst.newInst, elt.innerHTML, firstInLoop, {
      elt: false,
      elts: true
    }, elt.completeHeight, elt.completeWidth, display);

    elt.hasCrossed = thisInst.crossFlag;

  },
  triggerOff: function(elt, elts, thisInst) { // going back to the originating container

    thisInst.crossFlag = false;
    thisInst.removeLiElem.call(thisInst.newInst, thisInst.added, false)

      for (var i = 0; i < elts.length; i++) { // Loop over originating Container elements, animating them and updating their properties
        eltsReorder._eltsMoveForwardOrDown(elt, elts, thisInst);

      }
    elt.hasCrossed = thisInst.crossFlag;
    delete thisInst.added
  },
};

var eltsReorder = {
  _eltsMoveForwardOrDown: function(elt, elts, thisInst, flag) {

    var dims = thisInst.options.isVertical ? 'completeHeight' : 'completeWidth';
    var plane = thisInst.options.isVertical ? 'top' : 'left';

    if (elt.n > 0) {

      var eltPrev = elts[elt.n - 1];
      var eltPrevBound = eltPrev.pos[plane] + eltPrev[dims] / 2;
      if (elt.currentPos[plane] < eltPrevBound || flag) {

        elt.pos[plane] = eltPrev.pos[plane];
        eltPrev.pos[plane] += elt[dims];
        elts[elt.n] = eltPrev;
        elts[elt.n - 1] = elt;
        elts[elt.n].n = elt.n;
        elt.n = elt.n - 1;
        this.eltsAnimate(eltPrev, -(elt[dims]), thisInst)
      }
    }
  },
  _eltsMoveBackOrUp: function(elt, elts, thisInst, flag) { // flag disregards elt position check.

    var dims = thisInst.options.isVertical ? 'completeHeight' : 'completeWidth';
    var plane = thisInst.options.isVertical ? 'top' : 'left';

    if (elt.n < elts.length - 1) {

      var eltNext = elts[elt.n + 1];
      var eltNextBound = eltNext.pos[plane] + eltNext[dims] / 2;
      if (elt.currentPos[plane] + elt[dims] > eltNextBound || flag) {

        eltNext.pos[plane] = elt.pos[plane];
        elt.pos[plane] += eltNext[dims];
        elts[elt.n] = eltNext;
        elts[elt.n + 1] = elt;
        elts[elt.n].n = elt.n;
        elt.n = elt.n + 1;

        this.eltsAnimate(eltNext, elt[dims], thisInst)
      }
    }
  },
  eltsAnimate: function(elem, eltDimension, thisInst) {

    thisInst.div.dispatchEvent(setEvents.onReorder);

    var plane = elem.o.isVertical ? 'top' : 'left';

    elem.style[thisInst.transitionPrefix] = '0s';
    elem.style[plane] = elem.pos[plane] + 'px';
    elem.style[thisInst.transformPrefix] = elem.o.isVertical ? 'translate3d(0px,' + eltDimension + 'px, 0px)' : 'translate3d(' + eltDimension + 'px, 0px, 0px)'
    _transToZero(elem, thisInst);
  },
}

function _onStop(elt, thisInst) { // Stop
  var o = thisInst.options;

  elt.endDate = new Date();
  elt.dragSpeed = (elt.endDate.getTime() - elt.startDate.getTime()) / 1000;
  // elt.dragSpeed measuresthe time it takes to initialize the drag to when it is dropped. A smaller difference
  // will increase the speed of the layout animation.
  var speed;

  if (elt.dragSpeed < 0.2) {
    speed = '15ms ease'
  } else if (elt.dragSpeed < 0.35) {
    speed = '100ms ease'
  } else if (elt.dragSpeed < 0.5) {
    speed = '170ms ease'
  }

  // A lower elt.dragSpeed value will speed up the animation and subsequently the add and remove logic after dropping an item.
  // (If the difference in time between the initialized drag and the release is less than specified,
  // it will increase the transition speed of the dropped item going to its new position)

  if (thisInst.crossFlag == true) { // going to new container

    thisInst.lock.call(thisInst.newInst);
    thisInst.crossFlag = false;
    thisInst.newInst.ul.insertBefore(thisInst.added, thisInst.newInst.elts[thisInst.added.n + 1]);
    // The element (thisInst.added) is place on triggerOn,
    // but is not moved if the user subsequently reorders(by dragging) the elements.
    // Therefore it must be inserted/repositioned again

    elt.addEventListener('transitionend', _callback);

    function _callback() {
      appendRemove.call(thisInst)
      this.removeEventListener('transitionend', _callback);
    }


  } else { // staying in originating container

    if (!elt.hasCrossed && (elt.nStart != elt.n)) { //(elt.nStart != elt.n) only run the code in the if statement if elt is in new position
      // insert the dragged element into its new position efter drop in originating container
      // on condition that it has changed its position
      thisInst.ul.insertBefore(elt, thisInst.elts[elt.n + 1]);
    }
  }

  _animateBack(elt, o, thisInst);
  _transToZero(elt, thisInst, speed);


  function appendRemove() {

    thisInst.added.style.display = 'block'
    o.isVertical ? thisInst.added.style.top = elt.style.top : thisInst.added.style.left = elt.style.left;
    delete thisInst.added // the object that is a reference to the added object is deleted
    thisInst.removeLiElem(elt, false); // the dragged elt from the previous/starting instance is deleted once animated to its position
    thisInst.unlock.call(thisInst.newInst);
    _scaleElems(_elemsToCut(thisInst, thisInst.newInst), thisInst);
    thisInst.newInst.div.dispatchEvent(setEvents.onDrop);


    //    console.clear()
    // for (var i =0; i < thisInst.newInst.elts.length; i++) { // originating
    //     console.log('- : ' + this.adjInst.elts[i].n)
    //     console.log(this.adjInst.elts[i].pos.left)
    //     console.log(this.adjInst.elts[i].style.left)
    // };


  };

};
