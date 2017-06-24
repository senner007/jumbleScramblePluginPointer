*This version uses jQuery pointer polyfill as a dependency*


Todo:
+ add global vars for 'top'/'left' and 'completeHeight'/'completeWidth'
+ lock method prototype
+ make dropLimit work in horizontal mode
+ add margin for elt to constructor the first time it is calculated in animateback
+ dirSwitch on constructor
+ setChars function should update elt object as well, it does not work when moving to another container
+ Dragging enable/disable method
+ cutOffEnd on init
+ shuffle method
+ set width of list item in vertical layout if width is not set in css
+ test in slider
+ Multiple container drop ( long term )
+ Improve add and remove method. eg. all or an array as parameter
+ Add callbacks to add, remove, drop (before and after animate)
+ Add containment option to specify containment for the draggeble elements.
+ Click items to delete
+ Create new items from textbox and then add
+ working example where text is retrieved from json file with option to save
+ refactor to add the once: true object to similar to jquery once to events. Wait for browser compatibility


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

Fixed:
+ allow dragging and dropping over other instances - Fixed
+ double cliking elements throws errors - Fixed



Testing:
+ Create responsive layout and test on mobile devices
+ Insert into sliders eg. SLY

Dependency:
jQuery ? - latest
jQuery pointer events polyfill
