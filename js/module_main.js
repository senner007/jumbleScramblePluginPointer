  import {
    defaults,
    setChars,
    transSupport,
    transitionPrefix,
    transformPrefix,
    ifGpu
  } from "./modules.js"


  import {
    _addEventHandlers
  } from "./module_handlers.js"

  import {
    _animateBack,
    _transToZero,
    _scaleElems
  } from "./module_animation.js"

  import {
      eltsReorder,
      _elemsToCut
  } from "./module_dragging.js"



  export default JumbleScramble;
  // ES6 MODULE IMPORT/EXPORT
  ////////////////////////////

  JumbleScramble.prototype.transToZero = _transToZero;




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

  JumbleScramble.prototype.shuffle = function() {


    function shuffle(a) {
      for (let i = a.length; i; i--) {
          let j = Math.floor(Math.random() * i);
          [a[i - 1], a[j]] = [a[j], a[i - 1]];
      }
    }

    function _getElems (inst, adj) {
      var elems = []

        for (let ii = 0; ii<arguments.length; ii++) {
         let i = 0, p;
            while (arguments[ii].elts[i] != undefined ) {
              elems.push(arguments[ii].elts[i].innerHTML)
              i++
            }
        }


      shuffle(elems)

      return function () {
          var count = 0
          for (let i = 0; i<inst.elts.length; i++) {
              inst.elts[i].innerHTML = elems[count]
              count++;
          }

          for (let i = 0; i<adj.elts.length; i++) {
              adj.elts[i].innerHTML = elems[count]
              count++
          }
          return elems;
      };
    };


      var _setElems = _getElems(this, this.adjInst);
      _setElems()
      this.reLayout()
    this.adjInst.reLayout()


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

    _addEventHandlers(this);

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




  };
  /*------------------------------------------------------------------------------------------------------------------------------------*/


  JumbleScramble.prototype.cutOffEnd = function() { // function to remove the items above cutoff limit and then prepend the adjacent container


    _scaleElems(_elemsToCut(this, this.adjInst) , this);


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
      var marginLeft = o.isVertical ? el.offsetLeft : (el.completeWidth - el.offsetWidth); // account for margin
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

    if (elt == undefined) {return;} // if the requested elt to delete doesn't exist
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
