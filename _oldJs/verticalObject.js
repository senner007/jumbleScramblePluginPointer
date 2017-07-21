//export {cont1, cont2, vertical};
//import JumbleScramble from "../js/module_main.js";
// ES6 MODULE IMPORT/EXPORT
////////////////////////////

var vertical = {};

vertical.init = {
  nDivs: 2, // number of divs
  divId: function () { // get an array of div ids for the divs
    var idArr = []
    for (var i = 0; i<this.nDivs; i++) {
      idArr.push('id' + i)
    }
    return idArr;
  },
  divCss: {
    overflow: "visible",
    width: "50%",
    height: "90%",
    position: "absolute",
    display: "none"
  },
  ulClass: 'splitList',
  ulCss: {
    width: "100%",
    position: "absolute",
    display: "block",
    overflow: "visible"
  },
  liClass: 'listItem',
  liCss: {
    position: "absolute",
    ["list-style"]: "none",
    ["margin-bottom"]: "5px",
    padding: "5px",
    width: "95%",
    color: "rgba(34, 34, 34, 1)",
    ["border-radius"]: "1px",
    ["box-shadow"]: "0",
    background: "white",
    ["z-index"]: "1"
  }
}
vertical.text = {
    li0: 'Lorem ipsum dolor sit amet',
    li1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et mi sapien. Nullam rutrum velit vel quam convallis sagittis. Aliquam molestie urna sit amet lacus finibus, ac aliquet libero congue. Pellentesque in nisl quis ligula placerat ultrices. Nunc dapibus pellentesque orci, ut consectetur lorem hendrerit ornare. In tempus tellus et massa hendrerit, ut convallis lacus mattis. Mauris eget sollicitudin eros. Cras in eros sed nisi suscipit auctor. Sed efficitur sem quis posuere pulvinar. Nulla mauris urna, finibus ut magna et.',
    li2: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et mi sapien. Nullam rutrum velit vel quam convallis sagittis. Aliquam molestie urna sit amet lacus finibus, ac aliquet libero congue. Pellentesque in nisl quis ligula placerat ultrices. Nunc dapibus pellentesque orci, ut consectetur lorem hendrerit ornare.'
}
vertical.options = {
  isVertical: true,
  cutOff: function () {
    return (window.innerHeight - 50);
  }
}
vertical.events = {
  layoutCompleteAll:  function () {
    //  console.log('layoutCompleteAll')
  },
  div0: {
    layoutComplete: function (div0) {
        //console.log('container 1 layoutComplete')

         //example of using the removeLiElem method on the object's prototype. Callback is fired when animation is done
         var toDelete = elem.find('li').first()
         div0.removeLiElem(toDelete, true, function (){
          // console.log('container 1 remove element done')
         });
    }
  },
  div1: {
    layoutComplete: function (div1) {
      //  console.log('container 1 layoutComplete')

         //example of using the removeLiElem method on the object's prototype. Callback is fired when animation is done
         var toDelete = elem.find('li').first()
         div1.removeLiElem(toDelete, true, function (){
        //   console.log('container 1 remove element done')
         });
    }
  }
}


    // var divId = vertical.init.divId(),
    //     nLi = Object.keys(vertical.text).length;
    //
    //
    // for (var index = 0; index<vertical.init.nDivs; index++) {
    //
    //   $(".container").append("<div class='jMyPuzzle' id=" + divId[index]  + "><ul touch-action='none' class=" + vertical.init.ulClass + "></ul></div>"); // create the divs with uls
    //   $("#" + divId[i]).find('ul').css(vertical.init.ulCss);  // set the ul css
    //
    //       for (var i = 0; i<nLi; i++) {
    //
    //             var thisLi = Object.keys(vertical.text)[i]
    //             $("#" + divId[index]).find('ul').append("<li>" + vertical.text[thisLi] + "</li>") // create the lis
    //             $("#" + divId[index]).find('ul').find('li').eq(i).css(vertical.init.liCss) // attach the css for the lis
    //
    //
    //
    //       }
    //
    // }
