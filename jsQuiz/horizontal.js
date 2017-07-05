export {hello, hello2};
import JumbleScramble from "../js/module_main.js"

  var elem = $("#jMyPuzzleId2").show();
  var elem2 = $("#jMyPuzzleId3").show();

  var winWidth = window.innerWidth - 50; // recalculate windows height for cutoff on resize. Also run cutoff on resize

  var hello = new JumbleScramble(elem, {
    isVertical: false,
    cutOff: winWidth
  })

  var hello2 = new JumbleScramble(elem2, {
    isVertical: false,
    cutOff: winWidth
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

  console.log(hello)
  console.log(hello2)
