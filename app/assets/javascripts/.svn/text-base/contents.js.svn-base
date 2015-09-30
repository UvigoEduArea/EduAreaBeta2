// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(document).on("click", ".selector_document", function(){
	var $this = $(this);
	$this.siblings(".file_append").click();	
});


$(document).on("change", ".file_append", function(event){
	var $this = $(this);
	var append_id = $this.parents(".documents_appends_box").attr("data-id");
	var data = "";
	var new_file = false; 
	var target = $this;
	var type;
	var archivos = event.target.files;
	data = new FormData();
	data.append("contenido", archivos[0]);
	data.append("append_id", append_id);
	data.append("campo", "document");
	data.append("new", false);
	if ($this.hasClass("source")){
		data.append("type", "Source");
		type = "Source";
	}else{
		data.append("type", "Presentation");
		type = "Presentation";	
	}

	send_append_ajax($this, data, new_file, type);
});


$(document).on("click", ".add_append", function(){
	var $this = $(this);
	$this.siblings(".file_new_append").click();	
});

$(document).on("change", ".file_new_append", function(event){
	var $this = $(this);
	var data = "";
	var new_file = true; 
	var target = $this;
	var archivos = event.target.files;
	var type;
	data = new FormData();
	data.append("contenido", archivos[0]);
	data.append("campo", "document");
	data.append("new", true);
	if ($this.hasClass("presentation")){
		data.append("type", "Presentation");
		type = "Presentation";
	}else{
		data.append("type", "Source");
		type ="Source";	
	}
	send_append_ajax($this, data, new_file, type);
});


function send_append_ajax($this, send, new_file, type){
	$.ajax({
		type: "PATCH",
		url: $this.parents("form").attr("action"),
		dataType: "html",
		contentType: false,
		processData: false,
		data: send
	}).done(function(data){
		console.log(new_file);
		console.log(type);
		if (new_file){
			if (type == "Snippet"){
				$this.parents(".snippet_presentation").append(data);	
			}else{
				$this.parents(".appends_container").append(data);
			}
		}else{
			if (type == "Snippet"){
				$this.siblings(".snippet_view_append").remove();
				$this.parents(".snippet_presentation").append(data);
			}else{
				$this.parents(".documents_appends_box").html(data);	
			}	
		}
	});
}

$(document).on("click", ".delete_append", function(){
	var $this = $(this);
	var append_id = $this.attr("data-info").split(";")[1];
	var presentation = $this.attr("data-info").split(";")[0];
		
	$.ajax({
		type: "DELETE",
		url: "/"+$("#locale").val()+"/contents/"+$("form").attr("action").split("/")[3]+"/deleteAppend",
		dataType: "json",
		data: {append_id: append_id}
	})
	.done(function(){
		if (presentation == "Snippet"){
			$(".snippet_view_append").remove();
			$(".snippet_presentation").html("<label for='snippet_Snippet'>Snippet</label><input class='append_snippet_url_input focusable' id='snippet_url' name='snippet_url' placeholder='Introduce aquí o teu iframe' style='background-color: #eee' type='text'>");
		}else{
			$this.parents(".documents_appends_box").remove();	
		}
	});
});

$(document).on("change", ".append_snippet_url_input", function(){
	var $this = $(this);
	var type;
	var new_file;
	
	if($this.val().search("<iframe") != -1){
		var x = $($this.val());
		x = x.attr({
			width: 426,
			height: 216,
		});
		
		data = new FormData();
		data.append("contenido", x.prop('outerHTML'));
		data.append("campo", "snippet");
		data.append("type", "Presentation");
		
		if ($(".snippet_view_append").size() != 0){
			var append_id = $this.siblings(".snippet_view_append").attr("data-id");
			data.append("append_id", append_id);
			data.append("new", false);
			type = "Snippet";
			file = false;	
		}else{
			data.append("new", true);
			type = "Snippet";
			file = true;
		}
		
		send_append_ajax($this, data, file, type);
	}
});