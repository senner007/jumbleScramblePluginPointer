export {horizontal};
import JumbleScramble from "../../plugin_js/module_main.js"
// ES6 MODULE IMPORT/EXPORT
////////////////////////////


var horizontal = function () {
  $('.splitList').parent().remove();
  $('.bodyButton').remove()
  $('.container').show()

  var elem = $("#jMyPuzzleId2").show();
  var elem2 = $("#jMyPuzzleId3").show();

  var winWidth = window.innerWidth - 50; // recalculate windows height for cutoff on resize. Also run cutoff on resize

  var hello = new JumbleScramble(elem, {isVertical: false, cutOff: winWidth})
  var hello2 = new JumbleScramble(elem2, {  isVertical: false, cutOff: false, dropLimit: winWidth -100 })

  $(hello2.div).on('layoutCompleteAll', function () {  })

  hello.init();
  hello2.init();

  $(window).on('resize', function() {
    var winWidth = window.innerWidth - 50;
    hello.setCutOff(winWidth);
    hello2.setCutOff(winWidth);
    hello.reLayout()
    hello2.reLayout()
    hello.cutOffEnd()
    hello2.cutOffEnd()
  });
}
