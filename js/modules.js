export {
  defaults,
  setChars,
};

var defaults = {
  isVertical: false,
  setChars: false,
  cutOff: false,
  dropLimit: false,
  hasAdjacent: true,
  layoutComplete: function() { }
}

function setChars(elt) {
  var left = 0;
  $.each(instanceArr[elt.belongsTo].elts, function(i, e) {
    var v = this.text();
    if (this.hasClass('lower')) {
      // v = v.replace( v.charAt(0), v.charAt(0).toLowerCase());
      this.text(v.replace(v.charAt(0), v.charAt(0).toLowerCase()));
    };
    if (i == 0) {
      //v = v.replace( v.charAt(0), v.charAt(0).toUpperCase() );
      this.text(v.replace(v.charAt(0), v.charAt(0).toUpperCase()));
    };
    this.animate({
      left: left + 'px',
      top: 0
    }, 100);
    left += this.outerWidth(true);
  });
};
