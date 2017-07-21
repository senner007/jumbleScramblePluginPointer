Todo - other:
Add todo plugin in atom

Comments - other:
Added bookmarker and minimap plugins https://github.com/atom/bookmarks - switch between bookmarks with F2. Also visible in minimap
Added highlight - double click to highlight - select multiple with ctrl-d


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
+ Animation speed logic to determine when to speed up animations.
+ Adds touch support with fallback to pointer and then mouse as input
+ Lock/unlock methods which prevents dragging to and from instance
+ Added getInstances method to instance which returns array of all instances
+ Added crossDistance method to instances. The crossing distance to the adjacent container


Fixed:
+ allow dragging and dropping over other instances - Fixed
+ double cliking elements throws errors - Fixed
+ do not run init on object instantiation (run after as obj.init())- Fixed
+ currently doesn't work in Edge - Fixed ({once: true} in events doesn't agree with Edge)
+ improve the addLiElem logic, remove jQuery - DONE
+ maybe add and remove the element on triggeron/tiggeroff, hide it but update its position on each reorder. Then avoid calling the addLiElem on dragstop - DONE
+ try to unify the reordering logic and refactor into a single function call - DONE
+ remove global instanceArr. DONE
+ refactor cutOff - pass completeHeight, comleteWidth to addLiElem - DONE
+ on event move, pass in only instances that are involved in the event(Pass in elt, instanceThis, instanceAdj (maybe rename)). DONE
+ Put remaining properties on instanceArr on each instance. DONE
+ allow cutOff and dropLimit to be set after init - DONE
+ make dropLimit work in horizontal mode - DONE
+ refactor scale/descale elems to one function DONE
+ scale in items before transition has finished - DONE
+ make calculate a ul function - DONE
+ make a function to iterate  over elements and add to object as in init and relayout. -DONE
+ make cutOff return a collection of items and which can then be passed to add and remove function. DONE
+ make a cutoff on prototype only for external use - DONE
+ save the ul height on instance -DONE
+ remove onstop from prototype - Done

Partially fixed:
+ prevent multitouch !!! - The element will freeze and animate back if multi touch is detected. Find a way to simple ignore additional touches

Testing:
+ Create responsive layout and test on mobile devices
+ Insert into sliders eg. SLY

Dependency:
jQuery ? - latest
jQuery pointer events polyfill
