export {pageSetup};

function pageSetup() {


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

}
