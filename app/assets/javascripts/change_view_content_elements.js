/*$(document).on("click", ".next_element", function(){
	$(".col1").effect("slide",{direction: "left", mode: "hide"}, "slow");
	$(".col4").effect("slide", {direction: "right", mode: "show"}, "slow");
});*/

$(document).on("click", ".list_view_icon",function(){ //Esta funcion se llama para cambiar la vista de los recursos y/o de las actividades, entre modo lista y modo miniview
	var $this = $(this);
	var who = $this.attr("value");
	var view;
	var url;
	var data_info_splitted = $this.attr("data-info").split(";"); 
	var controller = data_info_splitted[0];
	if (controller == "Activity"){
		controller = "activities";
	}else{
		controller = "lesson_plans";
	}
	var element_id = data_info_splitted[1];
	
	if ($("#"+who+"_mini_view_"+element_id).hasClass("invisible")){//Si el identificador con _mini_view tiene la clase invisible es que hay que cambiar a modo vista mini_view
		view = "mini";
	}else{
		view = "list";
	}
	var data = {};
	
	if($("#disable_edition").hasClass("invisible")){
		data['created'] = false;
	}else{
		if ($("#disable_edition").size()!=0){
			data["created"] = true;	
		}else{
			data["created"] = false;
		}
		
		if ($(".content_show").hasClass("in_popup")){
			data["created"] = false;
		}
	}
	var created = data["created"];
		
	url = "/" + $("#locale").val() + "/" + controller + "/" + element_id + "/" + view + "/" + who;
	$.ajax({
		type: "GET",
		dataType: "html",
		url: url,
		data: data
	}).done(function(data){
		
		if (!$("#"+who+"_table_view_"+element_id).hasClass("invisible")){
			$("#"+who+"_table_view_"+element_id).addClass("invisible");
		}
		
		if (view == "mini"){
			$("#"+who+"_mini_view_"+element_id).html(data);
			$("#"+who+"_mini_view_"+element_id).removeClass("invisible");
			$("#"+who+"_list_view_"+element_id).addClass("invisible");
			if ($(".delete_element_checkbox").size()!=0){
				$(".delete_element_checkbox").remove();
			}
			
		}else{
			$("#"+who+"_list_view_"+element_id).html(data);
			$("#"+who+"_list_view_"+element_id+" textarea").jqte();
			$("#"+who+"_mini_view_"+element_id).addClass("invisible");
			$("#"+who+"_list_view_"+element_id).removeClass("invisible");
			if (created == true){
				$("#"+who+"_action_bar_"+element_id).append("<img alt='Close' class='delete_element_checkbox subcategorie_icon' src='/images/icons/Botones/Blanco/close.png' value='"+who+"'>");	
			}
			$("#"+who+"_list_view_"+element_id).sortable({
				axis: "y",
				cursor: "move",
				revert: true,
				placeholder: "sortable_placeholder",
				handle: ".select_element_to_move",
				connectWith: ".element_list_box",
				update: function(event, ui){
					var data_ajax = {};
					
					if($(ui.item[0]).parent().attr("data-position") == undefined){
						data_ajax["position"] = $(ui.item[0]).parent().next().attr("data-position");
					}else{
						data_ajax["position"] = $(ui.item[0]).parent().attr("data-position");
					}
					
					var url;
					console.log(who);
					if (who == "activities"){
						data_ajax["activity_id"] = $(ui.item[0]).attr("data-info").split(";")[1];
						url = "/" + $("#locale").val() + "/" + controller + "/" + element_id +"/sort/activities";
					}else{
						data_ajax["resource_id"] = $(ui.item[0]).attr("data-info").split(";")[1];
						url = "/" + $("#locale").val() + "/" + controller + "/" + element_id +"/sort/resources";	
					}
					
					$.ajax({
						url: url,
						type: "POST",
						dataType: "json",
						data: data_ajax
					}).done(function(data){
						var element;
						for(i=0; i < data.length; i++){
							element = $("[class=element_list_box][data-info='"+data[i].type+";"+data[i].id.toString()+"']");
							element.attr("data-position",data[i].position.toString());
						}
					});
	
					if($("#show_mode").attr("data-mode") != "2"){
						$("#"+who+"_section_body ."+who+"_list_view").sortable("disable");
					}
				}
			});
		}
		$("#"+who+"_action_bar_"+element_id+" input").attr("data-view", view);
		
		$(".resources_section_body .jqte_editor").attr("contenteditable", "false");
		$(".resources_section_body .jqte_toolbar").addClass("hide");
		$(".activities_section_body .jqte_editor").attr("contenteditable", "false");
		$(".activities_section_body .jqte_toolbar").addClass("hide");
		$(".resources_section_body .jqte, .activities_section_body .jqte").css("max-height", "50px");
		
		
	});
});

$(document).on("click", ".table_view_icon", function(){
	var $this = $(this);
	var who = $this.attr("value");
	var view;
	var url;
	var data_info_splitted = $this.attr("data-info").split(";"); 
	var controller = data_info_splitted[0];
	var element_id = data_info_splitted[1];
	
	if (controller == "Activity"){
		controller = "activities";
	}else{
		controller = "lesson_plans";
	}
	
	if ($("#"+who+"_table_view_"+element_id).hasClass("invisible")){//Si el identificador con _mini_view tiene la clase invisible es que hay que cambiar a modo vista mini_view
		view = "table";
	}else{
		view = "list";
	}
	var data = {};
	
	if($("#disable_edition").hasClass("invisible")){
		data['created'] = false;
	}else{
		if ($("#disable_edition").size()!=0){
			data["created"] = true;	
		}else{
			data["created"] = false;
		}
		
		if ($(".content_show").hasClass("in_popup")){
			data["created"] = false;
		}
	}
	
	url = "/" + $("#locale").val() + "/" + controller + "/" + element_id + "/" + view + "/" + who;
	
	if($('#experience').attr("data-parent") == undefined){
		data['experience'] = false;
	}else{
		data['experience'] = true;
	}
	
	$.ajax({
		type: "GET",
		dataType: "html",
		url: url,
		data: data
	}).done(function(data){
		
		if (!$("#"+who+"_mini_view_"+element_id).hasClass("invisible")){
			$("#"+who+"_mini_view_"+element_id).addClass("invisible");
		}	
		
		if (view == "table"){
			$("#"+who+"_table_view_body").html(data);
			$("#"+who+"_table_view_"+element_id+" textarea").jqte();
			$(".previous_element, .next_element").css("height", $("#"+who+"_table_view_body").height());
			$("#"+who+"_table_view_"+element_id).removeClass("invisible");
			$("#"+who+"_list_view_"+element_id).addClass("invisible");	
		}else{
			$("#"+who+"_list_view_"+element_id).html(data);
			$("#"+who+"_list_view_"+element_id+" textarea").jqte();
			$("#"+who+"_table_view_"+element_id).addClass("invisible");
			$("#"+who+"_list_view_"+element_id).removeClass("invisible");
		}
		$("#"+who+"_action_bar_"+element_id+" input").attr("data-view", view);
		
		if (($("#show_mode").attr("data-mode") == "1")){
			$(".jqte_toolbar").hide();
			$(".jqte_editor").attr("contenteditable", false);
		}else{
			if ($(".content_show").hasClass("in_popup")){
				$(".jqte_toolbar").hide();
				$(".jqte_editor").attr("contenteditable", false);
			}
		}
	});
});



