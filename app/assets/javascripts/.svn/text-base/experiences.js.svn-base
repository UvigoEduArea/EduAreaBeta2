$(document).on("click", ".add_record", function(){
	var $this = $(this);
	var html_code = "";
	var data = "";	
	switch($this.attr("data_type")){
	case "image":
		data = {type: "image"};
		break;
	case "video":
		data = {type: "video"};
		break;
	case "document":
		data = {type: "document"};
		break;
	case "positive_comment":
		data = {type: "positive_comment"};
		break;
	case "negative_comment":
		data = {type: "negative_comment"};
		break;
	case "free_text":
		data = {type: "free_text"};
		break;
	case "snippet":
		data = {type: "snippet"};
		break;
	case "idea":
		data = {type: "idea"};
		break;
	default:
		console.log("Algo ha salido mal!");
		break;
	}
	
	var url;
	if ($this.parent().parent().attr("id").split("_")[2]=="submissions"){
		data["info_type"]="submissions";
		url = $("#show_content_submissions form").attr("action")+"/addRecord";	
	}else{
		data["info_type"]="observations";
		url = $(".element_summary form").attr("action")+"/addRecord";
	}
	
	$.ajax({
		type: "POST",
		url: url,
		dataType: "html",
		data: data
	}).done(function(data){
		$data = $(data);
		if ($this.parent().parent().attr("id").split("_")[2]=="submissions"){
			$("#show_content_submissions .record_box_container").prepend($data);
		}else{
			$(".observations_section_body").children().prepend($data);
		}
		
		/*if ($($this.parents("form")[0]).attr("id").split("_")[1]!="submission"){
			$(".record_box_"+$this.attr("data_type")).first().find(".record_content textarea").jqte({css: "jqte_record"});
			if($("#show_mode").attr("data-mode") == "3"){
				$(".record_box_"+$this.attr("data_type")).first().find(".jqte_record_editor").attr("contenteditable","false");
				$(".record_box_"+$this.attr("data_type")).first().find(".jqte_record_toolbar").hide();
			}else{
				if($("#show_mode").attr("data-mode") == "4"){
					$(".record_invisible").first().toggleClass("invisible");
					$(".record_input").attr("disabled",false);
				}
			}
		}*/
	});
	
	
});

function send_record_ajax($this, send, file){
	if(file){
		$.ajax({
			type: "PATCH",
			url: window.location.href.split("?")[0],
			dataType: "html",
			contentType: false,
			processData: false,
			data: send
		}).done(function(data){
			var data_content_record = $($.parseHTML(data)).filter(".observation_container").children().filter(".record_box").children().filter(".record_content").children();
			$this.parents(".record_content.left").html(data_content_record);
			
			if ($this.parents(".record_box").children("input").attr("data-user") != "Student"){
				$this.parents(".record_box").filter(".record_input").attr("disabled", false);
				$this.parents(".record_box").filter(".record_invisible").toggleClass("invisible");
			}
				
		});
	}else{
		$.ajax({
			type: "PATCH",
			url: window.location.href.split("?")[0],
			dataType: "html",
			data: send
		}).done(function(data){
			
			var data_content_record = $($.parseHTML(data)).filter(".observation_container").children().filter(".record_box").children().filter(".record_content").children();
			$this.parents(".record_content.left").html(data_content_record);
			
			if ($this.parents(".record_box").children("input").attr("data-user") != "Student"){
				$this.parents(".record_box").filter(".record_input").attr("disabled", false);
				$this.parents(".record_box").filter(".record_invisible").toggleClass("invisible");
			}
			
			if(send.type != "snippet"){
				$(".show_content_body .record_content textarea").jqte({css: "jqte_record"});
			}
		});
	}
}

$(document).on("change", ".record_title, .record_description", function(){
	var $this = $(this);
	var record_id = $this.parents(".record_box").attr("data-id");
	if($this.hasClass("record_title")){
		var data = {type: "title", content: $this.val(), record_id: record_id};
	}else{
		var data = {type: "description", content: $this.val(), record_id: record_id};
	}
	
	send_record_ajax($this, data, false);
	
});

