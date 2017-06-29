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

  var winHeight = window.innerHeight - 50; // recalculate windows height for cutoff on resize. Also run cutoff on resize

  var hello = new module(elem, {
    isVertical: true,
    cutOff: [winHeight, winHeight]
  })

  var hello2 = new module(elem2, {
    isVertical: true,
    cutOff: [winHeight, winHeight]
  })


 //example of using the addLiElem method on the object's prototype
  hello2.addLiElem('added', 0, true)

  //example of using the removeLiElem method on the object's prototype
  var toDelete = elem.find('li').first()
  hello.removeLiElem(toDelete, true, function (){
    console.log('done')
  })


  console.log(hello)
  console.log(hello2)

  $(window).on('resize', function() {
    hello.reLayout()
    hello2.reLayout()
  });


});
