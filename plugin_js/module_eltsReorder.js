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
    oldPos = posObj; //find the old position stored on the object

  posObj = {
    top: elt.props.currentPos.top,
    left: elt.props.currentPos.left
  }; //the elt current position

  var dir = o.isVertical ? 'left' : 'top';
   ////////////////////////////////////////////////////////////////////////
  if (thisInst.emptySpace) {
    var ePos = thisInst.props.divOffset[dir] + posObj[dir];
    if (ePos < thisInst.emptySpace.max && ePos > thisInst.emptySpace.min) {
      console.log('EMPTY SPACE!')
      return;
    }
  }
   ////////////////////////////////////////////////////////////////////////
  var measure = o.isVertical ? 'divWidth' : 'divHeight',
    thisInstMid = posObj[dir] + thisInst.props[measure] / 2, // the middle point of the dragging element
    home = thisInstMid > 0 && thisInstMid < thisInst.props[measure], // when the element is within its own instance(thisInst)
    inNewInst = thisInst.newInst && thisInstMid > thisInst.newInst.distanceTo && thisInstMid < thisInst.newInst.distanceTo + thisInst.newInst.props[measure];


  if (home && thisInst.crossFlag == true) { // go back to originating container
  /////////////////////////////////
   delete thisInst.emptySpace;
  ////////////////////////////////////
    onTrigger._deleteElt(thisInst);
    thisInst.crossFlag = false;
    onTrigger._homeEltsOpen(elt, elts, thisInst);

  } else if (inNewInst) { // still in new instance container
    /////////////////////////////////
     delete thisInst.emptySpace;
    ////////////////////////////////////
    var adjConElts = thisInst.newInst.elts;

  } else if (thisInst.adjInst1 && !home) { // if the element has moved to a new instance and no longer within home distance

    thisInst.crossFlag = true;

    for (var i = 0, adjLenght = thisInst.adjCon.length; i < adjLenght; i++) {
      var p = thisInst.adjCon[i];
      var dropLimit = thisInst[p].props.ulSize < thisInst[p].props.dropLimit || thisInst[p].props.dropLimit == false;
      if (thisInstMid < thisInst[p].distanceTo + thisInst[p].props[measure] && thisInstMid > thisInst[p].distanceTo && dropLimit) { // found new instance
        onTrigger._deleteElt(thisInst); // delete element from prvious instance(thisInst.newInst) and animate
        thisInst.newInst = thisInst[p];
        var adjConElts = thisInst.newInst.elts;
        onTrigger._addElt(elt, adjConElts, elts, o, thisInst);
        onTrigger._homeEltsClose(elt, elts, thisInst);

        break;
      }

    }
    if (adjConElts == undefined) { // in empty space
         /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      thisInst.emptySpace = {};

      if (posObj[dir] < 0) {

        for (let val of thisInst.adjCon) {
          if (thisInst[val].props.divOffset[dir] < (thisInst.props.divOffset[dir] + posObj[dir])) {
            var min = min || thisInst[val];
            if (thisInst[val].props.divOffset[dir] > min.props.divOffset[dir]) {
              min = thisInst[val];
            }
          }
        }

        var max = thisInst;
        var minOffset = min ? min.props.divOffset[dir] : Number.NEGATIVE_INFINITY;

        for (let val of thisInst.adjCon) {
          var valOffset = thisInst[val].props.divOffset[dir];
          if (valOffset > minOffset) {
            if (valOffset < max.props.divOffset[dir]) {
              max = thisInst[val];
            }
          }
        }

        thisInst.emptySpace.min = min != undefined ? min.props.divOffset[dir] + min.props[measure] / 2 : Number.NEGATIVE_INFINITY
        thisInst.emptySpace.max = max.props.divOffset[dir] - max.props[measure] / 2


      } else {
        for (let val of thisInst.adjCon) {
          if (thisInst[val].props.divOffset[dir] > (thisInst.props.divOffset[dir] + posObj[dir])) {
            var max = max || thisInst[val];
            if (thisInst[val].props.divOffset[dir] < max.props.divOffset[dir]) {
              max = thisInst[val];
            }
          }
        }
        var min = thisInst;
        var maxOffset = max ? max.props.divOffset[dir] : Number.POSITIVE_INFINITY
        for (let val of thisInst.adjCon) {
          var valOffset = thisInst[val].props.divOffset[dir];
          if (valOffset < maxOffset) {
            if (valOffset > min.props.divOffset[dir]) {
              min = thisInst[val];
            }
          }
        }

        thisInst.emptySpace.min = min.props.divOffset[dir] + min.props[measure] - thisInst.props[measure] / 2;
        thisInst.emptySpace.max = max != undefined ? max.props.divOffset[dir] - thisInst.props[measure] / 2 : Number.POSITIVE_INFINITY

      }
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      onTrigger._homeEltsClose(elt, elts, thisInst);
      onTrigger._deleteElt(thisInst);

      return;
    }

  }


  /*-------------------------------------------------------------------------------------------------------------*/
  if (thisInst.crossFlag == true) {
    elts = adjConElts;
    thisInst.added.props.currentPos = elt.props.currentPos;
    elt = thisInst.added;
  }

  if (!o.isVertical && posObj.left != oldPos.left) { // move horizontally

    posObj.left > oldPos.left ? eltsReorder._eltsMoveBackOrUp(elt, elts, thisInst) : eltsReorder._eltsMoveForwardOrDown(elt, elts, thisInst);

  } else if (o.isVertical && posObj.top != oldPos.top) { // move vertically
    posObj.top > oldPos.top ? eltsReorder._eltsMoveBackOrUp(elt, elts, thisInst) : eltsReorder._eltsMoveForwardOrDown(elt, elts, thisInst);

  } else { // doing nothing
    return;
  }


};
/*----------------------------------------------------------------------------------------------------------------*/


