*This version uses jQuery pointer polyfill as a dependency*


Todo:
+ lock method prototype
+ make dropLimit work in horizontal mode
+ add margin for elt to constructor the first time it is calculated in animateback
+ dirSwitch on constructor
+ setChars function should update elt object as well, it does not work when moving to another container. should probably work in conjunction with the relayout method.
+ Dragging enable/disable method
+ shuffle method
+ test in slider
+ Multiple container drop ( long term )
+ Improve add and remove method. eg. all or an array as parameter.
+ Add containment option to specify containment for the draggable elements.
+ Click items to delete (for showcasing)
+ Create new items from textbox and then add
+ working example where text is retrieved from json file with option to save
+ allow cutOff and dropLimit to be set after init
+ Add callbacks to init, relayout, add, remove, drop (before and after animate)
+ relayout is duplicating code from init - FIX ME!
+ add boolean to cutOffEnd method which prevents the function from running if the cut-off element(s) will make adjacent container fire its cutoffEnd method and thereby creating an infinite loop.
+ remove animAdded from prototype and add to animation module
+ maybe set the instanceArr array to the JumbleScramble constructor function's constructor
+ Setup main page with Bulma css. Show all examples on one page and add a -show in full screen- link to each. Fetch each example module which are exporting objects with unique data.
  * Make examples avaiable using the routes rewrite in htaccess. When using the routes, remove anything but the example and show in full screen.
+ use touch instead of pointer because of increased support : https://caniuse.com/#feat=touch
+ Assume transition support
+ Remove jQuery dependency - Pointer events polyfill will still work without it
+ Prevent multitouch ( not fixed yet)
+ Throttle the resize events
<<<<<<< HEAD
+ Call orientationChange event in place of resize on Chrome ios
+ option to turn off/down animations
+ put elt object on separate object

=======
+ Call orientationChange event in place of resize on Chrome ios 
+ use native event delegation https://stackoverflow.com/questions/14174056/native-addeventlistener-with-selector-like-on-in-jquery
+ trigger events using native js - https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
+ insert before and after wirh native - https://blog.garstasio.com/you-dont-need-jquery/dom-manipulation/#inserting-elements-before-&-after
>>>>>>> 72809fe679c1ee8ecd9d3751eaa28e84f6bf08a2

Working:
+ List items in vertical or horizontal layout
+ Hardware accelerated Animations
+ Dragging using mouse or touch
+ Cross-dragging between list containers
+ Individual height or width of list items
+ Optional margin between list items
+ Option to disallow drop to containe when above height (dropLimit option)
+ Add and remove items from containers
+ Callback function after animation on remove method
+ Automatically remove and prepend items to containers to prevent overflow (cutOff option)
+ Multiple instances of jumbleScramble on the same page
+ reLayout method is added to allow repositioning and updates to position data in object instances. Can be fired after window resize event(which is also fired on orientation change on mobile devices)
+ No longer uses jquery plugin structure. Instantiate object using new keyword. Ex var myList = new JumbleScramble(divElem, options)
+ Examples of add and remove method calls
+ option to fire layoutComplete after all instances have been initialized

Fixed:
+ allow dragging and dropping over other instances - Fixed
+ double cliking elements throws errors - Fixed
+ do not run init on object instantiation (run after as obj.init())- Fixed



Testing:
+ Create responsive layout and test on mobile devices
+ Insert into sliders eg. SLY

Dependency:
jQuery ? - latest
jQuery pointer events polyfill
