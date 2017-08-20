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
  var elem3 = document.getElementById('jMyPuzzleId7');
  elem3.style.display = 'block'

  var winWidth = window.innerWidth; // recalculate windows height for cutoff on resize. Also run cutoff on resize

  var cont1 = new JumbleScramble(elem, {
    isVertical: false,
    cutOff: winWidth,
    adjIds: [
      elem2.id,
      elem3.id
    ]
  })

  var cont2 = new JumbleScramble(elem2, {
    isVertical: false,
    cutOff: winWidth,
    adjIds: [
      elem.id,
      elem3.id

    ]
   })
   var cont3 = new JumbleScramble(elem3, {
     isVertical: false,
    cutOff: winWidth,
    dropLimit: winWidth- winWidth/4,
     adjIds: [
       elem.id,
       elem2.id

     ]
    })

  /*---------------------------------------------------------------------------------------------------------------------------------------*/
   // SETUP CALLBACKS
   /////////////////////////////////////////
  $(cont2.div).on('layoutCompleteAll', function () {

      cont1.addLiElem("Added after the 'layoutCompleteAll' event", 0, {elt:true,elts:true},)
   })

  //  $('ul').on('pointerup.hello', function(ev) { // namespaced event added on top of events set in plugin. requires that stopPropagation is not used in plugin
  //  //  ev.preventDefault()
   //
  //    if (ev.target.localName == 'button') {
   //
  //      cont1.shuffle(cont1, cont2)
  //    }
  //    //$(this).off('pointerdown.hello');
  //  })
  //  var containers = [cont1,cont2,cont3]
  //  //
  //  for (let i = 0; i<containers.length; i++) {
   //
   //
  //     //  containers[i].div.addEventListener('onDrop', function (ev) {
  //     //        for (let i = 0; i<containers.length; i++) {
  //     //          containers[i].reLayout()
  //     //          console.log('relayout: ' + containers[i].id)
  //      //
  //     //       }
  //     //  })
   //
  //      containers[i].div.addEventListener('afterDrop', function (ev) {
  //     //   console.clear()
  //            for (let i = 0; i<containers.length; i++) {
  //              containers[i].reLayout()
   //
  //              console.log('relayout: ' + containers[i].id)
   //
  //           }
  //      })
   //
  //  }

  var containers = [cont1,cont2,cont3]
  function liInc (containers) {
    var counter = 1;
    for (let el of containers) {

      for (let i = 0; i<el.elts.length; i++) {
        var myText = counter + 'th'
        if (counter == 1) { myText = counter + 'st'}
        if (counter == 2) { myText = counter + 'nd'}
        if (counter == 3) { myText = counter + 'rd'}

        el.elts[i].childNodes[0].textContent = myText
        counter++;
      }

    };

  }

  cont1.div.addEventListener('onDropFrom', function (ev) {
    console.log('onDropFrom - 1')
    liInc(containers)
    cont1.reLayout()
    cont2.reLayout()
    cont3.reLayout()
  })
  cont2.div.addEventListener('onDropFrom', function (ev) {
      console.log('onDropFrom - 2')
      liInc(containers)
      cont1.reLayout()
      cont2.reLayout()
      cont3.reLayout()
  })
  cont3.div.addEventListener('onDropFrom', function (ev) {
    console.log('onDropFrom - 3')
    liInc(containers)
    cont1.reLayout()
    cont2.reLayout()
    cont3.reLayout()

  })

    /*---------------------------------------------------------------------------------------------------------------------------------------*/

  // cont1.div.addEventListener('onDropTo', function (ev) {
  // console.log('onDropTo - 1')
  //         cont1.reLayout()
  //
  // })
  //
  // cont2.div.addEventListener('onDropTo', function (ev) {
  //       console.log('onDropTo - 2')
  //         cont2.reLayout()
  //
  // })
  // cont3.div.addEventListener('onDropTo', function (ev) {
  //     console.log('onDropTo - 3')
  //         cont3.reLayout()
  //
  //
  // })


  /*---------------------------------------------------------------------------------------------------------------------------------------*/

  // cont1.div.addEventListener('afterDrop', function (ev) {
  // console.log('afterDrop - 1')
  //         cont1.reLayout()
  // })
  //
  // cont2.div.addEventListener('afterDrop', function (ev) {
  //       console.log('afterDrop - 2')
  //         cont2.reLayout()
  //
  // })
  // cont3.div.addEventListener('afterDrop', function (ev) {
  //     console.log('afterDrop - 3')
  //         cont3.reLayout()
  //
  // })


   /*---------------------------------------------------------------------------------------------------------------------------------------*/

  cont1.init();
  cont2.init();
  cont3.init();



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
