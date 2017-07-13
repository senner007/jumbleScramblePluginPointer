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

 JumbleScramble.prototype.transToZero = transToZero;



  JumbleScramble.prototype.onStop = function(elt, o) { // Stop

    var instanceArr = this.getInstances();

    // This will speed up the animation and subsequently the add and remove logic after dropping an item.
    // if the difference in time between the initialized drag and the release is less than specified,
    // it will increase the transition speed of the dropped item going to its new position

    instanceArr.end   = new Date();
    instanceArr.diff = (instanceArr.end.getTime() - instanceArr.start.getTime()) / 1000;
   // console.log(instanceArr.diff)
    instanceArr.interrupt = true;
    //// this will prevent the layout from breaking if the user drags an item across slowly
    // and then immediately drags more items to the same container. instanceArr.diff measures
    // the time it takes to initialize the drag to when it is dropped. A smaller difference
    // will increase the speed of the layout animation.


    if (instanceArr.diff < 0.5) {

      var speed = '170ms ease'
    }
    if (instanceArr.diff < 0.35) {

      var speed = '100ms ease'
    }


    if (instanceArr.diff < 0.2) {

      var speed = '15ms ease'
    }




    if (o.setChars) {  setChars(elt);  } // setChars function	- re-align lis after uppercase/lowercase for difficulty setting  2


    $(elt).one('transitionend', function() {

      if (!instanceArr.crossTrigger) {       // insert the dragged element into its new position efter drop in originating container
        //  var eltPrev = instanceArr[elt.belongsTo].elts[elt.n - 1];
          if (elt.n == 0) {
          //  $(elt).insertBefore(instanceArr[elt.belongsTo].elts[1]);
            instanceArr[elt.belongsTo].ul.insertBefore(elt, instanceArr[elt.belongsTo].elts[1]); // insert elt before the first one - replaces $.insertBefore
          }
          else {
            //$(elt).insertAfter(eltPrev);
            instanceArr[elt.belongsTo].ul.insertBefore(elt, instanceArr[elt.belongsTo].elts[elt.n + 1]);
            // insert elt before the next one - replaces $.insertAfter -http://xahlee.info/js/js_insert_after.html


          }

        instanceArr.interrupt = false;
      }

      for (var i = 0; i< instanceArr[elt.belongsTo].elts.length; i++) {
          instanceArr[elt.belongsTo].elts[i].canBeDragged = true

      }
    //  elt.canBeDragged = true;
      // This will prevent the layout from breaking if the user quickly drags an item across, drops it
      // and the immediately tries to drag it back again. It will disable the handler for the item until it has animatied to its position.
      // update: iterating over the entire colllection in the container because multi touch input might srew it up
      appendRemove()
    })


    animateBack(elt, o, instanceArr);
    instanceArr[0].transToZero(elt, speed);
    // only wait for transitionend if supported (not ie9)
    //{once: true}  once not supported before edge 16

    function appendRemove() {
       console.time("concatenation");
      if (!!o.autoValidate) {  o.autoValidate(); } // calls the autovalidate function in the plugin calling script
      if (instanceArr.crossTrigger) {
        instanceArr[elt.belongsTo].removeLiElem(elt, false, true)

        instanceArr[elt.movesTo].addLiElem(elt.textContent, elt.insertPos, false, elt.completeHeight, elt.completeWidth);

        instanceArr.crossTrigger= false;
       instanceArr[elt.movesTo].cutOffEnd()
      }
    };
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

  function jsOffset (el) {
    var temp = el.getBoundingClientRect();
    return {
      top: temp.top + document.body.scrollTop,
      left: temp.left + document.body.scrollLeft
    }
  }



  function JumbleScramble(element, options) { // Constructor function
    if (!window.instanceArr) {
      window.instanceArr = [];
      window.instanceArr.crossTrigger = false;
      window.instanceArr.transSupport = transSupport;
      window.instanceArr.transitionPrefix = transitionPrefix;
      window.instanceArr.transformPrefix = transformPrefix;
      window.instanceArr.ifGpu = ifGpu;
      window.instanceArr.interrupt = false;

    }

    this.div = element[0];
    this.divOffset = jsOffset(this.div);


    this.ul = this.div.querySelector('ul');

    this.container = window.instanceArr.length;
    this.adjCon = this.container % 2 == 0 ? this.container + 1 : this.container - 1;

    this.options = $.extend({}, defaults, options);

    this.cutOff = this.options.cutOff
    this.dropLimit = this.options.dropLimit[0];
    this.ul.style[transformPrefix] = 'translate3d(0px,0px,0px)';
    this.dfd = $.Deferred()


    window.instanceArr.push(this);

  };

  JumbleScramble.prototype.getInstances = function () {
    //var b = window.instanceArr.slice(0, window.instanceArr.length);
    return window.instanceArr;

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
        elt.style.left =  posLeft + 'px'; // get each li width in case of individual widths. (default)
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

    if (this.options.isVertical) {  this.ul.style.height = ulSize + 'px'; }
    else { this.ul.style.width = ulSize + 'px'; this.ul.style.height = outerHeight(thisElts[0]) + 'px'; }


    //  marginLeft: (this.ul.parent().width() - ulSize) / 2
   // Update the ul size
    $(this.div).trigger('layoutComplete', [parseInt(this.ul.style.height)]) // example of sending the ul height as second parameter to the callback
    this.dfd.resolve();
    var $this = this;
  //  var whendfd;
    if(this.constructor.whendfd == undefined) {
      //flag to prevent the when function from running on each instance init. whendfd is set on the inits constructor on the first init
      // a new array is created containing the derred functions from all the instances in the instanceArr
      var instanceArrDfd = $.map($this.instanceArr, function (val, ind) {
          return val.dfd
      });
      // the deferred instances is passed in as an array
      this.constructor.whendfd = $.when.apply($, $this.instanceArrDfd).done(function () {
        console.log('all resolved')
        // all the instances have been initialized
        // trigger the callback on all divs on all instances in the current instanceArr
        $.each($this.instanceArr, function( index, value ) {
              value.div.trigger('layoutCompleteAll')
            });

      });
    }


  };

  function outerHeight(el) {    // replacing jquery outerWidth(true)
    var height = el.offsetHeight;
    var style = getComputedStyle(el);

    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
  }

  function outerWidth(el) {    // replacing jquery outerWidth(true)
    var width = el.offsetWidth;
    var style = getComputedStyle(el);

    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
    return width;
  }




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

    if (this.options.isVertical) { this.ul.style.height = ulSize + 'px'; }
    else {  this.ul.style.width = ulSize + 'px'; this.ul.style.height = outerHeight(thisElts[0]) + 'px'  }


    this.divOffset = jsOffset(this.div)

  };



  JumbleScramble.prototype.cutOffEnd = function() { // function to remove the items above cutoff limit and then prepend the adjacent container
    var instanceArr = this.getInstances();
    var eltsSize = 0;
    var eltDim = this.options.isVertical ? 'completeHeight' : 'completeWidth';
    for (var i = 0; i < this.elts.length; i++) {
      eltsSize += this.elts[i][eltDim];
    }

    var tArr = [];
    while (eltsSize > this.cutOff) {
      tArr.push(instanceArr[this.adjCon].addLiElem(this.elts[this.elts.length - 1].textContent, 0, transSupport));
      this.removeLiElem(this.elts[this.elts.length - 1], transSupport)
      eltsSize -= this.elts[this.elts.length - 1][eltDim];
    }

    this.animAdded(tArr, this.adjCon);

  };

  JumbleScramble.prototype.animAdded = function(elems, parentCont) {  // should be in animation module, and not on the prototype

    var tArr = elems;

    var instanceArr =this.getInstances();

    var parentCont = parentCont;

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
  }

  JumbleScramble.prototype.addLiElem = function(liText, liPosition, addTrans, completeHeight, completeWidth) { // Add new li to previous collection

    var thisElts = this.elts;
    var n = Math.min(Math.max(parseInt(liPosition), 0), thisElts.length);
    var o = this.options;

    var eltObj = {
      'left': n > 0 ? thisElts[n - 1].pos.left + thisElts[n - 1].completeWidth + 'px' : 0,
      'top': n > 0 ? thisElts[n - 1].pos.top + thisElts[n - 1].completeHeight + 'px' : 0
    }
    var item = ('<li style="left:'  + eltObj.left + ';top:' + eltObj.top + '" class=' + (o.isVertical ? 'listItem' : 'listItem-horizontal') + '>' + liText + '</li>');
     var elt = document.createElement('li');
     elt.innerHTML = item;
     elt = elt.firstChild;

    var instanceArr = this.getInstances();

    /* 		if (addTrans) { elt[0].style[transformPrefix] = 'scale(0,0)'; elt[0].style.opacity = '1'; } */

    var tempArr = [];
    for (var i = n; i < thisElts.length; i++) {

      tempArr.push(thisElts[i]);
    }

    //  elt = elt[0];
    if (thisElts.length == 0) {
    //  elt.appendTo(this.ul)
      this.ul.appendChild(elt)

    } // if there are no elements present at drop

    else {  (n > 0) ? this.ul.insertBefore(elt, thisElts[elt.n + 1]) :   this.ul.insertBefore(elt, thisElts[n]);  }

    if (!completeHeight && !completeWidth) {

      var thisWidth = o.isVertical ? 0 : outerWidth(elt);
      var thisHeight = o.isVertical ? outerHeight(elt) : 0;
    }
    else {

      var thisWidth = completeWidth;
      var thisHeight = completeHeight;
    }

    for (var i = n; i < thisElts.length; i++) {
      var ets = thisElts[i];

      thisElts[i].moved = false;
      ets.style[instanceArr.transitionPrefix] = '0ms';
      ets.style[instanceArr.transformPrefix] = instanceArr.transSupport ? 'translate3d(0px,0px,0px)' : 'translate(0px,0px)';
      ets.style.left = parseInt(ets.style.left) + thisWidth + 'px'
      ets.style.top = parseInt(ets.style.top) + thisHeight + 'px'

      if (addTrans) {
        ets.style[instanceArr.transformPrefix] = 'translate(' + -(thisWidth) + 'px,' + -(thisHeight) + 'px)';
        instanceArr[0].transToZero(thisElts[i]);
      }
    }

    o.isVertical ? this.ul.style.height = parseInt(this.ul.style.height) + thisHeight + 'px':  this.ul.style.width = parseInt(this.ul.style.width) + thisWidth + 'px';

    var newTopPos = parseInt(eltObj.top),
        newLeftPos = parseInt(eltObj.left)


    addToObject(thisElts, elt, n, thisHeight, thisWidth, o, this.container, this.adjCon,newTopPos, newLeftPos);

    for (var i = 0; i < tempArr.length; i++) {

      var marginLeft = o.isVertical ? 0 : (tempArr[i].completeWidth - tempArr[i].offsetWidth); // account for margin
      tempArr[i].pos.left = tempArr[i].offsetLeft - marginLeft;
      tempArr[i].pos.top = tempArr[i].offsetTop;
      tempArr[i].n = n + i + 1;
      thisElts[n + 1 + i] = tempArr[i];
    }
    if (addTrans) {

      var tArr = [elt];

      this.animAdded(tArr, this.container)
      /* elt[0].style[transitionPrefix] = '500ms'; elt[0].style[transformPrefix] = 'scale(1,1)'; elt[0].style.opacity = '1';  */
      return elt;
    }; // animation only needed when triggering add

    // Do your operations
      console.timeEnd("concatenation");
      instanceArr.interrupt = false;

  }

  JumbleScramble.prototype.removeLiElem = function() { // Remove new li to previous collection

    var elt = arguments[0];
    var removeTrans = arguments[1];
    var callBack = arguments[2];
    if (typeof arguments[2] == 'function') { // flag to see if the third argument is a function, which is when it is called as a method from outside
      var callBack = arguments[2];           // if nott the third arghuments passed is set to dropDelete
    }
    else {
      var dropDelete = arguments[2];
    }

    var n = elt.n;

    var thisElts = this.elts;
    var eltHeight = dropDelete ? elt.completeHeight : thisElts[n].completeHeight;
    var eltWidth = dropDelete ? elt.completeWidth : thisElts[n].completeWidth;



    if (dropDelete != true) {           // this code is run when the removeLiElem mothod is called after init. not sure what everything does - maybe refactor

      for (var i = n + 1; i < thisElts.length; i++) {
        var el = thisElts[i];

        el.style[transitionPrefix] = removeTrans ? '250ms' : '0s';
        thisElts[i - 1] = el;
        el.n = i - 1;
        el.style.top = el.pos.top - eltHeight + 'px';
        el.style.left = el.pos.left - eltWidth + 'px';
        el.style[transformPrefix] = 'translate(0px,0px,0px)';
        el.pos.top = el.pos.top - eltHeight;
        el.pos.left = el.pos.left - eltWidth;
      };
    }
   thisElts.length = thisElts.length - 1;     // reduce the length of elt objects in the instanceArr after a delete



    if (removeTrans) {  // if the option to animate in the removeLiElem method used after init is true
      elt.style[transformPrefix] = 'scale(0.5,0.5)';
      elt.style.opacity = '0';
      elt.style[transitionPrefix] = '250ms';
      setTimeout(function() {
        elt.remove()
        if (callBack) {
          callBack(); //the callback is fired after the animation has finished

        }
      }, 250);
    } else {
      elt.remove();
    }
      // recalculate the height or width of the ul after deleting items

      this.options.isVertical ? this.ul.style.height = parseInt(this.ul.style.height) - eltHeight + 'px' : this.ul.style.width = parseInt(this.ul.style.width) - eltWidth + 'px';

  };
