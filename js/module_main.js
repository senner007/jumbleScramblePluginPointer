  import {
    defaults,
    setChars
  } from "./modules.js"

  import {
    onDrag,
    posObj
  } from "./module_dragging.js"

  import {
    addHandlers
  } from "./module_handlers.js"

  import {
    animateBack,
    transSupport,
    ifGpu,
    transitionPrefix,
    transformPrefix,
    transToZero
  } from "./module_animation.js"

  export {
    animateBack,
    instanceArr
  };

  var instanceArr = [];

  JumbleScramble.prototype.addHandlers = addHandlers;


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
    if (typeof arguments[2] == 'function') { // flag to see if the third argument is a function, which is when it is called as a method from outside
      var callBack = arguments[2];           // if nott the third arghuments passed is set to asPartofDragging
    }
    else {
      var asPartofDragging = arguments[2];
    }

    var n = elt.index();

    var thisElts = this.elts;
    var eltHeight = asPartofDragging ? elt.completeHeight : thisElts[n].completeHeight;
    var eltWidth = asPartofDragging ? elt.completeWidth : thisElts[n].completeWidth;


    if (asPartofDragging != true) {           // not sure what this does - refactor
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
    }
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
        console.log(this.ul.css('height'))
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
        transToZero(thisElts[i]);
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


var module_jumble_scramble = (function($) { // Compliant with jquery.noConflict()

  return JumbleScramble

})(jQuery);

export {
  module_jumble_scramble
};