$(document).on("blur", ".jqte_record_editor", function(){
	var $this = $(this);
	var record_id = $this.parents(".record_box").attr("data-id");
	
	switch($this.siblings(".jqte_record_source").find("textarea").attr("class")){
	case "record_input record_content_positive_comment":
		if($this.siblings($(".jqte_record_source")).find("textarea").html() != $this.html()){
			var data = {type: "positive_comment", content: $this.text(), record_id: record_id};
		}	
		break;
	case "record_input record_content_negative_comment":
		if($this.siblings(".jqte_record_source").find("textarea").html() != $this.html()){
			var data = {type: "negative_comment", content: $this.text(), record_id: record_id};
		}
		break;
	case "record_input record_content_free_text":
		if($this.siblings(".jqte_record_source").find("textarea").html() != $this.html()){
			var data = {type: "free_text", content: $this.text(), record_id: record_id};
		}
		break;
	case "record_input record_content_idea":
		if($this.siblings(".jqte_record_source").find("textarea").html() != $this.html()){
			var data = {type: "idea", content: $this.text(), record_id: record_id};
		}
		break;
	}
	send_record_ajax($this, data, false);
});

$(document).on("change", ".record_content_snippet_input", function(){
	var $this = $(this);
	if($this.val().search("<iframe") != -1){
		var x = $($this.val());
		x = x.attr({
			width: 426,
			height: 216,
		});
		console.log(x);
		var record_id = $this.parents(".record_box_snippet").attr("data-id");
		var data = {type: "snippet", content: x.prop('outerHTML'), record_id: record_id};
		
		send_record_ajax($this, data, false);
	}
});

$(document).on("click", ".selector", function(){
	var $this = $(this);
	$this.siblings(".file_field").click();
	
});

$(document).on("change", /*".record_image_description,*/".image_selector_input, .video_selector_input, .document_selector_input", function(event){
	var $this = $(this);
	var record_id = $this.parents(".record_box").attr("data-id");
	var file = true; //Se utilizaba cuando estaba usandose la descripcion del fondo de la imagen o video
	/*if($this.hasClass("record_image_description")){
		data = {type: "text_content", content: $this.val(), record_id: record_id};
	}else{*/
	var target = $this;
	var archivos = event.target.files;
	var data = new FormData();
	data.append("content", archivos[0]);
	data.append("record_id", record_id);
	
	switch($this.attr("class")){
	case "image_selector_input record_input file_field":
		data.append("type", "original_image");
		break;
	case "video_selector_input record_input file_field":
		data.append("type", "video");
		break;
	case "document_selector_input record_input file_field":
		data.append("type", "document");
		break;
	}
	//}
	send_record_ajax($this, data, file);
});

$(document).on("click", ".delete_record", function(){
	var $this = $(this);
	var record_id = $this.parents(".record_box").attr("data-id");
	var continuar = false;
	switch($("#locale").val()) {//Si hay un setting agregado, avisamos al usuario que perderá la información
		case "es":
			continuar = confirm("Si continua eliminará la observación");
			break;
		case "gl":
			continuar = confirm("Se continúa eliminará a observación");
			break;
		default:
			continuar = confirm("If you continue observation will lost");

	}
	if(continuar){
		$.ajax({
			type: "DELETE",
			url: "/"+$("#locale").val()+"/experiences/"+$("#experience").attr("data-id")+"/deleteRecord",
			dataType: "json",
			data: {record_id: record_id}
		})
		.done(function(){
			$this.parents(".record_box").remove();
		})
		.fail(function(){
			console.log("toy fallando");
		});
	}
});

$(document).on("click", "#share_experience", function(){
	if ($(".users_bar").size()==0){
		$.ajax({
			type: "GET",
			url: "/"+$("#locale").val()+"/users/getAllUsers",
			dataType: "json"
		}).done(function(data){
			var result = "";
			for(i=0; i < data.length; i++){
				var user = "<div id='user_" + data[i].user_id + "' class='user_box'><img src='"+ data[i].avatar+"' width='32px'/><span>"+ data[i].first_name + " " + data[i].last_name + "</span></div>";
				result = result.concat(user);
			}
			result = "<div class='users_bar'><button type='button' class='share_experience_button' style='display: block; margin: 0 auto;'>Enviar</button><input type='checkbox' class='shared_experience_editable'>Editable</input><input type='text' class='filter_users'>"+result+"</div>";
			$("#content_container").prepend(result);
		});
	}else{
		$(".users_bar").remove();
	}
});

$(document).on("click", ".user_box", function(){
	var $this = $(this);
	$this.toggleClass("user_selected");
});