var onTrigger = { //These will trigger when the elt is crossing over to connected adjacent container/instance

  _addElt: function(elt, adjConElts, elts, o, thisInst) {
    var objOffset = o.isVertical ? 'top' : 'left',
      adjEltsLength = adjConElts.length,
      insertPos = adjEltsLength;

    for (let i = 0; i < adjEltsLength; i++) { //Loop the array
      if (elt.props.currentPos[objOffset] < adjConElts[i].props.pos[objOffset] + adjConElts[i].props.size / 2) {
        insertPos = i;
        break;
      };
    };
    // initially set insertPos to the length of elts (dropped after last item);
    // reorder the elements in the originating container
    var opacity = 0

    ///////////////////////////////////////////////////////////
    // optionally set elt to animate to the new width
    // elt.style[thisInst.transitionPrefix] = 'width 100ms';
    // elt.style.width = thisInst.newInst.props.divWidth + 'px'
      ///////////////////////////////////////////////////////////

    // get the difference between the thisInst width and newInst width
    var diff = Math.abs ( thisInst.props.divWidth - thisInst.newInst.props.divWidth)

    // if new width is not same - set to undefined if in vertical
    var setHeight = {
      completeHeight: diff < 2  ? elt.props.completeHeight: o.isVertical ? undefined : elt.props.completeHeight,
      completeWidth: elt.props.completeWidth
      }



    thisInst.added = thisInst.addLiElem.call(thisInst.newInst, elt.innerHTML, insertPos, {
      elt: false,
      elts: true
    }, setHeight, opacity);


  },
  _deleteElt: function(thisInst) { // going back to the originating container

    thisInst.removeLiElem.call(thisInst.newInst, thisInst.added, false);
    delete thisInst.added
    delete thisInst.newInst;

  },
  _homeEltsOpen: function(elt, elts, thisInst) {
    for (var i = 0; i < elts.length; i++) { // Loop over originating Container elements, animate and update their properties
      eltsReorder._eltsMoveForwardOrDown(elt, elts, thisInst);
    }
  },
  _homeEltsClose: function(elt, elts, thisInst) {
    for (let i = elt.props.n + 1; i < elts.length; i++) { // originating

      eltsReorder._eltsMoveBackOrUp(elt, elts, thisInst, true);
      // third argument is a flag to override pos check in eltsMoveDown/eltsMoveForward function
    }
  }
};

