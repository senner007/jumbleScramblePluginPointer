export {horizontal};
import JumbleScramble from "../../plugin_js/module_main.js"
// ES6 MODULE IMPORT/EXPORT
////////////////////////////


var horizontal = function () {
  $('.splitList').parent().remove();
  $('.bodyButton').remove()
  $('.container').show()

  // var elem = $("#jMyPuzzleId3").show();
  // var elem2 = $("#jMyPuzzleId4").show();

  var elem = document.getElementById('jMyPuzzleId5');
 elem.style.display = 'block'
  var elem2 = document.getElementById('jMyPuzzleId6');
  elem2.style.display = 'block'

  var winWidth = window.innerWidth - 50; // recalculate windows height for cutoff on resize. Also run cutoff on resize

  var cont1 = new JumbleScramble(elem, {
    isVertical: false,
    cutOff: winWidth,
    adjIds: [
      elem2.id
    ]
  })

  var cont2 = new JumbleScramble(elem2, {
    isVertical: false,
    cutOff: false,
    dropLimit: winWidth -100,
    adjIds: [
      elem.id

    ]
   })

  /*---------------------------------------------------------------------------------------------------------------------------------------*/
   // SETUP CALLBACKS
   /////////////////////////////////////////
  $(cont2.div).on('layoutCompleteAll', function () {

      cont1.addLiElem("Added after the 'layoutCompleteAll' event", 0, {elt:true,elts:true},)
   })

   $('ul').on('pointerup.hello', function(ev) { // namespaced event added on top of events set in plugin. requires that stopPropagation is not used in plugin
   //  ev.preventDefault()

     if (ev.target.localName == 'button') {

       cont1.shuffle(cont1, cont1.adjInst)
     }
     //$(this).off('pointerdown.hello');
   })

   /*---------------------------------------------------------------------------------------------------------------------------------------*/

  cont1.init();
  cont2.init();

  $(window).on('resize', function() {
    var winWidth = window.innerWidth - 50;
    cont1.setCutOff(winWidth);
    cont2.setCutOff(winWidth);
    cont1.reLayout()
    cont2.reLayout()
    cont1.cutOffEnd()
    cont2.cutOffEnd()
  });



}