$(document).on("click", ".share_experience_button", function(){
	var $this = $(this);
	var ids = "";
	$(".user_selected").each(function(){
		if(ids != ""){
			ids = ids + ",";
		}
		ids = ids + $(this).attr("id").split("user_")[1].toString();
	});
	$.ajax({
		type: "POST",
		url: window.location.href+"/share",
		dataType: "json",
		data: {user_ids: ids, editable: $("input.shared_experience_editable").prop('checked')}
	}).done(function(){
		$(".users_bar").remove();
	});
});

$(document).on("keyup", ".filter_users", function(event){
	if(event.keyCode != 16){
		var users = $(".user_box span:contains('"+ $(this).val()+"')").parent();
		$(".user_box").css("display", "none");
		users.css("display","inherit");
	}
});


$(document).on("click", "#get_code_experience", function(){
	$.ajax({
		type: "GET",
		url: window.location.href.split("?")[0]+"/getCodeToShare",
		dataType: "json"
	}).done(function(data){
		console.log("get code experience");
		console.log(data);
		switch($("#locale").val()) {
			case "es":
				$("<div id='show_code_experience'><img class='close_info_code' src='/images/icons/Botones/Blanco/close.png'><br><span id='code_I'>El código para compartir el curso es </br><b>"+data.code_to_share+"</b></span></br><span id='code_II'>Envíaselo a tus alumnos para que puedan acceder.</span></div>").insertAfter("#popup_background");
				break;
			case "gl":
				$("<div id='show_code_experience'><img class='close_info_code' src='/images/icons/Botones/Blanco/close.png'><br><span id='code_I'>O código para compartir o curso é </br><b>"+data.code_to_share+"</b></span></br><span id='code_II'>Envíallo aos teus alumnos para que poidan acceder.</span></div>").insertAfter("#popup_background");
				break;
			default:
				$("<div id='show_code_experience'><img class='close_info_code' src='/images/icons/Botones/Blanco/close.png'><br><span id='code_I'>The code to share the course is </br><b>"+data.code_to_share+"</b></span></br><span id='code_II'>Send it to your student to have access.</span></div>").insertAfter("#popup_background");
		}
	});
});

$(document).on("click", ".close_info_code", function(){
	$("#show_code_experience").remove();
});


$(document).ready(function(){
	$("#use_code_experience").click(function(){
	   	$(".dropdown.code_experience").effect("slide", {direction: "left"},300);
	});
});


$(document).on("keyup", "#enter_code", function(event){
	var $this = $(this);
	var enter_code;
	
	if(event.keyCode == 13){
		enter_code = $this.val();
		
		$.ajax({
			type: "POST",
			url: "/" + $("#locale").val() + "/experiences/useCode",
			dataType: "json",
			data: {enter_code: enter_code}
		}).done(function(data){
			console.log(data.shared);
			if (data.shared != null){
				$(location).attr("href", "/" + $("#locale").val() + "/experiences/" + data.shared);
			}else{
				switch($("#locale").val()) {
					case "es":
						alert("El código que ha introducido no es correcto.");
						break;
					case "gl":
						alert("O código que acaba de introducir non é correcto.");
						break;
					default:
						alert("The code is not correct.");
				}				
			}
		});
	}
});


$(document).on("click", ".close_insert_code_experience", function(){
	$(".dropdown.code_experience").slideUp(300);
});


$(document).on("click", ".add_new_submission", function(){
	var $this = $(this);
	var url = $(".element_summary form").attr("action").split("?")[0];
	var controller = url.split("/")[url.split("/").length-2];
	var experience = false;
	if (controller == "experiences"){
		experience = true;
		url= $(".element_summary form").attr("action").split("?")[0];
	}
	$.ajax({
		type: "POST",
		url: url+"/addSubmission",
		dataType: "html",
		data: {experience: experience}
	}).done(function(data){
		$("#submissions_list_view_"+url.split("/")[url.split("/").length-1]).append(data);
	});
});

$(document).on("click", ".expand_submission", function(){
	var $this = $(this);
	$this.parent().siblings("form").children(".records").toggleClass("invisible");
	
	var url = $this.parent().siblings("form").attr("action");
	$.ajax({
		type: "GET",
		url: url+"/getRecords",
		dataType: "html",
		data: {submission: true}
	}).done(function(data){
		$this.parents(".show_submission_in_lp").find(".record_box_container").html(data);
	});
});


$(document).on("click", ".delete_submission", function(){
	var $this = $(this);
	var url = $this.parent().siblings("form").attr("action");
	$.ajax({
		type: "DELETE",
		url: url,
		dataType: "json"
	}).done(function(data){
		$this.parent().parent().remove();
	});
});