export {vertical};
import JumbleScramble from "../../plugin_js/module_main.js"
// ES6 MODULE IMPORT/EXPORT
////////////////////////////


var vertical = function () {
    $('.splitList-horizontal').parent().remove();
    $('.bodyButton').remove()
    $('.container').show()

    var elem = $("#jMyPuzzleId0").show();
    var elem2 = $("#jMyPuzzleId1").show();

    var winHeight = window.innerHeight - 50; // recalculate windows height for cutoff on resize.

    var cont1 = new JumbleScramble(elem, {isVertical: true,cutOff: winHeight })
    var cont2 = new JumbleScramble(elem2, {isVertical: true,cutOff: winHeight})


    /*---------------------------------------------------------------------------------------------------------------------------------------*/
     // SETUP CALLBACKS
     /////////////////////////////////////////

    $(cont1.div).on('layoutCompleteAll', function (hello, a) {
         //example of using the removeLiElem method on the object's prototype. Callback is fired when animation is done
        // var toDelete = elem.find('li').eq(2)[0]
        // cont1.removeLiElem(toDelete, true, function (){ })
        cont1.addLiElem("This element is added after the 'layoutCompleteAll' event", 1, {elt:true,elts:true},)
        console.log(cont1.elts[1].pos)
    })
  //  example of firing the layoutCompleteAll callback, which can be set up on all instance.divs. It is fired whan all instances have been init
    $(cont2.div).on('layoutCompleteAll', function () {

   cont2.addLiElem("This element is added after the 'layoutCompleteAll' event.<span></br>This text <div class='blue'> This text is in a nested span element.</div>  is in a span element.</span>",0, {elt:true,elts:true},)

    })
    $(cont1.div).on('onReorder', function (ev, elt, elts) {

        // console.log('elt moved: ' + elt.n)
        // console.log('elt top pos : ' + elt.pos.top)
        // console.log('length of elts: ' + elts.length)

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
      var winHeight = window.innerHeight - 50;

      cont1.cutOff = winHeight;
      cont2.cutOff = winHeight;
      cont1.reLayout()
      cont2.reLayout()
      // example of using the cutOffEnd method on the object's prototype.
      //Here, upon resize, it cuts the list when height is above specified value and prepends to adjacent container
      cont1.cutOffEnd()
      cont2.cutOffEnd()
    });

}
