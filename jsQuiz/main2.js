import {module_main} from "../js/module_main.js"
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

  var hello = new module_main(elem, {
    isVertical: false,
    cutOff: winHeight
  })

  var hello2 = new module_main(elem2, {
    isVertical: false,
    cutOff: winHeight
  })

  hello.div.on('layoutCompleteAll', function () {
      // console.log('complete hello')
      //      hello.addLiElem('added', 0, true)
           var toDelete = elem.find('li').first()
           hello.removeLiElem(toDelete, true, function (){
             console.log('done')
           })
           var toDelete2 = elem2.find('li').first()
           hello2.removeLiElem(toDelete2, true, function (){
             console.log('done')
             hello2.addLiElem('added', 0, true)
           })



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
