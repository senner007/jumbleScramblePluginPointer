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

  var elem = $("#jMyPuzzleId2");
  var elem2 = $("#jMyPuzzleId3");

  var winHeight = window.innerWidth - 50; // recalculate windows height for cutoff on resize. Also run cutoff on resize

  var hello = new module(elem, {
    isVertical: false,
    cutOff: winHeight
  })

  var hello2 = new module(elem2, {
    isVertical: false,
    cutOff: winHeight
  })
  hello.init();
  hello2.init();

  console.log(hello)
  console.log(hello2)

  $(window).on('resize', function() {
    hello.reLayout()
    hello2.reLayout()

  });

});
