$(document).on("click", "#active_edition", function(){
	$("form#edit_user input[type=text],#remove_avatar, form#edit_user #avatar_updateable, form#edit_user select").each(function(){
		$(this).attr("disabled",false);	
	});
	
	$("#avatar_updateable").show();
	//$(".condition, .commercial, .derivative").show();
	$("#remove_avatar").toggleClass("invisible");
	$(".name_edition .updateable").css("background-color", "#eee");
});

$(document).on("click", "#disable_edition", function(){
	$("form#edit_user input[type=text],#remove_avatar, form#edit_user #avatar_updateable, form#edit_user select").each(function(){
		
		$(this).attr("disabled",true);	
	});
	//$(".condition, .commercial, .derivative").toggleClass("invisible");
	$("#avatar_updateable").hide();
	$("#remove_avatar").toggleClass("invisible");
	$(".name_edition .updateable").css("background-color", "white");
});

$(document).on("click","#remove_avatar",function(){
	jQuery.ajax({
				type: "PATCH",
				url: $("#edit_user").attr('action'),
				dataType: "json",
				data: {campo: 'imagenone'}
				
				}).done(
						function(data)
								{
									
									$(".avatar_preview, #header_top .avatar img").attr('src', '/images/user/medium/user.png').attr('alt','');
									$("#cambiossinguardar").slideUp(500);
									$("#cambiosguardados").slideDown(2000).slideUp(2000);
									$("#avatar_updateable").replaceWith($("#avatar_updateable").clone(true));
									
								}
						);
});

$(document).on("change","#avatar_updateable",function (event){
	/*field = $(this).attr('name').substring($(this).attr('name').indexOf('[')+1,$(this).attr('name').indexOf(']'));*/
	var imageinput = $(this).attr('id'); 
	
	var archivos = event.target.files;
	var image = new FormData();
	image.append("avatar", archivos[0]);
	image.append("campo","image");
	   
	jQuery.ajax({
				type: "PATCH",
				url: $("#edit_user").attr('action'),
				dataType: "json",
				contentType: false,
				processData: false,
				data: image
				
				}).done(
						function(data)
								{
									
									/* Agregar aqui lo que sea necesario cuando la función retorne la respuesta */
									$(".avatar_preview, #header_top .avatar img").attr('src', data.url);
									$("#cambiossinguardar").slideUp(500);
									$("#cambiosguardados").slideDown(2000).slideUp(2000);
									$(this).css('border-color','').css('box-shadow','0px 0px 0px');
									
								}
						);
	
});

$(document).on("change",".updateable.user",function (){
	var field = '';
	var content = $(this).val();
	
	
	if ($(this).attr('alt')=='data_box'){
		field = $(this).attr('name').substring($(this).attr('name').indexOf('[')+1,$(this).attr('name').indexOf(']'));
		var data_box_id = $(this).attr('id');
		var data_value= { campo: field, contenido: content, data_box: data_box_id};
	}else{
		field = $(this).attr('name').substring($(this).attr('name').indexOf('[')+1,$(this).attr('name').indexOf(']'));	
		var data_value= { campo: field, contenido: content};
	}
	console.log("pq haces esto");
	jQuery.ajax({
				type: "PATCH",
				url: $("#edit_user").attr('action'),
				dataType: "json",
				data: data_value,
				}).done(
						function(data)
								{
									/* Agregar aqui lo que sea necesario cuando la función retorne la respuesta */
									$("#cambiossinguardar").slideUp(500);
									$("#cambiosguardados").slideDown(2000).slideUp(2000);
									$(this).css('border-color','').css('box-shadow','0px 0px 0px');
									$("#header_top .user_profile_link").text($(".user_first_name input").val() + " " + $(".user_last_name input").val());
								}
						);
	
});

$(document).on("click",".check_fields_first_register",function (){
	if (!$("#acept_conditions").prop("checked")){
		return false;
	}
});
