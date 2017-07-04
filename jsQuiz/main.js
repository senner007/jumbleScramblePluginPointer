import JumbleScramble from "../js/module_main.js"
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


  var elem = $("#jMyPuzzleId0");
  var elem2 = $("#jMyPuzzleId1");

  var winHeight = window.innerHeight - 50; // recalculate windows height for cutoff on resize.

  var cont1 = new JumbleScramble(elem, {
    isVertical: true,
    cutOff: winHeight
  })

  var cont2 = new JumbleScramble(elem2, {
    isVertical: true,
    cutOff: winHeight
  })

  cont1.div.on('layoutComplete', function () {
      console.log('container 1 layoutComplete')

       //example of using the removeLiElem method on the object's prototype. Callback is fired when animation is done
       var toDelete = elem.find('li').first()
       cont1.removeLiElem(toDelete, true, function (){
         console.log('container 1 remove element done')
       })

  })


  cont2.div.on('layoutComplete', function () {
      console.log('container 2 layoutComplete')

      //example of using the addLiElem method on the object's prototype
       cont2.addLiElem('added', 0, true)


  })
  // example of firing the layoutCompleteAll callback, which can be set up on all instance.divs. It is fired whan all instances have been init
  cont2.div.on('layoutCompleteAll', function () {
      console.log('layoutCompleteAll')


  })

  console.log('container 1 before init')
  cont1.init();
  console.log('container 1 after init')
  cont2.init();


  $(window).on('resize', function() {
    winHeight = window.innerHeight - 50;
    cont1.cutOff = winHeight;
    cont2.cutOff = winHeight;
    console.log(cont1.cutOff)
    cont1.reLayout()
    cont2.reLayout()

    // example of using the cutOffEnd method on the object's prototype.
    //Here, upon resize, it cuts the list when height is above specified value and prepends to adjacent container
    cont1.cutOffEnd()
    cont2.cutOffEnd()
  });


});
