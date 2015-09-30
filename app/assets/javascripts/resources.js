// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(document).ready(function(){
	/***** FEITO POR ROGER *******/
	$(".action_icon").click(function(){
	   	$(".dropdown.resources").effect("slide", {direction: "left"},300);
	});
	
    $(".action_icon_container .dropdown").hover(function(){}, function(){
    	$(".action_icon_container .dropdown").slideUp(300);
    });
    /******************************/
});

$(document).on("change","#Resources_select",function (){
	location = this.options[this.selectedIndex].value;
});

$(document).on("click", "#active_edition", function(){
	if($(".url a").length){ //EN ESTA CONDICION COMPRUEBO QUE EL TAG QUE ESTOY SELECCIONANDO EXISTE. (SI EXISTE TIENE LONGITUD, SI NO, ES 0)
		$(".url a").replaceWith("<input type='text' name='element[URL]' class='updateable focusable' style='background-color: rgb(238,238,238)' value='"+$(".url a").html()+"'/>");
	}	
});

$(document).on("click", "#disable_edition", function(){
	if($(".url input").length){
		$(".url input").replaceWith("<a href='"+$(".url input").val()+"' data-method='get' target='_blank'>"+$(".url input").val()+"</a>");
	}
});

$(document).on("click", ".add_resources", function(){
	$(this).siblings(".dropdown.new_resources").slideDown(300);
	$(".dropdown.new_resources").hover(function() {
	}, function() {
		$(".dropdown.new_resources").slideUp(300);
	});
});

$(document).on("click", "#record_card_dropdown", function(){
	$(this).siblings(".dropdown_record_card").slideDown(300);
	$(".dropdown_record_card").hover(function() {
	}, function() {
		$(".dropdown_record_card").slideUp(300);
	});
});
