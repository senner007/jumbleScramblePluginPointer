import {instanceArr, animateBack} from "./module_main.js"
import {transSupport, transitionPrefix, transformPrefix, transToZero} from "./module_animation.js"

export {
  onDrag,
  onDragAdj,
  onDragElts,
  onStop,
  posObj
};

var posObj = {}
posObj.crossTrigger = false;


function onDrag(elt, elts, o) { // Drag

  var eltPos = {
    top: elt.currentPos.top,
    left: elt.currentPos.left
  }


  var thisElt = posObj; //must be saved to a global object. (Possibly to avoid random
                        // occurrences of non moving objects on ipad)
  var oldPos = (thisElt.eltPos != null ? thisElt.eltPos : eltPos); //find the old position stored on the $object
  thisElt.eltPos = eltPos; //its current position derived from $draggable object


  if (instanceArr.length > 1 && o.isVertical) {
    var adjConElts = instanceArr[elt.movesTo].elts;
    var adjacentDir = instanceArr[elt.movesTo].divOffset.left - instanceArr[elt.belongsTo].divOffset.left;
    var dirSwitch = (elt.belongsTo % 2 == 0 ? thisElt.eltPos.left > adjacentDir / 2 : thisElt.eltPos.left < adjacentDir / 2);
  }
  if (instanceArr.length > 1 && !o.isVertical) {
    var adjConElts = instanceArr[elt.movesTo].elts;
    var adjacentDir = instanceArr[elt.movesTo].divOffset.top - instanceArr[elt.belongsTo].divOffset.top;
    var dirSwitch = (elt.belongsTo % 2 == 0 ? thisElt.eltPos.top > adjacentDir / 2 : thisElt.eltPos.top < adjacentDir / 2);
  }


  /*--------------------------------------------------------------------*/

  // trigger animations for
  // adjacent container if below
  // dropLimit - refactor to add method for horizontal too.

  if (dirSwitch && posObj.crossTrigger == false) {

    if (o.dropLimit == false || !adjConElts[adjConElts.length - 1] || adjConElts[adjConElts.length - 1].pos.top + adjConElts[adjConElts.length - 1].completeHeight <= instanceArr[elt.movesTo].dropLimit) {
      // if droplimit is false - or - if the adjacent container is empty  - or - if the last items position is not above dropLimit then move to new container. Otherwise go back


      onDragAdj.triggerOn(elt, adjConElts, elts, o);
      posObj.crossTrigger = true;
    }
  };

  if (!dirSwitch && posObj.crossTrigger == true && Object.keys(elts).length > 1) { // go back to originating container
    console.log('back to originating')

    onDragAdj.triggerOff(elt, adjConElts, elts, o);
    posObj.crossTrigger = false;
  };
  var move;
  /*--------------------------------------------------------------------*/
  if (!o.isVertical && thisElt.eltPos.left != oldPos.left) { // check whether the move is
    move = (thisElt.eltPos.left > oldPos.left ? 'forward' : 'backward'); // forward, backward, up or down
  } else if (o.isVertical && thisElt.eltPos.top != oldPos.top) {
    move = (thisElt.eltPos.top > oldPos.top ? "down" : "up");
  } else {
    return;
  } // doing nothing

  /*--------------------------------------------------------------------*/
  if (move == 'forward') { //  move forward
    posObj.crossTrigger ? onDragAdj.moveForward(elt, adjConElts) : onDragElts.eltsMoveForward(elt, elts); };
  if (move == "backward") { //  move backward
    posObj.crossTrigger ? onDragAdj.moveBack(elt, adjConElts) : onDragElts.eltsMoveBack(elt, elts); } ;
  if (move == 'up') { //  move up
    posObj.crossTrigger ? onDragAdj.moveUp(elt, adjConElts) : onDragElts.eltsMoveUp(elt, elts); };
  if (move == 'down') { //  move down
    posObj.crossTrigger ? onDragAdj.moveDown(elt, adjConElts) : onDragElts.eltsMoveDown(elt, elts); };
};

