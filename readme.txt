Todo - other:
Add todo plugin in atom

Comments - other:
Added bookmarker and minimap plugins https://github.com/atom/bookmarks - switch between bookmarks with F2. Also visible in minimap
Added highlight - double click to highlight - select multiple with ctrl-d
Added delete whitelines package - Alt-Shift-d

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
