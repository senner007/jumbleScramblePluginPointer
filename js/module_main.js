  import {
    defaults,
    setChars,
    transSupport,
    transitionPrefix,
    transformPrefix,
    ifGpu
  } from "./modules.js"


  import {
    addHandlers
  } from "./module_handlers.js"

  import {
    _animateBack,
    transToZero
  } from "./module_animation.js"

  import {
      eltsReorder
  } from "./module_dragging.js"


  export default JumbleScramble;
  // ES6 MODULE IMPORT/EXPORT
  ////////////////////////////

  JumbleScramble.prototype.transToZero = transToZero;

  JumbleScramble.prototype.onStop = function(elt) { // Stop
    var o = this.options;

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

    if (this.crossTrigger == true) { // going to new container

        this.adjInst.lock();
        this.crossTrigger = false;

        $(elt).one('transitionend', function() {
          appendRemove.call(thisInst)
        })

    } else { // staying in originating container
      elt.newPosSameCon = (elt.nStart != elt.n)

      if (!elt.hasCrossed && elt.newPosSameCon) {
        // insert the dragged element into its new position efter drop in originating container
        // on condition that it has changed its position
        elt.n == 0 ? this.ul.insertBefore(elt, this.elts[1]) : this.ul.insertBefore(elt, this.elts[elt.n + 1]);
      }

    }

    _animateBack(elt, o, this);
    this.transToZero(elt, speed);

    var thisInst = this

    function appendRemove() {

        if (this.adjInst.elts.length == 0) {
          this.adjInst.ul.insertBefore(this.added, this.adjInst.elts[1]); // The element (this.added) is place on triggerOn,
                                                                        // but is not moved if the user subsequently reorders(by dragging) the elements.
                                                                        // Therefore it must be inserted/repositioned again
        } else {
          this.adjInst.ul.insertBefore(this.added, this.adjInst.elts[this.added.n + 1]);
          this.added.style.display = 'block'
          o.isVertical ? this.added.style.top = elt.style.top : this.added.style.left = elt.style.left;
          delete this.added
          this.removeLiElem(elt, false);

        }
        this.adjInst.unlock();
        var elemsToCut = _elemsToCut(this.adjInst)

       _cutOff (elemsToCut, this, this.adjInst)
        //this.adjInst.cutOffEnd(this);

    };

  };


  function _addToObject(thisElts, elt, n, thisHeight, thisWidth, o, thisContainer, adjCon, posTop, posLeft) {

    thisElts[n] = elt;
    thisElts[n].completeWidth = thisWidth || 0; // its size (with the margin)
    thisElts[n].completeHeight = thisHeight || 0; // its height (with the margin)
    thisElts[n].pos = {
      top: posTop,
      left: posLeft
    }; // its position (left and top position)
    o.isVertical == true ? thisElts[n].pos = {
      top: posTop,
      left: 0
    } : thisElts[n].pos = {
      top: 0,
      left: posLeft
    };
    thisElts[n].initialN = n; // its initial position (as per the other elements)
    thisElts[n].n = n; // its current position (as per the other elements)
    thisElts[n].o = o; // its current position (as per the other elements)
    thisElts[n].hasCrossed = false; // has the elt crossed over to the other container
    thisElts[n].newPosSameCon = false; // has the element changed position but remained in the same container
    thisElts[n].belongsTo = thisContainer;
    thisElts[n].movesTo = adjCon;
    thisElts[n].currentPos = {};

  };

  function jsOffset(el) { // replaces jquery offset
    var temp = el.getBoundingClientRect();
    return {
      top: temp.top + document.body.scrollTop,
      left: temp.left + document.body.scrollLeft
    }
  }

  function JumbleScramble(element, options) { // Constructor function
    if (!window.temporaryInstanceArray) {
      window.temporaryInstanceArray = [];
    } // create the temporaryInstanceArray in the global scope
    this.props = {}; // The values that are to remain a reference as a shallow copy and update accordingly in adjInst must reside in a nested oobject.
                    // it is a sideeffect of Object.assign :
                    //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    this.div = element[0];
    this.id = this.div.id;
    this.divOffset = jsOffset(this.div);
    this.ul = this.div.querySelector('ul');

    this.props.locked = false;
    this.container = window.temporaryInstanceArray.length;
    this.adjCon = this.container % 2 == 0 ? this.container + 1 : this.container - 1;
    this.options = $.extend({}, defaults, options);
    this.props.cutOff = this.options.cutOff
    this.props.dropLimit = this.options.dropLimit;
    this.ul.style[transformPrefix] = 'translate3d(0px,0px,0px)';
    this.props.ulSize = this.options.ulSize;

    window.temporaryInstanceArray.push(this);

  };

  JumbleScramble.prototype.crossTrigger = false;
  JumbleScramble.prototype.transSupport = transSupport;
  JumbleScramble.prototype.transitionPrefix = transitionPrefix;
  JumbleScramble.prototype.transformPrefix = transformPrefix;
  JumbleScramble.prototype.ifGpu = ifGpu;

  JumbleScramble.prototype.setCutOff = function (cutOff){

      this.props.cutOff = cutOff


  };

  JumbleScramble.prototype.getInstances = function() {
    // get object containing all instances, but without the proto
  }

  JumbleScramble.prototype.lock = function() {
    // Nothing can be dragged to or from this instance
    this.props.locked = true;
  }

  JumbleScramble.prototype.unlock = function() {
    this.props.locked = false;
  }

  JumbleScramble.prototype.crossDistance = function(instThis, instAdj) {
    var crossDistance = this.options.isVertical ? this.adjInst.divOffset.left - this.divOffset.left : this.adjInst.divOffset.top - this.divOffset.top;
    return crossDistance;
  }

  JumbleScramble.prototype.addHandlers = addHandlers;

  JumbleScramble.prototype.setInstances = function() {

    var copy = Object.assign({}, temporaryInstanceArray[this.adjCon]);
    var copy2 = Object.assign({}, temporaryInstanceArray[this.adjCon].__proto__); // maybe find a way to copy object with proto
    delete copy.adjInst;
    delete copy.dfd;
    delete copy2.setInstances;
    delete copy2.getInstances;
    delete copy2.onStop;
    delete copy2.addHandlers;
    delete copy2.init;
    this.adjInst = copy;
    this.adjInst.__proto__ = copy2;


  }

  JumbleScramble.prototype.getUlSize = function() {
    return this.props.ulSize;
  }


  function _setEltsProps(elts, thisInst) {

    var n = 0,
      size = 0;


    for (var i = 0; i < elts.length; i++) {
      var elt = elts[i];

      if (thisInst.options.isVertical) {
        elt.style.top = size + 'px'; // get each li height in case of individual heights.
        var thisHeight = _outerHeight(elt);
        var newPosTop = size
        size += thisHeight;

      } else {
        elt.style.left = size + 'px'; // get each li width in case of individual widths. (default)
        var thisWidth = _outerWidth(elt);
        var newPosLeft = size
        size += thisWidth;

      }

      _addToObject(thisInst.elts, elt, n, thisHeight, thisWidth, thisInst.options, thisInst.container, thisInst.adjCon, newPosTop, newPosLeft);

      n = n + 1;
      elt.style[thisInst.transformPrefix] = 'translate3d(0px, 0px, 0px)';
    };
    return size; // return the size of the ul


  };

  function _setUlSize(size, thisInst) {
    if (thisInst.options.isVertical) {
      thisInst.ul.style.height = size + 'px';
    } else {
      thisInst.ul.style.width = size + 'px';
    //  thisInst.ul.style.height = _outerHeight(thisInst.elts[0]) + 'px';
    }

    thisInst.props.ulSize = size;



  }



  JumbleScramble.prototype.init = function() {

    var lis = this.div.getElementsByTagName('li');
    this.elts = new Array(lis.length);
    var ulSize = _setEltsProps(lis, this); // setting properties function return the ul size
    _setUlSize(ulSize, this)
    this.addHandlers();

    $(this.div).trigger('layoutComplete', [parseInt(this.ul.style.height)]) // example of sending the ul height as second parameter to the callback
    this.init = true;

    var counter = 0;
    for (var i = 0; i < temporaryInstanceArray.length; i++) {
      if (temporaryInstanceArray[i].init == true) {
        counter++
      }
      if (counter == temporaryInstanceArray.length) {
        $.each(temporaryInstanceArray, function(index, value) {
          this.setInstances()
          $(value.div).trigger('layoutCompleteAll') // trigger callback on each instance
        });
        temporaryInstanceArray.length = 0
        // delete the global instance array

      }
    }
    console.log(this)

  };

  /*--------------------------------------------------------------------*/

  function _outerHeight(el) { // replacing jquery outerWidth(true)
    var height = el.offsetHeight;
    var style = getComputedStyle(el);
    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
  }

  function _outerWidth(el) { // replacing jquery outerWidth(true)
    var width = el.offsetWidth;
    var style = getComputedStyle(el);
    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
    return width;
  }
  /*--------------------------------------------------------------------*/


  JumbleScramble.prototype.reLayout = function() {

    //var li = this.div.find('li'); // Variables declaration
    var ulSize = _setEltsProps(this.elts, this) // setting properties function return the ul size
    _setUlSize(ulSize, this)

    this.divOffset = jsOffset(this.div)
    this.adjInst.divOffset = jsOffset(this.adjInst.div)



  };
  /*------------------------------------------------------------------------------------------------------------------------------------*/


  JumbleScramble.prototype.cutOffEnd = function() { // function to remove the items above cutoff limit and then prepend the adjacent container

    var elemsToCut = _elemsToCut(this)
    _cutOff (elemsToCut, this.adjInst, this )

  };

