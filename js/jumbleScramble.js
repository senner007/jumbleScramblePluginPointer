  import {
    defaults,
    setChars,
    transSupport,
    ifGpu,
    transitionPrefix,
    transformPrefix,
  } from "./modules.js"

  import {
    onDrag,
    posObj
  } from "./drag_modules.js"

  export {
    module_jumble_scramble,
    instanceArr
  };

  var instanceArr = [];




  $.fn.transToZero = function() {
    var elt = this[0];

    window.getComputedStyle(elt)[transformPrefix] // needed to apply the transition style dynamically

    elt.style[transitionPrefix] = '250ms ease';

    elt.style[transformPrefix] = ifGpu // translateZ doesn't work for ie9

  };


  function addToObject(thisElts, elt, n, $thisHeight, $thisWidth, o, thisContainer, adjCon, posTop, posLeft) {

    thisElts[n] = elt;
    thisElts[n].completeWidth = $thisWidth || 0; // its size (with the margin)
    thisElts[n].completeHeight = $thisHeight || 0; // its height (with the margin)
    thisElts[n].pos = {top: posTop, left: posLeft}; // its position (left and top position)
    o.isVertical == true ? thisElts[n].pos = {top: posTop, left: 0} : thisElts[n].pos = {top: 0, left: posLeft};
    thisElts[n].initialN = n; // its initial position (as per the other elements)
    thisElts[n].n = n; // its current position (as per the other elements)
    thisElts[n].o = o; // its current position (as per the other elements)
    thisElts[n].moved = false;
    thisElts[n].belongsTo = thisContainer;
    thisElts[n].movesTo = adjCon;
    thisElts[n].currentPos = {};

  };













  function onStop(evt, elt, div, o) { // Stop
    animateBack(elt, o);
    elt.transToZero();
     console.log( 'old ' + $('ul')[0].style.width )
    if (o.setChars) {
      setChars(elt);

    } // setChars function	- re-align lis after uppercase/lowercase for difficulty setting  2

    transSupport ? elt.one('transitionend', function() {

      appendRemove()

    }) : appendRemove() // only wait for transitionend if supported (not ie9)

    function appendRemove() {

      if (!!o.autoValidate) {
        o.autoValidate(); // calls the autovalidate function in the plugin calling script
      }
      if (posObj.crossTrigger) {

        instanceArr[elt.belongsTo].removeLiElem(elt, false)

        instanceArr[elt.movesTo].addLiElem(elt.text(), elt.insertPos, false);

        posObj.crossTrigger = false;

        instanceArr[elt.movesTo].cutOffEnd()
      }
    };

  };

  function animateBack(elt, o) {

    var eltMarginLeft = o.isVertical ? 0 : elt.completeWidth - elt[0].offsetWidth; // set margin for horizontal
    if (posObj.crossTrigger) {

      var instMovesTo = instanceArr[elt.movesTo];
      var adjEltBefore = instMovesTo.elts[elt.insertPos - 1];
      if (o.isVertical) {

        var adjacentDir = instMovesTo.divOffset.left - instanceArr[elt.belongsTo].divOffset.left;
        var animateToPos = elt.insertPos > 0 ? adjEltBefore.pos.top + adjEltBefore.completeHeight : 0;
        console.log(instMovesTo.divOffset.left)
        var thisLeft = adjacentDir,
          thisTop = animateToPos,
          thisX = elt.currentPos.left - adjacentDir,
          thisY = elt.currentPos.top - animateToPos;
      } else {

        var adjacentDir = instMovesTo.divOffset.top - instanceArr[elt.belongsTo].divOffset.top;
        var animateToPos = elt.insertPos > 0 ? adjEltBefore.pos.left + adjEltBefore.completeWidth : 0;

        var thisLeft = animateToPos,
          thisTop = adjacentDir,
          thisX = elt.currentPos.left - animateToPos,
          thisY = elt.currentPos.top - adjacentDir;
      }
    } else {
      var thisLeft = elt.pos.left,
        thisTop = elt.pos.top,
        thisX = elt.currentPos.left - elt.pos.left,
        thisY = elt.currentPos.top - elt.pos.top;
    }

    elt[0].style.left = thisLeft + 'px'
    elt[0].style.top = thisTop + 'px'
    elt[0].style[transformPrefix] = 'translate3d(' + (thisX - eltMarginLeft) + 'px,' + thisY + 'px,0px)';


  }

  // function getOffset(elt) {
  //   return {
  //     left: parseInt(elt.css('left')),
  //     top: elt.css('top') == 'auto' ? 0 : parseInt(elt.css('top'))
  //   };
  // };



  var conCount = 0;
  var whendfd;
  function JumbleScramble(element, options) { // Constructor function

    this.div = $(element);
    this.divOffset = this.div.offset();
    this.ul = this.div.find('ul');
    this.container = conCount;
    this.adjCon = this.container % 2 == 0 ? this.container + 1 : this.container - 1;

    this.options = $.extend({}, defaults, options);

    this.cutOff = this.options.cutOff
    this.dropLimit = this.options.dropLimit[0];
    this.ul[0].style[transformPrefix] = 'translate3d(0px,0px,0px)';
    this.dfd = $.Deferred()

    conCount++;
    instanceArr.push(this);

  };


  JumbleScramble.prototype.cutOffEnd = function() { // function to remove the items above cutoff limit and then prepend the adjacent container
    var eltsSize = 0;
    var eltDim = this.options.isVertical ? 'completeHeight' : 'completeWidth';
    for (var i = 0; i < this.elts.length; i++) {
      eltsSize += this.elts[i][eltDim];
    }

    var tArr = [];
    while (eltsSize > this.cutOff) {
      tArr.push(instanceArr[this.adjCon].addLiElem(this.elts[this.elts.length - 1].text(), 0, transSupport)[0]);
      this.removeLiElem(this.elts[this.elts.length - 1], transSupport)
      eltsSize -= this.elts[this.elts.length - 1][eltDim];
    }
    this.animAdded(tArr, this.adjCon);
  };

  JumbleScramble.prototype.animAdded = function(elems, parentCont) {

    var tArr = elems;
    var parentCont = parentCont;

    if (transSupport && tArr.length != 0) { // transition elements  but only if if there are any

      for (var i = 0; i < tArr.length; i++) {
        tArr[i].style[transitionPrefix] = '0ms';
        tArr[i].style[transformPrefix] = 'scale(0,0)';

      }

      if (instanceArr[parentCont].elts[tArr.length] && !$(tArr).is(':last-child')) {

        instanceArr[parentCont].elts[instanceArr[parentCont].elts.length - 1].one('transitionend', animAddedElems); // callback function for when the items have moved down and made room for the newly prepended item(s)

      } else { // if there are no elements that have moved to make way for added elements(tArr)
        setTimeout(function() { // setTimeout is need because transform properties need time to be set.
          animAddedElems();
        }, 1);


      }
    }

    function animAddedElems() {
      for (var i = 0; i < tArr.length; i++) {
        tArr[i].style[transitionPrefix] = '500ms';
        tArr[i].style[transformPrefix] = 'scale(1,1)';

      }
    }


  }


  JumbleScramble.prototype.removeLiElem = function() { // Remove new li to previous collection

    var elt = arguments[0];
    var removeTrans = arguments[1];
    var callBack = arguments[2];

    var n = elt.index();
    var thisElts = this.elts;
    var eltHeight = thisElts[n].completeHeight;
    var eltWidth = thisElts[n].completeWidth;

    for (var i = n + 1; i < thisElts.length; i++) {
      var el = thisElts[i];
      el[0].style[transitionPrefix] = removeTrans ? '250ms' : '0s';
      thisElts[i - 1] = el;
      el.n = i - 1;
      el[0].style.top = el.pos.top - eltHeight + 'px';
      el[0].style.left = el.pos.left - eltWidth + 'px';
      el[0].style[transformPrefix] = 'translate(0px,0px,0px)';
      el.pos.top = el.pos.top - eltHeight;
      el.pos.left = el.pos.left - eltWidth;
    };
    thisElts.length = thisElts.length - 1;

    if (removeTrans) {
      elt[0].style[transformPrefix] = 'scale(0.5,0.5)';
      elt[0].style.opacity = '0';
      elt[0].style[transitionPrefix] = '250ms';
      setTimeout(function() {
        elt.remove()
        if (callBack) {
          callBack();
        }
      }, 250);
    } else {
      elt.remove();
    }

      this.options.isVertical ? this.ul.css({'height': '-=' + eltHeight + 'px'}) : this.ul.css({ 'width': '-=' + eltWidth + 'px'});
  };


  JumbleScramble.prototype.addLiElem = function(liText, liPosition, addTrans) { // Add new li to previous collection

    console.log('added')
    var thisElts = this.elts;
    var n = Math.min(Math.max(parseInt(liPosition), 0), thisElts.length);
    var o = this.options;
    var listClass = o.isVertical ? 'listItem' : 'listItem-horizontal';
    var elt = $('<li class=' + listClass + '>' + liText + '</li>');

    /* 		if (addTrans) { elt[0].style[transformPrefix] = 'scale(0,0)'; elt[0].style.opacity = '1'; } */

    var tempArr = [];
    for (var i = n; i < thisElts.length; i++) {
      tempArr.push(thisElts[i]);
    }

    var eltObj = {
      'left': n > 0 ? thisElts[n - 1].pos.left + thisElts[n - 1].completeWidth + 'px' : 0,
      'top': n > 0 ? thisElts[n - 1].pos.top + thisElts[n - 1].completeHeight + 'px' : 0
    }

    if (thisElts.length == 0) {
      elt.css(eltObj).appendTo(this.ul)
    } // if there are no elements present at drop
    else(n > 0 ? elt.insertAfter(thisElts[n - 1]).css(eltObj) : elt.insertBefore(thisElts[n]).css(eltObj));


    var $thisWidth = o.isVertical ? 0 : elt.outerWidth(true);
    var $thisHeight = o.isVertical ? elt.outerHeight(true) : 0;



    for (var i = n; i < thisElts.length; i++) {
      var ets0 = thisElts[i][0];
      thisElts[i].moved = false;
      ets0.style[transitionPrefix] = '0ms';
      ets0.style[transformPrefix] = transSupport ? 'translate3d(0px,0px,0px)' : 'translate(0px,0px)';
      ets0.style.left = parseInt(ets0.style.left) + $thisWidth + 'px'
      ets0.style.top = parseInt(ets0.style.top) + $thisHeight + 'px'

      if (addTrans) {
        //console.log(ets0)
        ets0.style[transformPrefix] = 'translate(' + -($thisWidth) + 'px,' + -($thisHeight) + 'px)';
        thisElts[i].transToZero();
      }
    }

    o.isVertical ? this.ul.css({ 'height': '+=' + $thisHeight + 'px'  }) :  this.ul.css({'width': '+=' + $thisWidth + 'px'})



    var newTopPos = parseInt(eltObj.top),
        newLeftPos = parseInt(eltObj.left)

    addToObject(thisElts, elt, n, $thisHeight, $thisWidth, o, this.container, this.adjCon,newTopPos, newLeftPos);



    for (var i = 0; i < tempArr.length; i++) {
      var marginLeft = o.isVertical ? 0 : (tempArr[i].completeWidth - tempArr[i][0].offsetWidth); // account for margin
      tempArr[i].pos.left = tempArr[i][0].offsetLeft - marginLeft;
      tempArr[i].pos.top = tempArr[i][0].offsetTop;
      tempArr[i].n = n + i + 1;
      thisElts[n + 1 + i] = tempArr[i];
    }
    if (addTrans) {
      var tArr = [elt[0]];
      this.animAdded(tArr, this.container)
      /* elt[0].style[transitionPrefix] = '500ms'; elt[0].style[transformPrefix] = 'scale(1,1)'; elt[0].style.opacity = '1';  */
      return elt;
    }; // animation only needed when triggering add


  }



  JumbleScramble.prototype.init = function() {

    var li = this.div.find('li'); // Variables declaration
    var left = 0,
      top = 0,
      n = 0,
      ulSize = 0,
      posTop = 0,
      posLeft = 0;

    var thisElts = this.elts = new Array(li.length);

    for (var i = 0; i < thisElts.length; i++) {
      var elt = li.eq(i);

      if (this.options.isVertical) {
        elt.css('top', posTop + 'px'); // get each li height in case of individual heights.

        var $thisHeight = elt.outerHeight(true);
        posTop += $thisHeight;


        ulSize += $thisHeight;
      } else {
        elt.css('left', posLeft + 'px'); // get each li width in case of individual widths. (default)
        var $thisWidth = elt.outerWidth(true);
        posLeft += $thisWidth;

        ulSize += $thisWidth; // calculate the size of the ul element
      }
       var newPosTop = posTop - $thisHeight;
       var newPosLeft = posLeft - $thisWidth;
      addToObject(thisElts, elt, n, $thisHeight, $thisWidth, this.options, this.container, this.adjCon, newPosTop, newPosLeft);

      n = n + 1;
      elt[0].style[transformPrefix] = 'translate3d(0px, 0px, 0px)';
    }
    this.addHandlers();

    this.options.isVertical ? this.ul.css({
      height: ulSize
    }) : this.ul.css({
      width: ulSize,
      height: thisElts[0].outerHeight() + 'px',
    //  marginLeft: (this.ul.parent().width() - ulSize) / 2
    }); // Update the ul size
    this.div.trigger('layoutComplete', [this.ul.css('height')])
    console.log(instanceArr[1].dfd.state())
    this.dfd.resolve();
    var $this = this;

    if(whendfd == undefined) { //flag to prevent the when function from running on each instance init. whendfd is a global var
      // a new array is created containing the derred functions from all the instances in the instanceArr
      var instanceArrDfd = $.map(instanceArr, function (val, ind) {
          return val.dfd
      });
      // the deferred instances is passed in as an array
      whendfd = $.when.apply($, instanceArrDfd).done(function () {
        console.log('all resolved')
        // all the instances have been initialized
        // trigger the callback on all divs on all instances in the current instanceArr
        $.each(instanceArr, function( index, value ) {
              value.div.trigger('layoutCompleteAll')
            });

      });
    }

  };



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
        elt.css('top', posTop + 'px'); // get each li height in case of individual heights.
        var $thisHeight = elt.outerHeight(true);
        posTop += $thisHeight;

        ulSize += $thisHeight;
      } else {
        elt.css('left', posLeft + 'px'); // get each li width in case of individual widths. (default)
        var $thisWidth = elt.outerWidth(true);
        posLeft += $thisWidth;

        ulSize += $thisWidth; // calculate the size of the ul element
      }
      var newPosTop = posTop - $thisHeight;
      var newPosLeft = posLeft - $thisWidth;
      addToObject(thisElts, elt, n, $thisHeight, $thisWidth, this.options, this.container, this.adjCon, newPosTop, newPosLeft);

      n = n + 1;
    elt[0].style[transformPrefix] = 'translate3d(0px, 0px, 0px)';
    }


    this.options.isVertical ? this.ul.css({
      height: ulSize
    }) : this.ul.css({
      width: ulSize,
      height: thisElts[0].outerHeight() + 'px',

    }); // Update the ul size

    this.divOffset = this.div.offset();

  };

  JumbleScramble.prototype.addHandlers = function() {

    var targetOffsetY, targetOffsetX, newDx, newDy;
    var div = this.div;
    var ul = this.ul;
    var adjCon = this.adjCon;
    var o = this.options;
    var thisElts;
    var $this = this;
    var move, elt;
    var movePos = {};
    var eStart = 'pointerdown',
      eMove = 'pointermove',
      eEnd = 'pointerup'
    var dontTouch = false;
    var classDefine = o.isVertical == true ? 'listItem' : 'listItem-horizontal',
      liSelector = o.isVertical == true ? '.listItem' : '.listItem-horizontal';
    var startX, startY;
    var hasMoved;
    var docElem = document.documentElement;

    ul[0].style.zIndex = '1'

    function findIndex() {
      var index;
      for (var i = 0; i < thisElts.length; i++) {
        if (thisElts[i][0].className == classDefine + ' dragging') {
          index = i
        }
      };
      return index;
    }
    ul.on(eStart, liSelector, function(e) {
      if (dontTouch == true) {
        return;
      } // flag to prevent multi
		//	e.stopPropagation();

      e.preventDefault();
      thisElts = $this.elts;

      dontTouch = true;
      move = this;

      move.style[transitionPrefix] = '0s';
      move.style.zIndex = 5;
      //move.addClass('dragging');
      move.className = classDefine + ' dragging';

      if (instanceArr[adjCon]) {
        instanceArr[adjCon].ul[0].style.zIndex = '-1'
      } //will also prevent the adjacent ul from
      // responding to touch events
      //if (e.type == 'touchstart') { e = e.originalEvent.touches[0] }
      startX = e.pageX, startY = e.pageY;
      targetOffsetY = e.target.offsetTop;
      targetOffsetX = e.target.offsetLeft;


      docElem.addEventListener(eEnd, pointerupFunction); // refactor to add the once: true object to similar to jquery once. Wait for browser compatibility
      docElem.addEventListener(eMove, pointermoveFunction);


    });

    function pointermoveFunction(e) {

      if (!dontTouch) {
        return;
      }
      //if ($(move).offset().top <  div.offset().top ) {return;}   //containment
      e.preventDefault();
      hasMoved = true; // hasMoved is a flag to clicking items without moving them
      elt = thisElts[findIndex()]
      //if (e.type == 'touchmove') { e = e.originalEvent.changedTouches[0]}
      newDx = e.pageX - startX;
      newDy = e.pageY - startY;

      if (transSupport) {
        move.style[transformPrefix] = 'translate3d(' + newDx + 'px, ' + newDy + 'px, 0px) translateZ(0)';
      } else {
        move.style.top = targetOffsetY + movePos.dy + 'px';
        move.style.left = targetOffsetX + movePos.dx + 'px';
      }

      // we need to save last made offset
      movePos = {
        dx: newDx,
        dy: newDy
      };
      //	console.log(e.pageX)

      elt.currentPos.top = targetOffsetY + newDy;
      elt.currentPos.left = targetOffsetX + newDx;
      //	console.log('moving')

      onDrag(elt, thisElts, o);

    };

    function pointerupFunction(e) {
      if (hasMoved) {
        e.preventDefault();
        hasMoved = false;
        clearClass();
        if (transSupport) {
          move.style[transformPrefix] = 'translateZ(0) translate3d(' + 0 + 'px, ' + 0 + 'px, 0px)';
        }
        move.style.top = targetOffsetY + movePos.dy + 'px';
        move.style.left = targetOffsetX + movePos.dx + 'px';
        if (!elt) {
          return;
        }
        onStop(e, elt, div, o);
      } else { // if it hasn't moved
        clearClass();
      }

      function clearClass() {
        move.style[transitionPrefix] = 'box-shadow 250ms';
        move.style.zIndex = 1;
        if (instanceArr[adjCon]) {
          instanceArr[adjCon].ul[0].style.zIndex = '1'
        };
        ul[0].style.zIndex = '1';

        move.className = classDefine;
        dontTouch = false;
      };
      docElem.removeEventListener(eMove, pointermoveFunction);
      docElem.removeEventListener(eEnd, pointerupFunction);

    }

  };





  // $.fn.jumbleScramble = function(options, arg1, arg2, arg3) { // jumbleScramble fn
  //
  //   if (typeof options === 'string') { // if a metod is called
  //
  //     var self = this
  //     var thisId = (options == 'remove' ? this.parent().parent() : this);
  //
  //     $.each(instanceArr, function(i, e) {
  //
  //       if (this.div[0] == thisId[0]) {
  //
  //         instanceArr[i][options + 'LiElem'](arg1 || self, arg2, arg3) // self is for the remove method, arg2 is then undefined.
  //       }
  //     });
  //     //	console.log(this.length)
  //
  //
  //     return this;
  //   }
  //   else {
  //
  //
  //     this.instanceArr = instanceArr
  //
  //     instanceArr.push(new JumbleScramble(this, options, arg1, arg2))
  //    return this
  //
  //   }
  //
  // };

var module_jumble_scramble = (function($) { // Compliant with jquery.noConflict()

  return JumbleScramble

})(jQuery);
