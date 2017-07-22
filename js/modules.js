export {
  _shuffle,
  defaults,
  _setChars,
  transSupport,
  transitionPrefix,
  transformPrefix,
  ifGpu
};
// ES6 MODULE IMPORT/EXPORT
////////////////////////////

var defaults = {
  isVertical: false,
  setChars: false,
  cutOff: false,
  dropLimit: false,
  hasAdjacent: true,
  ulSize: 0
  // layoutComplete: function() { }
}

function _shuffle() {

      function shuffle(a) {
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
      }

      function _getElems (inst, adj) {
        var elems = []

          for (let ii = 0; ii<arguments.length; ii++) {
           let i = 0, p;
              while (arguments[ii].elts[i] != undefined ) {
                arguments[ii].elts[i].style[arguments[ii].transitionPrefix] = '0ms'; // make sure elts dont animate into new position
                elems.push(arguments[ii].elts[i].innerHTML)
                i++
              }
          }


        shuffle(elems)

        return function () {                  // Refactor me
            var count = 0
            for (let i = 0; i<inst.elts.length; i++) {
                inst.elts[i].innerHTML = elems[count]
                count++;
            }

            for (let i = 0; i<adj.elts.length; i++) {
                adj.elts[i].innerHTML = elems[count]
                count++
            }
            return elems;
        };
      };


        var _setElems = _getElems(this, this.adjInst);
        _setElems()
        this.reLayout()
      this.adjInst.reLayout()
}

function _setChars(elt) {
  var left = 0;
  $.each(this.elts, function(i, e) {
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

var transSupport = (function() {
  var b = document.body || document.documentElement,
    s = b.style,
    p = 'transition';
  if (typeof s[p] == 'string') {
    return true;
  }
  // Tests for vendor specific prop
  var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
  p = p.charAt(0).toUpperCase() + p.substr(1);
  for (var i = 0; i < v.length; i++) {
    if (typeof s[v[i] + p] == 'string') {
      return true;
    }
  }
  return false;
})();

var ifGpu = transSupport ? 'translate3d(0px,0px,0px) translateZ(0)' : 'translate(0px,0px)';
var testElement = document.createElement('div');
var transitionPrefix = "webkitTransition" in testElement.style ? "webkitTransition" : "transition";
var transformPrefix = "webkitTransform" in testElement.style ? "webkitTransform" : "-ms-transform" in testElement.style && transSupport == false ? "-ms-transform" : "transform"; //if ie9
