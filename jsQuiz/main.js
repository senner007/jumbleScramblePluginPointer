$(document).ready(function() {

  (function($) {
    $.fn.disableSelection = function() {
      return this
        .attr('unselectable', 'on')
        .css('user-select', 'none')
        .on('selectstart', false);
    };
  })(jQuery);
  //$("body").css("overflow", "hidden");
  $('body').disableSelection();
  $('ul').on('touchmove', function(e) {
    e.preventDefault();
  });
  var hello;

  var elem = $("#jMyPuzzleId0");
  var elem2 = $("#jMyPuzzleId1");

  var winHeight = window.innerHeight - 50; // recalculate windows height for cutoff on resize.

  var hello = new module(elem, {
    isVertical: true,
    cutOff: winHeight
  })

  var hello2 = new module(elem2, {
    isVertical: true,
    cutOff: winHeight
  })

  hello.div.on('layoutComplete', function () {
      console.log('complete')

       //example of using the removeLiElem method on the object's prototype. Callback is fired when animation is done
       var toDelete = elem.find('li').first()
       hello.removeLiElem(toDelete, true, function (){
         console.log('done')
       })

  })

  hello2.div.on('layoutComplete', function () {
      console.log('complete')

      //example of using the addLiElem method on the object's prototype
       hello2.addLiElem('added', 0, true)


  })
  console.log('hello before init')
  hello.init();
  console.log('hello after init')
  hello2.init();





  console.log(hello)
  console.log(hello2)
console.log(hello.cutOff)
  $(window).on('resize', function() {
    winHeight = window.innerHeight - 50;
    hello.cutOff = winHeight;
    hello2.cutOff = winHeight;
    console.log(hello.cutOff)
    hello.reLayout()
    hello2.reLayout()

    // example of using the cutOffEnd method on the object's prototype.
    //Here, upon resize, it cuts the list when height is above specified value and prepends to adjacent container
    hello.cutOffEnd()
    hello2.cutOffEnd()
  });


});
