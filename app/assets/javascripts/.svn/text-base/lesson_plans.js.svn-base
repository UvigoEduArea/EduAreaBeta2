$(document).ready(function(){
	
	/*$("#activities_section_body .activities_list_view").sortable({
		axis: "y",
		cursor: "move",
		revert: true,
		placeholder: "sortable_placeholder",
		handle: ".sort_activities",
		update: function(event, ui){
			var data_ajax = {};
			if($(ui.item[0]).prev().attr("data-position") == undefined){
				data_ajax["position"] = $(ui.item[0]).next().attr("data-position");
			}else{
				data_ajax["position"] = $(ui.item[0]).prev().attr("data-position");
			}
			data_ajax["activity_id"] = $(ui.item[0]).attr("id").split("_")[1];
			$.ajax({
				url: $(this).parents("#activities").siblings("form").attr("action")+"/sort/activities",
				type: "POST",
				dataType: "json",
				data: data_ajax
			}).done(function(data){
				var element;
				console.log(data);
				for(i=0; i < data.length; i++){
					element = $("#activity_"+data[i].id.toString());
					element.attr("data-position",data[i].position.toString());
					element.find("a.activity_anchor_position").attr("name", "activity_position_"+element.attr("data-position"));
					switch($("#locale").val()){
						case "gl":
							element.find("span[name='activity_name']").text("Actividade "+element.attr("data-position"));
						break;
						case "es":
							element.find("span[name='activity_name']").text("Actividad "+element.attr("data-position"));
						break;
						case "pt":
							element.find("span[name='activity_name']").text("Actividade "+element.attr("data-position"));
						break;
						case "en":
							element.find("span[name='activity_name']").text("Activity "+element.attr("data-position"));
						break;
					}
					
				}
			});
		}
	});
	
	if($("#show_mode").attr("data-mode") != "2"){
		$("#activities_section_body .activities_list_view").sortable("disable");
	}*/
});

$(document).on("click", ".list_view, .grid_view", function(){
	var $this = $(this);
	var url = $(".element_summary form").attr("action");
	
	if($this.hasClass("list_view")){
		url = url + "/getListView";
	}else{
		
	}
});
