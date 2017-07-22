import {vertical} from "./examples/vertical.js"
import {horizontal} from "./examples/horizontal.js"
import {pageSetup} from "./pageSetup.js"
import JumbleScramble from "../plugin_js/module_main.js";
// ES6 MODULE IMPORT/EXPORT
////////////////////////////

$('.container').hide(); // cannot be set from css ???

var exampleObject = {
  vertical : vertical,
  horizontal : horizontal

}

history.replaceState(null, document.title, document.location.href);

var path = window.location.pathname.split('/');
if (path[1].length == 0) {
    $('.bodyButton').show().on('click', function(e) {
      console.log('hello')
      exampleObject[e.target.textContent]();
    });
}
else if (path[1] == 'vertical' ){
    exampleObject.vertical();
}
else if (path[1] == 'horizontal' ) {
  exampleObject.horizontal();
}


pageSetup();
