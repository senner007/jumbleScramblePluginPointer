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
    animateBack,
    transToZero
  } from "./module_animation.js"

  export default JumbleScramble;

  // ES6 MODULE IMPORT/EXPORT
  ////////////////////////////

  JumbleScramble.prototype.transToZero = transToZero;

  JumbleScramble.prototype.onStop = function(elt) { // Stop
    var o = this.options;

    // A lower elt.dragSpeed value will speed up the animation and subsequently the add and remove logic after dropping an item.
    // (If the difference in time between the initialized drag and the release is less than specified,
    // it will increase the transition speed of the dropped item going to its new position)

    if (this.crossTrigger == true) { // going to new container
      this.adjInst.lock();
      this.crossTrigger = false;
    } else { // staying in originating container
      elt.newPosSameCon = (elt.nStart != elt.n)
    }

    elt.endDate = new Date();
    elt.dragSpeed = (elt.endDate.getTime() - elt.startDate.getTime()) / 1000;

    // elt.dragSpeed measuresthe time it takes to initialize the drag to when it is dropped. A smaller difference
    // will increase the speed of the layout animation.
    console.time("concatenation");
    var speed;

    if (elt.dragSpeed < 0.2) {
      speed = '15ms ease'
    }
    else if (elt.dragSpeed < 0.35) {
      speed = '100ms ease'
    }
    else if (elt.dragSpeed < 0.5) {
      speed = '170ms ease'
    }

    var thisInst = this
    $(elt).one('transitionend', function() {
      appendRemove.call(thisInst)
    })

    animateBack(elt, o, this);
    this.transToZero(elt, speed);

    function appendRemove() {
      if (!elt.hasCrossed && elt.newPosSameCon) {
        // insert the dragged element into its new position efter drop in originating container
        // on condition that it has changed its position
        if (elt.n == 0) {
          this.ul.insertBefore(elt, this.elts[1]);
        }
        // insert elt before the first one - replaces $.insertBefore
        else {
          this.ul.insertBefore(elt, this.elts[elt.n + 1]);
        }
      }
      else if (elt.hasCrossed) {

        if (this.adjInst.elts.length == 0) {
          this.adjInst.ul.insertBefore(this.added, this.adjInst.elts[1]);
        } else {
          this.adjInst.ul.insertBefore(this.added, this.adjInst.elts[this.added.n + 1]);
          this.added.style.display = 'block'
          o.isVertical ? this.added.style.top = elt.style.top : this.added.style.left = elt.style.left;
          delete this.added
          this.removeLiElem(elt, false, true);

        }
          this.adjInst.unlock();
          this.adjInst.cutOffEnd(this);
          elt.hasCrossed = false;

      }
    };
  };


  function addToObject(thisElts, elt, n, thisHeight, thisWidth, o, thisContainer, adjCon, posTop, posLeft) {

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
      window.temporaryInstanceArray = []; // create the temporaryInstanceArray in the global scope

    }

    this.div = element[0];
    this.id = this.div.id;
    this.divOffset = jsOffset(this.div);
    this.ul = this.div.querySelector('ul');
    this.locked = false;
    this.container = window.temporaryInstanceArray.length;
    this.adjCon = this.container % 2 == 0 ? this.container + 1 : this.container - 1;
    this.options = $.extend({}, defaults, options);
    this.cutOff = this.options.cutOff
    this.dropLimit = this.options.dropLimit[0];
    this.ul.style[transformPrefix] = 'translate3d(0px,0px,0px)';
    this.dfd = $.Deferred()

    window.temporaryInstanceArray.push(this);

  };

  JumbleScramble.prototype.crossTrigger = false;
  JumbleScramble.prototype.transSupport = transSupport;
  JumbleScramble.prototype.transitionPrefix = transitionPrefix;
  JumbleScramble.prototype.transformPrefix = transformPrefix;
  JumbleScramble.prototype.ifGpu = ifGpu;

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


  JumbleScramble.prototype.getInstances = function() {


    // get object containing all instances, but without the proto
  }

  JumbleScramble.prototype.lock = function() {
    // Nothing can be dragged to or from this instance
    this.locked = true;
  }

  JumbleScramble.prototype.unlock = function() {
    this.locked = false;
  }

  JumbleScramble.prototype.crossDistance = function(instThis, instAdj) {


    if (this.options.isVertical) {
      var crossDistance = this.adjInst.divOffset.left - this.divOffset.left;
    } else {
      var crossDistance = this.adjInst.divOffset.top - this.divOffset.top;
    }

    return crossDistance
  }

  JumbleScramble.prototype.addHandlers = addHandlers;

  JumbleScramble.prototype.init = function() {

    var li = this.div.getElementsByTagName('li'); // Variables declaration
    var left = 0,
      top = 0,
      n = 0,
      size = 0,
      thisElts = this.elts = new Array(li.length);

    for (var i = 0; i < thisElts.length; i++) {
      var elt = li[i];

      if (this.options.isVertical) {
        elt.style.top = size + 'px'; // get each li height in case of individual heights.
        var thisHeight = outerHeight(elt);
        var newPosTop = size
        size += thisHeight;

      } else {
        elt.style.left = size + 'px'; // get each li width in case of individual widths. (default)
        var thisWidth = outerWidth(elt);
        var newPosLeft = size
        size += thisWidth;

      }

      addToObject(thisElts, elt, n, thisHeight, thisWidth, this.options, this.container, this.adjCon, newPosTop, newPosLeft);

      n = n + 1;
      elt.style[transformPrefix] = 'translate3d(0px, 0px, 0px)';
    }
    this.addHandlers();

    if (this.options.isVertical) {
      this.ul.style.height = size + 'px';
    } else {
      this.ul.style.width = size + 'px';
      this.ul.style.height = outerHeight(thisElts[0]) + 'px';
    }


    //  marginLeft: (this.ul.parent().width() - ulSize) / 2
    // Update the ul size
    $(this.div).trigger('layoutComplete', [parseInt(this.ul.style.height)]) // example of sending the ul height as second parameter to the callback
    this.init = true;
    var counter = 0;
    for (var i = 0; i<temporaryInstanceArray.length; i++) {
      if (temporaryInstanceArray[i].init == true) { counter++}
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

  function outerHeight(el) { // replacing jquery outerWidth(true)
    var height = el.offsetHeight;
    var style = getComputedStyle(el);
    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
  }

  function outerWidth(el) { // replacing jquery outerWidth(true)
    var width = el.offsetWidth;
    var style = getComputedStyle(el);
    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
    return width;
  }
  /*--------------------------------------------------------------------*/


  JumbleScramble.prototype.reLayout = function() {

    //var li = this.div.find('li'); // Variables declaration
    var left = 0,
      top = 0,
      n = 0,
      size = 0;


    var thisElts = this.elts;
    var thisEltsLength = thisElts.length;

    for (var i = 0; i < thisEltsLength; i++) {
      var elt = thisElts[i];

      if (this.options.isVertical) {
        elt.style.top = size + 'px'; // get each li height in case of individual heights.
        var thisHeight = outerHeight(elt);
        var newPosTop = size
        size += thisHeight;

      } else {
        elt.style.left = size + 'px'; // get each li width in case of individual widths. (default)
        var thisWidth = outerWidth(elt);
        var newPosLeft = size
        size += thisWidth;

      }

      addToObject(thisElts, elt, n, thisHeight, thisWidth, this.options, this.container, this.adjCon, newPosTop, newPosLeft);

      n = n + 1;
      elt.style[this.transformPrefix] = 'translate3d(0px, 0px, 0px)';
    }

    if (this.options.isVertical) {
      this.ul.style.height = size + 'px';
    } else {
      this.ul.style.width = size + 'px';
      this.ul.style.height = outerHeight(thisElts[0]) + 'px'
    }

    this.divOffset = jsOffset(this.div)
    this.adjInst.divOffset = jsOffset(this.adjInst.div)


  };
  /*------------------------------------------------------------------------------------------------------------------------------------*/


  JumbleScramble.prototype.cutOffEnd = function(thisInst) { // function to remove the items above cutoff limit and then prepend the adjacent container
   var thisInst = thisInst || this.adjInst; // thisInst is the instance which receives the cutOff elements. If not passed in, it will assume the instance is this.adjInst

   var elems = [],
       eltsSize = 0,
       eltDim = this.options.isVertical ? 'completeHeight' : 'completeWidth';

    for (var i = 0; i < this.elts.length; i++) { // same as getting the ul size
      eltsSize += this.elts[i][eltDim];
    }


    while (eltsSize > this.cutOff) {
      var eltToCut = this.elts[this.elts.length - 1];
      var elt = thisInst.addLiElem(eltToCut.textContent, 0, {elt:false,elts:true}, eltToCut.completeHeight, eltToCut.completeWidth);
      elt.style[this.transitionPrefix] = '0ms';
      elt.style[this.transformPrefix] = 'scale(0,0)';
      elems.push(elt);
      this.removeLiElem(this.elts[this.elts.length - 1], this.transSupport)
      eltsSize -= this.elts[this.elts.length - 1][eltDim];
    }

    thisInst.animAdded(elems);

  };
  /*--------------------------------------------------------------------------------------------------------------------------------------------------*/


  JumbleScramble.prototype.animAdded = function(elems) { // should be in animation module, and not on the prototype
    var elems = elems, // elems is an array of elements to scale in after they have been added
      _this = this;

    if (this.transSupport && elems.length != 0) { // transition elements  but only if if there are any

      if (this.elts[elems.length] && !$(elems).is(':last-child')) {
        // callback function for when the items have moved down and made room for the newly prepended item(s)
        // this.elts[elems.length] is the first item before the added items(elems) to scale in.
        $(this.elts[elems.length]).one('transitionend', animAddedElems); // once true might not be supported in all browsers
      } else {
        // if there are no elements that have moved to make way for added elements(elems)
        setTimeout(function() { // setTimeout is need because transform properties need time to be set.
          animAddedElems();
        }, 1);

      }
    }

    function animAddedElems() {
        for (var i = 0; i < elems.length; i++) {
          elems[i].style[_this.transitionPrefix] = '500ms';
          elems[i].style[_this.transformPrefix] = 'scale(1,1)';
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

    thisElts.length == 0 ? this.ul.appendChild(elt) : (n > 0) ? this.ul.insertBefore(elt, thisElts[elt.n + 1]) : this.ul.insertBefore(elt, thisElts[n]);

    var thisWidth = completeWidth || (o.isVertical ? 0 : outerWidth(elt)),
      thisHeight = completeHeight || (o.isVertical ? outerHeight(elt) : 0);

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

    o.isVertical ? this.ul.style.height = parseInt(this.ul.style.height) + thisHeight + 'px' : this.ul.style.width = parseInt(this.ul.style.width) + thisWidth + 'px';

    addToObject(thisElts, elt, n, thisHeight, thisWidth, o, this.container, this.adjCon, eltObj.top, eltObj.left);

    if (addTrans.elt) {
      elt.style[this.transitionPrefix] = '0ms';
      elt.style[this.transformPrefix] = 'scale(0,0)';
      var tArr = [elt];
      this.animAdded(tArr)
      /* elt[0].style[transitionPrefix] = '500ms'; elt[0].style[transformPrefix] = 'scale(1,1)'; elt[0].style.opacity = '1';  */

    }; // animation only needed when triggering add

    this.unlock();
    return elt;
  }


  JumbleScramble.prototype.removeLiElem = function(elt, transition, callBack) { // Remove new li to previous collection


    if (typeof arguments[2] == 'function') { // flag to see if the third argument is a function, which is when it is called as a method from outside
      var callBack = arguments[2]; // if nott the third arghuments passed is set to dropDelete
    } else {
      var dropDelete = arguments[2];
    }

    var n = elt.n,
      thisElts = this.elts,
      eltHeight = dropDelete ? elt.completeHeight : thisElts[n].completeHeight,
      eltWidth = dropDelete ? elt.completeWidth : thisElts[n].completeWidth;


    if (dropDelete != true) { // this code is run after init and if third argument is not true. Used in cutOff method
                              // Not sure what everything does - maybe refactor

      for (var i = n + 1; i < thisElts.length; i++) {
        var el = thisElts[i];

        el.style[transitionPrefix] = transition ? '250ms' : '0s';
        thisElts[i - 1] = el;
        el.n = i - 1;
        el.style.top = el.pos.top - eltHeight + 'px';
        el.style.left = el.pos.left - eltWidth + 'px';
        el.style[transformPrefix] = 'translate(0px,0px,0px)';
        el.pos.top = el.pos.top - eltHeight;
        el.pos.left = el.pos.left - eltWidth;
      };
    }
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

    this.options.isVertical ? this.ul.style.height = parseInt(this.ul.style.height) - eltHeight + 'px' : this.ul.style.width = parseInt(this.ul.style.width) - eltWidth + 'px';

  };
