  import {
    _shuffle,
    setEvents,
    defaults,
    _setChars,
    transSupport,
    transitionPrefix,
    transformPrefix,
    ifGpu
  } from "./module_utils.js"


  import {
    _addEventHandlers
  } from "../../_dragHandler/module_handlers.js"

  import {
    _animateBack,
    _transToZero,
    _scaleElems
  } from "./module_animation.js"

  import {
      eltsReorder,
      _elemsToCut
  } from "./module_eltsReorder.js"



  export default JumbleScramble;
  // ES6 MODULE IMPORT/EXPORT
  ////////////////////////////
  function Elt (n, thisHeight, thisWidth, thisInst, eltObj) {
    var isVertical = thisInst.options.isVertical == true;

    this.o = thisInst.options; // its current position (as per the other elements)
    this.completeWidth = thisWidth || 0; // its width (with the margin)
    this.completeHeight = thisHeight || 0; // its height (with the margin)
    this.size;
    this.pos = isVertical ? { top: eltObj.top, left: 0 } : {  top: 0, left: eltObj.left }; // its position (left and top position)
    this.initN = n; // its initial position (as per the other elements)
    this.n = n; // its current position (as per the other elements)
    this.currentPos = {top:0, left:0};
//    console.log(thisWidth)

  }

function setEltProto (param) {
  Object.defineProperty(Elt.prototype, param, {
  	get: function() { return this.size },
  	set: function(value) { this.size = value }
  })
}


  function _addToObject(elt, n, thisHeight, thisWidth, thisInst, eltObj) {
    var thisElts = thisInst.elts
    var isVertical = thisInst.options.isVertical == true;
    thisElts[n] = elt;
    // thisElts[n].completeWidth = thisWidth || 0; // its width (with the margin)
    // thisElts[n].completeHeight = thisHeight || 0; // its height (with the margin)
  //  thisElts[n].size = thisInst.options.isVertical == true ? thisHeight : thisWidth
  //  thisElts[n].pos = isVertical ? { top: eltObj.top, left: 0 } : {  top: 0, left: eltObj.left }; // its position (left and top position)
//    thisElts[n].initN = n; // its initial position (as per the other elements)
  //  thisElts[n].n = n; // its current position (as per the other elements)
  //  thisElts[n].o = thisInst.options; // its current position (as per the other elements)
  //  thisElts[n].hasCrossed = false; // has the elt crossed over to the other container
  //  thisElts[n].newPosSameCon = false; // has the element changed position but remained in the same container //  remove!
    // thisElts[n].belongsTo = thisInst.container;
    //thisElts[n].movesTo = thisInst.adjCon;
    //thisElts[n].currentPos = {top:0, left:0};


      var param = isVertical ? "completeHeight" : "completeWidth";
      if (!(param in Elt.prototype)) {setEltProto(param);}


    thisElts[n].props = new Elt(n, thisHeight, thisWidth, thisInst, eltObj)


  };

  function jsOffset(el) { // replaces jquery offset

    var temp = el.getBoundingClientRect();

    return {
      top: temp.top + document.body.scrollTop,
      left: temp.left + document.body.scrollLeft
    }
  }

  function JumbleScramble(element, options) { // Constructor function
    window.temporaryInstanceArray =  window.temporaryInstanceArray || [];
     // create the temporaryInstanceArray in the global scope
    this.props = {}; // The values that are to remain a reference as a shallow copy and update accordingly in adjInst must reside in a nested oobject.
                    // it is a sideeffect of Object.assign :
                    //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    this.div = element;
    this.id = this.div.id;
    this.props.divOffset = jsOffset(element);
    this.props.divWidth = _outerWidth(this.div);
    this.props.divHeight = _outerHeight(this.div);
    this.ul = this.div.querySelector('ul');

    this.props.locked = false;
    // this.container = window.temporaryInstanceArray.length;
    this.adjCon = [];
    this.options = $.extend({}, defaults, options);
    this.props.cutOff = this.options.cutOff
    this.props.dropLimit = this.options.dropLimit;
    this.ul.style[transformPrefix] = 'translate3d(0px,0px,0px)';
    this.props.ulSize = 0;
    this.transitionPrefix = transitionPrefix;
    this.transformPrefix = transformPrefix;
    this.ifGpu = ifGpu;
    this.transSupport = transSupport;
    this.crossFlag = false;
    window.temporaryInstanceArray.push(this);
  };



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

  JumbleScramble.prototype.crossDistance = function(thisInst, adjInst) {
    return this.options.isVertical ? (adjInst.props.divOffset.left - this.props.divOffset.left) : (adjInst.props.divOffset.top - this.props.divOffset.top);
  }


  JumbleScramble.prototype.setInstances = function() {

    var adjInstances = this.options.adjIds;                     //Refactor - too many loops

    for (var i= 0;i<temporaryInstanceArray.length; i++) {

        for (var n = 0; n<adjInstances.length; n++) {

           if (temporaryInstanceArray[i].id == adjInstances[n]) {

                var copy = Object.assign({}, temporaryInstanceArray[i]);
                for (let val of copy.adjCon) {
                 delete copy[val]
                }
                delete copy.adjCon;
                this['adjInst' + (n +1)] = copy;
                this.adjCon.push('adjInst' + (n +1))

                copy.distanceTo = this.crossDistance(this, temporaryInstanceArray[i])
           }
        }

    }


  }



  JumbleScramble.prototype.getUlSize = function() {
    return this.props.ulSize;
  }

  JumbleScramble.prototype.shuffle = _shuffle;

  /*--------------------------------------------------------------------------------------------------------------------------------------------------*/

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
      elt.style[thisInst.transitionPrefix] = '0ms'; // make sure the elts don't animate into position
      _addToObject(elt, n, thisHeight, thisWidth, thisInst, {top:newPosTop, left:newPosLeft});

      n = n + 1;
      //elt.style[thisInst.transformPrefix] = 'translate3d(0px, 0px, 0px)'; // must be off for scale to work
    };
    return size; // return the size of the ul
  };
    /*--------------------------------------------------------------------------------------------------------------------------------------------------*/

  function _setUlSize(size, thisInst) {
    var style = thisInst.ul.style;
    if (thisInst.options.isVertical) {
      style.height = size + 'px';
    } else {
      style.width = size + 'px';
    //  thisInst.ul.style.height = _outerHeight(thisInst.elts[0]) + 'px';
    }
    thisInst.props.ulSize = size;
  }
    /*--------------------------------------------------------------------------------------------------------------------------------------------------*/

  JumbleScramble.prototype.init = function() {

    var lis = this.div.getElementsByTagName('li');
    this.elts = new Array(lis.length);
    var ulSize = _setEltsProps(lis, this); // setting properties function return the ul size
    _setUlSize(ulSize, this)

    _addEventHandlers(this);

    this.init = true;
    this.div.dispatchEvent(setEvents.onLayout) // onLayout event

    var counter = 0;

    for (var i = 0; i < temporaryInstanceArray.length; i++) { // loop over the array and get all instances that have been initialized
      if (temporaryInstanceArray[i].init == true) {
        counter++
      }
    }

    if (counter == temporaryInstanceArray.length) {           // if all instances have been initialized
      $.each(temporaryInstanceArray, function(index, instance) {
        this.setInstances()
        // $(value.div).trigger('layoutCompleteAll') // trigger callback on each instance

        instance.div.dispatchEvent(setEvents.onLayoutAll)
      });


      //temporaryInstanceArray = null
      // delete the global instance array
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


    _setUlSize(_setEltsProps(this.elts, this), this) //setting properties function returns the ul size
    this.props.divOffset = jsOffset(this.div)


  };
  /*------------------------------------------------------------------------------------------------------------------------------------*/


  JumbleScramble.prototype.cutOffEnd = function() { // function to remove the items above cutoff limit and then prepend the adjacent container

    _scaleElems( _elemsToCut(this, this.adjInst) , this); //_elemsToCut function returns the elts to scale

  };


  /*--------------------------------------------------------------------------------------------------------------------------------------------------*/



  JumbleScramble.prototype.addLiElem = function(liText, liPosition, addTrans, setHeight, opacity = 1) {

    //display param has an ES6 default value

    var thisElts = this.elts;
    var liPosition = Math.min(Math.max(parseInt(liPosition), 0), thisElts.length); // this is to make sure that the insert position is not greater than the number of elts present.
    var n = thisElts.length,
      o = this.options,
      tempArr = [];
      var eltObj = {
        'left': liPosition > 0 ? thisElts[liPosition - 1].props.pos.left + thisElts[liPosition - 1].props.completeWidth : 0,
        'top': liPosition > 0 ? thisElts[liPosition - 1].props.pos.top + thisElts[liPosition - 1].props.completeHeight : 0
      }

    var item = ('<li style="opacity:' + opacity  +';left:' + eltObj.left + 'px;top:' + eltObj.top + 'px" class=' + (o.isVertical ? 'listItem' : 'listItem-horizontal') + '>' + liText + '</li>');
    var elt = document.createElement('li');
    elt.innerHTML = item;
    elt = elt.firstChild;

    // insert the elt before the current element at liPosition
    this.ul.insertBefore(elt, thisElts[liPosition]);


    // get its height and width
    var completeWidth = setHeight.completeWidth || (o.isVertical ? 0 : _outerWidth(elt)),
      completeHeight = setHeight.completeHeight || (o.isVertical ? _outerHeight(elt) : 0);


      //update the ul size
    var ulSize = o.isVertical ? this.props.ulSize + completeHeight : this.props.ulSize + completeWidth;
    _setUlSize(ulSize, this)

    // the elt is inserted at the specified liPosition-position but with the n-property set to the last position.
    // It is then moved up to its position by calling the eltsReorder [liPosition + 1] times
  //  console.log(eltObj)
    _addToObject(elt, n, completeHeight, completeWidth, this, eltObj);

    //reorder the elts below its insert position(last) and update the elt properties(elt.n & elt.pos)
    //if the elt is added when crossing to adjacent instance, the elt will be referred to by the name of thisInst.added

    for (var i = liPosition ; i < thisElts.length -1; i++) {
      eltsReorder._eltsMoveForwardOrDown(elt, thisElts, this, true);
    };


    if (addTrans.elt) {
      _scaleElems([elt], this)

    }; // animation only needed when triggering add

    //this.unlock();

    return elt;
  }

  /*------------------------------------------------------------------------------------------------------------------------*/


  JumbleScramble.prototype.removeLiElem = function(elt, transition, callBack) { // Remove new li to previous collection

    if (elt == undefined) {return;} // if the requested elt to delete doesn't exist
    var n = elt.props.n,
      thisElts = this.elts,
      eltHeight = thisElts[n].props.completeHeight,
      eltWidth = thisElts[n].props.completeWidth;

    for (var i = n; i < thisElts.length; i++) {  // Loop over adjacent conatiner elements, animating them and updating their properties
      eltsReorder._eltsMoveBackOrUp(elt, thisElts,  this, true);
      // third argument is a flag to override pos check in eltsMoveDown/eltsMoveForward function
    };

    thisElts.length = thisElts.length - 1; // reduce the length of elt objects in the temporaryInstanceArray after a delete

    if (transition) { // if the option to animate in the removeLiElem method used after init is true. Used in cutOff method


      elt.style[this.transformPrefix] = 'scale(0.5,0.5)';
      elt.style.opacity = '0';
      elt.style[this.transitionPrefix] = '250ms';
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

    var ulSize = this.options.isVertical ? this.props.ulSize - eltHeight : this.props.ulSize - eltWidth;
    _setUlSize(ulSize, this)
  };