function _elemsToCut(thisInst) {
  if (thisInst.props.cutOff == false) { return [];}
  var elems = []
  var size =0;
  var height = thisInst.options.isVertical ? 'completeHeight': 'completeWidth';

  for (var i = 0; i<thisInst.elts.length; i++) {
        size += thisInst.elts[i][height]
  }

  var counter = -1;
    while (size > thisInst.props.cutOff) {
      elems.splice(0, 0, thisInst.elts[thisInst.elts.length + counter])
      size -= thisInst.elts[thisInst.elts.length -1][height]
      counter -= 1
    }

  return elems;

}

function _cutOff (elemsToCut, thisInst, adjInst) {

  var tempArr = []
  if (elemsToCut.length != 0) {


    for (var i = 0; i< elemsToCut.length; i++) {
      tempArr.push(  thisInst.addLiElem(elemsToCut[i].textContent, 0, {elt: false, elts: true}, elemsToCut[i].completeHeight, elemsToCut[i].completeWidth))
      adjInst.removeLiElem(adjInst.elts[adjInst.elts.length - 1], adjInst.transSupport, false)

    }
      _scaleElems(tempArr, thisInst);

  }
}

  /*--------------------------------------------------------------------------------------------------------------------------------------------------*/


  function _scaleElems(elems, thisInst) { // should be in animation module, and not on the prototype
    var elems = elems, // elems is an array of elements to scale in after they have been added
      thisInst = thisInst;

    scaleElems('off');

    if (thisInst.transSupport && elems.length != 0) { // transition elements  but only if if there are any

       setTimeout(function() { scaleElems('on'); }, 1);
        // setTimeout is need because transform properties need time to be set.
    }

    function scaleElems(trigger) {
      for (var i = 0; i < elems.length; i++) {
        elems[i].style[thisInst.transitionPrefix] = trigger == 'on' ? '500ms' : '0ms';
        elems[i].style[thisInst.transformPrefix] = trigger == 'on' ? 'scale(1,1)' : 'scale(0,0)';
      }
    }
  };

  /*--------------------------------------------------------------------------------------------------------------------------------------------------*/

  JumbleScramble.prototype.addLiElem = function(liText, liPosition, addTrans, completeHeight, completeWidth) { // Add new li to previous collection

    var thisElts = this.elts;

    var n = Math.min(Math.max(parseInt(liPosition), 0), thisElts.length),
      o = this.options,
      tempArr = [];
    var eltObj = {
      'left': n > 0 ? thisElts[n - 1].pos.left + thisElts[n - 1].completeWidth : 0,
      'top': n > 0 ? thisElts[n - 1].pos.top + thisElts[n - 1].completeHeight : 0
    }
    var item = ('<li style="left:' + eltObj.left + 'px;top:' + eltObj.top + 'px" class=' + (o.isVertical ? 'listItem' : 'listItem-horizontal') + '>' + liText + '</li>');
    var elt = document.createElement('li');
    elt.innerHTML = item;
    elt = elt.firstChild;
    elt.n = n


    if (thisElts.length == 0) {  this.ul.appendChild(elt)  } // if there are no elements present at drop
    else { (n > 0) ? this.ul.insertBefore(elt, thisElts[elt.n]) : this.ul.insertBefore(elt, thisElts[n]) }

    var thisWidth = completeWidth || (o.isVertical ? 0 : _outerWidth(elt)),
      thisHeight = completeHeight || (o.isVertical ? _outerHeight(elt) : 0);


    // Iterate over the all elts after insert and update accordingly


    for (var i = n; i < thisElts.length; i++) {
      var el = thisElts[i];
      var marginLeft = o.isVertical ? 0 : (el.completeWidth - el.offsetWidth); // account for margin

      el.style[this.transitionPrefix] = '0ms';
      el.style[this.transformPrefix] = this.transSupport ? 'translate3d(0px,0px,0px)' : 'translate(0px,0px)';
      el.style.left = parseInt(el.style.left) + thisWidth + 'px'
      el.style.top = parseInt(el.style.top) + thisHeight + 'px'
      el.pos.left = el.offsetLeft - marginLeft;
      el.pos.top = el.offsetTop;
      el.n = el.n + 1
      tempArr.push(el);
      if (addTrans.elts) {
        el.style[this.transformPrefix] = 'translate(' + -(thisWidth) + 'px,' + -(thisHeight) + 'px)';
        this.transToZero(el);
      }
    };

    for (var i = 0; i < tempArr.length; i++) {
      thisElts[n + 1 + i] = tempArr[i];
    }

    var ulSize = o.isVertical ? parseInt(this.ul.style.height) + thisHeight : parseInt(this.ul.style.width) + thisWidth;
    _setUlSize(ulSize, this)


    _addToObject(thisElts, elt, n, thisHeight, thisWidth, o, this.container, this.adjCon, eltObj.top, eltObj.left);

    if (addTrans.elt) {


      _scaleElems([elt], this)

    }; // animation only needed when triggering add

    //this.unlock();
    return elt;
  }

  /*--------------------------------------------------------------------------------------------------------------------------------------------------*/


  JumbleScramble.prototype.removeLiElem = function(elt, transition, callBack) { // Remove new li to previous collection

    var n = elt.n,
      thisElts = this.elts,
      eltHeight = thisElts[n].completeHeight,
      eltWidth = thisElts[n].completeWidth;

    for (var i = n; i < thisElts.length ; i++) {  // Loop over adjacent conatiner elements, animating them and updating their properties
      eltsReorder._eltsMoveBackOrUp(elt, thisElts,  this, true);
      // third argument is a flag to override pos check in eltsMoveDown/eltsMoveForward function
    };

    thisElts.length = thisElts.length - 1; // reduce the length of elt objects in the temporaryInstanceArray after a delete

    if (transition) { // if the option to animate in the removeLiElem method used after init is true. Used in cutOff method

      elt.style[transformPrefix] = 'scale(0.5,0.5)';
      elt.style.opacity = '0';
      elt.style[transitionPrefix] = '250ms';
      setTimeout(function() {
        elt.remove()
        if (callBack) {
          callBack(); //the callback is fired after the animation has finished
          // use transitionend instead
        }
      }, 250);
    } else {
      elt.remove();
    }
    // recalculate the height or width of the ul after deleting items

    var ulSize = this.options.isVertical ? parseInt(this.ul.style.height) - eltHeight : parseInt(this.ul.style.width) - eltWidth;
    _setUlSize(ulSize, this)
  };
