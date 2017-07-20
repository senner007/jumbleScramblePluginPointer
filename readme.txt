Todo:

+ add margin for elt to constructor the first time it is calculated in animateback
+ setChars function should update elt object as well, it does not work when moving to another container. should probably work in conjunction with the relayout method.
+ Dragging enable/disable/lock on individual items method
+ shuffle method
+ test in slider
+ Multiple container drop ( long term )
+ Improve add and remove method. eg. all or an array as parameter.
+ Add containment option to specify containment for the draggable elements.
+ Click items to delete (for showcasing)
+ working example where text is retrieved from json file with option to save
+ Add callbacks to init, relayout, add, remove, drop (before and after animate)
+ relayout is duplicating code from init - FIX ME!
+ add boolean to cutOffEnd method which prevents the function from running if the cut-off element(s) will make adjacent container fire its cutoffEnd method and thereby creating an infinite loop.
+ remove animAdded from prototype and add to animation module
+ Setup main page with Bulma css. Show all examples on one page and add a -show in full screen- link to each. Fetch each example module which are exporting objects with unique data.
  * Make examples avaiable using the routes rewrite in htaccess. When using the routes, remove anything but the example and show in full screen.
+ Assume transition support
+ Remove jQuery dependency - Pointer events polyfill will still work without it
+ Throttle the resize events
+ Call orientationChange event in place of resize on Chrome ios
+ use native event delegation https://stackoverflow.com/questions/14174056/native-addeventlistener-with-selector-like-on-in-jquery
+ trigger events using native js - https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
+ optionally implement logic to calculate animation speed based on the position of the dropped item relative to its new position
+ when using a single list, allow the option to constrain to a single axis - http://www.javascriptkit.com/javatutors/touchevents.shtml(bottom)
+ maybe set {passive: true} as third argument on event start and event move - https://developers.google.com/web/updates/2017/01/scrolling-intervention
+ Put dirSwitch as property on instance dragging from and rename to crossTrigger,  rename crossTrigger to crossFlag and put on same instance.
+ add placeholder when dragging
+ allow jquery pointer polyfill as optional
+ add more comments/lines
+ split module_main
+ crossDistance should be a property set on init/reLayout, not a method.
+ put elt object properties on namespaced separate object. Name the object dynamically to the div id.
+ pass in the element for the adjacent container on instantiation, and set/look up adjacent container by its id
  if id is not passed in options, it will assign a number based id based on the order of instantiation(default)
+ getInstances() should point to array of all instances but without prototypes (Object.assign)
+ fix lock method
+ support for custom animations set in options
+ method to turn all animations on/off
----------------------------
+ remove onstop from prototype
+ use the eltsReorder in addLiElem
-------------------------------




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

Partially fixed:
+ prevent multitouch !!! - The element will freeze and animate back if multi touch is detected. Find a way to simple ignore additional touches

Testing:
+ Create responsive layout and test on mobile devices
+ Insert into sliders eg. SLY

Dependency:
jQuery ? - latest
jQuery pointer events polyfill
