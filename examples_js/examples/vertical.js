export {vertical};
import JumbleScramble from "../../plugin_js/module_main.js"
// ES6 MODULE IMPORT/EXPORT
////////////////////////////


var vertical = function () {
    $('.splitList-horizontal').parent().remove();
    $('.bodyButton').remove()
    $('.container').show()

  // var elem = $("#jMyPuzzleId0").show();
    var elem1 = document.getElementById('jMyPuzzleId0');
   elem1.style.display = 'block'
    var elem2 = document.getElementById('jMyPuzzleId1');
    elem2.style.display = 'block'
    var elem3 = document.getElementById('jMyPuzzleId2');
    elem3.style.display = 'block'
    var elem4 = document.getElementById('jMyPuzzleId3');
    elem4.style.display = 'block'
    var elem5 = document.getElementById('jMyPuzzleId4');
    elem5.style.display = 'block'
  //  console.log(elem.id)

    var winHeight = window.innerHeight - 50; // recalculate windows height for cutoff on resize.
var containers = [];
    var cont1 = new JumbleScramble(elem1, {
      isVertical: true,
      cutOff: winHeight,
      adjIds: [
        elem2.id,
        elem3.id,
        elem4.id,
        elem5.id

      ]
    })


          var cont2 = new JumbleScramble(elem2, {
            isVertical: true,
            dropLimit: 500,
            cutOff: winHeight,
            adjIds : [
              elem1.id,
              elem3.id,
              elem4.id,
              elem5.id
            ]
            })


    var cont3 = new JumbleScramble(elem3, {
      isVertical: true,
      cutOff: winHeight,
      adjIds : [
        elem1.id,
        elem2.id,
        elem4.id,
        elem5.id
      ]
      })

        var cont4 = new JumbleScramble(elem4, {
          isVertical: true,
          cutOff: winHeight,
          adjIds : [
            elem1.id,
            elem2.id,
            elem3.id,
            elem5.id
          ]
          })


        var cont5 = new JumbleScramble(elem5, {
          isVertical: true,
          cutOff: winHeight,
          adjIds : [
            elem1.id,
            elem2.id,
            elem3.id,
            elem4.id
          ]
          })



    /*---------------------------------------------------------------------------------------------------------------------------------------*/
     // SETUP CALLBACKS
     /////////////////////////////////////////

    cont1.div.addEventListener('onLayout', function () {
         //example of using the removeLiElem method on the object's prototype. Callback is fired when animation is done
        // var toDelete = elem.find('li').eq(2)[0]
        // cont1.removeLiElem(toDelete, true, function (){ })
    //    cont1.addLiElem("This element is added after the 'layoutCompleteAll' event", 1, {elt:true,elts:true},)

    })
    cont1.div.addEventListener('onReorder', function () {


    })
    cont2.div.addEventListener('onReorder', function () {


    })




  //  example of firing the layoutCompleteAll callback, which can be set up on all instance.divs. It is fired whan all instances have been init
    // cont2.div.addEventListener('onLayoutAll', function () {
    //   //
    //  cont2.addLiElem("<span class='special'></span>This element is added after the 'layoutCompleteAll' event.<span></br>This text <div class='blue'> This text is in a nested span element.</div>  is in a span element.</span>",0, {elt:true,elts:true},)
    //
    // })
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

    cont1.div.addEventListener('onDropTo', function (ev) {

      //$(this).find('li').first().css('height', '50px');
         liInc(containers)
      $(this).find('li').addClass('trimText')

      cont1.reLayout()
    })

var containers = [cont1,cont2,cont3,cont4,cont5]

for (let i = 0; i<containers.length; i++) {

    containers[i].div.addEventListener('onDropTo', function (ev) {
       liInc(containers)
      for (let i = 0; i<containers.length; i++) {
              containers[i].reLayout()
        }
    })

}

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






  /*---------------------------------------------------------------------------------------------------------------------------------------*/

  cont1.init();
  cont2.init();
  cont3.init();
  cont4.init();
  cont5.init();

    // $(window).on('resize', function() {
    //   var winHeight = window.innerHeight - 50;
    //
    //   cont1.cutOff = winHeight;
    //   cont2.cutOff = winHeight;
    //   cont3.cutOff = winHeight;
    //   cont4.cutOff = winHeight;
    //   cont5.cutOff = winHeight;
    //
    //   cont1.reLayout()
    //   cont2.reLayout()
    //   cont3.reLayout()
    //   cont4.reLayout()
    //   cont5.reLayout()
    //
    //   // example of using the cutOffEnd method on the object's prototype.
    //   //Here, upon resize, it cuts the list when height is above specified value and prepends to adjacent container
    //   cont1.cutOffEnd()
    //   cont2.cutOffEnd()
    //   cont3.cutOffEnd()
    //   cont4.cutOffEnd()
    //   cont5.cutOffEnd()
    //
    // });

}
