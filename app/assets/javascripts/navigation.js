$(document).on("click", "#personal_area_dropdown, #resources_dropdown, #plans_dropdown",function(){
	var $this = $(this);
	var ul = $this.find(".name_image_dropdown").siblings(".dropdown_list");
	$(".dropdown_list").hide();
	ul.show();
	ul.hover(null,function(){
		ul.hide();
	});
});


$(document).on("click", "#where_resources_dropdown", function(){
	$(this).siblings(".dropdown.resources_where").slideDown(300);
	$(".dropdown.resources_where").hover(function() {
	}, function() {
		$(".dropdown.resources_where").slideUp(300);
	});
});


$(document).on("click", "#where_activities_dropdown", function(){
	$(this).siblings(".dropdown.activities_where").slideDown(300);
	$(".dropdown.activities_where").hover(function() {
	}, function() {
		$(".dropdown.activities_where").slideUp(300);
	});
});