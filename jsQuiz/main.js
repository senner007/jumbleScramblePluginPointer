import {cont1, cont2} from "./vertical.js"
import {hello, hello2} from "./horizontal.js"
$('.container').hide(); // cannot be set from css ???

var exampleObject = {
  vertical: function () {
    $('.splitList-horizontal').parent().remove();
    $('button').remove()
    $('.container').show()

    console.log('container 1 and 2 before init')
    cont1.init();
    console.log('container 1 after init - container 2 before init')
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

  },
  horizontal: function () {
    $('.splitList').parent().remove();
    $('button').remove()
    $('.container').show()

    console.log('container 1 and 2 before init')
    hello.init();
    console.log('container 1 after init - container 2 before init')
    hello2.init();

    $(window).on('resize', function() {
      var winWidth = window.innerWidth - 50;
      hello.cutOff = winWidth;
      hello2.cutOff = winWidth;
      console.log('hello')
      hello.reLayout()
      hello2.reLayout()
      hello.cutOffEnd()
      hello2.cutOffEnd()
    });

  }

}

history.replaceState(null, document.title, document.location.href);

var path = window.location.pathname.split('/');
if (path[1].length == 0) {

    $('button').show().on('click', function(e) {
      exampleObject[e.target.textContent]();
    });

}
else if (path[1] == 'vertical' ){

    exampleObject.vertical();
}
else if (path[1] == 'horizontal' ) {

  exampleObject.horizontal();

}





$.fn.disableSelection = function() {
    return this
      .attr('unselectable', 'on')
      .css('user-select', 'none')
      .on('selectstart', false);
};

//$("body").css("overflow", "hidden");
$('body').disableSelection();
$('ul').on('touchmove', function(e) {
  e.preventDefault();
});
