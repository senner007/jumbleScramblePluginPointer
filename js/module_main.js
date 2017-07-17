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
    var instanceArr = this.getInstances();

    // A lower elt.dragSpeed value will speed up the animation and subsequently the add and remove logic after dropping an item.
    // (If the difference in time between the initialized drag and the release is less than specified,
    // it will increase the transition speed of the dropped item going to its new position)

    if (instanceArr.crossTrigger == true) { // going to new container
    instanceArr[elt.movesTo].lock();
      instanceArr.crossTrigger = false;
    } else { // staying in originating container
      elt.newPosSameCon = (elt.nStart != elt.n)
    }

    elt.endDate = new Date();
    elt.dragSpeed = (elt.endDate.getTime() - elt.startDate.getTime()) / 1000;

    // elt.dragSpeed measuresthe time it takes to initialize the drag to when it is dropped. A smaller difference
    // will increase the speed of the layout animation.
    console.time("concatenation");
    var speed;
    if (elt.dragSpeed < 0.5) {
      speed = '170ms ease'
    }
    if (elt.dragSpeed < 0.35) {
      speed = '100ms ease'
    }
    if (elt.dragSpeed < 0.2) {
      speed = '15ms ease'
    }

    //
    // if (o.setChars) {
    //   setChars(elt);
    // } // setChars function	- re-align lis after uppercase/lowercase for difficulty setting  2

    $(elt).one('transitionend', function() {

      appendRemove()
    })

    animateBack(elt, o, instanceArr);
    instanceArr[0].transToZero(elt, speed);
    // only wait for transitionend if supported (not ie9)
    //{once: true}  once not supported before edge 16

    function appendRemove() {
      // if (!!o.autoValidate) {
      //   o.autoValidate();
      // } // calls the autovalidate function in the plugin calling script
      if (!elt.hasCrossed && elt.newPosSameCon) {
        // insert the dragged element into its new position efter drop in originating container
        // on condition that it has changed its position
        if (elt.n == 0) {
          instanceArr[elt.belongsTo].ul.insertBefore(elt, instanceArr[elt.belongsTo].elts[1]);
        }
        // insert elt before the first one - replaces $.insertBefore
        else {
          instanceArr[elt.belongsTo].ul.insertBefore(elt, instanceArr[elt.belongsTo].elts[elt.n + 1]);
        }
      }
      if (elt.hasCrossed) {
        if (instanceArr[elt.movesTo].elts.length == 0) {
          instanceArr[elt.movesTo].ul.insertBefore(instanceArr.added, instanceArr[elt.movesTo].elts[1]);
        } else {
          instanceArr[elt.movesTo].ul.insertBefore(instanceArr.added, instanceArr[elt.movesTo].elts[instanceArr.added.n + 1]);
          instanceArr.added.style.display = 'block'
          o.isVertical ? instanceArr.added.style.top = elt.style.top : instanceArr.added.style.left = elt.style.left;

          instanceArr[elt.belongsTo].removeLiElem(elt, false, true);

        }
          instanceArr[elt.movesTo].unlock();
        instanceArr[elt.movesTo].cutOffEnd();

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
    if (!window.instanceArr) {
      window.instanceArr = []; // create the instanceArr in the global scope
      window.instanceArr.crossTrigger = false;
      window.instanceArr.transSupport = transSupport;
      window.instanceArr.transitionPrefix = transitionPrefix;
      window.instanceArr.transformPrefix = transformPrefix;
      window.instanceArr.ifGpu = ifGpu;
    }

    this.div = element[0];
    this.id = this.div.id;
    this.divOffset = jsOffset(this.div);
    this.ul = this.div.querySelector('ul');
    this.locked = false;
    this.container = window.instanceArr.length;
    this.adjCon = this.container % 2 == 0 ? this.container + 1 : this.container - 1;
    this.options = $.extend({}, defaults, options);
    this.cutOff = this.options.cutOff
    this.dropLimit = this.options.dropLimit[0];
    this.ul.style[transformPrefix] = 'translate3d(0px,0px,0px)';
    this.dfd = $.Deferred()

    window.instanceArr.push(this);

  };

  JumbleScramble.prototype.setInstances = function() {


    var copy = Object.assign({}, instanceArr[this.adjCon]);
    var copy2 = Object.assign({}, instanceArr[this.adjCon].__proto__); // maybe find a way to copy object with proto
    delete copy.adjInstance
    this.adjInstance = copy;
    this.adjInstance.__proto__ = copy2
    console.log(this)

  }


  JumbleScramble.prototype.getInstances = function() {


    return window.instanceArr;
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
      var crossDistance = instanceArr[this.elts[0].movesTo].divOffset.left - this.divOffset.left;
    } else {
      var crossDistance = instanceArr[this.elts[0].movesTo].divOffset.top - this.divOffset.top;
    }

    return crossDistance
  }

  JumbleScramble.prototype.addHandlers = addHandlers;

  JumbleScramble.prototype.init = function() {

    var li = this.div.getElementsByTagName('li'); // Variables declaration
    var left = 0,
      top = 0,
      n = 0,
      ulSize = 0,
      posTop = 0,
      posLeft = 0;

    var thisElts = this.elts = new Array(li.length);

    for (var i = 0; i < thisElts.length; i++) {
      var elt = li[i];

      if (this.options.isVertical) {
        elt.style.top = posTop + 'px'; // get each li height in case of individual heights.
        var thisHeight = outerHeight(elt);
        posTop += thisHeight;
        ulSize += thisHeight;
      } else {
        elt.style.left = posLeft + 'px'; // get each li width in case of individual widths. (default)
        var thisWidth = outerWidth(elt);
        posLeft += thisWidth;
        ulSize += thisWidth; // calculate the size of the ul element
      }
      var newPosTop = posTop - thisHeight;
      var newPosLeft = posLeft - thisWidth;

      addToObject(thisElts, elt, n, thisHeight, thisWidth, this.options, this.container, this.adjCon, newPosTop, newPosLeft);

      n = n + 1;
      elt.style[transformPrefix] = 'translate3d(0px, 0px, 0px)';
    }
    this.addHandlers();

    if (this.options.isVertical) {
      this.ul.style.height = ulSize + 'px';
    } else {
      this.ul.style.width = ulSize + 'px';
      this.ul.style.height = outerHeight(thisElts[0]) + 'px';
    }


    //  marginLeft: (this.ul.parent().width() - ulSize) / 2
    // Update the ul size
    $(this.div).trigger('layoutComplete', [parseInt(this.ul.style.height)]) // example of sending the ul height as second parameter to the callback
    this.init = true;
    var counter = 0;
    for (var i = 0; i<instanceArr.length; i++) {
      if (instanceArr[i].init == true) { counter++}
      if (counter == instanceArr.length) {
        $.each(instanceArr, function(index, value) {
          $(value.div).trigger('layoutCompleteAll')

            this.setInstances()


       });

      }
    }



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
      ulSize = 0,
      posTop = 0,
      posLeft = 0;


    var thisElts = this.elts;
    var thisEltsLength = thisElts.length;

    for (var i = 0; i < thisEltsLength; i++) {
      var elt = thisElts[i];

      if (this.options.isVertical) {
        // get each li height in case of individual heights.
        elt.style.top = posTop + 'px'
        var thisHeight = outerHeight(elt);
        posTop += thisHeight;
        ulSize += thisHeight;
      } else {
        // get each li width in case of individual widths. (default)
        elt.style.left = posLeft + 'px';
        var thisWidth = outerWidth(elt);
        posLeft += thisWidth;
        ulSize += thisWidth; // calculate the size of the ul element
      }
      var newPosTop = posTop - thisHeight;
      var newPosLeft = posLeft - thisWidth;
      addToObject(thisElts, elt, n, thisHeight, thisWidth, this.options, this.container, this.adjCon, newPosTop, newPosLeft);

      n = n + 1;
      elt.style[transformPrefix] = 'translate3d(0px, 0px, 0px)';
    }

    if (this.options.isVertical) {
      this.ul.style.height = ulSize + 'px';
    } else {
      this.ul.style.width = ulSize + 'px';
      this.ul.style.height = outerHeight(thisElts[0]) + 'px'
    }

    this.divOffset = jsOffset(this.div)

  };
  /*------------------------------------------------------------------------------------------------------------------------------------*/


  JumbleScramble.prototype.cutOffEnd = function() { // function to remove the items above cutoff limit and then prepend the adjacent container

    var eltsSize = 0;
    var eltDim = this.options.isVertical ? 'completeHeight' : 'completeWidth';
    for (var i = 0; i < this.elts.length; i++) {
      eltsSize += this.elts[i][eltDim];
    }

    var tArr = [];
    while (eltsSize > this.cutOff) {
      var eltToCut = this.elts[this.elts.length - 1];
      tArr.push(this.addLiElem.call(this.adjInstance, eltToCut.textContent, 0, {elt:false,elts:true}, eltToCut.completeHeight, eltToCut.completeWidth));
      this.removeLiElem(this.elts[this.elts.length - 1], transSupport)
      eltsSize -= this.elts[this.elts.length - 1][eltDim];
    }

    this.animAdded(tArr, this.adjCon);

  };
  /*--------------------------------------------------------------------------------------------------------------------------------------------------*/


  JumbleScramble.prototype.animAdded = function(elems, parentCont) { // should be in animation module, and not on the prototype

    var tArr = elems,
        instanceArr = this.getInstances(),
        parentCont = parentCont;

    if (transSupport && tArr.length != 0) { // transition elements  but only if if there are any

      for (var i = 0; i < tArr.length; i++) {

        tArr[i].style[instanceArr.transitionPrefix] = '0ms';
        tArr[i].style[instanceArr.transformPrefix] = 'scale(0,0)';
      }

      if (instanceArr[parentCont].elts[tArr.length] && !$(tArr).is(':last-child')) {

        // callback function for when the items have moved down and made room for the newly prepended item(s)
        $(instanceArr[parentCont].elts[instanceArr[parentCont].elts.length - 1]).one('transitionend', animAddedElems); // once true might not be supported in all browsers

      } else { // if there are no elements that have moved to make way for added elements(tArr)
        setTimeout(function() { // setTimeout is need because transform properties need time to be set.
          animAddedElems();
        }, 1);

      }
    }

    function animAddedElems() {

      for (var i = 0; i < tArr.length; i++) {

        tArr[i].style[instanceArr.transitionPrefix] = '500ms';
        tArr[i].style[instanceArr.transformPrefix] = 'scale(1,1)';

      }
    }
  };

  /*--------------------------------------------------------------------------------------------------------------------------------------------------*/

  JumbleScramble.prototype.addLiElem = function(liText, liPosition, addTrans, completeHeight, completeWidth) { // Add new li to previous collection

    var thisElts = this.elts;

      var n = Math.min(Math.max(parseInt(liPosition), 0), thisElts.length),
      o = this.options,
      instanceArr = this.getInstances(),
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

      el.style[instanceArr.transitionPrefix] = '0ms';
      el.style[instanceArr.transformPrefix] = instanceArr.transSupport ? 'translate3d(0px,0px,0px)' : 'translate(0px,0px)';
      el.style.left = parseInt(el.style.left) + thisWidth + 'px'
      el.style.top = parseInt(el.style.top) + thisHeight + 'px'
      el.pos.left = el.offsetLeft - marginLeft;
      el.pos.top = el.offsetTop;
      el.n = el.n + 1
      tempArr.push(el);
      if (addTrans.elts) {
        el.style[instanceArr.transformPrefix] = 'translate(' + -(thisWidth) + 'px,' + -(thisHeight) + 'px)';
        instanceArr[0].transToZero(el);
      }
    };

    for (var i = 0; i < tempArr.length; i++) {
      thisElts[n + 1 + i] = tempArr[i];
    }

    o.isVertical ? this.ul.style.height = parseInt(this.ul.style.height) + thisHeight + 'px' : this.ul.style.width = parseInt(this.ul.style.width) + thisWidth + 'px';

    addToObject(thisElts, elt, n, thisHeight, thisWidth, o, this.container, this.adjCon, eltObj.top, eltObj.left);

    if (addTrans.elt) {
      var tArr = [elt];
      this.animAdded(tArr, this.container)
      /* elt[0].style[transitionPrefix] = '500ms'; elt[0].style[transformPrefix] = 'scale(1,1)'; elt[0].style.opacity = '1';  */
      return elt;
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
    thisElts.length = thisElts.length - 1; // reduce the length of elt objects in the instanceArr after a delete

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
