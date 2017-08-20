export {
  _shuffle,
  _elemsToCut,
  setEvents,
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
  adjIds : []

  // layoutComplete: function() { }
}

var setEvents = {
        onLayoutAll: new Event('onLayoutAll'),
        onLayout : new Event('onLayout'),
        onReorder: new Event('onReorder'),
        onDropTo: new Event('onDropTo'),
        onDropFrom: new Event('onDropFrom')
      //  afterDrop: new Event('afterDrop')


  };

function _elemsToCut(thisInst, adjInst) {
  if (adjInst.props.cutOff == false) {
    return function() {};
  }

  var elemsToCut = [],
      ulSize = thisInst.getUlSize.call(adjInst),
      counter = -1;

  //  console.log(size)
  while (ulSize > adjInst.props.cutOff) {

    elemsToCut.push(adjInst.elts[adjInst.elts.length + counter])
    ulSize -= adjInst.elts[adjInst.elts.length + counter].props.size
    counter -= 1
  }

  var addedElemsArray = [];
  if (elemsToCut.length != 0) {

    for (var i = 0; i < elemsToCut.length; i++) {
      let setHeight = {
        completeHeight: elemsToCut[i].completeHeight,
        completeWidth: elemsToCut[i].completeWidth
      }
      addedElemsArray.push(thisInst.addLiElem(elemsToCut[i].innerHTML, 0, {elt: false, elts: true}, setHeight))
      thisInst.removeLiElem.call(adjInst, adjInst.elts[adjInst.elts.length - 1], adjInst.transSupport, false)
    }

  }

  return addedElemsArray;

}

function _shuffleArray(a) {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
}

function _shuffle() {

    var elems = [],
        instances = arguments;  // account for n number of instances to shuffle

    for (let ii = 0; ii < instances.length; ii++) { // get the elems

      let n = 0;
      while (instances[ii].elts[n] != undefined) {
        instances[ii].elts[n].style[instances[ii].transitionPrefix] = '0ms'; // make sure elts dont animate into new position
        elems.push(instances[ii].elts[n].innerHTML)
        n++
      }

    }

    _shuffleArray(elems)          // shuffle the elems

      var count = 0
      for (let ii = 0; ii < instances.length; ii++) {   // insert the elems

          for (let n = 0; n < instances[ii].elts.length; n++) {
            instances[ii].elts[n].innerHTML = elems[count]
            count++;
          }

      }

  this.reLayout()                             // reLayout the instances
  this.reLayout.call(this.adjInst1)

  return elems;
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
var transitionPrefix = "webkitTransition" in testElement.style ? "-webkit-transition" : "transition";
var transformPrefix = "webkitTransform" in testElement.style ? "-webkit-transform" : "-ms-transform" in testElement.style && transSupport == false ? "-ms-transform" : "transform"; //if ie9