var eltsReorder = {
  _eltsMoveForwardOrDown: function(elt, elts, thisInst, flag) {


    var plane = thisInst.options.isVertical ? 'top' : 'left';
    var eltn = elt.props.n;
    if (eltn > 0) {

      var eltPrev = elts[eltn - 1];
      var eltPrevMid = eltPrev.props.pos[plane] + eltPrev.props.size / 2;
      if (elt.props.currentPos[plane] < eltPrevMid || flag) {

        elt.props.pos[plane] = eltPrev.props.pos[plane]; // swap position property
        eltPrev.props.pos[plane] += elt.props.size;
        elts[eltn] = eltPrev; // swap index in elts array
        elts[eltn - 1] = elt;
        // elts[elt.props.n].props.n = elt.props.n;
        // elt.props.n = elt.props.n - 1;
        eltPrev.props.n++; // swap n property
        elt.props.n--;

        this.eltsAnimate(eltPrev, -(elt.props.size), thisInst)
      }
    }
  },
  _eltsMoveBackOrUp: function(elt, elts, thisInst, flag) { // flag disregards elt position check.


    var plane = thisInst.options.isVertical ? 'top' : 'left';
    var eltn = elt.props.n;
    if (eltn < elts.length - 1) {

      var eltNext = elts[eltn + 1];
      var eltNextMid = eltNext.props.pos[plane] + eltNext.props.size / 2;
      if (elt.props.currentPos[plane] + elt.props.size > eltNextMid || flag) {

        eltNext.props.pos[plane] = elt.props.pos[plane]; // swap position property
        elt.props.pos[plane] += eltNext.props.size;
        elts[eltn] = eltNext; // swap index in elts array
        elts[eltn + 1] = elt;
        // elts[elt.props.n].props.n = elt.props.n;
        // elt.props.n = elt.props.n + 1;
        eltNext.props.n--; // swap n property
        elt.props.n++;

        this.eltsAnimate(eltNext, elt.props.size, thisInst)
      }
    }
  },
  eltsAnimate: function(elem, eltDimension, thisInst) {

    thisInst.div.dispatchEvent(setEvents.onReorder);
    var o = thisInst.options;
    var plane = o.isVertical ? 'top' : 'left';

    //  elem.style[thisInst.transitionPrefix] = '0s';
    //  elem.style[plane] = elem.pos[plane] + 'px';
    //  elem.style[thisInst.transformPrefix] = o.isVertical ? 'translate3d(0px,' + eltDimension + 'px, 0px)' : 'translate3d(' + eltDimension + 'px, 0px, 0px)';


    // this replaces the above for performance
    var stringCss = o.isVertical ? 'translate3d(0px,' + eltDimension + 'px, 0px)' : 'translate3d(' + eltDimension + 'px, 0px, 0px)';
    elem.style.cssText = thisInst.transitionPrefix + ":0s;" + plane + ":" + elem.props.pos[plane] + "px;" + thisInst.transformPrefix + ':' + stringCss;




    _transToZero(elem, thisInst);
  },
}

function _onStop(elt, thisInst) { // Stop

  /////////////////////////////////
   delete thisInst.emptySpace;
  ////////////////////////////////////
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


  if (thisInst.crossFlag == true && thisInst.newInst) { // going to new container

    thisInst.lock.call(thisInst.newInst);

    thisInst.newInst.ul.insertBefore(thisInst.added, thisInst.newInst.elts[thisInst.added.props.n + 1]);
    // The element (thisInst.added) is place on triggerOn,
    // but is not moved if the user subsequently reorders(by dragging) the elements.
    // Therefore it must be inserted/repositioned again

    elt.addEventListener('transitionend', _callback);

    function _callback() {
      appendRemove.call(thisInst)
      this.removeEventListener('transitionend', _callback);
    }


  } else { // staying in originating container


    if (elt.nStart != elt.props.n) { //(elt.nStart != elt.n) only run the code in the if statement if elt is in new position
      // insert the dragged element into its new position efter drop in originating container
      // on condition that it has changed its position

      thisInst.ul.insertBefore(elt, thisInst.elts[elt.props.n + 1]);

      elt.addEventListener('transitionend', _callback);

      function _callback() {
        console.log('afterDrop - no cut');
        thisInst.div.dispatchEvent(setEvents.onDropTo);
        thisInst.div.dispatchEvent(setEvents.onDropFrom);

        this.removeEventListener('transitionend', _callback);
      }

    }
  }

  _animateBack(elt, thisInst);
  _transToZero(elt, thisInst, speed);

  thisInst.crossFlag = false;

  function appendRemove() {

    thisInst.added.style.opacity = 1
    thisInst.options.isVertical ? thisInst.added.style.top = thisInst.added.props.pos.top + 'px' : thisInst.added.style.left = thisInst.added.props.pos.left + 'px';
    delete thisInst.added // the object that is a reference to the added object is deleted
    thisInst.removeLiElem(elt, false); // the dragged elt from the previous/starting instance is deleted once animated to its position
    thisInst.unlock.call(thisInst.newInst);

    var elmsCut = _elemsToCut(thisInst, thisInst.newInst);

    thisInst.div.dispatchEvent(setEvents.onDropFrom);
    thisInst.newInst.div.dispatchEvent(setEvents.onDropTo);

    _scaleElems(elmsCut, thisInst);




    // console.clear()
    // var elts =  thisInst.newInst.elts
    // for (var i =0; i < elts.length; i++) { // originating
    //   console.log('- : ' + elts[i].props.n)
    //   console.log('pos left: ' +  elts[i].pos.left)
    //   console.log('style left: ' +   elts[i].style.left)
    //   console.log('pos top: ' +  elts[i].pos.top)
    //   console.log('style top: ' +  elts[i].style.top)
    //   console.log('size: ' +  elts[i].props.size)
    //   console.log('ulSize: ' +  thisInst.newInst.props.ulSize)
    // };

    delete thisInst.newInst
  };

};
