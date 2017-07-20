export {onDrag, eltsReorder};
import {eltsReorder} from "./module_eltsReorder.js"
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

  if (dirSwitch && thisInst.crossTrigger == false && thisInst.adjInst.props.locked == false) {

  //  if (o.dropLimit == false || !adjConElts[adjConElts.length - 1] || adjConElts[adjConElts.length - 1].pos.top + adjConElts[adjConElts.length - 1].completeHeight <= thisInst.adjInst.props.dropLimit) {
      // if droplimit is false - or - if the adjacent container is empty  - or - if the last items position is not above dropLimit then move to new container. Otherwise go back
      if (thisInst.adjInst.props.ulSize < thisInst.adjInst.props.dropLimit || thisInst.adjInst.props.dropLimit == false) {

          onTrigger.triggerOn(elt, adjConElts, elts, o, thisInst);
        }
  //  }
  };

  if (!dirSwitch && thisInst.crossTrigger == true && Object.keys(elts).length > 1) { // go back to originating container
    onTrigger.triggerOff(elt, adjConElts, elts, o, thisInst);
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
  if (move == 'forward' || 'down') {  eltsReorder._eltsMoveBackOrUp(elt, eltsToMove, thisInst)  };
  if (move == "backward" || 'up') {  eltsReorder._eltsMoveForwardOrDown(elt, eltsToMove, thisInst) } ;


 };
  /*----------------------------------------------------------------------------------------------------------------*/


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
    firstInLoop = (firstInLoop >= 0) ? firstInLoop : adjConElts.length;  // firstInLoop is the insert position
    // check if firstInLoop is set, if not, set it to the length of the container
    // (dropped after last item)
    // reorder the elements in the originating container
    for (var i = elt.n + 1; i < elts.length; i++) {
      eltsReorder._eltsMoveBackOrUp(elt, elts, thisInst, true);
      // third argument is a flag to override pos check in eltsMoveDown/eltsMoveForward function
    };
    thisInst.added = thisInst.adjInst.addLiElem(elt.textContent, firstInLoop, {elt:false,elts:true}, elt.completeHeight, elt.completeWidth);
    thisInst.added.style.display = 'none'
    thisInst.crossTrigger = true;
    elt.hasCrossed = thisInst.crossTrigger;
  },
  triggerOff: function(elt, adjConElts, elts, o, thisInst) { // going back to the originating container
      thisInst.crossTrigger = false;

    //  for (var i = thisInst.added.n; i < thisInst.adjInst.elts.length ; i++) {  // Loop over adjacent conatiner elements, animating them and updating their properties
    //    eltsReorder._eltsMoveForwardOrDown(thisInst.added, thisInst.adjInst.elts,  thisInst.adjInst, true);
    //    // third argument is a flag to override pos check in eltsMoveDown/eltsMoveForward function
    //  };
      thisInst.adjInst.removeLiElem(thisInst.added, false)

     for (var i = 0; i < elts.length - 1; i++) { // Loop over originating Container elements, animating them and updating their properties
       eltsReorder._eltsMoveForwardOrDown(elt, elts, thisInst);
     }
     elt.hasCrossed = thisInst.crossTrigger;
  },
};
