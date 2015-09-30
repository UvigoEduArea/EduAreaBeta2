$(document).ready(function(){
	$('a[href^="landing#"]').on('click',function (e) {
	    e.preventDefault();

	    var target = this.hash;
	    var $target = $(target);
		 if ($target.selector != "#home")
		 {
		
		    $('html, body').stop().animate({
		        'scrollTop': ($target.offset().top)-75
		    }, 900, 'swing', function () {
	
				
		    });
		 }
		 else $("html, body").animate({ scrollTop: 0 }, 900,'swing');
	});
});