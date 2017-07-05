export {cont1, cont2};
import JumbleScramble from "../js/module_main.js";


  var elem = $("#jMyPuzzleId0").show();
  var elem2 = $("#jMyPuzzleId1").show();

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
