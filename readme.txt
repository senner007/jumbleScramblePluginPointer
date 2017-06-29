*This version uses jQuery pointer polyfill as a dependency*


Todo:
+ add global vars for 'top'/'left' and 'completeHeight'/'completeWidth'
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
+ Click items to delete
+ Create new items from textbox and then add
+ working example where text is retrieved from json file with option to save
+ cutOff on init and reLayout
+ allow cutOff and dropLimit to be set after init
+ add examples of add and remove method calls
+ Add callbacks to init, relayout, add, remove, drop (before and after animate)
+ relayout is duplicating code from init - FIX ME!
+ do not run init on object instantiation (run after as obj.init())- FIX ME!
+ add boolean to cutOffEnd method which prevents the function from running if the cut-off element(s) will make adjacent container fire its cutoffEnd method and thereby creating an infinite loop.

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

Fixed:
+ allow dragging and dropping over other instances - Fixed
+ double cliking elements throws errors - Fixed



Testing:
+ Create responsive layout and test on mobile devices
+ Insert into sliders eg. SLY

Dependency:
jQuery ? - latest
jQuery pointer events polyfill
