$(document).on("click", ".setting_icon.add_setting", function(){
	var url = $(this).closest("form").attr("action")+"/add_setting";
	var classes = $(this).attr("class").split(" ");
	var type = classes[classes.length -1]; //ASI COGEMOS EL ULTIMO ELEMENTO DEL ARRAY, QUE ES EN EL QUE SE ENCUENTRA EL TIPO DE SETTING
	
	$.ajax({
		type: "POST",
		url: url,
		dataType: "html",
		data: {new_element: true, type: type}
	});
});

$(document).on("click", ".delete_technical_setting", function() {
	var $this = $(this);
	var element_id = $this.attr('id');
	var url = "/" + $("#locale").val() + "/technical_settings/" + element_id;
	var result = false;
	
	switch($("#locale").val()) {//Si hay un setting agregado, avisamos al usuario que perderá la información
		case "es":
			result = confirm("¿Está seguro de querer eliminar el perfil?");
			break;
		case "gl":
			result = confirm("Está seguro de querer eliminar o perfil?");
			break;
		default:
			result = confirm("Are you sure that you want to remove the setting?");
	}

	if (result){
		jQuery.ajax({
			type : "DELETE",
			url : url,
			dataType : "json",
			data : {
				element_id : element_id,
			},
		}).done(function(data) {
			$this.parent().parent().parent().remove();
			var container = $('#content_popup');
			container.imagesLoaded(function() {
				container.masonry({
					columnWidth : 2,
					itemSelector : '.cards'
				}).fadeIn();
			});
		});
	}
	
});