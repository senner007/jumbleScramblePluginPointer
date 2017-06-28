
$(document).ready(function() {



  (function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);
 //$("body").css("overflow", "hidden");
		$('body').disableSelection();
		$('ul').on('touchmove',function(e){
			e.preventDefault();
		});



    var elem = $("#jMyPuzzleId2");
    var elem2 = $("#jMyPuzzleId3");


				//$("#jMyPuzzleId2, #jMyPuzzleId3").remove();

				// hello = $("#jMyPuzzleId0").on('layoutComplete', function (){
        //             console.log(arguments[1])
        //         }).jumbleScramble({
        // 						isVertical: true,
        // 						cutOff: [500,550]
				// 	     });
        var winHeight = window.innerWidth - 50; // recalculate windows height for cutoff on resize. Also run cutoff on resize
        var hello = new module(elem,{
          isVertical: false,
         cutOff: [winHeight,winHeight]

        })
      //  instanceArr.push(hello)

        var hello2 = new module(elem2,{
          isVertical: false,
           cutOff: [winHeight,winHeight]

        })
      //  instanceArr.push(hello2)

          console.log(hello)
          console.log(hello2)

                        $( window ).on('resize', function() {
                          hello.reLayout()
                          hello2.reLayout()

                        //  console.log(instanceArray[0]//)
                        });



 });
