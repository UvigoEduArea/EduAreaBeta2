// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(document).ready(function(){
	/***** FEITO POR ROGER *******/
	$(".action_icon").click(function(){
	   	$(".dropdown.templates").effect("slide", {direction: "left"},300);
	});
	
    $(".dropdown.templates").hover(function(){}, function(){
    	$(".dropdown.templates").slideUp(300);
    });
    /******************************/
});
    
$(document).on("ajax:success","#New_Box",function(e, data, status, xhr){
	var response = jQuery.parseJSON(xhr.responseText);
	var box;
	box = '<div class="updateable_box pp_'+ response.box.page_position +'"><input type="hidden" class="updateable_box_id" value="' + response.box.id + '"><input type="text" class="updateable_box_title" value="Introduzca Título">';	
	switch (response.box.box_type){
		
		case "BR": box = '<div class="updateable_box pp_'+ response.box.page_position +'"><hr>';
					break;
		case "BSV": box += '<input type="text" class="updateable_box_description" value="Introduzca Descripción"><select class="updateable_box_BSV_type"><option value=""></option><option value="Integer">TipoInteger</option><option value="String">TipoString</option><option value="Float">TipoFloat</option><option value="Date">TipoDate</option></select>';
					break;
		case "BI": box += '<input type="text" class="updateable_box_description" value="Introduzca Descripción"><select class="updateable_box_BI_voc">';
					box += '<option value=""></option>';
					for	(index = 0; index < response.vocabularies.length; index++) {
						box += '<option value="' + response.vocabularies[index].id + '">' + response.vocabularies[index].title +'</option>';   							 
					} 
					box += '</select>';
					break;
		case "BEI": box += '<input type="text" class="updateable_box_description" value="Introduzca Descripción"><select class="updateable_box_BEI_type"><option value=""></option><option value="Resource">Recurso</option><option value="Device">Dispositivo</option><option value="Application">Aplicación</option><option value="Collaborator">Colaborador</option><option value="Event">Salida</option><option value="Content">Contenido</option></select>';
					break;
		case "BFTI":box += '<input type="text" class="updateable_box_description" value="Introduzca Descripción">';
					break;
		case "BT": box += '';
					break;
		case "BTA": box += '<input type="text" class="updateable_box_description" value="Introduzca Descripción">';
					break;
		
		
	}
	box += '<div class="info_changes_box"></div><div class="delete_box_from_template"></div></div>';
	$("#lastclear").remove();
	if (response.box.box_type != "BR") $(".content_template").append(box);
	$(".content_template").append('<div id="lastclear" class="clear"></div>');
	if (response.box.box_type == "BR") $(".content_template").append(box);
	
	console.log(xhr.responseText);
	
}).on("ajax:error","#New_Box",function(e, xhr, status, error){
	 $(".content_template").append("<p>ERROR</p>");
});

$(document).on("change",".add_box_select",function(){
	
	switch ($(this).val()){
	
	case "BR":
				$(".add_box_page_position_select").val("full");
				$(".add_box_page_position_select").attr('disabled','disabled');
				$(".add_box_page_position_select").show();
				$(".add_box_submit").show();
				break;
	case "BTA":
	case "BI":
	case "BFTI":
	case "BEI":
	case "BT":
	case "BSV":	$(".add_box_page_position_select").val("left");
				$(".add_box_page_position_select").removeAttr('disabled');
				$(".add_box_page_position_select").show();
				$(".add_box_submit").show();
				break;
	default: 	$(".add_box_page_position_select").hide();
				$(".add_box_submit").hide();
				break;
	}
	
});

function update_box_field(){
	
	var box = $(this);
	var field = "";
	switch (box.attr('class')){
		
		case "updateable_box_title":field = "title";break;
		case "updateable_box_description":field = "description";break;
		case "updateable_box_BSV_type": field = "data_type";break;
		case "updateable_box_BEI_type": field = "data_type";break;										
		case "updateable_box_BI_voc": field= "vocabulary_id";break;
		default: field = "valuetype";break;
		
	}
	var content = $(this).val();
	var id = box.parent().children(".updateable_box_id").val();
	
	jQuery.ajax({
				type: "PATCH",
				url: "/boxes/" + id,
				dataType: "json",
				data: {campo: field,contenido: content},
				}).done(
						function(data)
								{
									/* Agregar aqui lo que sea necesario cuando la función retorne la respuesta */
									
									info_changes_box = box.parent().children(".info_changes_box");
									info_changes_box.html("<p>Cambios Guardados</p>");									
									info_changes_box.slideDown(2000);
									info_changes_box.slideUp(3000);
								}
						);
	
}

$(document).on("change",".updateable_box_title",update_box_field);
$(document).on("change",".updateable_box_description",update_box_field);
$(document).on("change",".updateable_box_BSV_type",update_box_field);
$(document).on("change",".updateable_box_BEI_type",update_box_field);
$(document).on("change",".updateable_box_BI_voc",update_box_field);
$(document).on("click",".delete_box_from_template",function(){
	
	var box = $(this).parent();
	var id = $(this).parent().children(".updateable_box_id").val();
	
	jQuery.ajax({
				type: "DELETE",
				url: "/boxes/" + id,
				dataType: "json",
				data: {},
				}).done(
						function(data)
								{
									/* Agregar aqui lo que sea necesario cuando la función retorne la respuesta */
									 box.remove();
									 
								}
						);
});

/*$(document).on("change",".updateable_box_title",function (){
	
	var box = $(this);
	
	var field = "title";
	var content = $(this).val();
	var id = box.parent().children(".updateable_box_id").val();
	
	jQuery.ajax({
				type: "PATCH",
				url: "/boxes/" + id,
				dataType: "json",
				data: {campo: field,contenido: content},
				}).done(
						function(data)
								{
									/* Agregar aqui lo que sea necesario cuando la función retorne la respuesta */
									/*info_changes_box = box.parent().closest(".info_changes_box");
									info_changes_box.html("<p>Cambios Guardados</p>");
									info_changes_box.slideDown(2000).slideUp(2000);
								}
						);
	
});*/