var onDragElts = {
  eltsMoveUp: function(elt, elts, flag) { // flag disregards elt position check
    if (elt.n > 0) {

      var eltPrev = elts[elt.n - 1];

      var eltPrevBound = eltPrev.pos.top + eltPrev.completeHeight / 2;
      if (elt.currentPos.top < eltPrevBound || flag) {
        // if (eltPrev.hasClass('locked')) {
        //   return;
        // }
    //  elt.insertBefore(eltPrev);
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
  eltsMoveDown: function(elt, elts, flag) {
    if (elt.n < elts.length - 1) {
      var eltNext = elts[elt.n + 1];
      var eltNextBound = eltNext.pos.top + eltNext.completeHeight / 2;
      if (elt.currentPos.top + elt.completeHeight > eltNextBound || flag) {
        // if (eltNext.hasClass('locked')) {
        //   return;
        // }
    //    elt.insertAfter(eltNext);
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
  eltsMoveBack: function(elt, elts) {
    if (elt.n > 0) {
      var eltPrev = elts[elt.n - 1];
      var eltPrevBound = eltPrev.pos.left + eltPrev.completeWidth / 2;
      if (elt.currentPos.left < eltPrevBound) {

        // if (eltPrev.hasClass('locked')) {
        //   return;
        // }
      //  elt.insertBefore(eltPrev);
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
  eltsMoveForward: function(elt, elts, flag) {
    if (elt.n < elts.length - 1) {
      var eltNext = elts[elt.n + 1];
      var eltNextBound = eltNext.pos.left + eltNext.completeWidth / 2;
      if (elt.currentPos.left + elt.completeWidth > eltNextBound || flag) {
        // if (eltNext.hasClass('locked')) {
        //   return;
        // }
      //  elt.insertAfter(eltNext);
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

    elem[0].style[transitionPrefix] = '0s';
    elem[0].style[dir] = elem.pos[dir] + 'px';
    elem[0].style[transformPrefix] = elem.o.isVertical ? 'translate3d(0px,' + eltDimension + 'px, 0px)' : 'translate3d(' + eltDimension + 'px, 0px, 0px)'
    transToZero(elem);
  }
}



var onDragAdj = {

  triggerOn: function(elt, adjConElts, elts, o) {


    var tempArr = [];
    var objOffset = o.isVertical ? 'top' : 'left';
    var objDimension = o.isVertical ? 'completeHeight' : 'completeWidth';
    if (transSupport) {
      var objTranslate = o.isVertical ? 'translate3d(0px,' + elt[objDimension] + 'px,0px)' : 'translate3d(' + elt[objDimension] + 'px,0px,0px)';
    } else {
      var objTranslate = o.isVertical ? 'translateY(' + elt[objDimension] + 'px)' : 'translateX(' + elt[objDimension] + 'px)';
    }
    for (var i = 0; i < adjConElts.length; i++) { //Loop the array
      var obj = adjConElts[i]

      if (elt.currentPos[objOffset] < obj.pos[objOffset] + obj[objDimension] / 2) {

        if (obj.moved == false) {
          tempArr.push(i)
          obj[0].style[transitionPrefix] = '250ms ease';
          obj[0].style[transformPrefix] = objTranslate
          obj.moved = true;
          elt.insertPos = obj.n;
          obj.pos[objOffset] = obj.pos[objOffset] + elt[objDimension];

        };
      };
    };
    elt.insertPos = tempArr[0] >= 0 ? tempArr[0] : adjConElts.length;
    // reorder the elements in the originating container
    for (var i = elt.n + 1; i < elts.length; i++) {
      o.isVertical ? onDragElts.eltsMoveDown(elt, elts, true) : onDragElts.eltsMoveForward(elt, elts, true); // third argument is a flag to override pos check in eltsMoveDown function
    };

  },
  triggerOff: function(elt, adjConElts, elts, o) { // going back to the originating container

    var objOffset = o.isVertical ? 'top' : 'left';
    var objDimension = o.isVertical ? 'completeHeight' : 'completeWidth';
    for (var i = 0; i < adjConElts.length; i++) { //Loop over adjacentContainer elements
      var obj = adjConElts[i];

      if (obj.moved == true) {
        obj.moved = false;
        obj.pos[objOffset] = obj.pos[objOffset] - elt[objDimension];
        transToZero(obj);
      }
    }

    for (var i = 0; i < elts.length - 1; i++) { // Loop over originating Container elements
      o.isVertical ? onDragElts.eltsMoveUp(elt, elts) : onDragElts.eltsMoveBack(elt, elts);
    }


  },
  moveUp: function(elt, adjConElts) {
    if (elt.insertPos > 0) {
      var obj = adjConElts[elt.insertPos - 1]
      if (elt.currentPos.top < obj.pos.top + obj.completeHeight / 2 && obj.moved == false) {
        obj[0].style[transitionPrefix] = '250ms ease';
        obj[0].style[transformPrefix] = transSupport ? 'translate3d(0px,' + elt.completeHeight + 'px, 0px)' : 'translateY(' + elt.completeHeight + 'px)';
        obj.moved = true;
        elt.insertPos = obj.n;
        obj.pos.top = obj.pos.top + elt.completeHeight;
      };
    };
  },
  moveDown: function(elt, adjConElts) {
    if (elt.insertPos < adjConElts.length) {
      var obj = adjConElts[elt.insertPos]
      if (elt.currentPos.top + elt.completeHeight > obj.pos.top + obj.completeHeight / 2 && obj.moved == true) {
        transToZero(obj);
        obj.moved = false;
        elt.insertPos = obj.n + 1;
        obj.pos.top = obj.pos.top - elt.completeHeight;
      }
    };
  },
  moveForward: function(elt, adjConElts) {
    if (elt.insertPos < adjConElts.length) {
      var obj = adjConElts[elt.insertPos]
      if (elt.currentPos.left + elt.completeWidth > obj.pos.left + obj.completeWidth / 2 && obj.moved == true) {
        transToZero(obj);
        obj.moved = false;
        elt.insertPos = obj.n + 1;
        obj.pos.left = obj.pos.left - elt.completeWidth;
      }
    };
  },
  moveBack: function(elt, adjConElts) {

    if (elt.insertPos > 0) {
      var obj = adjConElts[elt.insertPos - 1]

      if (elt.currentPos.left < obj.pos.left + obj.completeWidth / 2 && obj.moved == false) {

        obj[0].style[transitionPrefix] = '250ms ease';
        obj[0].style[transformPrefix] = transSupport ? 'translate3d(' + elt.completeWidth + 'px,0px,0px)' : 'translateX(' + elt.completeWidth + 'px)';
        obj.moved = true;
        elt.insertPos = obj.n;
        obj.pos.left = obj.pos.left + elt.completeWidth;
      }
    };
  }

};

function onStop(evt, elt, div, o) { // Stop
  animateBack(elt, o);
  transToZero(elt);

  if (o.setChars) {
    setChars(elt);

  } // setChars function	- re-align lis after uppercase/lowercase for difficulty setting  2


  transSupport ? elt.one('transitionend', function() {
    if (!posObj.crossTrigger) {       // insert the dragged element into its new position efter drop in originating container

        var eltPrev = instanceArr[elt.belongsTo].elts[elt.n - 1];
        if (elt.n == 0) {
          elt.insertBefore(instanceArr[elt.belongsTo].elts[1]);
        }
        else {
          elt.insertAfter(eltPrev);
        }
    }

 appendRemove()

  }) : appendRemove() // only wait for transitionend if supported (not ie9)

  function appendRemove() {

    if (!!o.autoValidate) {
      o.autoValidate(); // calls the autovalidate function in the plugin calling script
    }
    if (posObj.crossTrigger) {

      instanceArr[elt.belongsTo].removeLiElem(elt, false, true)

      instanceArr[elt.movesTo].addLiElem(elt.text(), elt.insertPos, false);

      posObj.crossTrigger = false;

      instanceArr[elt.movesTo].cutOffEnd()
    }
    else {


    }
  };

};
