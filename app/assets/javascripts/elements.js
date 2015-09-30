// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

/*************************************************************************/
/* JavaScript para iniciar la colocacion de las record_cards en el index */
/*************************************************************************/
$(document).ready(function() {
	
	var container = $('.content');
	container.imagesLoaded(function() {
		container.masonry({
			columnWidth : 1,
			itemSelector : '.cards'
		}).fadeIn();
	});
	
	$("#content_container").css("margin-bottom", $(".footer").height() + 3);
	if ($(document).width() < 1024) {
		$("#nav_bar, #header_top, #section_header, #content_container").addClass("medium_window");
	} else {
		$("#nav_bar, #header_top").addClass("large_window");
	}

	jqte_inizialitor();
	
	/*******     INICIALIZAMOS EL SORTABLE PARA ORDENAR LOS BFTI     *******/
	$(".data_box_bfti").sortable({
		cursor: "move",
		placeholder: "sortable_placeholder",
		revert: true,
		update: function(event, ui){
			var data_ajax = {};
			if($(ui.item[0]).prev().attr("data-position") == undefined){
				data_ajax["position"] = $(ui.item[0]).next().attr("data-position");
			}else{
				data_ajax["position"] = $(ui.item[0]).prev().attr("data-position");
			}
			data_ajax["box_id"] = $(ui.item[0]).parent("ul").attr("data-box_id");
			data_ajax["data_box_id"] = $(ui.item[0]).attr("data-bfti_id");
			$.ajax({
				url: $(this).parents("form").attr("action")+"/sort/bfti",
				type: "POST",
				dataType: "json",
				data: data_ajax
			}).done(function(data){
				for(i=0; i < data.length; i++){
					console.log($(".itemize_li[data-position=\""+data[i].id.toString()+"\"]"));
					$(".itemize_li[data-bfti_id='"+data[i].id.toString()+"']").attr("data-position",data[i].position.toString());
				}
			});
		}
	});
	
});

function jqte_inizialitor() {
	$("textarea").jqte();
	if (($("#show_mode").attr("data-mode") == "1")){
		$(".jqte_toolbar").hide();
		$(".jqte_editor").attr("contenteditable", false);
	}

}

/****************************************************************/
/*******     FUNCION PARA ENCOGER Y ESTIRAR EL FOOTER     *******/
/****************************************************************/

$(document).on("click", ".expand_footer, .contract_footer", function() {
	if ($(".footer").css("height") == "38px") {
		$(".footer").animate({
			height : "115px"
		});
		$(".expand_footer, .contract_footer").toggleClass("invisible");
	} else {
		$(".footer").animate({
			height : "38px"
		});
		$(".expand_footer, .contract_footer").toggleClass("invisible");
	}
});

/*******************************************************************************************/
/*******     FUNCION PARA MOSTRAR Y OCULTAR EL TEXTO DE LOS BOTONES Y EL BUSCADOR    *******/
/*******************************************************************************************/
$(document).on("click", ".show_hide_text", function() {
	ajax_load_bars("text");
});

$(document).on("click", ".show_filter_menu", function(){
	ajax_load_bars("filter");
});

function ajax_load_bars(type){
	if (type == "text"){
		$(".show_hide_text.ocultar, .show_hide_text.mostrar, .action_icon_container span").toggleClass("invisible");
	}else{
		$(".filter_bar").toggleClass("invisible");
		/*$(".filter_bar .action_search").toggleClass("invisible");*/
	}
	
	if ($(".show_hide_text .ocultar").hasClass("invisible")) {
	//Si la clase ocultar tiene tb la clase invisible, es que el texto está oculto, asi que hacemos mas pequeña la barra
		
		if (type == "text"){ /* si pinchamos para ver los textos de la sidebar */
			if($("#content_container").hasClass("content_show")){
				$(".show_navigation_menu").animate({
					"margin-left" : "64px"
				});
				
				$("#section_header").animate({
					"width": "64px"
				});
				$("#content_container").animate({
					"margin-left" : "284px"
				});
				$(".breadcrumb").animate({
					"margin-left" : "264px"
				});
			} else { 
				if(($(".filter_bar").val()!= undefined)){
					if ($(".filter_bar").hasClass("invisible")){
						$("#section_header, #bar").animate({
							"width" : "64px"
						});
						$("#content_container, #bar").animate({
							"margin-left" : "64px"
						});
						/*$("#content_container").animate({
							"margin-left" : "3%",
							"width" : "+=3%"
						});	*/
						//$(".filter_bar .action_search").toggleClass("invisible");
					}else{
						$(".filter_bar").animate({
							"left" : "64px"
						});
						$("#section_header, #bar").animate({
							"width" : "264px"
						});
						$("#content_container, #bar").animate({
							"margin-left" : "284px"
						});
						/*$("#content_container").animate({
							"margin-left" : "3%",
							"width" : "+=10%"
						});*/
					}
					/*$(".filter_bar").addClass("invisible");*/	
				}else{
					/*$("#content_container").animate({
						"margin-left" : "3%",
						"width" : "+=4%"
					});*/
					$("#section_header, #bar").animate({
						"width" : "64px"
					});
					$("#content_container, #bar").animate({
						"margin-left" : "64px"
					});
				}
			}
			

		}else{ /* si pinchamos para mostrar/ocultar la barra de filtrado */
			if ($(".filter_bar").val() != undefined){
				if ($(".filter_bar").hasClass("invisible")){
					$("#section_header, #bar").animate({
						"width" : "64px"
					});
					$("#content_container, #bar").animate({
						"margin-left" : "64px"
					});
					/*$("#content_container").animate({
						"margin-left" : "3%",
						"width" : "+=4%"
					});	*/
					//$(".filter_bar .action_search").toggleClass("invisible");
				}else{
					$(".filter_bar").animate({
						"left" : "64px"
					});
					$("#section_header, #bar").animate({
						"width" : "264px"
					});
					$("#content_container, #bar").animate({
						"margin-left" : "284px"
					});
					//$(".filter_bar .action_search").toggleClass("invisible");
					/*$("#content_container").animate({
						"margin-left" : "10.1%",
						"width" : "-=4%"
					});*/
					
				}
			}else{
				/*$("#content_container").animate({
					"margin-left" : "3%",
					"width" : "-=4%"
				});*/
				$("#section_header, #bar").animate({
					"width" : "64px"
				});
				$("#content_container, #bar").animate({
					"margin-left" : "64px"
				});
			}
			
		}

	} else { //si los textos de la primera sidebar están visibles
		if (type == "text"){ /* si pinchamos en los textos */
			
			if($("#content_container").hasClass("content_show")){
				$(".show_navigation_menu").animate({
					"margin-left" : "100px"
				});
				
				$("#section_header").animate({
					"width": "100px"
				});
				
				$("#content_container").animate({
					"margin-left" : "320px"
				});
				$(".breadcrumb").animate({
					"margin-left" : "300px"
				});
			} else {
				if ($(".filter_bar").val() != undefined){
					if ($(".filter_bar").hasClass("invisible")){
						/*$("#content_container").animate({
							"margin-left" : "7%",
							"width" : "-=3%"
						});	*/
						/*$(".filter_bar .action_search").toggleClass("invisible");*/
						$("#section_header, #bar").animate({
							"width" : "100px"
						});
						$("#content_container, #bar").animate({
							"margin-left" : "100px"
						});
					}else{
						$(".filter_bar").animate({
							"left" : "100px"
						});
						/*$("#content_container").animate({
							"margin-left" : "7%",
							"width" : "-=1%"
						});*/
						$("#section_header, #bar").animate({
							"width" : "300px"
						});
						$("#content_container, #bar").animate({
							"margin-left" : "320px"
						});
					}	
					/*$(".filter_bar").addClass("invisible");	*/
				}else{
					/*$("#content_container").animate({
						"margin-left" : "7%",
						"width" : "-=4%"
					});*/
					$("#section_header, #bar").animate({
						"width" : "100px"
					});
					$("#content_container, #bar").animate({
						"margin-left" : "100px"
					});
				}
			}
			
		}else{ /* si pinchamos para mostrar / ocultar filtrado */
			if ($(".filter_bar").hasClass("invisible")){
				/*$("#content_container").animate({
					"margin-left" : "35px",
					"width" : "200px"
				});	*/
				//$(".filter_bar .action_search").toggleClass("invisible");
				$("#section_header, #bar").animate({
					"width" : "100px"
				});
				$("#content_container, #bar").animate({
					"margin-left" : "100px"
				});
			}else{
				$(".filter_bar").animate({
					"left" : "100px"
				});
				/*$("#content_container").animate({
					"margin-left" : "14.1%",
					"width" : "-=7%"
				});*/
				//$(".filter_bar .action_search").toggleClass("invisible");
				$("#section_header, #bar").animate({
						"width" : "300px"
					});
					$("#content_container, #bar").animate({
						"margin-left" : "320px"
					});
			}
			
		}
	}
}

/**************************************************/
/*******     FUNCIONES PARA LOS SCROLL      *******/
/**************************************************/
$(document).scroll(function() {
	var url = $("nav.pagination").last().find("span.page.current").next("span.page").children("a").attr("href");
	var popup = false;
	if ($(window).scrollTop() + $(window).height() == $(document).height()) {
		ajax_scroll(url, popup);
	}
});

function ajax_scroll(url, popup) {
	if (url != undefined) {
		var type = "GET";
		var filters = url.split("?")[0].split("/")[3];
		if(filters == "filter"){
			type = "POST";
		}
		jQuery.ajax({
			type : type,
			dataType : "html",
			url : url
		}).done(function(data) {
			if (popup) {
				var elements = $($.parseHTML(data)).filter("#marco_popup").children().filter("#content_popup").children();
				$("#content_popup").append(elements).imagesLoaded(function(){
						$("#content_popup").masonry('appended', elements, 'reload');
					});
			} else {
				if ($("#content_container").children().filter('#board_element_list').length) {
					var elements = $($.parseHTML(data)).filter("#board_element_list").children();
					$("#board_element_list").append(elements).imagesLoaded(function(){
						$("#board_element_list").masonry('appended', elements, 'reload');
					});
				} else {
					var elements = $($.parseHTML(data)).filter('#global_container').children("#content_container").children();
					$(".content").append(elements).imagesLoaded(function(){
						$(".content").masonry('appended', elements, 'reload');
					});
				}
				//console.log($("#content_container input").attr("data-scroll"));
				//$("body").css('overflow', 'visible');/* Se vuelve a activar la scrollbar del documento completo */
				//$(window).scrollTop(parseInt($("#content_container input").attr("data-scroll")));
				//console.log("aquí! SI???????????????????????????????????");
			}
		});
	}
}

//Función para la activación y desactivación de las scrollbars con popups
function active_scrollbars_popup(){
	$("body").css('overflow', 'hidden'); //Se desactiva la scrollbar del documento
	$("#content_popup").scroll(function() { //Se activa la scrollbar del popup
		size_content = parseFloat($("#content_popup").attr('style').split(" ")[3].split("px")[0]);
		var url = $("nav.pagination").last().find("span.page.current").next("span.page").children("a").attr("href");
		var popup = true;
		var tempScroll = undefined;
		if (($("#content_popup").scrollTop() + $("#content_popup").innerHeight() >= size_content ) && (url != undefined)) {
			ajax_scroll(url, popup);
		}
	});		
}

/**************************************************/
/*******     FUNCIONES PARA LOS POPUPS!     *******/
/**************************************************/

//Función que carga con data el contenido del popup
function load_data_in_popup(data){
	$("#popup_background").html(data);
	$("#background_overlay").show();
	$("#marco_popup").show();
	var container = $('#content_popup');
	container.imagesLoaded(function() {
		container.masonry({
			columnWidth : 2,
			itemSelector : '.cards'
		});
	});
}

$(document).on("click", "#download_file", function(){
	$("#background_overlay, #marco_popup").hide();
});

// Abre el popup normal y abre el popup distinguiendo entre todos los elementos y solo los míos
$(document).on("click", ".abre_popup", function(event) {
	console.log("Estoy en el abre popup");
	var $this= $(this);
	var controller = $this.attr("value");
	var parent_type; // Indica el tipo del elemento padre
	var parent_id; // Indica el identificador del elemento padre
	var element_id; //Solo para boards: indica el identificador del elemento que se queire colgar en un tablero
	var element_type; //Solo para boards: indica el tipo de elemento que se queire colgar en un tablero
	var data_ajax={popup: true, page: null};
	var url = "/" + $("#locale").val() + "/" + controller;
	var data_info_splitted;
	var data_owner;
	var show_mode;
	var use_resource = false;
	var use_activity = false;
	var use_element = false;
	var continuar = true;
	var continua_javi = true;
	 
	if ($this.attr("data-info") != undefined){
		data_info_splitted = $this.attr("data-info").split(";");		
	}
	if ($this.hasClass("filter_on")){//En este caso estamos filtrando en el popup, una vez abierto
		data_owner = $this.attr("data-owner");
		data_info_splitted = ($("#content_popup input").attr("data-parent_type")+";"+$("#content_popup input").attr("data-parent_id")).split(";");
		data_ajax = {popup: true, owner: data_owner, page: null};
	}
	
	if ($this.hasClass("add_resource_button")){
		use_resource = true;
	}
	
	if ($this.hasClass("add_activity_button")){
		use_activity = true;
	}
	
	show_mode = $this.siblings("input").attr("data-view");
	console.log($this.siblings("input").attr("data-view"));
	console.log(show_mode);
	var tempScrollTop = $(window).scrollTop();
	console.log(controller);
	console.log(use_resource);
	console.log(use_activity);
	switch (controller){
		case "resources":
			parent_type = data_info_splitted[0];
			parent_id = data_info_splitted[1];
		break;
		
		case "applications":
		case "devices":
		case "events":
		case "collaborators":
		case "contents":
			parent_type = data_info_splitted[0];
			parent_id = data_info_splitted[1];
		break;
		
		case "activities":
			if (use_resource == true){
				element_type = data_info_splitted[0];
				element_id = data_info_splitted[1];
				data_ajax = {popup: true, use_element: true};
			}else{
				parent_type = data_info_splitted[0];
				parent_id = data_info_splitted[1];	
			}
		break;
		
		case "lesson_plans":
			if ((use_resource == true) || (use_activity == true)){
				element_type = data_info_splitted[0];
				element_id = data_info_splitted[1];
				data_ajax = {popup: true, use_element: true};
			}else{
				parent_type = data_info_splitted[0];
				parent_id = data_info_splitted[1];
				data_ajax = {popup: true, parent_id: parent_id};		
			}
		break;
		
		case "experiences":
		if ((use_resource == true) || (use_activity == true)){
			element_type = data_info_splitted[0];
			element_id = data_info_splitted[1];
			data_ajax = {popup: true, use_element: true};
			console.log(element_type);
			console.log(element_id);
		}else{
		//	parent_type = data_info_splitted[0];
			//parent_id = data_info_splitted[1];
			//data_ajax = {popup: true, parent_id: parent_id};		
		
		parent_type = data_info_splitted[0];
		parent_id = data_info_splitted[1];
		var borrar = false;
		var drive = false;
		var reloj = false;
		switch($this.find("img").attr("value")) {

		case "export":
			var url = "/" + $("#locale").val() + "/" + "operations/" + $this.find("img").attr("data_id");
			var data_box = false;
			break;

		case "download_pdf":
			if($this.hasClass("student")){
				data_ajax["student"] = true;
			}else{
				data_ajax["student"] = false;
			}
			reloj = true;
			var url = "/" + $("#locale").val() + "/" + "operations/download_pdf/";
			var data_box = false;
			$("#marco_popup").css("display", "none");
			$(".loading_icon").toggleClass("invisible");
			break;

		case "up_experience_pdf":
			var url = "/" + $("#locale").val() + "/" + "accounts/index/pdf";
			var data_box = false;
			console.log($this);
			if($this.hasClass("student")){
				data_ajax["student"] = true;
			}else{
				data_ajax["student"] = false;
			}
			break;

		case "up_evidences_pre":
			var url = "/" + $("#locale").val() + "/" + "operations/up_evidences_pre";
			var data_box = false;
			reloj = true;
			$("#marco_popup").css("display", "none");
			$(".loading_icon").toggleClass("invisible");
			break;

		case "up_evidences":
			var url = "/" + $("#locale").val() + "/" + "accounts/index/files";
			var ids = "";
			$(".check_box_evidences_download").each(function() {
				if ($(this).prop('checked')) {
					if (ids != "") {
						ids = ids + ",";
					}
					ids = ids + $(this).val();
				}
			});
			if (ids != "") {
				$('body').data('ids', ids);
			} else {
				alert("Ninguna observación seleccionada. Por favor, seleccione al menos una.");
				continua = false;
			}
			break;

		case "download_evidences_pre":
			var url = "/" + $("#locale").val() + "/operations/download_evidences_pre";
			reloj = true;
			$("#marco_popup").css("display", "none");
			$(".loading_icon").toggleClass("invisible");
			break;

		case "edit_image":
		console.log($this);
			var url = "/" + $("#locale").val() + "/" + "images/edit_image/" + $this.find("img").attr("data_id") + "&" + $this.find("img").attr("operation");
			var data_box = false;
			photo_editor = true;
			reloj = true;
			$("#marco_popup").css("display", "none");
			$(".loading_icon").toggleClass("invisible");
			break;

		case "adjust_image":
			var url = "/" + $("#locale").val() + "/" + "images/adjust_image/" + $this.find("img").attr("type");
			var data_box = false;
			reloj = true;
			$("#marco_popup").css("display", "none");
			$(".loading_icon").toggleClass("invisible");
			break;

		case "undo_changes":
			var url = "/" + $("#locale").val() + "/" + "images/undo_changes";
			var data_box = false;
			reloj = true;
			$("#marco_popup").css("display", "none");
			$(".loading_icon").toggleClass("invisible");
			break;

		case "recover_image":
			var url = "/" + $("#locale").val() + "/" + "images/recover_image";
			var data_box = false;
			reloj = true;
			$("#marco_popup").css("display", "none");
			$(".loading_icon").toggleClass("invisible");
			break;

		case "save_image":
			var url = "/" + $("#locale").val() + "/" + "images/save_image";
			var data_box = false;
			reloj = true;
			$("#marco_popup").css("display", "none");
			$(".loading_icon").toggleClass("invisible");
			break;

		case "out":
			var url = "/" + $("#locale").val() + "/" + "images/out";
			var data_box = false;
			reloj = true;
			$("#marco_popup").css("display", "none");
			$(".loading_icon").toggleClass("invisible");
			break;

		case "select_account":
			if ($this.find("img").attr("type") == "pdf") {
				var url = "/" + $("#locale").val() + "/" + "operations/save_experience_pdf/" + $this.find("img").attr("data_id");
			} else {
				console.log("entro en el else");
				var url = "/" + $("#locale").val() + "/" + "operations/up_evidences/" + $this.find("img").attr("data_id");
				console.log($('body').data('ids'));
				data_ajax = {
					popup : true,
					images_id : $('body').data('ids'),
					page : null
				};
			}
			if($this.hasClass("student")){
				data_ajax["student"] = true;
			}else{
				data_ajax["student"] = false;
			}
			var data_box = false;
			reloj = true;
			drive = true;
			$("#marco_popup").css("display", "none");
			$(".loading_icon").toggleClass("invisible");
			console.log("fin de select_account");
			break;

		case "delete_account":
			var url = "/" + $("#locale").val() + "/" + "accounts/" + $this.find("img").attr("data_id");
			borrar = true;
			var data_box = false;
			break;

		case "new_account":
			console.log("NEW ACCOUNT");
			var url = "/" + $("#locale").val() + "/" + "/accounts/new";
			window.open(url);
			var data_box = false;
			break;

		case "download_evidences":
			reloj = true;
			var url = "/" + $("#locale").val() + "/" + "operations/download_evidences";
			var ids = "";
			$(".check_box_evidences_download").each(function() {
				if ($(this).prop('checked')) {
					if (ids != "") {
						ids = ids + ",";
					}
					ids = ids + $(this).val();
				}
			});
			if (ids != "") {
				$("#marco_popup").css("display", "none");
				$(".loading_icon").toggleClass("invisible");

				data_ajax = {
					popup : true,
					images_id : ids,
					page : null
				};
			} else {
				alert("Ninguna observación seleccionada. Por favor, seleccione al menos una.");
				continua = false;
			}
			break;

		}
		
	}
		break;
		
		case "boards":
			element_type = data_info_splitted[0];
			element_id = data_info_splitted[1];
		break;
		
		case "activity_templates":
		case "lesson_plan_templates":
			if(data_info_splitted == null){
				data_ajax = {popup: true, parent_id: 0, page: null};
			}else{
				parent_type = data_info_splitted[0];
				parent_id = data_info_splitted[1];	
			}
		break;
		
		case "technical_settings":
		case "educational_settings":
			switch($("form").attr("action").split("/")[1]) {//Si hay un setting agregado, avisamos al usuario que perderá la información
				case "es":
					continuar = confirm("Si continúa y agrega un nuevo perfil se perderá el actual.");
					break;
				case "gl":
					continuar = confirm("Se continúa e agrega un novo perfil perderase o actual.");
					break;
				default:
					continuar = confirm("If you continue the information will lost");

			}
			parent_type = data_info_splitted[0];
			parent_id = data_info_splitted[1];
		break;
		
		default:
			console.log("La has liado, pollito");		
	}
	
	var tipo = "GET";
	if (borrar) {
		tipo = "DELETE";
	}
	
	if (continuar && continua_javi){
		jQuery.ajax({
			type : tipo,
			dataType : "html",
			url : url,
			data : data_ajax
		}).done(function(data) {
			
			if (reloj==true) {
				$(".loading_icon").toggleClass("invisible");
				$("#background_overlay").hide();
				reloj = false;
				if (drive == true){
					alert("Exportación realizada correctamente");
					drive = false;
				}
			}
			
			if ($("#content_container input").size() != 0){
				$("#content_container input")[0].setAttribute("data-scroll", tempScrollTop);	
			}
			if(controller == "experiences" && $this.find("img").attr("value") == "delete_account"){
				$this.parents(".entrada").remove();
			}else{
				load_data_in_popup(data);
			}
			if ((controller != "boards") && (use_resource != true) && (use_activity != true)){
				if ($this.hasClass("filter_on")){
					$("#content_popup").prepend("<input type='hidden' data-parent_type='" + parent_type + "' data-parent_id='" + parent_id + "' data-owner='" + data_owner + "'>");
				}else{// El filtrado no está activado en el popup
					$("#content_popup").prepend("<input type='hidden' data-parent_type='" + parent_type + "' data-parent_id='" + parent_id + "' data-show_mode='"+show_mode+"'>");	
				}	
			}else{
				$("#content_popup").prepend("<input type='hidden' data-element_type='" + element_type + "' data-element_id='" + element_id + "'>");
			}
			if (controller != "experiences") {
				active_scrollbars_popup();
			}
		});
	}
});


//Carga en el popup los elementos que se corresponden con el texto que se ha buscado
$(document).on("change", ".search_in_popup", function() {

	var $this = $(this);
	var text_search = $("#search").val();
	//Componenetes del hidden del popup
	var parent_type = $("#content_popup").children("input").attr('data-parent_type');
	var parent_id = $("#content_popup").children("input").attr('data-parent_id');
	var data_owner = $("#content_popup").children("input").attr('data-owner');
	var data_show_mode = $("#content_popup").children("input").attr('data-show_mode');
	//Tipo de elementos del popup sobre los que se va a filtrar
	var type = $("#header_popup").attr("data-type");
	
	var ajax_data = {
		search : text_search,
		owner : data_owner,
		popup : true
	};
	var url = "/" + $("#locale").val() + "/" + type + "/search";

	jQuery.ajax({
		type : "GET",
		url : url,
		dataType : "html",
		data : ajax_data,
	}).done(function(data) {
		load_data_in_popup(data);
		$("#content_popup").prepend("<input type='hidden' data-parent_type='" + parent_type + "' data-parent_id='" + parent_id + "' data-show_mode='" + data_show_mode + "' data-owner='" + data_owner + "'>");
		active_scrollbars_popup();
	});
});


//Accedemos dentro del popup a ver el contenido de una record_card
$(document).on("click", ".show_whole_view_popup", function() {
	
	var $this = $(this);
	var back = "false";
	if ($this.hasClass("with_back")){//En este caso visualizamos el contenido a partir de una lista ya visualizada en un popup
		var hidden_popup = $("#content_popup").children("input");
		back = $("#header_popup").children(".abre_popup").attr("value"); //Tipo de elementos que contiene el popup antes de la visualización de uno en concreto, para saber a donde volver
	}else{// En otro caso estamos visualizando el contenido de una miniview
		var tempScrollTop = $(window).scrollTop();
	}
	var data_info_splitted = $this.attr("data-info").split(";");
	var controller = $this.attr("value");
	if (controller == "lessonplans"){
		controller = "lesson_plans";
	}
	var url = "/" + $("#locale").val() + "/" + controller + "/" + data_info_splitted[1];
	var popup = true;

	jQuery.ajax({
		type : "GET",
		dataType : "html",
		url : url,
		data : {
			popup : true,
			back : back
		}
	}).done(function(data) {
		load_data_in_popup(data);
		if (back != "false") {
			$("#content_popup").prepend(hidden_popup);	
		}else{
			if ($("#content_container input").size() != 0){
				$("#content_container input")[0].setAttribute("data-scroll", tempScrollTop);	
			} 
		}	
		$(".content_show.in_popup textarea").jqte();
		$(".content_show.in_popup .jqte_toolbar").hide();
		$(".content_show.in_popup .jqte_editor").attr("contenteditable", false);
		active_scrollbars_popup();		
	});
});


// En el popup, visualizando el contenido de una record card, tenemos que volver a la vista anterior (sin mantener el search)
$(document).on("click", ".back_popup", function() {
	
	var $this = $(this);
	var controller = $this.attr("data-info");
	var hidden_popup = $("#content_popup").children("input");
	var owner = hidden_popup.attr("data-owner"); 
	var data_ajax={popup: true, owner: owner};
	
	var type = $(this).attr("data-type");
	var url = "/" + $("#locale").val() + "/" + controller;
	
	jQuery.ajax({
		type : "GET",
		dataType : "html",
		url : url,
		data : data_ajax
	}).done(function(data) {
		load_data_in_popup(data);
		$("#content_popup").prepend(hidden_popup);		
		active_scrollbars_popup();
	});

});


//Selector de recursos en el popup
$(document).on("change", "#selector_resources_popup", function() {
	var controller = this.options[this.selectedIndex].value;
	var $this = $(this);
	var url = "/" + $("#locale").val() + "/" + controller;
	var hidden_popup = $("#content_popup").children("input");
	
	jQuery.ajax({
		type : "GET",
		dataType : "html",
		url : url,
		data : { popup : true }
	}).done(function(data) {
		load_data_in_popup(data);
		$("#content_popup").prepend(hidden_popup);
		active_scrollbars_popup();
	});
});


// Función para cerrar el popup
$(document).on("click", ".close_popup", function() {
	$("#marco_popup").hide();
	$("#background_overlay").hide();
	$("body").css('overflow', 'visible');/* Se vuelve a activar la scrollbar del documento completo */
	$(window).scrollTop(parseInt($("#content_container input").attr("data-scroll")));
});


/***********************************************************************************************/

/*************************************/

/*************************************/
$(document).on("focus", ".updateable.focusable", function() {
	$(this).css('border-color', '').css('box-shadow', '5px 5px 5px');
});

$(document).on("keypress", ".updateable, .jqte_editor", function() {
	$("#cambiosguardados").slideUp(0);
	$("#cambiossinguardar").slideDown(500);
});

$(document).on("blur", ".updateable", function() {
	//$("#cambiossinguardar").slideUp(500);
	$(this).css('border-color', '').css('box-shadow', '0px 0px 0px');
});

$(document).on("blur", ".jqte_editor", function(event) {
	var url = $(this).closest("form").attr("action");
	var field = "";
	var data_value = "";
	if ($(this).closest(".box_container").length) {//SI ENTRA AQUI, ES QUE TENEMOS QUE ACTUALIZAR UN DATABOX
		if ($(this).siblings($(".jqte_source")).find("textarea").html() != $(this).html()) {
			field = $(this).closest(".jqte").find(".updateable").attr('name').split("[")[1].replace("]", "");
			var parent_element = false;
			if ($(this).parents("form").find("#experience").attr("data-parent") == "experiences") {
				parent_element = true;
			}
			data_value = {
				campo : field,
				contenido : $(this).html(),
				data_box : $(this).siblings(".jqte_source").find(".updateable").attr("id").split("_")[2],
				parent_element : parent_element
			};
			update_field_ajax(data_value, url);
		}
	} else {//SI ENTRO AQUI ESTOY EN EL TEXT EDITOR DE LA CABECERA
		if ($(this).html() != $(this).siblings(".jqte_source").children("textarea").text()) {
			field = $(this).closest(".jqte").find(".updateable").attr('name').split("[")[1].replace("]", "");
			var parent_element = false;
			if ($(this).parents("form").find("#experience").attr("data-parent") == "experiences") {
				parent_element = true;
			}
			data_value = {
				campo : field,
				contenido : $(this).html(),
				parent_element : parent_element
			};
			update_field_ajax(data_value, url, null, $(this));
		}
	}
});

//Aquí se entra cuando elegimos private/public en cada element o genérico/específico o autor
$(document).on("change", ".updateable", function() {
	var content = $(this).val();
	var url = $(this).closest("form").attr("action");
	var field = $(this).attr("name").split("[")[1].replace("]", "");
	var parent_element = false;
	
	console.log(content);
	console.log(url);
	console.log(field);

	switch($(this).attr("data_type")) {
		case "data_box":
			var data_value = {
				campo : field,
				contenido : content,
				data_box : $(this).attr('id').split("_")[1]
			};
			update_field_ajax(data_value, url);
			break;
		case "free_text":
			var data_value = {
				campo : field,
				contenido : content,
				data_box : $(this).siblings(".delete_data_box_item").attr('id')
			};
			update_field_ajax(data_value, url);
			break;
		default:
			if ($(this).parents("form").find("#experience").attr("data-parent") == "experiences") {
				parent_element = true;
			}
			if (field == "private" || field == "abstract") {
				var change_icon = $(this);
				console.log(change_icon);
			}
			var data_value = {
				campo : field,
				contenido : content,
				parent_element : parent_element
			};
			update_field_ajax(data_value, url, change_icon, $(this));
	}
});

function update_field_ajax(data_value, url, change_icon, $this) {
	jQuery.ajax({
		type : "PATCH",
		url : url,
		dataType : "json",
		data : data_value,
	}).done(function(data) {
		/* Agregar aqui lo que sea necesario cuando la función retorne la respuesta */
		$("#cambiossinguardar").slideUp(0);
		$("#cambiosguardados").slideDown(400);
		$(this).css('border-color', '').css('box-shadow', '0px 0px 0px');
		console.log(data_value["campo"]);
		switch(data_value["campo"]){
			case "private":
			case "abstract":
				if (data_value["contenido"] == true) {
					change_icon.parents(".privacy").children().first().children(".private_icon").toggleClass("public");
				} else {
					change_icon.parents(".privacy").children().first().children(".private_icon").toggleClass("public");
				}
				break;
			case "state":
				$(".course_state_color").attr("class", "course_state_color "+data_value["contenido"]);
				break;
			case "title":
				$this.parents("form").find(".attribution_title").text(data_value["contenido"]);
				$this.attr("value", data_value["contenido"]);
			break;
			case "language":
				var user_id = window.location.href.split("/users/")[1];
				var new_location = "/" + data_value["contenido"] + "/users/" +user_id;
				window.location.assign(new_location);
			break;
			default:
			break;
		}

		if ($this.hasClass("jqte_editor")) {
			$('.jqte_editor').siblings(".jqte_source").find("textarea").text($('jqte_editor').html());
		}
		if ($this.parents(".element_contained").length != 0 && data_value["campo"] == "title") {
			$("a[href='#" + $this.parents(".element_contained").prev(".activity_number").find("a").attr("name") + "']").find("span").text(data_value["contenido"]);
		}
		
	});
}

$(document).on("click",".known_CC_license", function(){
	var $this = $(this);
	var url = $(this).closest("form").attr("action");
	var field = $(this).attr("name").split("[")[1].replace("]", "");
	var content = $(this).val();
	var condition = $this.parents("form").find(".active_condition").prop("checked"); //Elegimos la licencia CC0
	var right_id = 	$this.parents("form").find(".licenses_image").attr("data_value");
		
	var data_value = {
		campo : field,
		contenido : content,
		right_id : right_id
		};
	
	jQuery.ajax({
		type: "PATCH",
		url: url,
		dataType: "json",
		data: data_value,
	}).done(function(data){ 
		if ($this.val() == "true"){
			$this.parents("form").find(".licenses_image").attr({"src": data.license_icon,
				"data_value": data.right_id
				});
			$this.parents("form").find(".attribution_license").text(data.modified_license_name);
			$this.parents("form").find(".attribution_license").attr("href",data.url_license_modified);
			$this.parents("form").find(".show_license").toggleClass("invisible");
			$this.parents("form").find(".show_authorization").toggleClass("invisible");
			$this.parents("form").find("#LicenciasBoxFull, #LicenciasBoxLeft").toggleClass("invisible");
			if (data.right_id == 7){
				$this.parents("form").find(".active_select").prop("disabled", true);
			}
			else{
				$this.parents("form").find(".active_select").prop("disabled", false);
			}
			generar_licencia(data.right_id, $this); /* función que genera las opciones correctas en las preguntas commercial y derivative*/
		}
		else{ //no tiene licencia CC conocida
			$this.parents("form").find(".licenses_image").attr({"src": data.license_icon,
				"alt": "",
				"data_value": data.right_id
				});
			$this.parents("form").find(".attribution_license").attr("href",data.url_license_modified);
			$this.parents("form").find(".show_license").toggleClass("invisible");
			$this.parents("form").find(".show_authorization").toggleClass("invisible");
			$this.parents("form").find("#LicenciasBoxFull, #LicenciasBoxLeft").toggleClass("invisible");
			
			switch($("form").attr("action").split("/")[1]){ /*así cogemos solo el idioma de la url, ex: /es/activities/filter*/
			case "es":
				$this.parents("form").find(".attribution_license").text("desconocida");
			break;
			case "gl":
				$this.parents("form").find(".attribution_license").text("descoñecida");
			break;
			case "en":
				$this.parents("form").find(".attribution_license").text("unknown");
			break;
			case "pt":
				$this.parents("form").find(".attribution_license").text("desconhecida");
			break;
			}
		}
	});
});

//Función que cambia los valores de las preguntas de la licencia para que sean coherentes las opciones con la licencia correspondiente.
function generar_licencia (right_id, $this){
	
	var commercial;
	var derivative;
	
	switch (right_id){
		case 1: //CC-BY
			commercial = 1;
			derivative = 1;
		break;
		case 2: //CC-BY-SA
			commercial = 1;
			derivative = 2;
		break;
		case 3: //CC-BY-NC
			commercial = 0;
			derivative = 1;
		break;
		case 4: //CC-BY-NC-SA
			commercial = 0;
			derivative = 2;
		break;		
		case 5: //CC-BY-ND
			commercial = 1;
			derivative = 0;
		break;
		case 6: //CC-BY-NC-ND
			commercial = 0;
			derivative = 0;
		break;
	}
	if (right_id != 7){
		$this.parents("form").find(".derivative select").val(derivative);
		$this.parents("form").find(".commercial select").val(commercial);
		if ($this.parents("form").find(".active_condition").prop("checked") == true){
			$this.parents("form").find(".active_condition").prop("checked", "false");
		}
	}
}

//Function for copyrighted material -> License: Some Rights Granted (SRG)
$(document).on("click",".authorization_license", function(){
	var $this = $(this);
	var url = $(this).closest("form").attr("action");
	var field = $(this).attr("name").split("[")[1].replace("]", "");
	var content = $(this).val();
	var data_value = {
		campo : field,
		contenido : content,
		};
	jQuery.ajax({
		type: "PATCH",
		url: url,
		dataType: "json",
		data: data_value,
	}).done(function(data){ 
	if ($this.val() == "true"){
		$this.parents("form").find(".licenses_image").attr({
			"src": data.license_icon,
			"data_value": data.right_id
			});
		$this.parents("form").find(".attribution_license").attr("href",data.url_license_modified);
		switch($("form").attr("action").split("/")[1]){ /*así cogemos solo el idioma de la url, ex: /es/activities/filter*/
			case "es":
				$this.parents("form").find(".attribution_license").text("con algunos derechos autorizados");
			break;
			case "gl":
				$this.parents("form").find(".attribution_license").text("con algúns dereitos autorizados");
			break;
			case "en":
				$this.parents("form").find(".attribution_license").text("with some rights granted");;
			break;
			case "pt":
				$this.parents("form").find(".attribution_license").text("con alguns direitos autorizados");
			break;
			}
	}
	else{
		$this.parents("form").find(".licenses_image").attr({"src": data.license_icon,
				"alt": "",
				"data_value": data.right_id
				});
		$this.parents("form").find(".attribution_license").attr("href",data.url_license_modified);
		
		switch($("form").attr("action").split("/")[1]){ /*así cogemos solo el idioma de la url, ex: /es/activities/filter*/
			case "es":
				$this.parents("form").find(".attribution_license").text("desconocida");
			break;
			case "gl":
				$this.parents("form").find(".attribution_license").text("descoñecida");
			break;
			case "en":
				$this.parents("form").find(".attribution_license").text("unknown");
			break;
			case "pt":
				$this.parents("form").find(".attribution_license").text("desconhecida");
			break;
		}
	}
	});
});

//Function that generates CC license
$(document).on("change", ".commercial select, .derivative select", function(){
	var source = false;
	var $this = $(this);
	var url = $(this).closest("form").attr("action");
	var commercial = $this.parents("form").find(".commercial select").val();
	var derivative = $this.parents("form").find(".derivative select").val();
	var parent = $this.parents("form").attr("action").split("/")[3];
	var vector_licenses = $this.parents("form").find(".vector_licenses").val();
	var commercial_anterior = $this.parents("form").find(".vector_licenses").attr("data-commercial");
	var derivative_anterior = $this.parents("form").find(".vector_licenses").attr("data-derivative");
	var condition_anterior = $this.parents("form").find(".vector_licenses").attr("data-condition");
	
	var data_value= { campo: "licenses", commercial: commercial, derivative: derivative, condition: "1",parent_id: parent, vector_licenses: vector_licenses, source: source};
	jQuery.ajax({
		type: "PATCH",
		url: url,
		dataType: "json",
		data: data_value,
	}).done(function(data){ 
		/* Agregar aqui lo que sea necesario cuando la función retorne la respuesta */
		$this.parents("form").find(".licenses_image").attr({"src": data.license_icon,
				"alt": "",
				"data_value": data.right_id
				});
		$this.parents("form").find(".attribution_license").attr("href",data.url_license_modified);
		$this.parents("form").find(".attribution_license").text(data.modified_license_name);
		
		
		if($("form.edit_lesson_plan").hasClass("edit_lesson_plan") == true){
			$("form.edit_lesson_plan").find(".vector_licenses").attr("value", data.lesson_plan_vector);
		}
		
				
		$("#cambiossinguardar").slideUp(0);
		$("#cambiosguardados").slideDown(400);
		switch (commercial){
			case "0":
			commercial = "false";
			break;
			case "1":
			commercial = "true";
		}
		var condition="0";
		if (derivative=="2"){
			condition="1";
		}
		switch (derivative){
			case "0":
			derivative = "false";
			break;
			case "1":
			case "2":
			 derivative = "true";
			break;
		}
		
		$this.parents("form").find(".vector_licenses").attr("data-commercial",commercial) ;
		$this.parents("form").find(".vector_licenses").attr("data-derivative",derivative) ;
		$this.parents("form").find(".vector_licenses").attr("data-condition",condition);
		
		
	}).fail(function(data){
		
		if (commercial_anterior && derivative_anterior && condition_anterior == "1"){
			$this.parents("form").find(".commercial select").val(commercial_anterior == "true" ? 1:0);
			$this.parents("form").find(".derivative select").val(2);
		}
		else{
			if (commercial_anterior == "true"){
				commercial_anterior="1";
			}
			else{
				commercial_anterior="0";
			}
			if (derivative_anterior == "true"){
				derivative_anterior="1";
			}
			else{
				derivative_anterior="0";
			}
			var commercial=$this.parents("form").find(".commercial select").val(commercial_anterior);
			var derivative= $this.parents("form").find(".derivative select").val(derivative_anterior);
		}
		
		
		x=jQuery.parseJSON(data.responseText);
	
		switch($("form").attr("action").split("/")[1]){ /*así cogemos solo el idioma de la url, ex: /es/activities/filter*/
			case "es":
				switch (x.x){
					case "activity_condition1":
						alert("La licencia de la actividad no es compatible con las licencias de los recursos añadidos.");
					break;
					case "activity_condition2":
						if ($("#actions").find("#share_experience").size()==1){
							alert("La licencia de la actividad no es compatible con la licencia de la experiencia.");
						}else{
							alert("La licencia de la actividad no es compatible con la licencia de la unidad didáctica.");
						}
					break;
					case "activity_condition3":
						alert("La licencia de la actividad clonada no es compatible con la licencia de la actividad original.");
					break;
					case "lessonplan_condition1":
						if ($("#actions").find("#share_experience").size()==1){
							alert("La licencia de la experiencia no es compatible con las licencias de los recursos y/o actividades añadidas.");
						}else{
							alert("La licencia de la unidad didáctica no es compatible con las licencias de los recursos y/o actividades añadidas.");
						}
					break;
					case "lessonplan_condition2":
						if ($("#actions").find("#share_experience").size()==1){
							alert("La licencia de la experiencia clonada no es compatible con la licencia del elemento original.");
						}else{
							alert("La licencia de la unidad didáctica clonada no es compatible con la licencia de la unidad didáctica original.");
						}
					break;
				}
			break;
			case "en":
				switch (x.x){
					case "activity_condition1":
						alert("The license of the activity is not compatible with the licenses of the added resources.");
					break;
					case "activity_condition2":
						if ($("#actions").find("#share_experience").size()==1){
							alert("The license of the activity is not compatible with the license of the experience.");
						}else{
							alert("The license of the activity is not compatible with the license of the lesson plan.");
						}
					break;
					case "activity_condition3":
						alert("The license of the cloned activity is not compatible with the license of the original activity.");
					break;
					case "lessonplan_condition1":
						if ($("#actions").find("#share_experience").size()==1){
							alert("The license of the experience is not compatible with the licenses of the added resources and/or activities.");
						}else{
							alert("The license of the lesson plan is not compatible with the licenses of the added resources and/or activities.");
						}
					break;
					case "lessonplan_condition2":
						if ($("#actions").find("#share_experience").size()==1){
							alert("The license of the cloned experience is not compatible with the license of the original element.");
						}else{
							alert("The license of the cloned lesson plan is not compatible with the license of the original lesson plan.");
						}
					break;
				}
			break;	
			case "gl":
				switch (x.x){
					case "activity_condition1":
						alert("A licenza da actividade non é compatible coas licenzas dos recursos engadidos.");
					break;
					case "activity_condition2":
						if ($("#actions").find("#share_experience").size()==1){
							alert("A licenza da actividade non é compatible coa licenza da experiencia.");
						}else{
							alert("A licenza da actividade non é compatible coa licenza da unidade didáctica.");
						}
					break;
					case "activity_condition3":
						alert("A licenza da actividade clonada non é compatible coa licenza da actividade orixinal.");
					break;
					case "lessonplan_condition1":
						if ($("#actions").find("#share_experience").size()==1){
							alert("A licenza da experiencia non é compatible coas licenzas dos recursos e/ou actividades engadidas.");
						}else{
							alert("A licenza da unidade didáctica non é compatible coas licenzas dos recursos e/ou actividades engadidas.");
						}
					break;
					case "lessonplan_condition2":
						if ($("#actions").find("#share_experience").size()==1){
							alert("A licenza da experiencia clonada non é compatible coa licenza do elemento orixinal.");
						}else{
							alert("A licenza da unidade didáctica clonada non é compatible coa licenza da unidade didáctica orixinal.");
						}
					break;
				}
			break;
			case "pt":
				switch (x.x){
					case "activity_condition1":
						alert("A licença da atividade não é compativel com as licenças dos recursos adicionados.");
					break;
					case "activity_condition2":
						if ($("#actions").find("#share_experience").size()==1){
							alert("A licença da atividade não é compativel com a licença da experiência.");
						}else{
							alert("A licença da atividade não é compativel com a licença do plano de aula.");
						}
					break;
					case "activity_condition3":
						alert("A licença da atividade clonada não é compativel com a licença da atividade original.");
					break;
					case "lessonplan_condition1":
						if ($("#actions").find("#share_experience").size()==1){
							alert("A licença da experiência não é compativel com as licenças dos recursos e/ou atividades adicionadas.");
						}else{
							alert("A licença do plan de aula não é compativel com as licenças dos recursos e/ou atividades adicionadas.");
						}
					break;
					case "lessonplan_condition2":
						if ($("#actions").find("#share_experience").size()==1){	
							alert("A licença da experiência não é compativel com a licença do elemento original.");
						}else{
							alert("A licença do plan de aula não é compativel com a licença do plan de aula original.");
						}
					break;
				}
			break;	
		}
	});
});

//Function that disables dropdown license list if CC0 is chosen as the license and generates the CC0 license
$(document).on("click",".active_condition",function(){
	var $this = $(this);
	var field = $this.attr("name").split("[")[2].replace("]", "");
	var url = $this.closest("form").attr("action");
	var parent = $this.parents("form").attr("action").split("/")[3];
	var vector_licenses = $this.parents("form").find(".vector_licenses").val();
	
	if ($this.parents("form").find(".active_condition").prop("checked") == true){ //Elegimos la licencia CC0
		var data_value= { campo: "licenses", commercial: "1", derivative: "1", condition: "2",parent_id: parent, vector_licenses: vector_licenses};
		$this.parents("form").find(".active_select").prop("disabled", true);
	}
	else{
		$this.parents("form").find(".active_select").prop("disabled", false);
		var commercial = $this.parents("form").find(".commercial select").val();
		var derivative = $this.parents("form").find(".derivative select").val();
		var data_value= { campo: "licenses", commercial: commercial, derivative: derivative, condition: "1", vector_licenses: vector_licenses};
	}
	console.log(data_value);
	jQuery.ajax({
		type: "PATCH",
		url: url,
		dataType: "json",
		data: data_value,
	}).done(function(data){
		$this.parents("form").find(".licenses_image").attr({"src": data.license_icon,
				"alt": "",
				"data_value": data.right_id
				});
		$("#cambiossinguardar").slideUp(0);
		$("#cambiosguardados").slideDown(400);
		$this.parents("form").find(".attribution_license").attr("href",data.url_license_modified);
		$this.parents("form").find(".attribution_license").text(data.modified_license_name);
				
	}).fail(function(data){
		
		x=jQuery.parseJSON(data.responseText);
	
		switch($("form").attr("action").split("/")[1]){ /*así cogemos solo el idioma de la url, ex: /es/activities/filter*/
			case "es":
				switch (x.x){
					case "activity_condition1":
						alert("La licencia de la actividad no es compatible con las licencias de los recursos añadidos.");
					break;
					case "activity_condition2":
						if ($("#actions").find("#share_experience").size()==1){
							alert("La licencia de la actividad no es compatible con la licencia de la experiencia.");
						}else{
							alert("La licencia de la actividad no es compatible con la licencia de la unidad didáctica.");
						}
					break;
					case "activity_condition3":
						alert("La licencia de la actividad clonada no es compatible con la licencia de la actividad original.");
					break;
					case "lessonplan_condition1":
						if ($("#actions").find("#share_experience").size()==1){
							alert("La licencia de la experiencia no es compatible con las licencias de los recursos y/o actividades añadidas.");
						}else{
							alert("La licencia de la unidad didáctica no es compatible con las licencias de los recursos y/o actividades añadidas.");
						}
					break;
					case "lessonplan_condition2":
						if ($("#actions").find("#share_experience").size()==1){
							alert("La licencia de la experiencia clonada no es compatible con la licencia del elemento original.");
						}else{
							alert("La licencia de la unidad didáctica clonada no es compatible con la licencia de la unidad didáctica original.");
						}
					break;
				}
			break;
			case "en":
				switch (x.x){
					case "activity_condition1":
						alert("The license of the activity is not compatible with the licenses of the added resources.");
					break;
					case "activity_condition2":
						if ($("#actions").find("#share_experience").size()==1){
							alert("The license of the activity is not compatible with the license of the experience.");
						}else{
							alert("The license of the activity is not compatible with the license of the lesson plan.");
						}
					break;
					case "activity_condition3":
						alert("The license of the cloned activity is not compatible with the license of the original activity.");
					break;
					case "lessonplan_condition1":
						if ($("#actions").find("#share_experience").size()==1){
							alert("The license of the experience is not compatible with the licenses of the added resources and/or activities.");
						}else{
							alert("The license of the lesson plan is not compatible with the licenses of the added resources and/or activities.");
						}
					break;
					case "lessonplan_condition2":
						if ($("#actions").find("#share_experience").size()==1){
							alert("The license of the cloned experience is not compatible with the license of the original element.");
						}else{
							alert("The license of the cloned lesson plan is not compatible with the license of the original lesson plan.");
						}
					break;
				}
			break;	
			case "gl":
				switch (x.x){
					case "activity_condition1":
						alert("A licenza da actividade non é compatible coas licenzas dos recursos engadidos.");
					break;
					case "activity_condition2":
						if ($("#actions").find("#share_experience").size()==1){
							alert("A licenza da actividade non é compatible coa licenza da experiencia.");
						}else{
							alert("A licenza da actividade non é compatible coa licenza da unidade didáctica.");
						}
					break;
					case "activity_condition3":
						alert("A licenza da actividade clonada non é compatible coa licenza da actividade orixinal.");
					break;
					case "lessonplan_condition1":
						if ($("#actions").find("#share_experience").size()==1){	
							alert("A licenza da experiencia non é compatible coas licenzas dos recursos e/ou actividades engadidas.");
						}else{
							alert("A licenza da unidade didáctica non é compatible coas licenzas dos recursos e/ou actividades engadidas.");
						}
					break;
					case "lessonplan_condition2":
						if ($("#actions").find("#share_experience").size()==1){
							alert("A licenza da experiencia clonada non é compatible coa licenza do elemento orixinal.");
						}else{
							alert("A licenza da unidade didáctica clonada non é compatible coa licenza da unidade didáctica orixinal.");
						}
					break;
				}
			break;
			case "pt":
				switch (x.x){
					case "activity_condition1":
						alert("A licença da atividade não é compativel com as licenças dos recursos adicionados.");
					break;
					case "activity_condition2":
						if ($("#actions").find("#share_experience").size()==1){
							alert("A licença da atividade não é compativel com a licença da experiência.");
						}else{
							alert("A licença da atividade não é compativel com a licença do plano de aula.");
						}
					break;
					case "activity_condition3":
						alert("A licença da atividade clonada não é compativel com a licença da atividade original.");
					break;
					case "lessonplan_condition1":
						if ($("#actions").find("#share_experience").size()==1){
							alert("A licença da experiência não é compativel com as licenças dos recursos e/ou atividades adicionadas.");
						}else{
							alert("A licença do plan de aula não é compativel com as licenças dos recursos e/ou atividades adicionadas.");
						}
					break;
					case "lessonplan_condition2":
						if ($("#actions").find("#share_experience").size()==1){
							alert("A licença da experiência não é compativel com a licença do elemento original.");
						}else{
							alert("A licença do plan de aula não é compativel com a licença do plan de aula original.");
						}
					break;
				}
			break;	
		}
		
		var vector_inputs=$this.parents("form").find(".condition input");
		vector_inputs[0].checked=false;
		vector_inputs[1].checked=true;
		$this.parents("form").find("select.active_select").prop("disabled", false);	
	});
});

//Function that disables name and url author input if the user is the original author
$(document).on("change", ".choose_author", function() {
	var $this = $(this);
	var content = $(this).val();
	var url = $(this).closest("form").attr("action");
	var field = $(this).attr("name").split("[")[1].replace("]", "");
	
	var data_value = {
		campo : field,
		contenido : content,
		};
	jQuery.ajax({
		type : "PATCH",
		url : url,
		dataType : "json",
		data : data_value,
	}).done(function(data) {
		if (data_value["contenido"] == "true"){
			$this.parents("form").find(".author_name").val("");
			$this.parents("form").find(".URL_edition").val("");
			$this.parents("form").find(".user_author").text(data.author);
			$this.parents("form").find(".user_author").attr("href",data.author_url);
			$this.parents("form").find(".show_name_edition").hide();
		}
		else{
			$this.parents("form").find(".show_name_edition").show();
		}
		$("#cambiossinguardar").slideUp(0);
		$("#cambiosguardados").slideDown(400);
	});
});

//Function for author input name
$(document).on("change", ".author_name", function() {
	var $this = $(this);
	var content = $(this).val();
	var url = $(this).closest("form").attr("action");
	var field = $(this).attr("name").split("[")[1].replace("]", "");
	var data_value = {
		campo : field,
		contenido : content,
		};
	jQuery.ajax({
		type : "PATCH",
		url : url,
		dataType : "json",
		data : data_value,
	}).done(function(data) {
		$this.parents("form").find(".user_author").text(data.author);
		$("#cambiossinguardar").slideUp(0);
		$("#cambiosguardados").slideDown(400);
	});
});

$(document).on("change", ".URL_edition", function() {
	var $this=$(this);
	var content = $(this).val();
	var url = $(this).closest("form").attr("action");
	var field = $(this).attr("name").split("[")[1].replace("]", "");
	var content_http = content.split("://");
	if (content_http.length > 1){
		content = "www."+content_http[1];
	}
	var data_value = {
		campo : field,
		contenido : content,
		};
	jQuery.ajax({
		type : "PATCH",
		url : url,
		dataType : "json",
		data : data_value,
	}).done(function(data) {
		$this.parents("form").find(".user_author").attr("href",data.author_url);
		$("#cambiossinguardar").slideUp(0);
		$("#cambiosguardados").slideDown(400);
	});
});


$(document).on("change", ".image_updateable", function(event) {

	var imageinput = $(this).attr('id');
	var target = $(this);
	var archivos = event.target.files;
	var image = new FormData();
	image.append("contenido", archivos[0]);
	image.append("campo", "image");
	if ($(this).parents("#form_header").children("input").attr("data-parent") == "experiences") {
		image.append("parent_element", true);
	}

	jQuery.ajax({
		type : "PATCH",
		url : $(this).parents("form").attr('action'),
		dataType : "json",
		contentType : false,
		processData : false,
		data : image

	}).done(function(data) {
		/* Agregar aqui lo que sea necesario cuando la función retorne la respuesta */
		if (target.attr("id")=="technical_setting_image"){
			target.parent().children(".image_preview").attr('src', data.url).css('display', '');
		}else{
			target.parent().parent().children(".image_preview").attr('src', data.url).css('display', '');	
		}
		$("#cambiosguardados").hide();
		$("#cambiossinguardar").slideUp(500);
		$("#cambiosguardados").slideDown(2000);
		target.css('border-color', '').css('box-shadow', '0px 0px 0px');
	});

});

$(document).on("change", ".document_append", function(event) {
	var $this = $(this);
	var target = $this;
	var archivos = event.target.files;
	var data = new FormData();
	data.append("contenido", archivos[0]);
	data.append("campo", "document");
	
	jQuery.ajax({
		type : "PATCH",
		url : $(this).parents("form").attr('action'),
		dataType : "json",
		contentType : false,
		processData : false,
		data : data

	}).done(function(data) {
		/* Agregar aqui lo que sea necesario cuando la función retorne la respuesta */
		$("#cambiosguardados").hide();
		$("#cambiossinguardar").slideUp(500);
		$("#cambiosguardados").slideDown(2000);
		target.css('border-color', '').css('box-shadow', '0px 0px 0px');
	});

});

$(document).on("click", "#remove_image, #remove_image_setting", function() {
	var url = $(this).parents("form").attr('action');
	var button = $(this);
	if ($(this).parents("form").children("input").attr("data-parent") == "experiences") {
		data = {
			campo : 'imagenone',
			parent_element : true
		};
	} else {
		data = {
			campo : 'imagenone'
		};
	}
	jQuery.ajax({
		type : "PATCH",
		url : url,
		dataType : "json",
		data : data

	}).done(function(data) {
		if (button.attr("id")=="remove_image_setting"){
			console.log(button);
			console.log(button.parent());
			console.log(button.parent().children(".image_preview"));
			button.parent().children(".image_preview").remove();
			button.parent().prepend("<img alt='Picture' class='image_preview' crop='scale' src='/images/img_defecto.png' width='300'>");
		}else{
			button.parent().parent().children(".image_preview").remove();
			button.parent().parent().prepend("<img alt='Picture' class='image_preview' crop='scale' src='/img_defecto.png' width='300'>");	
		}
		$("#cambiosguardados").hide();
		$("#cambiossinguardar").slideUp(500);
		$("#cambiosguardados").slideDown(2000);
	});
});

function change_show_mode(action) {
	switch($("#show_mode").attr("data-mode")) {
		case "1":
			//Si estoy en el modo 1 -> Modo vista sin records
			if (action == "init_edition") {
				$("#show_mode").attr("data-mode", "2");
				active_edition("mode_1");
			} else {
				if (action == "init_documentation") {
					$("#show_mode").attr("data-mode", "3");
				}
			}
			break;
		case "2":
			//Si estoy en el modo 2 -> Modo edición normal, sin records
			if (action == "stop_edition") {
				disable_edition("mode_2");
				$("#show_mode").attr("data-mode", "1");
			} else {
				if (action == "init_documentation") {
					disable_edition("mode_2");
					$("#show_mode").attr("data-mode", "3");
				}
			}
			break;
		case "3":
			//Si estoy en el modo 3 -> Modo vista con los records
			if (action == "init_edition") {
				active_edition("mode_3");
				$("#show_mode").attr("data-mode", "4");
			} else {
				if (action == "stop_documentation") {
					$("#show_mode").attr("data-mode", "1");
				}
			}

			break;
		case "4":
			//Si estoy en el modo 4 -> Modo edición de los records unicamente
			if (action == "stop_edition") {
				disable_edition("mode_4");
				$("#show_mode").attr("data-mode", "3");
			} else {
				if (action == "stop_documentation") {
					disable_edition("mode_4");
					$("#show_mode").attr("data-mode", "1");
				}
			}

			break;
		default:
			console.log("show_mode -> El valor del modo de vision no se ha guardado correctamente");
	}
}


$(document).on("click", "#active_edition", function() {
	change_show_mode("init_edition");
});

function active_edition(from) {
	$("#active_edition, #disable_edition").toggleClass("invisible");
	if(from == "mode_1"){
		$("form input[type=text],form textarea, form input[type=radio], form input[type=checkbox], form .active_select, #remove_image, #remove_image_setting, .updateable_box_valuetype, .updateable_box_BSV_type,.updateable_box_BEI_type,.updateable_box_BI_voc, #snippet_url").each(function(){
				$(this).attr("disabled",false);	
				
		});
		$(".box_title_no_updateable, .box_description_no_updateable, .box_item_value_no_updateable").each(function() {
			$(this).attr("disabled", true);
		});
		$(".submission_edition").each(function() {
			$(this).attr("disabled",false);
		});
		$(".submission_edition_disabled").each(function() {
			$(this).attr("disabled",true);
		});
		
		$(".submission_edition span, .submission_edition.delete_record, .submission_edition.select_record_type").removeClass("invisible");
		$(".submission_edition_disabled span").addClass("invisible");
		
		if ($("#active_checkbox").attr('checked')=="checked"){
			$(".active_select option").prop("disabled", true);
		}
		
		$(".author_attribution").toggleClass("invisible");
		$(".condition, .commercial, .derivative, .author, .name_edition, .url_author, .append_snippet_url_input").toggleClass("invisible");
		$(".delete_box_from_template,#New_Box, .delete_data_box_miniview, .delete_data_box_item, .itemizes, .info_bubble, .add_resource_to_itemize").toggleClass("invisible");
		$(".delete_button, .add_option_item, .jqte_toolbar, .add_new_single_value, .subcategorie_icon, .document_selector").toggleClass("invisible");
		$(".list_view_icon.subcategorie_icon").toggleClass("invisible");
		$(".image_updateable, #remove_image, #remove_image_setting, .add_free_text, .change_file_input").toggleClass("invisible");
		$(".add_to_library, .delete_element, .add_element, .table_view_icon, .delete_append, .delete_submission").toggleClass("invisible");
		$(".delete_keyword, .keyword_input, .search_setting, .delete_setting_term, .plus_box, .add_vocabulary_setting").toggleClass("invisible");
		$(".plus_box.add_free_text").toggleClass("invisible");
		
		$(".url input, .title input, .description textarea, .keyword_input, .box_components input").css("background-color", "#eee");
		$(".jqte_editor").attr("contenteditable", "true");
		
		$("#LicenciasBoxTop").toggleClass("invisible");
		$("#LicenciasBoxFull").toggleClass("invisible");
		
		$(".resources_section_header, .activities_section_header, .submissions_section_header, #delete_checkbox, .move_element").toggleClass("invisible");
		
		$(".title_container p").replaceWith(function(){
			var $this = $(this);
			var id = $this.attr("id");
			var clas = $this.attr("class");
			var name = $this.attr("name");
			var style = $this.attr("style");
			var value = $this.attr("value");
			if (value == "undefined" || value == undefined){
				value = "";
			}
			return "<input id='"+id+"' class='"+clas+"' name='"+name+"' style='"+style+"' type='text' value='"+value+"'/>";
		});
		
		//$("#activities_section_body .activities_list_view, .data_box_bfti").sortable("enable");
	} else {
		if (from == "mode_3") {
			$(".record_invisible, .select_record_type, .delete_record").toggleClass("invisible");
			$(".record_input").attr("disabled", false);
			$(".jqte_record_editor").attr("contenteditable", "true");
			$(".jqte_record_toolbar").toggleClass("invisible");
		}
	}
}


$(document).on("click", "#disable_edition", function() {
	change_show_mode("stop_edition");
});

function disable_edition(from) {
	$("#active_edition, #disable_edition").toggleClass("invisible");
	if(from == "mode_2"){
		$("form input[type=text],form textarea,form input[type=radio], form input[type=checkbox], #remove_image, #remove_image_setting, .updateable_box_valuetype, #snippet_url").each(function(){
			$(this).attr("disabled",true);	
			
		});
		$(".updateable_box_BSV_type,.updateable_box_BEI_type,.updateable_box_BI_voc").each(function() {
			$(this).attr("disabled", true);
		});
		$(".submission_edition, .submission_edition_disabled").each(function() {
			$(this).attr("disabled",true);
		});
		$(".submission_edition span, .submission_edition.delete_record, .submission_edition.select_record_type, .submission_edition_disabled span").addClass("invisible");
		
		$(".author_attribution").toggleClass("invisible");
		$(".condition, .commercial, .derivative, .author, .name_edition, .url_author, .append_snippet_url_input").toggleClass("invisible");
		$(".delete_box_from_template, #New_Box, .delete_data_box_miniview, .delete_data_box_item, .itemizes, .info_bubble, .add_resource_to_itemize").toggleClass("invisible");
		$(".delete_button, .add_option_item, .delete_submission").toggleClass("invisible");
		$(".image_updateable, #remove_image, #remove_image_setting, .add_free_text, .change_file_input").toggleClass("invisible");
		
		var $images = $(".image img");
		$images.each(function() {
			if ($.trim($(this).attr("src")) == "" || $.trim($(this).attr("src")) == "undefined") {
				$(this).toggleClass("invisible");
			}
		});

		$(".jqte_toolbar, .add_new_single_value, .subcategorie_icon, .document_selector, .list_view_icon.subcategorie_icon").toggleClass("invisible");
$(".list_view_icon.subcategorie_icon").toggleClass("invisible");
		$(".plus_box.add_free_text, .add_to_library, .delete_element, .add_element, .table_view_icon, .delete_append").toggleClass("invisible");
		$(".delete_keyword, .keyword_input, .search_setting, .delete_setting_term, .plus_box, .add_vocabulary_setting").toggleClass("invisible");
		
		$(".url input, .title input, .description textarea, .keyword_input, .box_components input").css("background-color", "white");
		$(".jqte_editor").attr("contenteditable", "false");
		
		$("#LicenciasBoxTop").toggleClass("invisible");
		$("#LicenciasBoxFull").toggleClass("invisible");
		
		$(".resources_section_header, .activities_section_header, .submissions_section_header, #delete_checkbox, .move_element").toggleClass("invisible");
				
		$(".title_container input").replaceWith(function(){
			var $this = $(this);
			var id = $this.attr("id");
			var clas = $this.attr("class");
			var name = $this.attr("name");
			var style = $this.attr("style");
			var value = $this.attr("value");
			var placeholder = $this.attr("placeholder");
			if (value == "undefined" || value == undefined){
				value = "";
			}
			return "<p id='"+id+"' class='"+clas+"' name='"+name+"' style='"+style+"' placeholder='"+placeholder+"' value='"+value+"'>"+value+"</p>";
		});
		
		//$("#activities_section_body .activities_list_view, .data_box_bfti").sortable("disable");
	} else {
		if (from == "mode_4") {
			$(".record_invisible, .select_record_type, .delete_record").toggleClass("invisible");
			$(".record_input").attr("disabled", true);
			$(".jqte_record_editor").attr("contenteditable", "false");
			$(".jqte_record_toolbar").toggleClass("invisible");
		}
	}
}


/******************************************************************************************************************************************/
/* Función que crea el vector de licencias cuando se va a añadir un recurso a una actividad o una actividad de la library a un lesson plan*/
/******************************************************************************************************************************************/
function create_vector_licenses(right_id,parent_type,parent_id){
	
	switch (right_id){
			//License CC0
			case "7":
				var vector = "00001";
			break;
			//License CC-BY
			case "1":
				var vector = "00010";
			break;
			//License CC-BY-SA
			case "2":
				var vector = "00100";
			break;
			//License CC-BY-NC
			case "3":
				var vector = "01000";
			break;
			//License CC-BY-NC-SA
			case "4":
				var vector = "10000";
			break;
			/*License CC-BY-ND: Esta licencia no es compatible con ninguna otra licencia, salvo con si misma, siempre y cuando el recurso fuese creado por la misma persona que creó la actividad */
			case "5":
				var vector = "100000";
			break;
			/*License CC-BY-NC-ND: Esta licencia no es compatible con ninguna otra licencia, salvo con si misma, siempre y cuando el recurso fuese creado por la misma persona que creó la actividad */
			case "6":
				var vector = "110000";
			break;
	}
	
	//Pasamos string a valor decimal, cogemos base 2
	vector=parseInt(vector,2);
	
	if(parent_type == "LessonPlan" || parent_type == "lesson_plans"){
		parent_type = "lesson_plan";
	}else{
		parent_type = parent_type.toLowerCase();
	}
	//Actualizamos valor de previous vector con el valor de vector licenses
	$("#edit_" + parent_type + "_" + parent_id +" .prev_vector_licenses").val($("#edit_" + parent_type + "_" + parent_id +" .vector_licenses").val());
	var final_vector=$("#edit_" + parent_type + "_" + parent_id +" .vector_licenses").val();
	//Pasamos string a valor decimal, cogemos base 2
	final_vector=parseInt(final_vector.toString(),2);
	//Calculamos vector final de licencias haciendo OR de ambos vectores en formato decimal y luego pasando a string
	final_vector=(final_vector | vector).toString(2);
	//console.log("final_vector function"+final_vector);
	if ((right_id != 5) && (right_id != 6)){
		//console.log("length: "+final_vector.toString().length);
		//Si longitud de vector resultante menor que 5 hay que añadir ceros al principio del string para ontener una longitud de 5
		if (final_vector.toString().length < 5){
			if (final_vector.toString().length == 4){
				final_vector = "0" + final_vector;
			}
			if (final_vector.toString().length == 3){
				final_vector = "00" + final_vector;
			}
			if (final_vector.toString().length == 2){
				final_vector = "000" + final_vector;
			}
			if (final_vector.toString().length == 1){
				final_vector = "0000" + final_vector;
			}
		}
	}
	return final_vector;
}

$(document).on("click", ".add_fast_elements", function(){
	var $this = $(this);
	var type = "html";
	
	if($this.hasClass("action_icon")){
		type = "json";	
	}
	
	var show_mode = $this.siblings("input").attr("data-view");
	
	$.ajax({
		type: "POST",
		url: window.location.href.split("?")[0]+"/addFastElement",
		dataType: type,
		data: {show_mode: show_mode},
	}).done(function(data){
		if($this.hasClass("action_icon")){
			$(location).attr("href", window.location.href + "/" + data.id + "?created=true");
		}else{
			$(".activities_section_body #activities_"+ show_mode+"_view_"+$this.attr("data-info").split(";")[1]).append(data);
			//$(".activities_mini_view").append(data);
			if (show_mode == "mini"){
				var right_id = $($.parseHTML(data)).filter(".mini_view_box").find(".mini_view_license_icon").attr("data-id");
				var data_info = $($.parseHTML(data)).filter(".mini_view_box").find(".show_element_in_lp").attr("data-info");
				var title = $($.parseHTML(data)).filter(".mini_view_box").find(".show_element_in_lp").find("p").text();	
			}else{
				var right_id = $($.parseHTML(data)).filter(".element_list_box").find(".element_list_license_icon").attr("data-id");
				var data_info = $($.parseHTML(data)).filter(".element_list_box").attr("data-info");
				var title = $($.parseHTML(data)).filter(".element_list_box").find(".title").find("p").text();	
			}
			
			var splitted_url = window.location.href.split("/");
			if(splitted_url[4] == "experiences"){
				splitted_url[4] = "lesson_plans";
				splitted_url[5] = $(".element_summary form").attr("id").split("_")[3];
			}
			var final_vector = create_vector_licenses(right_id, splitted_url[4], splitted_url[5].split("?")[0]);
			$("#edit_lesson_plan_" + splitted_url[5].split("?")[0] +" .vector_licenses").val(final_vector);
			
			var activity;
			switch($("form").attr("action").split("/")[1]){//Al agregar una actividad desde cero nunca tendrá título. Le pondremos un título por defecto.
				case "es":
					activity = ("Actividad");
				break;
				case "gl":
					activity = ("Actividade");
				break;
				default:
					activity = ("Activity");
			};
			
			positions = $("#activities_breadcrumb").find(".actstyle").children("ul").children().last().text().split("."); 
			if ($("#activities_breadcrumb").find(".actstyle").children("ul").children().size() == 0){
				$("#activities_breadcrumb ul").first().find("ul").append("<li><a class='show_element_in_lp' data-info='"+data_info+"'>1.1. "+activity+"</a></li>");
			}else{
				position_ud = positions[0];
				position_act = parseInt(positions[1])+1;
				$("#activities_breadcrumb ul").first().find("ul").append("<li><a class='show_element_in_lp' data-info='"+data_info+"'>"+position_ud+"."+position_act+". "+activity+"</a></li>");
			}
		}
				
	}).fail(function(data){
		if (data.status != 406){
			show_licenses_error(data, "lesson_plan", $(".vector_licenses").val());	
		}
	});
});

$(document).on("click", ".create_new_element, .add_new_element", function(){
	
	var $this = $(this);
	var data_info_splitted = $this.attr("data-info").split(";");
	var parent_type;
	var parent_id;
	var element_id; //Id del elemento contenido
	var element_type; //Tipo del elemento contenido
	var data_ajax;
	var url;
	var template = false;
	var final_vector;
	var type = "html";
	var show_mode;
	console.log("add_new_element");
	parent_type = $("#content_popup input").attr("data-parent_type");
	parent_id = $("#content_popup input").attr("data-parent_id");
	element_type = data_info_splitted[0];
	element_id = data_info_splitted[1];
	if (parent_type == "users"){
		set_default_template_ajax(element_id);
	}else{
		var aux;
		switch(parent_type){
			case "LessonPlan":
				aux = "lesson_plan";
			break;
			default:
				if(data_info_splitted[0] == "LessonPlan"){
					aux = "lesson_plan";
				}else{
					aux = "activity";
				}
		}
		
		if($this.hasClass("create_new_element")){ //ESTE IF ES TRUE CUANDO CREAMOS UNA ACTIVIDAD O UN LESSONPLAN O UNA EXPERIENCE EN LA LIBRARY
			console.log("añadir nuevo elemento usando un template");
			data_ajax = { element_id : data_info_splitted[1]};
			url = "/" + $("#locale").val() + "/" + $("#content_container").data('type') + "/create.json";
			if(data_info_splitted[0] == "template"){
				template = true; //Si template es true, estamos creando una actividad o lesson plan en la library
			}
			type = "json";	
		}else{//EN ESTE CASO CREAMOS UNA ACTIVIDAD O UN RECURSO PARA INCLUIR EN OTRO ELEMENTO
			if(data_info_splitted[0] == "template"){
				template = true; //Si template es true, estamos añadiendo una actividad nueva al lesson plan
				show_mode = $("#content_popup input").attr("data-show_mode");
			}else{
				element_type = $this.attr("data-type");
				parent_type = data_info_splitted[0];
				parent_id = data_info_splitted[1];
				show_mode = $this.parent().siblings("input").attr("data-view");
			}		
			url = $("#edit_"+aux+"_"+parent_id).attr("action")+"/addElement";
			final_vector = $("#edit_"+aux+"_"+parent_id+" .vector_licenses").val();
			data_ajax = {parent_type: parent_type, parent_id: parent_id, element_id: element_id, element_type: element_type, final_vector: final_vector, show_mode: show_mode};
		}
		
		var tempScrollTop = $(window).scrollTop(); 
		if ($("#content_container input").size() != 0){
			$("#content_container input")[0].setAttribute("data-scroll", tempScrollTop);	
		}
		add_new_element_ajax(data_ajax, url, $this, template, type);
	}
	
});

function set_default_template_ajax(element_id){
	jQuery.ajax({
		type : "POST",
		url : $("#content_container form").attr("action")+"/setDefaultTemplate",
		dataType : "json",
		data : {element_id: element_id}
	}).done(function(data) {
		if (data["template_type"] == "ActivityTemplate"){
			$("#title_activity_default").text(data["title"]);
		}else{
			$("#title_lesson_plan_default").text(data["title"]);
		}
		
		$("#marco_popup").hide();
		$("#background_overlay").hide();
		$("body").css('overflow', 'visible');
		$(window).scrollTop(parseInt($("#content_container input").attr("data-scroll")));
	});
		
}

function add_new_element_ajax(data_ajax, url, $this, template, type){
	jQuery.ajax({
		type : "POST",
		url : url,
		dataType : type,
		data : data_ajax
	}).done(function(data) {
		if(data_ajax["parent_type"] == "LessonPlan"){
			data_ajax["parent_type"] = "lesson_plan";
		}
		if(template){
			if($this.hasClass("create_new_element")){ //Activity o Lesson Plan en la library
				$(location).attr("href", "/" + $("#locale").val() + "/" + $("#content_container").data('type') + "/" + data.id + "?created=true");
			}else{ //Aqui se está agregando una activity a un lesson plan
				//$("#numbers_activities").children().last().remove();
				//var position = $("#numbers_activities").children().size();
				/*switch($("form").attr("action").split("/")[1]){
					case "es":
						result = ("Fin");
						activity = ("Actividad");
					break;
					case "gl":
						result = ("Fin");
						activity = ("Actividade");
					break;
					default:
						result = ("End");
						activity = ("Activity");
				}*/
				
				if (data_ajax["show_mode"] == "mini"){
					var data_info = $($.parseHTML(data)).filter(".mini_view_box").find(".show_element_in_lp").attr("data-info");
				}else{
					var data_info = $($.parseHTML(data)).filter(".element_list_box").attr("data-info");
				}
				
				final_vector = create_vector_licenses($(data).find(".licenses_image").attr("data_value"),data_ajax["parent_type"],data_ajax["parent_id"]);	
				//$("#activities_section_body .activities_list_view").append("<div class='activity_number'><span name='activity_name'>"+activity+" "+position+"</span> <a name='activity_position_"+position+"'><span>"+activity+" "+position+"</span></a></div>");
				var activity;
				switch($("form").attr("action").split("/")[1]){//Al agregar una actividad desde cero nunca tendrá título. Le pondremos un título por defecto.
					case "es":
						activity = ("Actividad");
					break;
					case "gl":
						activity = ("Actividade");
					break;
					default:
						activity = ("Activity");
				};
				
				positions = $("#activities_breadcrumb").find(".actstyle").children("ul").children().last().text().split("."); 
				if ($("#activities_breadcrumb").find(".actstyle").children("ul").children().size() == 0){
					$("#activities_breadcrumb ul").first().find("ul").append("<li><a class='show_element_in_lp' data-info='"+data_info+"'>1.1. "+activity+"</a></li>");
				}else{
					position_ud = positions[0];
					position_act = parseInt(positions[1])+1;
					$("#activities_breadcrumb ul").first().find("ul").append("<li><a class='show_element_in_lp' data-info='"+data_info+"'>"+position_ud+"."+position_act+". "+activity+"</a></li>");
				}
				
				$(".activities_section_body #activities_"+ data_ajax["show_mode"]+"_view_"+data_ajax["parent_id"]).append(data);
				//$("#activities_section_body .activities_list_view").sortable("refresh");
				//$("#numbers_activities").append("<div class='number_container'><a href='#activity_position_"+position+"' class='item_activity_bar'>"+position+"</a></div><div class='number_container'><a href='#end_page'>"+result+"</a></div>");
				//var activity = $(data).find("form").attr("id");
				//$("#"+activity).find("textarea").jqte();

				//Actualizamos vector de licencias que está en input
				$("#edit_" + data_ajax["parent_type"].toLowerCase() + "_" + data_ajax["parent_id"] +" .vector_licenses").val(final_vector);
				$("#edit_" + data_ajax["parent_type"].toLowerCase() + "_" + data_ajax["parent_id"] +" .prev_vector_licenses").val($("#edit_" + data_ajax["parent_type"] + "_" + data_ajax["parent_id"] +" .vector_licenses").val());
				
				if ($("#valid_template").size() != 0){
					var valid_template = $("#valid_template").val();
					if (valid_template == false){//En este caso no se podrá cambiar a modo tabla
						$("#activities_action_bar_"+data_ajax["parent_id"]).children(".table_view_icon").addClass("invisible");
					}
				}
				
				
				
			}
		}else{
			if($this.hasClass("create_new_element")){ //Estamos creando una experiencia a partir de un lesson plan
				$(location).attr("href", "/" + $("#locale").val() + "/" + $("#content_container").data('type') + "/" + data.id + "?created=true");
			}else{ // Estamos añadiendo un recurso a un elemento
				if (data_ajax["show_mode"] == "mini"){
					final_vector = create_vector_licenses($(data).find(".mini_view_license_icon").attr("data-id"),data_ajax["parent_type"],data_ajax["parent_id"]);
				}else{
					final_vector = create_vector_licenses($(data).find(".element_list_license_icon").attr("data-id"),data_ajax["parent_type"],data_ajax["parent_id"]);
				}

				$("#edit_" + data_ajax["parent_type"].toLowerCase() + "_" + data_ajax["parent_id"] +" .vector_licenses").val(final_vector);
				$("#edit_" + data_ajax["parent_type"].toLowerCase() + "_" + data_ajax["parent_id"] +" .prev_vector_licenses").val($("#edit_" + data_ajax["parent_type"].toLowerCase() + "_" + data_ajax["parent_id"] +" .vector_licenses").val());
				
				$this.parents(".resources").find(".resources_section_body #resources_"+ data_ajax["show_mode"]+"_view_"+data_ajax["parent_id"]).prepend(data);
			}
		}
		$("#marco_popup").hide();
		$("#background_overlay").hide();
		$("body").css('overflow', 'visible');
		$(window).scrollTop(parseInt($("#content_container input").attr("data-scroll")));
	}).fail(function(data){
		if (data.status != 406){
			show_licenses_error(data, data_ajax["parent_type"], data_ajax["final_vector"]);	
		}else{
			switch($("form").attr("action").split("/")[1]){ /*así cogemos solo el idioma de la url, ex: /es/activities/filter*/
			case "es":
				alert("La actividad posee una plantilla no válida para ser vista en modo tabla" );
			break;
			case "gl":
				alert("A actividade ten un modelo que non é valido para ser visto en modo táboa.");
			break;
			case "en":
				alert("The activity has a not valid template to show in table mode.");
			break;
			case "pt":
				alert("nao compatible");
			break;			
			}
		}
	});
}

function add_element_ajax(data_ajax, url, special_case, $this){
	var aux;
	console.log("Ejecutando add element ajax");
	jQuery.ajax({
		type : "POST",
		url : url,
		dataType : "html",
		data : data_ajax
	}).done(function(data) {
		console.log(data_ajax);
		console.log(url);
		console.log(special_case);
		console.log($this);
		//Actualizamos vector de licencias que está en input
		//$("#edit_" + aux + "_" + data_ajax["parent_id"] +" .vector_licenses").val(data_ajax["final_vector"]);
		//$("#edit_" + aux + "_" + data_ajax["parent_id"] +" .prev_vector_licenses").val($("#edit_" + aux + "_" + data_ajax["parent_id"] +" .vector_licenses").val());
		//console.log($("#edit_" + aux + "_" + data_ajax["parent_id"] +" .vector_licenses").val());
		switch(data_ajax["element_type"]){
			case "TechnicalSetting":
			case "EducationalSetting":
				if (data_ajax["element_type"] == "TechnicalSetting"){
					$(".technical_setting").html(data);
					//$(".technical_setting").find(".contents")[0].remove();
					//$($(".technical_setting").find("form")[0]).append(data);
					//$(".technical_setting .contents").html(data);
					//var setting_id = $($(".technical_setting .contents")[1]).attr("data-id");
					//$(".technical_setting .contents")[0].setAttribute("data-id", setting_id);
					//$(".technical_setting").find("form")[0].setAttribute("action", "/"+$("#locale").val()+"/technical_settings/"+setting_id);
					//$(".technical_setting").find("form")[0].setAttribute("id", "edit_technical_setting_"+setting_id);
						
				}else{
					$(".educational_setting .contents").html(data);
				}
				$("#marco_popup").hide();
				$("#background_overlay").hide();
				$("body").css('overflow', 'visible');
			break;
			default:
			switch(data_ajax["parent_type"]){
				case "Activity":
					if (special_case){
						switch($("form").attr("action").split("/")[1]){
						case "es":
							alert("El recurso se ha agregado correctamente a la actividad seleccionada." );
						break;
						case "gl":
							alert("O recurso agregouse correctamente á actividade seleccionada.");
						break;
						case "en":
							alert("The resource has been added in the selected activity.");
						break;
						case "pt":
							alert("Recurso adicionado na atividade.");
						break;			
						}	
					}else{
						aux = "activity";
						$("#edit_" + aux + "_" + data_ajax["parent_id"] +" ").parent().siblings(".element_resources").find("#resources_"+data_ajax["show_mode"]+"_view_"+data_ajax["parent_id"]).append(data); //#resource_mini_view va a depender del modo de vista que se esté utilizando
						
						$("#edit_" + aux + "_" + data_ajax["parent_id"] +" .vector_licenses").val(data_ajax["final_vector"]);
						$("#edit_" + aux + "_" + data_ajax["parent_id"] +" .prev_vector_licenses").val($("#edit_" + aux + "_" + data_ajax["parent_id"] +" .vector_licenses").val());
					}
					
					$("#marco_popup").hide();
					$("#background_overlay").hide();
					$("body").css('overflow', 'visible');
					$(window).scrollTop(parseInt($("#content_container input").attr("data-scroll")));
				break;
				case "LessonPlan":
					aux = "lesson_plan";
					if (special_case){
						switch($("form").attr("action").split("/")[1]){
						case "es":
							if ($("#header_popup").attr("data-type") == "experiences"){
								alert("El elemento se ha agregado correctamente al curso seleccionado." );
							}else{
								alert("El elemento se ha agregado correctamente a la unidad didáctica seleccionada." );	
							}
						break;
						case "gl":
							if ($("#header_popup").attr("data-type") == "experiences"){
								alert("O elemento agregouse correctamente ao curso seleccionado.");
							}else{
								alert("O elemento agregouse correctamente á unidade didáctica seleccionada.");	
							}
						break;
						case "en":
							if ($("#header_popup").attr("data-type") == "experiences"){
								alert("The element has been added in the selected experience.");
							}else{
								alert("The element has been added in the selected lesson plan.");	
							}
						break;
						case "pt":
							if ($("#header_popup").attr("data-type") == "experiences"){
								alert("Elemento adicionado no curso.");
							}else{
								alert("Elemento adicionado no plano de aula.");							}
						break;			
						}
					}else{
						if(data_ajax["element_type"] == "Activity"){
							//$("#numbers_activities").children().last().remove();
							//var position = $("#numbers_activities").children().size();
							/*switch($("form").attr("action").split("/")[1]){
								case "es":
									result = ("Fin");
									activity = ("Actividad");
								break;
								case "gl":
									result = ("Fin");
									activity = ("Actividade");
								break;
								default:
									result = ("End");
									activity = ("Activity");
							}*/
							//$("#activities_section_body .activities_list_view").append("<div class='activity_number'><span name='activity_name'>"+activity+" "+position+"</span> <a name='activity_position_"+position+"'><span>"+activity+" "+position+"</span></a></div>");
							if (data_ajax["show_mode"] == "mini"){
								var data_info = $($.parseHTML(data)).filter(".mini_view_box").find(".show_element_in_lp").attr("data-info");
								var title = $($.parseHTML(data)).filter(".mini_view_box").find(".show_element_in_lp").find("p").text();	
							}else{
								var data_info = $($.parseHTML(data)).filter(".element_list_box").attr("data-info");
								var title = $($.parseHTML(data)).filter(".element_list_box").find(".title").find("p").text();	
							}
							
							
							if (title == ""){
								switch($("form").attr("action").split("/")[1]){//Al agregar una actividad desde cero nunca tendrá título. Le pondremos un título por defecto.
									case "es":
										title = ("Actividad");
									break;
									case "gl":
										title = ("Actividade");
									break;
									default:
										title = ("Activity");
								};	
							}
							
							positions = $("#activities_breadcrumb").find(".actstyle").children("ul").children().last().text().split("."); 
							if ($("#activities_breadcrumb").find(".actstyle").children("ul").children().size() == 0){
								$("#activities_breadcrumb ul").first().find("ul").append("<li><a class='show_element_in_lp' data-info='"+data_info+"'>1.1. "+title+"</a></li>");
							}else{
								position_ud = positions[0];
								position_act = parseInt(positions[1])+1;
								$("#activities_breadcrumb ul").first().find("ul").append("<li><a class='show_element_in_lp' data-info='"+data_info+"'>"+position_ud+"."+position_act+". "+title+"</a></li>");
							}
							
							$(".activities_section_body #activities_"+data_ajax["show_mode"]+"_view_"+data_ajax["parent_id"]).append(data);
							
							
							
							//$("#activities_section_body .activities_list_view").sortable("refresh");
							//$("#numbers_activities").append("<div class='number_container'><a href='#activity_position_"+position+"' class='item_activity_bar'>"+position+"</a></div><div class='number_container'><a href='#end_page'>"+result+"</a></div>");
							//var activity = $(data).find("form").attr("id");
							//$("#"+activity).find("textarea").jqte();
							
							//Actualizamos vector de licencias que está en input
							$("#edit_" + aux + "_" + data_ajax["parent_id"] +" .vector_licenses").val(data_ajax["final_vector"]);
							$("#edit_" + aux + "_" + data_ajax["parent_id"] +" .prev_vector_licenses").val($("#edit_" + aux + "_" + data_ajax["parent_id"] +" .vector_licenses").val());
							
							if ($("#valid_template").size() != 0){
								var valid_template = $("#valid_template").val();
								if (valid_template == false){//En este caso no se podrá cambiar a modo tabla
									$("#activities_action_bar_"+data_ajax["parent_id"]).children(".table_view_icon").addClass("invisible");
								}
							}
						}else{
							$("#edit_" + aux + "_" + data_ajax["parent_id"] +" ").parent().siblings(".element_resources").find("#resources_"+data_ajax["show_mode"]+"_view_"+data_ajax["parent_id"]).append(data); //#resource_mini_view va a depender del modo de vista que se esté utilizando
							
							$("#edit_" + aux + "_" + data_ajax["parent_id"] +" .vector_licenses").val(data_ajax["final_vector"]);
							$("#edit_" + aux + "_" + data_ajax["parent_id"] +" .prev_vector_licenses").val($("#edit_" + aux + "_" + data_ajax["parent_id"] +" .vector_licenses").val());
							
							$("#marco_popup").hide();
							$("#background_overlay").hide();
							$("body").css('overflow', 'visible');
						}	
					}
					
					$("#marco_popup").hide();
					$("#background_overlay").hide();
					$("body").css('overflow', 'visible');
					$(window).scrollTop(parseInt($("#content_container input").attr("data-scroll")));
					
				break;
				case "Board":
					if ($($.parseHTML(data)).filter("#element_repeat").val() != undefined) {
						var hidden_info = $("#content_popup").children('input');
						$("#content_popup").html($($.parseHTML(data)));
						$("#content_popup").prepend(hidden_info);
					} else {
						if(special_case){ //Si esta variable es true, estamos agregando un elemento desde fuera de la seccion de boards
							switch($("form").attr("action").split("/")[1]){
							case "es":
								alert("El elemento se ha agregado correctamente al tablero seleccionado." );
							break;
							case "gl":
								alert("O elemento agregouse correctamente ó taboleiro seleccionado.");
							break;
							case "en":
								alert("The element has been added in the selected board.");
							break;
							case "pt":
								alert("Elemento adicionado no quadro.");
							break;			
							}	
						}else{
							if ($("#board_element_list").val() == undefined) {
								$("#content_container").append("<div id='board_element_list' class='content small-12 columns clearfix'></div>");
							}
							$("#board_element_list").prepend(data).masonry('reloadItems');
			
							var container = $('#board_element_list');
							container.imagesLoaded(function() {
								container.masonry({
									columnWidth : 2,
									itemSelector : '.cards'
								}).fadeIn();
							});
						}
						$("#marco_popup").hide();
						$("#background_overlay").hide();
						$("body").css('overflow', 'visible');
						$(window).scrollTop(parseInt($("#content_container input").attr("data-scroll")));
					}
				break;
				case "TechnicalSetting":
					if (data_ajax["element_type"] == "Device"){
						var element_type = "devices";
					}else{
						var element_type = "applications";
					}
					$(".ts_"+element_type).append(data);
					$("#marco_popup").hide();
					$("#background_overlay").hide();
					$("body").css('overflow', 'visible');
					$(window).scrollTop(parseInt($("#content_container input").attr("data-scroll")));
				break;
				default:
				console.log("La has liao pollito! Done ajax add element");
			}
		}	
	}).fail(function(data){
		if (data.status != 406){
			show_licenses_error(data, aux, data_ajax["final_vector"]);	
		}else{
			switch($("form").attr("action").split("/")[1]){ 
			case "es":
				alert("La actividad posee una plantilla no válida para ser vista en modo tabla" );
			break;
			case "gl":
				alert("A actividade ten un modelo que non é valido para ser visto en modo táboa.");
			break;
			case "en":
				alert("The activity has a not valid template to show in table mode.");
			break;
			case "pt":
				alert("nao compatible");
			break;			
			}
		}
	});
}

function show_licenses_error(data,aux,final_vector){
	$("#edit_" + aux + "_" + data["parent_id"] +" .vector_licenses").val($("#edit_" + aux + "_" + data["parent_id"] +" .prev_vector_licenses").val());
	console.log(data.responseText);
	switch($("form").attr("action").split("/")[1]){ /*así cogemos solo el idioma de la url, ex: /es/activities/filter*/
		case "es":
			switch (data.responseText){
				case "activity_condition4":
					alert("El recurso no se puede añadir porque su licencia no es compatible con la licencia de la actividad.");
				break;
				case "activity_condition5":
					alert("El recurso no se puede añadir porque la licencia que se le asigna por defecto no es compatible con la licencia de la actividad. Cambie la licencia por defecto en su perfil de usuario o cambie la licencia de la actividad.");
				break;
				case "activity_condition6":
					if ($("#actions").find("#share_experience").size()==1){
						alert("La actividad no se puede añadir porque su licencia no es compatible con la licencia de la experiencia.");
					}else{
						alert("La actividad no se puede añadir porque su licencia no es compatible con la licencia de la unidad didáctica.");	
					}
				break;
				case "activity_condition7":
					if ($("#actions").find("#share_experience").size()==1){
						alert("La actividad no se puede añadir porque la licencia que se le asigna por defecto no es compatible con la licencia de la experiencia. Cambie la licencia por defecto en su perfil de usuario o cambie la licencia de la experiencia");
					}else{
						alert("La actividad no se puede añadir porque la licencia que se le asigna por defecto no es compatible con la licencia de la unidad didáctica. Cambie la licencia por defecto en su perfil de usuario o cambie la licencia de la unidad didáctica");	
					}		
				break;
				case "activity_condition8":
					if ($("#actions").find("#share_experience").size()==1){
						alert("El recurso no se puede añadir porque su licencia no es compatible con la licencia de la experiencia.");
					}else{
						alert("El recurso no se puede añadir porque su licencia no es compatible con la licencia de la unidad didáctica.");
					}
				break;
				case "activity_condition9":
					if ($("#actions").find("#share_experience").size()==1){
						alert("El recurso no se puede añadir porque la licencia que se le asigna por defecto no es compatible con la licencia de la experiencia. Cambie la licencia por defecto en su perfil de usuario o cambie la licencia de la experiencia.");
					}else{
						alert("El recurso no se puede añadir porque la licencia que se le asigna por defecto no es compatible con la licencia de la unidad didáctica. Cambie la licencia por defecto en su perfil de usuario o cambie la licencia de la unidad didáctica.");
					}
				break;
			}
		break;
		case "en":
			switch (data.responseText){
				case "activity_condition4":
					alert("The resource cannot be added because its license is not compatible with the activity's license.");
				break;
				case "activity_condition5":
					alert("The resource cannot be added because its default license is not compatible with the activity's license. Change the default license in your user profile or change the activity's license.");
				break;
				case "activity_condition6":
					if ($("#actions").find("#share_experience").size()==1){
						alert("The activity cannot be added because its license is not compatible with the experience's license.");
					}else{
						alert("The activity cannot be added because its license is not compatible with the lesson plan's license.");
					}
				break;
				case "activity_condition7":
					if ($("#actions").find("#share_experience").size()==1){
						alert("The activity cannot be added because the default license that is assigned to it, is not compatible with the experience's license. Change the default license in your user profile or change the experience's license.");
					}else{
						alert("The activity cannot be added because the default license that is assigned to it, is not compatible with the lesson plan's license. Change the default license in your user profile or change the lesson plan's license.");
					}
				break;
				case "activity_condition8":
					if ($("#actions").find("#share_experience").size()==1){
						alert("The resource cannot be added because its license is not compatible with the experience's license.");
					}else{
						alert("The resource cannot be added because its license is not compatible with the lesson plan's license.");
					}
				break;
				case "activity_condition9":
					if ($("#actions").find("#share_experience").size()==1){
						alert("The resource cannot be added because its default license is not compatible with the experience's license. Change the default license in your user profile or change the experience's license.");
					}else{
						alert("The resource cannot be added because its default license is not compatible with the lesson plan's license. Change the default license in your user profile or change the lesson plan's license.");
					}
				break;
			}
		break;
		case "gl":
			switch (data.responseText){
				case "activity_condition4":
					alert("O recurso non se pode engadir porque a súa licenza non é compatible coa licenza da actividade.");
				break;
				case "activity_condition5":
					alert("O recurso non se pode engadir porque a licenza por defecto que se lle asigna non é compatible coa licenza da actividade. Cambie a licenza por defecto no seu perfil de usuario ou cambie a licenza da actividade.");
				break;
				case "activity_condition6":
					if ($("#actions").find("#share_experience").size()==1){
						alert("A actividade non se pode engadir porque a súa licenza non é compatible coa licenza da experiencia.");
					}else{
						alert("A actividade non se pode engadir porque a súa licenza non é compatible coa licenza da unidade didáctica.");
					}
				break;
				case "activity_condition7":
					if ($("#actions").find("#share_experience").size()==1){
						alert("A actividade non se pode engadir porque a licenza por defecto que se lle asigna non é compatible coa licenza da experiencia. Cambie a licenza por defecto no seu perfil de usuario ou cambie a licenza da experiencia.");
					}else{
						alert("A actividade non se pode engadir porque a licenza por defecto que se lle asigna non é compatible coa licenza da unidade didáctica. Cambie a licenza por defecto no seu perfil de usuario ou cambie a licenza da unidade didáctica.");
					}
				break;
				case "activity_condition8":
					if ($("#actions").find("#share_experience").size()==1){
						alert("O recurso non se pode engadir porque a súa licenza non é compatible coa licenza da experiencia.");
					}else{
						alert("O recurso non se pode engadir porque a súa licenza non é compatible coa licenza da unidade didáctica.");
					}
				break;
				case "activity_condition9":
					if ($("#actions").find("#share_experience").size()==1){
						alert("O recurso non se pode engadir porque a licenza por defecto que se lle asigna non é compatible coa licenza da experiencia. Cambie a licenza por defecto no seu perfil de usuario ou cambie a licenza da experiencia.");
					}else{
						alert("O recurso non se pode engadir porque a licenza por defecto que se lle asigna non é compatible coa licenza da unidade didáctica. Cambie a licenza por defecto no seu perfil de usuario ou cambie a licenza da unidade didáctica.");
					}
				break;
			}
		break;	
		case "pt":
			switch (data.responseText){
				case "activity_condition4":
					alert("O recurso não se pode adicionar porque a sua licença não é compativel com a licença da atividade.");
				break;
				case "activity_condition5":
					alert("O recurso não se pode adicionar porque a sua licença por padrão não é compativel com a licença da atividade. Mude a licença por padrão no seu perfil de usuário ou mude a licença da atividade.");
				break;
				case "activity_condition6":
					if ($("#actions").find("#share_experience").size()==1){
						alert("A atividade não se pode adicionar porque a sua licença não é compativel com a licença da experiência.");
					}else{
						alert("A atividade não se pode adicionar porque a sua licença não é compativel com a licença do plano de aula.");
					}
				break;
				case "activity_condition7":
					if ($("#actions").find("#share_experience").size()==1){
						alert("A atividade não se pode adicionar porque a licença por padrão que lhe é atribuída não é compativel com a licença da experiência. Mude a licença por padrão no seu perfil de usuário ou mude a licença da experiência.");
					}else{
						alert("A atividade não se pode adicionar porque a licença por padrão que lhe é atribuída não é compativel com a licença do plano de aula. Mude a licença por padrão no seu perfil de usuário ou mude a licença do plano de aula.");
					}
				break;
				case "activity_condition8":
					if ($("#actions").find("#share_experience").size()==1){
						alert("O recurso não se pode adicionar porque a sua licença não é compativel com a licença da experiência.");
					}else{
						alert("O recurso não se pode adicionar porque a sua licença não é compativel com a licença do plano de aula.");
					}
				break;
				case "activity_condition9":
					if ($("#actions").find("#share_experience").size()==1){
						alert("O recurso não se pode adicionar porque a sua licença por padrão não é compativel com a licença da experiência. Mude a licença por padrão no seu perfil de usuário ou mude a licença da experiência.");
					}else{
						alert("O recurso não se pode adicionar porque a sua licença por padrão não é compativel com a licença do plano de aula. Mude a licença por padrão no seu perfil de usuário ou mude a licença do plano de aula.");
					}
				break;
			}
		break;
	}
	

		
}

$(document).on("click", ".add_element", function(event) { //SOLO SE UTILIZA DESDE LOS POPUPS!
	var $this = $(this);
	var data_info_splitted = $this.attr("data-info").split(";");
	var parent_type; //Tipo del elemento padre
	var parent_id; //Id del elemento padre
	var element_id; //Id del elemento contenido
	var element_type; //Tipo del elemento contenido
	var data_ajax;
	var url;
	var special_case = false;
	var final_vector;
	var show_mode;
	
	if(data_info_splitted[0] == "Board"){ //Estamos en el caso de agregar un elemento (Externo) a un board (Dentro del popup)
		parent_type = data_info_splitted[0];
		parent_id = data_info_splitted[1];
		element_type = $("#content_popup input").attr("data-element_type");
		element_id = $("#content_popup input").attr("data-element_id");
		url = "/" + $("#locale").val() + "/boards/"+parent_id.toString()+"/addElement";
		special_case = true;
	}else{ 
		if ($this.hasClass("add_resource_element")){ //Estamos en el caso de agregar un recurso (externo) a una actividad o un lesson_plan (dentro del popup)
			parent_type = data_info_splitted[0];
			parent_id = data_info_splitted[1];
			element_type = $("#content_popup input").attr("data-element_type");
			element_id = $("#content_popup input").attr("data-element_id");
			var controller;
			var aux;
			if (parent_type == "Activity"){
				controller = "activities";
				aux = "activity";
			}else{
				controller = "lesson_plans";
				aux = "lesson_plan";
			}
			url = "/" + $("#locale").val() + "/"+controller+"/"+parent_id.toString()+"/addElement";
			special_case = true;
		}else{//Estamos agregando cualquiero otro elemento a otro elemento (También entran los boards -> Agregar un elemento a un board, siendo el board el elemento externo y el otro elemento el del popup)
			console.log("anadimos recurso desde lupa");
			parent_type = $("#content_popup input").attr("data-parent_type");
			parent_id = $("#content_popup input").attr("data-parent_id");
			element_id = data_info_splitted[1];
			element_type = data_info_splitted[0];
			show_mode = $("#content_popup input").attr("data-show_mode");
			var aux;
			
			switch(parent_type){
				case "LessonPlan":
					url = "/" + $("#locale").val() + "/lesson_plans/"+parent_id.toString()+"/addElement";
					aux = "lesson_plan";
				break;
				case "Activity":
					url = "/" + $("#locale").val() + "/activities/"+parent_id.toString()+"/addElement";
					aux = "activity";
				break;
				case "Board":
					url = "/" + $("#locale").val() + "/boards/"+parent_id.toString()+"/addElement";
				break;
				case "TechnicalSetting":
					url = "/" + $("#locale").val() + "/technical_settings/"+parent_id.toString()+"/addElement";
					aux = "technical_setting";
				break;
				default:
					console.log("La que has liao pollito! Parte 2");
			}
			if((parent_type != "Board") && (parent_type != "TechnicalSetting")){
				//cogemos right_id que identifica el tipo de licencia para poder construir el vector
				var right_id = $this.parents(".record_card").find(".license_image_container img").attr("data_value");
				//creamos vector con las licencias de todos los recursos que tiene la actividad
				final_vector=create_vector_licenses(right_id,aux,parent_id);
			}
		}	
	}
		
	data_ajax = {element_type: element_type, element_id: element_id, parent_type: parent_type, parent_id: parent_id, final_vector: final_vector, show_mode: show_mode, special_case: special_case};
	console.log(data_ajax);
	console.log("antes del add element ajax");
	console.log(data_ajax);
	console.log(url);
	console.log(special_case);
	add_element_ajax(data_ajax, url, special_case);
}); 	

/*	var parent_id = $this.closest(".content").find("input").attr("data-id");
	
	var parent_type = $this.closest(".content").find("input").attr("data-parent");

	var splited_id = $this.attr("id") != undefined ? $this.attr("id").split("->") : "";
	var resource_id = splited_id != "" ? splited_id[1] : "";
	var resource_type = splited_id != "" ? splited_id[0] : "";
		
	
	if($this.closest(".content").find("input").attr("data-box") == "true"){ //Si agregamos un data_box nuevo entramos en este if, en caso contrario vamos al else
		var box_id=$(".id_popup").attr('data-id').split('_')[2];
		var box_components = $(".content_template[data-id='"+parent_id.toString()+"']").find("#box_container_"+box_id.toString()).children(".box_components");
		var tv = false;

		if ($(this).parents("#content_popup").find("input").attr("data-table_view") == "true") {
			tv = true;
		}
	
		//cogemos right_id que identifica el tipo de licencia para poder construir el vector
		var right_id = $this.parents(".record_card").find(".license_image_container img").attr("data_value");
		//creamos vector con las licencias de todos los recursos que tiene la actividad
		console.log("create vector_licenses");
		var final_vector=create_vector_licenses(right_id,parent_type,parent_id);
		
		//console.log("parent_id: "+parent_id);
		var ajax_data = {type_value: resource_type ,content_value: resource_id, element_id: parent_id, box_id: box_id, type: 'Element_From_Popup', table_view: tv, final_vector: final_vector};
		ajax_add_databox(ajax_data, box_components, final_vector, parent_type, parent_id);
		
	}else{
		var selector = parent_type != undefined ? $this.closest(".content").find("input").attr("data-parent") : $this.attr("data-type"); 
/*
 * Explicación de este switch:
 * El selector se obtiene del input que está dentro del popup. Este input contiene 3 parametros: data-box, data-parent, data-id
 * 		- data-box: Es de tipo boolean. Si está a true, quiere decir que estamos agregando algún elemento al template.
 * 		- data-parent: Es de tipo string. Indica que tipo de elemento es el elemento al que vamos a agregar algo.
 * 		- data-id: Es de tipo int. Indica el id del data-parent.
 * 		- Ejemplo: Queremos agregar una Activity DE LA LIBRARY a un LessonPlan. Al clickar sobre la lupa se abre el popup con todas las activities disponibles y de primero un input de la siguiente manera ->
 * 			-> <input type="hidden" data-box="false" data-parent="lesson_plan" data-id"761">. De esta forma sabemos en que form tenemos que buscar para agregar el elemento.
 * Principalmente esta función se llama desde todos los + de agregar elementos desde el popup. También se llama desde el + de TechnicalSetting, EducationalSetting.
 * Estos dos últimos casos son "espciales", pues el selector pierde un poco el sentido que tenía, con ellos.
 * Explicaré el caso de TechnicalSetting, que será igual para EducationalSetting.
 * 
 * ---------------------------------> Esta parte hay que cambiarla para que todo siga la misma lógica y no sea tan complicado de seguir <------------------------------------------
 * El selector ahora no va en función del elemento padre al que vamos a agregar el elemento (solamente en el caso del +, con la lupa se recupera el sentido otra vez). Ahora entramos en el case correspondiente del elemento que
 * estamos agregando (en este caso: technical_setting). Primeramente comparamos que estamos agregando un nuevo elemento. Si no entrara en el primer if, quiere decir que le estoy agregando un application o device. Dentro del
 * primer if, comprobamos si ya hay un TechnicalSetting o si está vacio y vamos a agregar uno por primera vez. La comprobación se realiza comparando los attributes action del form propio del TechnicalSetting con el form
 * del elemento padre. Si son iguales, quiere decir que no hay ningún TechnicalSetting y que vamos a agregar uno nuevo por primera vez. En el caso de que no sea el primer TechnicalSetting, mostramos un mensaje de aviso
 * para informar al usuario que si continúa, perderá la información y no podrá recuperarla.
 */
/*		switch(selector){ //SELECCIONAMOS EN FUNCION DEL DATA-PARENT DEL INPUT
		case "technical_setting":
				if ($this.hasClass("new")) {//Si tiene la clase new -> Vamos a crear un elemento nuevo de 0
					if ($this.parents("form").attr("action") != $this.parents(".settings").siblings("form").attr("action")) {//Comprobamos que hay un setting ya agregado
						var result = false;
						switch($("form").attr("action").split("/")[1]) {//Si hay un setting agregado, avisamos al usuario que perderá la información
							case "es":
								result = confirm("Si continúa se perderá toda la información");
								break;
							case "gl":
								result = confirm("Se continúa perderase toda a información");
								break;
							default:
								result = confirm("If you continue the information will lost");

						}
						if (result) {//Si el usuario acepta el dialogo de advertencia, procedemos a agregar el nuevo setting
							var url = $this.parents(".settings").siblings("form").attr("action") + "/addElement";
							var ajax_data = {
								type : $this.attr("data-type"),
								new_element : true,
								delete_old : true
							};
							create_content_element_ajax(ajax_data, url, $this);
						}
					} else {//Si no hay ningun setting agregado, lo creamos directamente
						var url = $this.parents("form").attr("action") + "/addElement";
						var ajax_data = {
							type : $this.attr("data-type"),
							new_element : true
						};
						create_content_element_ajax(ajax_data, url, $this);
					}
				} else {//Si no tiene la clase new, quiere decir que vamos a agregar un setting de la library o agregarle un application o device
					var variable = $this.parents(".record_card").siblings("input").attr("data-parent");
					var url = $("#edit_technical_setting_" + $this.parents(".content").find("input").attr("data-id")).attr("action") + "/addElement";
					var ajax_data = {
						type : $this.attr("data-type"),
						element_id : resource_id,
						new_element : false
					};
					create_content_element_ajax(ajax_data, url, $this);
				}

				break;
		case "educational_setting"://AQUI NO TOQUES
			if($this.hasClass("new")){
				if($this.parents("form").attr("action") != $this.parents(".settings").siblings("form").attr("action")){
					var result = false;
					switch($("form").attr("action").split("/")[1]){
						case "es":
							result = confirm("Si continúa ser perderá toda la información");
						break;
						case "gl":
							result = confirm("Se continúa perderase toda a información");
						break;
						default:
							result = confirm("If you continue the information will lost");
						
					}
						if (result) {
							var url = $this.parents(".settings").siblings("form").attr("action") + "/addElement";
							var ajax_data = {
								type : $this.attr("data-type"),
								new_element : true,
								delete_old : true
							};
							create_content_element_ajax(ajax_data, url, $this);
						}
					} else {
						var url = $this.parents("form").attr("action") + "/addElement";
						var ajax_data = {
							type : $this.attr("data-type"),
							new_element : true
						};
						create_content_element_ajax(ajax_data, url, $this);
					}
				}
				break;
		case "activity":
				console.log("add_element: Activity");
				//cogemos right_id que identifica el tipo de licencia para poder construir el vector
				var right_id = $this.parents(".record_card").find(".license_image_container img").attr("data_value");
				//creamos vector con las licencias de todos los recursos que tiene la actividad
				console.log("create vector_licenses");
				var final_vector=create_vector_licenses(right_id,parent_type,parent_id);
				
				var url = $("#edit_activity_" + parent_id).attr("action") + "/addElement";
				var mini_view;
				if ($("#resources_mini_view").hasClass("invisible")){
					mini_view = false;
				}else{
					mini_view = true;
				}
				var ajax_data = {
					element_id : resource_id,
					new_element : false,
					type : resource_type,
					mini_view : mini_view,
					final_vector : final_vector
				};
				create_content_element_ajax(ajax_data, url, $this);
				break;
		case "lesson_plan": //Lupa de agregar actividades
			var url = $("#edit_lesson_plan_"+parent_id).attr("action")+"/addElement";
			var tv = $this.parents("#content_popup").find("input").attr("data-table_view");
			//LOGICA DE LICENCIAS
			//cogemos right_id que identifica el tipo de licencia para poder construir el vector
			console.log("Lesson plans");
			var right_id = $this.parents(".record_card").find(".license_image_container img").attr("data_value");
			//creamos vector con las licencias de todos los recursos que tiene el lesson plan
			var final_vector=create_vector_licenses(right_id,parent_type,parent_id);
			console.log("final_vector in LP: "+final_vector);
			
			var ajax_data = {element_id: resource_id, new_element: false, type: resource_type, table_view: tv, final_vector: final_vector};
			create_content_element_ajax(ajax_data, url,$this);
			break;
			
			case "boards":
				var where = $this.closest(".content").find("input").attr("data-id");
				console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!");
				console.log(where);
				console.log(resource_id);
				console.log($this.closest(".content").find("input").attr("data-id"));
				console.log('Fin!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
				/* En este caso se sigue utilizando id_resource pero seria equivalente a id_element pq se incluye un elemento de cualquier tipo*/
/*				var url = "/" + $("#locale").val() + "/boards/addElementToBoard";
				ajax_add_element_to_board(resource_id, $this.closest(".content").find("input").attr("data-id"), url, where);
				break;

			default:
				console.log(selector);
				console.log("Se ha producido un error");
				break;
		}
	}
*/

function ajax_add_databox(data, box_components, final_vector, parent_type, parent_id){
	//console.log("data ajax: "+data["content_value"]);
	jQuery.ajax({
		type : "POST",
		url : "/" + $("#locale").val() + "/dataBoxes/addDataToBox",
		dataType : "html",
		data : data
	}).done(function(data) {

		if (!$.trim(data)) {
			alert("El recurso no se puede añadir porque ya está incluido.");
		} else {
			box_components.prepend(data);
		}

		$("#marco_popup").hide();
		$("#background_overlay").hide();
		$("body").css('overflow', 'visible');
		
		console.log("final vector add_data_box: "+final_vector);
		console.log($("#edit_" + parent_type + "_" + parent_id +" .vector_licenses").val());
		$("#edit_" + parent_type + "_" + parent_id +" .vector_licenses").val(final_vector);
		console.log("ajax_data_box => vector_licenses: "+$("#edit_" + parent_type + "_" + parent_id +" .vector_licenses").val());
		$("#edit_" + parent_type + "_" + parent_id +" .prev_vector_licenses").val($("#edit_" + parent_type + "_" + parent_id +" .vector_licenses").val());
		//console.log("previous vector en add_data_box: "+$("#edit_" + parent_type + "_" + parent_id +" .prev_vector_licenses").val());
		
	}).fail(function(data){
		//console.log($("form").attr("action"));
		$("#edit_" + parent_type + "_" + parent_id +" .vector_licenses").val($("#edit_" + parent_type + "_" + parent_id +" .prev_vector_licenses").val());
		switch($("form").attr("action").split("/")[1]){ /*así cogemos solo el idioma de la url, ex: /es/activities/filter*/
					case "es":
						if ((final_vector == "5") || (final_vector == "6")){
							alert("El recurso no se puede añadir. Para poder añadir un recurso con licencia CC-BY-ND o CC-BY-NC-ND es necesario ser el creador de ese recurso.");
						}
						else{
							alert("El recurso no se puede añadir porque la licencia no es compatible con la licencia de la actividad. Las únicas licencias compatibles con la actividad son:" );
						}
					break;
					case "gl":
						if ((final_vector == "5") || (final_vector == "6")){
							alert("El recurso no se puede añadir. Para poder añadir un recurso con licencia CC-BY-ND o CC-BY-NC-ND es necesario ser el creador de ese recurso.");
						}
						else{
							alert("non compatible");
						}
					break;
					case "en":
						if ((final_vector == "5") || (final_vector == "6")){
							alert("El recurso no se puede añadir. Para poder añadir un recurso con licencia CC-BY-ND o CC-BY-NC-ND es necesario ser el creador de ese recurso.");
						}
						else{
							alert("not compatible");
						}
					break;
					case "pt":
						if ((final_vector == "5") || (final_vector == "6")){
							alert("El recurso no se puede añadir. Para poder añadir un recurso con licencia CC-BY-ND o CC-BY-NC-ND es necesario ser el creador de ese recurso.");
						}
						else{
							alert("nao compatible");
						}
					break;			
		}
		
		/* Mensaje de error cuando las licencias no son compatibles*/
		/*$("#content_popup").html("<div>El recurso no se puede añadir porque la licencia no es compatible con la licencia de la actividad.</div>");*/
		/*alert("El recurso no se puede añadir porque la licencia no es compatible con la licencia de la actividad. Las únicas licencias compatibles con la actividad son:" );*/
	});
	
}

/***********************************************************************************************/
/* Cuando se crea una actividad, se crea a partir de un template */
/* Se tienen que crear también todas las data boxes asociadas a ese template que ahora pertenecerán a la nueva actividad creada */

$(document).on("click", ".create_element", function(event) {
	console.log("creating new elementtttttttttttttt");
	var img_id = $(this).attr('id').split("->");
	var data;
	if (img_id[0] == "template") {
		data = {
			template_id : img_id[1]
		};
	} else {
		data = {
			element_id : img_id[1]
		};
	}
	var url = "/" + $("#locale").val() + "/" + $("#content_container").data('type') + "/create.json";

	jQuery.ajax({
		type : "POST",
		url : url,
		dataType : "json",
		data : data,
	}).done(function(data) {
		$(location).attr("href", "/" + $("#locale").val() + "/" + $("#content_container").data('type') + "/" + data.id + "?created=true");
	});

});

/********************************************************************************************************/
/* Función para eliminar un recurso de una determinada box                                              */
/* Para ello se debe eliminar la entrada en la tabla de data_boxes correspondiente                      */

$(document).on("click",".delete_data_box_miniview",function(event){
	var $this = $(this);
	var data_box = $(this).parent();
	var data_box_id = $(this).attr('id');

	var box_container = data_box.parent().parent();
	var select_tag = $(box_container).children(".itemizes");
	var data_type ="html";
	if ($(this).parents(".box_components").hasClass("BEI")){
		data_type="json";
	}
	//console.log("vector_licenses en delete_data_box :"+$("#vector_licenses").val());
	//console.log("previous vector en delete_data_box :"+$("#prev_vector_licenses").val());

	jQuery.ajax({
		type: "DELETE",
		url: "/"+$("#locale").val()+"/dataBoxes/"+data_box_id,
		dataType: data_type,
		data: {},
	}).done(function(data){
		if(data_type == "json"){
			$this.parents("form").find(".vector_licenses, .prev_vector_licenses").val(data.licenses);
		}else{
			if ($.trim(data)){
				$(select_tag).html(data);
			}
	 	}
		data_box.remove();
	});
});

/***************************************************************************************************************************/
/* Función para añadir un nuevo item a una box BI, este nuevo item será uno de los términos de un determinado vocabulario  */

function add_new_box_item() {
	var type_value = $(this).val();
	var activity_id = $(this).closest(".content_template").attr('data-id');
	var box_id = $(this).parent().data('box-id');

	var select_tag = $(this).parent();
	/* Select completo */
	var box_container = $(select_tag).parent();
	/* Etiqueta box_container */
	var box_components = $(box_container).children(".box_components");

	jQuery.ajax({
		type : "POST",
		url : "/" + $("#locale").val() + "/dataBoxes/addDataToBox",
		dataType : "html",
		data : {
			type_value : type_value,
			element_id : activity_id,
			box_id : box_id,
			type : "Vocabulary"
		},
	}).done(function(data) {

		var new_select = $($.parseHTML(data)).filter("#activity_data_boxes_content_value");
		$(select_tag).html(new_select);

		var new_databox = $($.parseHTML(data)).filter(".data_box_bi");
		$(box_components).children().append(new_databox);
	});
};

$(document).on("change", ".add_option_item", add_new_box_item);

/********************************************************************************************************+
 * Función que añade un nuevo vocabulario, propio del usuario, a una BI
 */

$(document).on("click", ".add_free_text", function(event) {

	var box_container = $(this).parent();
	var box_id = box_container.attr('id').split("_")[2];
	var ul = $(box_container).children(".box_components").children();
	var activity_id = $(this).closest(".content_template").attr('data-id');

	jQuery.ajax({
		type : "POST",
		url : "/" + $("#locale").val() + "/dataBoxes/addDataToBox",
		dataType : "html",
		data : {
			type_value : "Free_Text",
			element_id : activity_id,
			box_id : box_id,
			type : 'Free_Text'
		},
	}).done(function(data) {
		var new_databox = $($.parseHTML(data)).filter(".data_box_bfti");
		$(ul).append(new_databox);
		$(".data_box_bfti").sortable("refresh");
	});
});

/********************************************************************************************************/
/* Función para eliminar un recurso de una determinada box                                              */
/* Para ello se debe eliminar la entrada en la tabla de data_boxes correspondiente                      */

$(document).on("click", ".delete_data_box_item", function(event) {

	var data_box = $(this).parent().parent();
	var data_box_id = $(this).attr('id');

	var box_container = data_box.parent().parent().parent();
	var select_tag = $(box_container).children(".itemizes");

	jQuery.ajax({
		type : "DELETE",
		url : "/" + $("#locale").val() + "/dataBoxes/" + data_box_id,
		dataType : "html",
		data : {},
	}).done(function(data) {
		if ($.trim(data)) {
			$(select_tag).html(data);
		}
		data_box.remove();
	});
});

/* Funciones para agregar un elemento a otro elemento */
/* Se utilizan dos funciones. La primera recoje el evento de hacer click en el + del elemento del popup */
/* La siguiente es la llamada ajax al servidor. Está separada para que se pueda llamar desde la función que recoje el evento onclick de "add_element" */
/* "add_element" se utiliza para agregar data boxes nuevas a un template, o para agregar elementos que estan contenidos en otros elementos */
/* Por ejemplo: Para agregar una activity de la library a un lesson plan. */


/* Función que se utiliza para mostrar información */
$(document).on("click", ".show_info", function() {
	$(this).siblings(".dropdown.info_bubble").effect("slide", {
		direction : "up"
	}, 300);

	$(".dropdown.info_bubble").hover(function() {
	}, function() {
		$(".dropdown.info_bubble").slideUp(300);
	});

});

$(document).on("click", ".expand_content", function() {
	$(this).parents("form").toggleClass("half-open");
	$(this).parents("form").siblings(".settings").toggleClass("half-open");
	$(this).parents("form").siblings(".resources").toggleClass("invisible");
});

$(document).on("click", ".expand_setting", function() {
	$(this).parents("#setting_header").siblings("#setting_body").toggleClass("collapsed");
	if ($(this).parents("#setting_header").siblings("#setting_body").hasClass("collapsed")) {
		$(this).attr("src", "/images/icons/White/arrow-down.svg");
	} else {
		$(this).attr("src", "/images/icons/White/arrow-up.svg");
	}
});

//ESTA FUNCIÓN SE UTILIZA PARA AGREGAR CUALQUIER ELEMENTO A LA BIBLIOTECA CORRESPONDIENTE
$(document).on("click", ".add_to_library", function() {
	var $this = $(this);
	var url = "";
	var data = "";

	if ($this.hasClass("setting")) {
		url = $this.parents("form").attr("action") + "/addToLibrary";
	} else {
		url = $this.closest("form").attr("action") + "/addToLibrary";
	}
	$.ajax({
		type : "POST",
		url : url,
		dataType : "json",
	}).done(function(data) {
		if ($(".save_ok").length != 0) {
			$(".save_ok").remove();
		}
		
		switch($this.parents("form").attr("action").split("/")[1]){
		case "es":
			alert("El elemento se ha agregado correctamente a la biblioteca." );
		break;
		case "gl":
			alert("O elemento agregouse correctamente á biblioteca.");
		break;
		case "en":
			alert("The element has been added in the library.");
		break;
		case "pt":
			alert("Elemento adicionado na biblioteca.");
		break;			
		}	
	});
});

/*
function ajax_add_element_to_board(element_id, board_id, url, where) {
	jQuery.ajax({
		type : "POST",
		url : url,
		dataType : "html",
		data : {
			element_id : element_id,
			id : board_id
		},
	}).done(function(data) {

		if ($($.parseHTML(data)).filter("#element_repeat").val() != undefined) {
			var hidden_info = $("#content_popup").children('input');
			console.log($("#content_popup").children('input'));
			$("#content_popup").html($($.parseHTML(data)));
			$("#content_popup").prepend(hidden_info);
		} else {
			$("#marco_popup").hide();
			$("#background_overlay").hide();
			$("body").css('overflow', 'visible');

			if (board_id == where) {
				if ($("#board_element_list").val() == undefined) {
					$("#content_container").append("<div id='board_element_list' class='content'></div>");
				}
				$("#board_element_list").prepend(data).masonry('reloadItems');

				var container = $('#board_element_list');
				container.imagesLoaded(function() {
					container.masonry({
						columnWidth : 2,
						itemSelector : '.cards'
					}).fadeIn();
				});
			} else {
				window.location.reload();
			}
		}
	});
};


$(document).on("click", ".add_element_board", function() {
	var $this = $(this);
	var board_id = $this.attr('id').split("->")[1];
	var element_id = $("#content_popup input").attr("data-element_id");
	var url = "/" + $("#locale").val() + "/boards/addElementToBoard";
	var where = $("#content_popup").children().filter('input').attr('data-id');
	console.log(board_id);
	console.log(element_id);
	console.log(url);
	console.log(where);
	ajax_add_element_to_board(element_id, board_id, url, where);
});
*/

$(document).on("click", ".delete_element_board", function() {
	var $this = $(this);
	var element_id = $this.attr('id');
	var board_id = $("#board_elements_selector").attr("data-id");
	var url = "/" + $("#locale").val() + "/boards/deleteElementFromBoard";
	var result = false;
	
	switch($("form").attr("action").split("/")[1]) {//Si hay un setting agregado, avisamos al usuario que perderá la información
		case "es":
			result = confirm("¿Está seguro de querer eliminar el elemento del tablero?");
			break;
		case "gl":
			result = confirm("Está seguro de querer eliminar o elemento do taboleiro?");
			break;
		default:
			result = confirm("Are you sure that you want to remove the element from the board?");
	}

	if (result){
		jQuery.ajax({
			type : "DELETE",
			url : url,
			dataType : "json",
			data : {
				element_id : element_id,
				id : board_id
			},
		}).done(function(data) {
			$this.parent().parent().parent().remove();
			var container = $('#board_element_list');
			container.imagesLoaded(function() {
				container.masonry({
					columnWidth : 2,
					itemSelector : '.cards'
				}).fadeIn();
			});
		});
	}
	
});

$(document).on("click", "#second_level_options", function() {
	var $this = $(this);
	
	if ($this.siblings().find("select").size() == 0 || $($this.siblings().find("select")[0]).hasClass("invisible")){
		$this.parents("form").find(".add_vocabulary_setting").toggleClass("invisible");
		$this.parents("form").find(".delete_setting_term").toggleClass("invisible");
		$("#first_level_options").css('background-color', '#A3ADB7');
	
		var url = $this.parents("form").attr("action") + "/validateOptionsVocabulary";
	
		switch($("form").attr("action").split("/")[1]) {
			case "es":
				$("<div id='loading'><img class='loading_vocabularies' src='/images/icons/ajax-loader.gif' width='13'><span>Cargando...</span></div>").insertAfter("#popup_background");
				break;
			case "gl":
				$("<div id='loading'><img class='loading_vocabularies' src='/images/icons/ajax-loader.gif' width='13'><span>Cargando...</span></div>").insertAfter("#popup_background");
				break;
			case "pt":
				$("<div id='loading'><img class='loading_vocabularies' src='/images/icons/ajax-loader.gif' width='13'><span>Carregamento...</span></div>").insertAfter("#popup_background");
				break;
			default:
				$("<div id='loading'><img class='loading_vocabularies' src='/images/icons/ajax-loader.gif' width='13'><span>Loading...</span></div>").insertAfter("#popup_background");
		}
		
		$.ajax({
			type : "POST",
			url : url,
			dataType : "html",
			data: {accion: "second_level"}
		}).done(function(data) {
			$(".validate_options").html(data);
			$("#loading").remove();
		});
	}
});

$(document).on("click", "#first_level_options", function() {
	var $this = $(this);

	if ($this.siblings().find("select").size() == 0 || $($this.siblings().find("select")[0]).hasClass("invisible")){
		$this.parents("form").find(".add_vocabulary_setting").toggleClass("invisible");
		$this.parents("form").find(".delete_setting_term").toggleClass("invisible");
		$("#second_level_options").css('background-color', '#A3ADB7');
		
		var url = $this.parents("form").attr("action") + "/validateOptionsVocabulary";
		
		switch($("form").attr("action").split("/")[1]) {
			case "es":
				$("<div id='loading'><img class='loading_vocabularies' src='/images/icons/ajax-loader.gif' width='13'><span>Cargando...</span></div>").insertAfter("#popup_background");
				break;
			case "gl":
				$("<div id='loading'><img class='loading_vocabularies' src='/images/icons/ajax-loader.gif' width='13'><span>Cargando...</span></div>").insertAfter("#popup_background");
				break;
			case "pt":
				$("<div id='loading'><img class='loading_vocabularies' src='/images/icons/ajax-loader.gif' width='13'><span>Carregamento...</span></div>").insertAfter("#popup_background");
				break;
			default:
				$("<div id='loading'><img class='loading_vocabularies' src='/images/icons/ajax-loader.gif' width='13'><span>Loading...</span></div>").insertAfter("#popup_background");
		}
		
		$.ajax({
			type : "POST",
			url : url,
			dataType : "html",
			data: {accion: "first_level"}
		}).done(function(data) {
			$(".reload_options").html(data);
			$("#loading").remove();
		});
	}
});


$(document).on("change", ".add_vocabulary_setting", function() {
	var $this = $(this);
	var vocabulary_term_id = $this.val();
	//Recogemos el id del vocabulario que estamos agregando. Queda coger la URL a la que llamar y enviarlo y en el done, eliminar el option de la lista
	var url = $this.parents("form").attr("action") + "/addVocabulary";
	
	var with_reload = false;
	var datatype = "json";
		
	var type = $this.closest(".contents").attr("data-type");
	if (type == "educational_setting") {
		if (!$this.hasClass("no_reload")){
			with_reload = true;
			datatype = "html";	
		}
		var second_level = false;
		if ($this.parents(".validate_options").size()!=0){
			second_level = true;
		}
	}
	var params = {
		term_id : vocabulary_term_id,
		with_reload : with_reload
	};
	
	switch($("form").attr("action").split("/")[1]) {
		case "es":
			$("<div id='loading'><img class='loading_vocabularies' src='/images/icons/ajax-loader.gif' width='13'><span>Cargando...</span></div>").insertAfter("#popup_background");
			break;
		case "gl":
			$("<div id='loading'><img class='loading_vocabularies' src='/images/icons/ajax-loader.gif' width='13'><span>Cargando...</span></div>").insertAfter("#popup_background");
			break;
		case "pt":
			$("<div id='loading'><img class='loading_vocabularies' src='/images/icons/ajax-loader.gif' width='13'><span>Carregamento...</span></div>").insertAfter("#popup_background");
			break;
		default:
			$("<div id='loading'><img class='loading_vocabularies' src='/images/icons/ajax-loader.gif' width='13'><span>Loading...</span></div>").insertAfter("#popup_background");
	}
	
	$.ajax({
		type : "POST",
		url : url,
		dataType : datatype,
		data : params
	}).done(function(data) {
		if (with_reload) {
			if (second_level){
				$(".validate_options").html(data);	
			}else{
				$(".reload_options").html(data);
			}
		}else{
			$this.parents(".vocabularies").append("<div class='vocabulary_boxy' data-id='" + data.id + "'><img alt='Close' class='delete_setting_term delete' src='/images/icons/Black/close.svg' width='11'>" + data.term + "</div>");
			$this.children("option[value='" + vocabulary_term_id.toString() + "']").remove();
		}
		$("#loading").remove();
	});

});

$(document).on("click", ".delete_setting_term", function() {
	var $this = $(this);
	var setting_term_id = $this.parent().attr("data-id");
	var url = $this.parents("form").attr("action") + "/removeTerm";

	var with_reload = false;
	var datatype = "json";
		
	var type = $this.closest(".contents").attr("data-type");
	if (type == "educational_setting") {
		if (!$this.hasClass("no_reload")){
			with_reload = true;
			datatype = "html";	
		}
		var second_level = false;
		if ($this.parents(".validate_options").size()!=0){
			second_level = true;
		}
	}
	var params = {
		term_id : setting_term_id,
		with_reload : with_reload
	};
	
	switch($("form").attr("action").split("/")[1]) {
		case "es":
			$("<div id='loading'><img class='loading_vocabularies' src='/images/icons/ajax-loader.gif' width='13'><span>Cargando...</span></div>").insertAfter("#popup_background");
			break;
		case "gl":
			$("<div id='loading'><img class='loading_vocabularies' src='/images/icons/ajax-loader.gif' width='13'><span>Cargando...</span></div>").insertAfter("#popup_background");
			break;
		case "pt":
			$("<div id='loading'><img class='loading_vocabularies' src='/images/icons/ajax-loader.gif' width='13'><span>Carregamento...</span></div>").insertAfter("#popup_background");
			break;
		default:
			$("<div id='loading'><img class='loading_vocabularies' src='/images/icons/ajax-loader.gif' width='13'><span>Loading...</span></div>").insertAfter("#popup_background");
	}
	
	$.ajax({
		type : "DELETE",
		url : url,
		dataType : datatype,
		data : params
	}).done(function(data) {
		if (with_reload) {
			if (second_level){
				$(".validate_options").html(data);	
			}else{
				$(".reload_options").html(data);
			}
		}else{
			$this.parent().siblings("select").append("<option value='" + data.id.toString() + "'>" + data.term + "</option>");
			$this.parent().remove();
		}
		$("#loading").remove();
	});
});

//Función que elimina una actividad de un lesson plan o un recurso de una actividad o lesson plan
//Función que elimina un recurso o una actividad contenida en otro elemento, sea en la vista form como en la vista miniview
$(document).on("click", ".delete_element", function(event){
	var $this = $(this);
	var url;
	var data_info_splitted = $this.attr("data-info").split(";");
	var controller = data_info_splitted[0];
	var element_id = data_info_splitted[1];
	url = "/" + $("#locale").val() + "/" + controller + "/" + element_id;
	
	var result = false;
	switch($("form").attr("action").split("/")[1]) {//Si hay un setting agregado, avisamos al usuario que perderá la información
		case "es":
			result = confirm("Se va a eliminar el elemento, ¿estás seguro?");
			break;
		case "gl":
			result = confirm("Vaise eliminar o elemento, estás seguro?");
			break;
		case "en":
			result = confirm("The element will be removed, are you sure?");
			break;
		default:
			result = confirm("O elemento vai ser removido, voçê tem certeza?");

	}
	if (result){
		$.ajax({
			type: "DELETE",
			url: url,
			dataType: "json",
		}).done(function(data){
			if(controller == "activities"){ //En el caso de una actividad
				if (data.licenses != null){
					$this.parents("#content_container").find(".element_summary .vector_licenses , .element_summary .prev_vector_licenses").val(data.licenses);
				}
				//Se tiene que actualizar la breadcrumb
				$("#activities_breadcrumb").find(".actstyle").children("ul").children().remove();
				jQuery.each( data.li_activities, function( i, val ) {
					$("#activities_breadcrumb").find(".actstyle").children("ul").append("<li><a class='show_element_in_lp' data-info='Activity;"+i+"'>1."+val+"</a></li>");
				});
				
				/*if ($this.parent().parent().prev().attr("class") == ("activity_number")) {
					var index = $this.parent().parent().prev().children("a").attr("name").split("_")[2];
					switch($("form").attr("action").split("/")[1]) {
						case "es":
							activity = ("Actividad");
							break;
						case "gl":
							activity = ("Actividade");
							break;
						default:
							activity = ("Activity");
					}
					for (var i = index; i < ($("#numbers_activities").children().size() - 1); i++) { //Se actualizan los índices que tiene cada una de las actividades que forma un lesson_plan a partir de la actividad eliminada
						if ($("[name='activity_position_" + i + "']") != undefined) {
							$("[name='activity_position_" + i + "']").parent().html("<span name='activity_name'>" + activity + " " + (i - 1) + "</span> <a name='activity_position_" + (i - 1) + "'><span>" + activity + " " + (i - 1) + "</span></a>");
						}
					}
					$this.parent().parent().prev().remove(); //Se elimina la etiqueta actividad asociada a la actividad que se va a eliminar
				}
				$("#numbers_activities").children().last().prev().remove(); //Se elimina una actividad de la barra de actividades superior
				if (data.valid_template == true){
					$("#activities_section_header").children(0).children(".table_view_icon").removeClass("invisible");
				}*/
				
			}else{
				if (data.licenses != null){
					$this.parents("#content_container").find(".element_summary .vector_licenses , .element_summary .prev_vector_licenses").val(data.licenses);			
				}
			}
			$this.closest(".element_contained").fadeOut(1000).remove(); //Se elimina el elemento miniview en concreto
		});			
	}
});



$(document).on("click", "#comment_it", function() {
	var $this = $(this);
	var description = $this.siblings().val();
	var nav_bar = $this.hasClass("comment_it_nav_bar"); //En este caso estoy en la vista show obteniendo la informacion de paradata
	var href;
	if (nav_bar) {
		href = window.location.pathname;
	} else {
		href = $this.closest(".record_card").children("a").attr("href");
	}
	switch(description) {
		case "":
			switch($(".web_title_text").attr("href").split("=")[1]) {
				case "es":
					alert("No se pueden enviar comentarios vacíos.");
					break;
				case "gl":
					alert("Non se poden enviar comentarios baleiros.");
					break;
				default:
					alert("You can't send empty comments.");
			}
			break;
		default:
			$.ajax({
				type : "POST",
				url : href + "/setComments",
				dataType : "html",
				data : {
					description : description,
					nav_bar : nav_bar
				},
			}).done(function(data) {
				if (nav_bar) {
					var number_comments = parseInt($(".comment_it_nav_bar").closest("#paradata_content").siblings(".paradata_information").find(".comments_info").children("span")[0].innerText);
					if (number_comments == 0) {
						$(".dropdown_paradata").children().first().remove();
					}
					number_comments += 1;
					$(".comment_it_nav_bar").closest("#paradata_content").siblings(".paradata_information").find(".comments_info").children("span")[0].innerHTML=number_comments.toString();

					$(".dropdown_paradata").prepend(data);
					$this.prev().remove();
					$("<textarea class='comment_input' cols='1' height='auto' id='comment_description' name='comment[description]' placeholder='Tu comentario...' rows='1' width='100%'></textarea>").insertBefore($this);

				} else {
					$(".actual_comments").prepend(data);
					$this.prev().remove();
					$("<textarea class='comment_input' cols='1' height='auto' id='comment_description' name='comment[description]' placeholder='Tu comentario...' rows='1' width='100%'></textarea>").insertBefore($this);
					var comment_icon = $('button').closest(".record_card").children(".bottom_bar").children(".record_card_icons").children(".comment_icon");
					if ((comment_icon.children().attr("value")) == undefined) {
						new_value = 1;
						$(".actual_comments").children().remove('p');
					} else {
						new_value = $(".actual_comments").children(".comment").size();
					}
					comment_icon.html("<span class='social_counter comments_counter' value='" + new_value + "'>" + new_value + "</span>");
				}
			});
	}
});

$(document).on("click", ".comment_icon", function() {
	var $this = $(this);
	var type = "comments";
	var data_info_splitted = $this.attr("data-info").split(";"); 
	var controller = data_info_splitted[0];
	if (controller == "lessonplans"){
		controller = "lesson_plans";
	}
	var element_id = data_info_splitted[1];
	var url = "/" + $("#locale").val() + "/" + controller + "/" + element_id + "/getComments";
	show_content_icon_ajax(type, url, $this, false);
});

$(document).on("click", ".social_icon", function() {
	var $this = $(this);
	var type = "boards";
	var element_id = $this.attr("data-info").split(";")[1];
	var url = "/" + $("#locale").val() + "/boards/" + element_id + "/getBoardsFromElement";
	show_content_icon_ajax(type, url, $this, false);
});

$(document).on("click", ".view_icon", function() {
	var $this = $(this);
	var type = "views";
	var url = "/" + $("#locale").val() + "/usages/getViews";
	show_content_icon_ajax(type, url, $this, false);
});

$(document).on("click", ".copy_icon", function() {
	var $this = $(this);
	var type = "copies";
	var url = "/" + $("#locale").val() + "/usages/getCopies";
	show_content_icon_ajax(type, url, $this, false);
});

$(document).on("click", ".comments_info", function() {
	var $this = $(this);
	var type = "comments";
	var data_info_splitted = $this.attr("data-info").split(";"); 
	var controller = data_info_splitted[0];
	if (controller == "lessonplans"){
		controller = "lesson_plans";
	}
	var element_id = data_info_splitted[1];
	var url = "/" + $("#locale").val() + "/" + controller + "/" + element_id + "/getComments";
	if ($(".dropdown_paradata") != undefined) {
		$("#paradata_content .dropdown_paradata").remove();
	}
	show_content_icon_ajax(type, url, $this, true);
});

$(document).on("click", ".boards_info", function() {
	var $this = $(this);
	var type = "boards";
	var element_id = $this.attr("data-info").split(";")[1];
	var url = "/" + $("#locale").val() + "/boards/" + element_id + "/getBoardsFromElement";
	if ($(".dropdown_paradata") != undefined) {
		$("#paradata_content .dropdown_paradata").remove();
	}
	show_content_icon_ajax(type, url, $this, true);
});

$(document).on("click", ".paradata_icon.user_info", function(){
	var $this = $(this);
	$this.closest("#paradata_information").children().first().remove();
	var info_box = $(".element_info_box").children().clone().first().addClass("dropdown").addClass("paradata").addClass("user_info_box");
	$this.closest("#paradata_information").prepend(info_box);
	$(".dropdown.paradata").slideDown(300);
	$("div.action_icon .dropdown.paradata").hover(function() {
	}, function() {
		$("div.action_icon .dropdown.paradata").slideUp(300);
		$("div.action_icon .dropdown.paradata").remove();
	});	
});

$(document).on("click", ".view_info", function() {
	var $this = $(this);
	var type = "views";
	var url = "/" + $("#locale").val() + "/usages/getViews";
	if ($(".dropdown_paradata") != undefined) {
		$("#paradata_content .dropdown_paradata").remove();
	}
	show_content_icon_ajax(type, url, $this, true);
});

$(document).on("click", ".copy_info", function() {
	var $this = $(this);
	var type = "copies";
	var url = "/" + $("#locale").val() + "/usages/getCopies";
	if ($(".dropdown_paradata") != undefined) {
		$("#paradata_content .dropdown_paradata").remove();
	}
	show_content_icon_ajax(type, url, $this, true);
});

$(document).on("click", ".info", function() {
	var $this = $(this);
	var type = "info";
	var data_info_splitted = $this.attr("data-info").split(";");
	var controller = data_info_splitted[0];
	if (controller == "lessonplans"){
		controller = "lesson_plans";
	}
	var url = "/" + $("#locale").val() + "/" + controller + "/getInfo";
	if ($(".dropdown_paradata") != undefined) {
		$("#paradata_content .dropdown_paradata").remove();
	}
	show_content_icon_ajax(type, url, $this, true);
});

function show_content_icon_ajax(type, url, $this, show) {
	if ($("#background_overlay").size() == 0) {
		if (url != null) {
			var data_info_splitted = $this.attr("data-info").split(";"); 
			var element_id = data_info_splitted[1];
			$.ajax({
				type : "GET",
				url : url,
				dataType : "html",
				data : { show : show, id: element_id },
			}).done(function(data) {
				if (show == false) {
					$this.parents(".record_card").append(data).css('z-index', 5001);
					$(".footer").css('z-index', -1);
					$("<div id='background_overlay' class='close_comments'></div>").insertAfter($this.parents(".record_card").next());
					if (type == "comments") {
						//Actualizamos el número de comentarios por si ha cambiado
						var comment_icon = $('button').closest(".record_card").children(".bottom_bar").children(".record_card_icons").children(".comment_icon");
						if ($(".actual_comments").children(".comment").size() != 0) {
							comment_icon.html("<span class='social_counter comments_counter' value='" + $(".actual_comments").children(".comment").size() + "'>" + $(".actual_comments").children(".comment").size() + "</span>");
						}
					}
				} else {
					$this.parents(".paradata_information").siblings("#paradata_content").append(data);
					$(".dropdown_paradata").slideDown(300);
					$("#paradata_content .dropdown_paradata").hover(function() {
					}, function() {
						$("#paradata_content .dropdown_paradata").slideUp(300);
						$("#paradata_content .dropdown_paradata").remove();
					});
				}

			});

		}

	} else {

		if (show == false) {
			var value = $(".comments").attr("value");
			if ((value == "boards") || (value == "views" ) || (value == "copies" )) {
				$(".comments").next().remove();
			}
			$(".comments").remove();
			$("#background_overlay").remove();
			$(".record_card").css('z-index', 0);
			$(".footer").css('z-index', 0);

			if (value != type) {
				show_content_icon_ajax(type, url, $this, false);
			}
		}

	}
}


$(document).on("click", ".close_comments", function() {
	if (($(".comments").attr("value") == "boards") || ($(".comments").attr("value") == "views") || ($(".comments").attr("value") == "copies") || ($(".comments").attr("value") == "relevances")) {
		$(".comments").next().remove();
	}
	$(".comments").remove();
	$("#background_overlay").remove();
	$(".record_card").css('z-index', 0);
	$(".footer").css('z-index', 0);
});

$(document).on("click", ".quality_icon", function() {
	var $this = $(this);
	var type = "relevances";
	var controller = $this.attr("data-info").split(";")[0];
	if (controller == "lessonplans"){
		controller = "lesson_plans";
	}
	var url = "/" + $("#locale").val() + "/" + controller + "/getRelevanceInfo";
	show_content_icon_ajax(type, url, $this, false);
});

$(document).on("keypress", ".keyword_input", function(event) {
	var $this = $(this);
	var code = event.keyCode || event.which;
	if (code == 13) {
		event.preventDefault();
		if ($this.val() == "") {
			return;
		}
		add_keyword_ajax($this);
	}
});

$(document).on("change", ".keyword_input", function(event) {
	var $this = $(this);
	if ($this.val() == "") {
		return;
	}
	add_keyword_ajax($this);
	$this.focus();
});

function add_keyword_ajax($this) {
	$.ajax({
		type : "POST",
		url : $this.parents("form").attr("action") + "/addKeyword.json",
		dataType : "json",
		data : {
			keyword : $this.val()
		},
	}).done(function(data) {
		$this.val("");
		$(".keywords_container").append('<div id="keyword_' + data["keyword"]["id"] + '" class="keyword_box"><img class="delete_keyword" src="/images/icons/Black/cancel-circle.svg"><span>' + data["keyword"]["keyword"] + '</span></div>');
	}).fail(function(data) {
		$this.effect("shake", {
			distance : 10,
			times : 4
		}, 300);
	});
}


$(document).on("click", ".delete_keyword", function() {
	var $this = $(this);
	var id = $this.parent().attr("id").split("_")[1];

	$.ajax({
		type : "DELETE",
		url : $this.parents("form").attr("action") + "/deleteKeyword",
		dataType : "json",
		data : {
			keyword_id : id
		},
	}).done(function() {
		$this.parent().remove();
	});
});

$(document).on("click", ".add_new_resource", function() {
	var $this = $(this);
	var what = $this.attr("data-type");
	var where = $this.attr("data-parent").split("->")[0];
	var parent_id = $this.attr("data-parent").split("->")[1];
	var mini_view;
	if ($this.parents(".resources_section_header").siblings(".resources_section_body").children("#resources_mini_view_"+parent_id).hasClass("invisible")){
		mini_view = false;
	}else{
		mini_view = true;
	} 
	
	switch (where){
		case "activity":
			var url = $("#edit_"+where+"_"+parent_id).attr("action")+"/addElement";
			var ajax_data = {
				new_element : true,
				type : what,
				mini_view : mini_view,
			};
			create_content_element_ajax(ajax_data, url, $this);
			break;
		case "lesson_plan":
			var url = $("#edit_"+where+"_"+parent_id).attr("action")+"/addElement";
			var ajax_data = {
				new_element : true,
				type : what,
				mini_view : mini_view,
			};
			create_content_element_ajax(ajax_data, url, $this);
			break;
		default:
			break;	
	}	
});

$(document).on("click", ".share_content_by_email", function() {
	$(".form_share_email").toggleClass("invisible");
});

$(document).on("click", ".li_summary, .li_technical_setting, .li_educational_setting, .li_details, .li_resources, .li_activities, .li_observations, .li_submissions", function(){
	var $this = $(this);
	if (!$this.hasClass("selected")){
		if($(".element_"+$this.attr("class").split("li_")[1]).length > 0){
			var selected_section = $("#show_navigation_menu_list li.selected").attr("class").replace("selected", "");
		
			$(".element_"+selected_section.split("li_")[1]+ ", .element_"+$this.attr("class").split("li_")[1]).toggleClass("hide");
			$("."+selected_section+", ."+$this.attr("class")).toggleClass("selected");
		
			/*if($this.hasClass("li_observations") && $("#show_mode").attr("data-mode") < 3){
				change_show_mode("init_documentation");
			}
			if(!$this.hasClass("li_observations") && $("#show_mode").attr("data-mode") > 2){
				change_show_mode("stop_documentation");
			}*/
		}
	}
});

$(document).on("click", ".show_element_in_lp", function() {
	var $this = $(this);
	var data_info_splitted = $this.attr("data-info").split(";"); 
	var ajax_data;
	
	var element_id = data_info_splitted[1];
	var controller = data_info_splitted[0];
	
	switch (controller){
		case "Activity":
			controller = "activities";
			var data_parent_id = $("#activities_breadcrumb").attr("data-info").split(";")[1];
			ajax_data = {
				parent_id: data_parent_id,
				contents: true
			};
			break;
		case "LessonPlan":
			if ($("#activities_breadcrumb").attr("data-experience")!=""){
				controller = "experiences";
				element_id = $("#activities_breadcrumb").attr("data-experience");
			}else{
				controller = "lesson_plans";
			}
			ajax_data = {
				contents: true
			};	
			break;
	};
	
	var url = "/" + $("#locale").val() + "/" + controller + "/" + element_id;
	
	$.ajax({
		type: "GET",
		dataType: "html",
		url: url,
		data: ajax_data
	}).done(function(data){
		if (controller == "activities"){//Se oculta o se muestra la sección actividades de la barra lateral de las UDs
			if (!$(".li_activities").hasClass("invisible")){
				$(".li_activities").toggleClass("invisible");
			}
		}else{
			$(".li_activities").toggleClass("invisible");
		}
		
		var data_content_container = $($.parseHTML(data)).filter("#content_container").children();
		$("#content_container").html(data_content_container);
		$(".element_summary textarea").jqte();
		
		var data_breadcrumb = $($.parseHTML(data)).filter(".breadcrumb").children();
		$(".breadcrumb").html(data_breadcrumb);
		
		$("#show_navigation_menu_list li").off("click");
		if(($("#show_mode").attr("data-mode") == 1 && $("#active_edition").hasClass("invisible")) || ($("#show_mode").attr("data-mode") == 2 && $("#disable_edition").hasClass("invisible"))){
			active_edition("mode_1");
		}
		$.ajax({ //Se cargan las demás secciones del form
			type: "GET",
			url: "/" + $("#locale").val() + "/" + controller + "/" + element_id +"/getSections",
			dataType: "html",
			data: {contents: ajax_data["contents"]}
		}).done(function(data){
			$("#content_container").append(data);
			$("#content_container .hide").each(function(){
				var $this = $(this);
				$this.find("textarea").jqte();
				if($this.hasClass("element_observations")){
				$(".element_observations textarea").jqte();
				$(".element_observations .record_content textarea").jqte({css: "jqte_record"});
				$(".element_observations .jqte_record_editor").attr("contenteditable", "false");
				$(".element_observations .jqte_record_toolbar").toggleClass("invisible");
			}else{
				if ($("#show_mode").attr("data-mode")=="2" || $("#show_mode").attr("data-mode")=="4"){
					$(".jqte_editor").attr("contenteditable", "true");
					$(".jqte_toolbar").removeClass("hide");
				}else{
					$(".jqte_editor").attr("contenteditable", "false");
					$(".jqte_toolbar").addClass("hide");
				}	
			}
			
			$(".resources_section_body .jqte_editor").attr("contenteditable", "false");
			$(".resources_section_body .jqte_toolbar").addClass("hide");
			$(".activities_section_body .jqte_editor").attr("contenteditable", "false");
			$(".activities_section_body .jqte_toolbar").addClass("hide");
			$(".resources_section_body .jqte, .activities_section_body .jqte").css("max-height", "50px");
			
			if($this.hasClass("element_submissions")){
				$(".element_submissions textarea").jqte();
				$(".submission_container textarea").jqte({css: "jqte_record"});
				$(".element_submissions .jqte_record_editor").attr("contenteditable", "false");
				$(".element_submissions .jqte_record_toolbar").toggleClass("invisible");
			}
			});
			$("#show_navigation_menu_list li").on("click");
			
			//ORDENACIÓN DE ACTIVIDADES
			var element_id = $(".element_summary").children("form").first().attr("action").split("/")[$(".element_summary").children("form").first().attr("action").split("/").length-1];
			$("#activities_list_view_"+element_id).sortable({
				axis: "y",
				cursor: "move",
				revert: true,
				placeholder: "sortable_placeholder",
				handle: ".select_element_to_move",
				connectWith: ".element_list_box",
				cursorAt: {top: 80},
				update: function(event, ui){
					var data_ajax = {};
					
					if($(ui.item[0]).next().attr("data-position") == undefined){
						data_ajax["position"] = $(ui.item[0]).prev().attr("data-position");
					}else{
						if($(ui.item[0]).attr("data-position") < $(ui.item[0]).next().attr("data-position")){
							data_ajax["position"] = $(ui.item[0]).prev().attr("data-position");
						}else{
							data_ajax["position"] = $(ui.item[0]).next().attr("data-position");
						}
					}
					
					data_ajax["activity_id"] = $(ui.item[0]).attr("data-info").split(";")[1];
					$.ajax({
						url: window.location.href.split("?")[0]+"/sort/activities",
						type: "POST",
						dataType: "json",
						data: data_ajax
					}).done(function(data){
						var element;
						for(i=0; i < data.length; i++){
							element = $("[class='element_list_box small-12 columns'][data-info='Activity;"+data[i].id.toString()+"']");
							element.attr("data-position",data[i].position.toString());
						}
					});
		
					if($("#show_mode").attr("data-mode") != "2"){
						$(".activities_section_body .activities_list_view").sortable("disable");
					}
				}
			});
			
			//ORDENACIÓN DE RECURSOS
			$("#resources_list_view_"+element_id).sortable({
				axis: "y",
				cursor: "move",
				revert: true,
				placeholder: "sortable_placeholder",
				handle: ".select_element_to_move",
				connectWith: ".element_list_box",
				cursorAt: {top: 80},
				update: function(event, ui){
					var data_ajax = {};
					
					if($(ui.item[0]).next().attr("data-position") == undefined){
						data_ajax["position"] = $(ui.item[0]).prev().attr("data-position");
					}else{
						if($(ui.item[0]).attr("data-position") < $(ui.item[0]).next().attr("data-position")){
							data_ajax["position"] = $(ui.item[0]).prev().attr("data-position");
						}else{
							data_ajax["position"] = $(ui.item[0]).next().attr("data-position");
						}
					}
					
					data_ajax["resource_id"] = $(ui.item[0]).attr("data-info").split(";")[1];
					$.ajax({
						url: window.location.href.split("?")[0]+"/sort/resources",
						type: "POST",
						dataType: "json",
						data: data_ajax
					}).done(function(data){
						var element;
						for(i=0; i < data.length; i++){
							element = $("[class='element_list_box small-12 columns'][data-info='"+data[i].type+";"+data[i].id.toString()+"']");
							element.attr("data-position",data[i].position.toString());
						}
					});
		
					if($("#show_mode").attr("data-mode") != "2"){
						$("#resources_section_body").sortable("disable");
					}
				}
			});
			
			//ORDENACIÓN DE ENTREGAS
			$("#submissions_list_view_"+element_id).sortable({
				axis: "y",
				cursor: "move",
				revert: true,
				placeholder: "sortable_placeholder",
				handle: ".select_element_to_move",
				connectWith: ".element_list_box",
				cursorAt: {top: 80},
				update: function(event, ui){
					var data_ajax = {};
					
					if($(ui.item[0]).next().attr("data-position") == undefined){
						data_ajax["position"] = $(ui.item[0]).prev().attr("data-position");
					}else{
						if($(ui.item[0]).attr("data-position") < $(ui.item[0]).next().attr("data-position")){
							data_ajax["position"] = $(ui.item[0]).prev().attr("data-position");
						}else{
							data_ajax["position"] = $(ui.item[0]).next().attr("data-position");
						}
					}
					
					data_ajax["submission_id"] = $(ui.item[0]).attr("data-info").split(";")[1];
					$.ajax({
						url: window.location.href.split("?")[0]+"/sort/submissions",
						type: "POST",
						dataType: "json",
						data: data_ajax
					}).done(function(data){
						var element;
						for(i=0; i < data.length; i++){
							element = $("[class='show_submission_in_lp element_list_box small-12 columns'][data-info='Submission;"+data[i].id.toString()+"']");
							element.attr("data-position",data[i].position.toString());
						}
					});
				}
			});
				
		});
		
		var selected_section = $("#show_navigation_menu_list li.selected").attr("class");
		if (selected_section != "li_summary selected"){
			$("#show_navigation_menu_list li.selected").toggleClass("selected");
			$(".li_summary").addClass("selected");
		}
		
		var language_interface = $("#locale").val();
		switch (controller){
			case "activities":
				switch(language_interface) {
					case "es":
						$(".show_navigation_menu_title").html("Actividad");
						break;
					case "gl":
						$(".show_navigation_menu_title").html("Actividade");
						break;
					case "en":
						$(".show_navigation_menu_title").html("Activity");
						break;
					case "pt":
						$(".show_navigation_menu_title").html("Atividade");
						break;
			
				}
				break;
			case "lesson_plans":
				switch(language_interface) {
					case "es":
						$(".show_navigation_menu_title").html("Unidad Didáctica");
						break;
					case "gl":
						$(".show_navigation_menu_title").html("Unidade Didáctica");
						break;
					case "en":
						$(".show_navigation_menu_title").html("Lesson Plan");
						break;
					case "pt":
						$(".show_navigation_menu_title").html("Plano de Aula");
						break;
			
				}
				//Compartir en redes sociales
				!function(d,s,id){
					var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
					if(!d.getElementById(id)){
						js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';
						fjs.parentNode.insertBefore(js,fjs);
					}
					twttr.widgets.load();
				}(document, 'script', 'twitter-wjs');
				
				 window.___gcfg = {lang: language_interface};
				  (function() {
				    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
				    po.src = 'https://apis.google.com/js/platform.js';
				    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
				  })();
	
				break;
			case "experiences":
				switch(language_interface) {
					case "en":
						$(".show_navigation_menu_title").html("Course");
						break;
					default:
						$(".show_navigation_menu_title").html("Curso");
						break;
				}
				
				//Compartir en redes sociales
				!function(d,s,id){
					var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
					if(!d.getElementById(id)){
						js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';
						fjs.parentNode.insertBefore(js,fjs);
					}
					twttr.widgets.load();
				}(document, 'script', 'twitter-wjs');
				
				 window.___gcfg = {lang: language_interface};
				  (function() {
				    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
				    po.src = 'https://apis.google.com/js/platform.js';
				    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
				  })();
	
				break;
				
		}
	});
});

$(document).on("click", ".show_content_element", function(event){
	var $this = $(this);
	var data_info_splitted = $this.attr("data-info").split(";"); 
	var edition_active = false;
	if ($("#show_mode").attr("data-mode")=="2"){
		edition_active= true;
	}
	var ajax_data = {contents: true, edition_active: edition_active };
	var element_id = data_info_splitted[1];
	var controller = $this.attr("value");
	var url = "/" + $("#locale").val() + "/" + controller + "/" + element_id;
	
	if (controller == "observations"){
		url = $(".element_summary form").attr("action").split("?")[0] + "/showRecord/" + element_id;
	}
	if ((controller == "submissions") && (data_info_splitted[0] == "Observation")){ //En este caso estamos accediendo a ver una observación de una determinada entrega (submission)
		url = $("#show_content_submissions .show_content_body form").attr("action").split("?")[0] + "/showRecord/" + element_id;
		var element_id_back = $("#show_content_submissions .show_content_body form").attr("action").split("?")[0].split("/")[$("#show_content_submissions .show_content_body form").attr("action").split("?")[0].split("/").length-1];
	}
	
	$.ajax({
		type: "GET",
		dataType: "html",
		url: url,
		data: ajax_data
	}).done(function(data){
		
		if ((controller != "submissions") && (controller != "observations")){
			controller = "resources";
		}
		
		var parent_id = $(".element_summary form").attr("action").split("?")[0].split("/")[$(".element_summary form").attr("action").split("?")[0].split("/").length-1];
		
		if ((controller == "submissions") && (data_info_splitted[0] == "Observation")){ //En este caso estamos accediendo a ver una observación de una determinada entrega (submission)
			$("#show_content_"+controller+"_action_bar_"+parent_id+ " img").addClass("invisible");
			$("#show_content_"+controller+"_action_bar_"+parent_id+ " .back_list_elements").removeClass("invisible").attr("data-info", "Submission;"+element_id_back);
			//Habría que incluir también en la barra de acciones el título de la entrega a la que pertenece la observacion
		}else{
		
			if ($("."+controller+"_section_header").hasClass("invisible")){
				$("."+controller+"_section_header").toggleClass("invisible");
				$("#show_content_"+controller+"_action_bar_"+parent_id+" .back_list_elements").removeClass("invisible");
			}
			$("#"+controller+"_action_bar_"+parent_id).toggleClass("invisible");
			$("#show_content_"+controller+"_action_bar_"+parent_id).toggleClass("invisible");
			
			$("."+controller+"_section_body").toggleClass("invisible");
			$("#show_content_"+controller).toggleClass("invisible");
	
		}
		
		var content = "resource";
		if (controller=="submissions"){
			if (data_info_splitted[0] == "Observation"){
				content= "observation";
			}else{
				content= "submission";
			}
		}
		if (controller=="observations"){
			content= "observation";
		}
		
		var data_content_container = $($.parseHTML(data)).filter("."+content+"_container").children();
		$("#show_content_"+controller+" .show_content_body").html(data_content_container);
		if (content != "observation") {
			$("#show_content_"+controller+" .show_content_body textarea").jqte();	
		}else{
			$("#show_content_"+controller+" .show_content_body .record_content textarea").jqte({css: "jqte_record"});
		}
		
		if (!edition_active){
			$("#show_content_"+controller+" .jqte_editor").attr("contenteditable", "false");
			$("#show_content_"+controller+" .jqte_toolbar").toggleClass("invisible");	
		}

	});
});

$(document).on("click", ".back_list_elements", function(event){
	var $this = $(this);
	var parent_id = $(".element_summary form").attr("action").split("?")[0].split("/")[$(".element_summary form").attr("action").split("?")[0].split("/").length-1];
	var who = $this.attr("value");
	
	var data_info_splitted = $this.attr("data-info").split(";");
	
	if ((who == "submissions") && (data_info_splitted[0] == "Submission")){
		var edition_active = false;
		if ($("#show_mode").attr("data-mode")=="2"){
			edition_active= true;
		}
		var ajax_data = {contents: true, edition_active: edition_active };
		
		$.ajax({
			type: "GET",
			dataType: "html",
			url : "/" + $("#locale").val() + "/" + who + "/" + data_info_splitted[1],
			data: ajax_data
		}).done(function(data){
			
			var parent_id = $(".element_summary form").attr("action").split("?")[0].split("/")[$(".element_summary form").attr("action").split("?")[0].split("/").length-1];
			var parent_type = $(".element_summary form").attr("action").split("?")[0].split("/")[$(".element_summary form").attr("action").split("?")[0].split("/").length-2];
			if (parent_type == "lesson_plans"){
				parent_type = "LessonPlan";
			}else{
				parent_type = "Activity";
			}
			$("#show_content_submissions_action_bar_"+parent_id+ " img").removeClass("invisible");
			$("#show_content_submissions_action_bar_"+parent_id+ " .back_list_elements").attr("data-info", parent_type+";"+parent_id);
			
			console.log(data);
			var data_content_container = $($.parseHTML(data)).filter(".submission_container").children();
			console.log(data_content_container);
			$("#show_content_submissions .show_content_body").html(data_content_container);
			
		});
		
	}else{
	
		$.ajax({
			type: "GET",
			dataType: "html",
			url: $(".element_summary form").attr("action").split("?")[0]+"/getElementList",
			data: {who: who}
		}).done(function(data){
			
			$("#"+who+"_action_bar_"+parent_id).toggleClass("invisible");
			$("#show_content_"+who+"_action_bar_"+parent_id).toggleClass("invisible");
			
			$("."+who+"_section_body").toggleClass("invisible");
			$("#show_content_"+who).toggleClass("invisible");
			
			$("."+who+"_section_body #"+who+"_list_view_"+parent_id).html(data);
			
			if ($("#show_mode").attr("data-mode")=="1"){
				$("."+who+"_section_header").toggleClass("invisible");
				$("#show_content_"+who+"_action_bar_"+parent_id+" .back_list_elements").toggleClass("invisible");
				$("#delete_checkbox, .move_element").addClass("invisible");
			}
		});
		
	}
});


$(document).on("click", ".delete_element_checkbox", function(event){
	var $this = $(this);
	var type = $this.attr("value");
	
	
	switch(type) {
		case "resource":
			controller = "resources";
			break;
		case "activity":
			controller = "activities";
			break;
		case "submission":
			controller = "submissions";
			break;
		default:
			controller = "records";

	}
	
	var url = "/" + $("#locale").val() + "/" + controller;
	
	var checkboxes = document.getElementsByName('delete_'+type+'_checkbox');
	var ids = "";
	for (var i=0, n=checkboxes.length;i<n;i++) {
	  if (checkboxes[i].checked) {
	  	if (ids == ""){
	  		ids = checkboxes[i].value;
	  	}else{
			ids += ","+checkboxes[i].value;	  		
	  	}
	  }
	}
	
	var url;
	var ajax_data={};
	if ((type != "observation") && ((type != "records_submission"))){
		url = "/" + $("#locale").val() + "/" + controller + "/" + ids;	
	}else{
		var data_controller = $this.attr("data-controller");
		if (data_controller == "lessonplans"){
			data_controller = "lesson_plans";
		}
		var id = $(".element_summary form").attr("action").split("?")[0].split("/")[3];
		url = "/" + $("#locale").val() + "/" + data_controller + "/" + id + "/deleteRecord";
		ajax_data["record_id"] = ids;
	}
	
	console.log(ids);
	console.log(url);
	
	var result = false;
	switch($("form").attr("action").split("/")[1]) {
		case "es":
			result = confirm("Se van a eliminar los elementos seleccionados, ¿estás seguro?");
			break;
		case "gl":
			result = confirm("Vanse eliminar os elemento seleccionados, estás seguro?");
			break;
		case "en":
			result = confirm("The checked elements will be removed, are you sure?");
			break;
		default:
			result = confirm("Os elemento marcados van ser removidos, voçê tem certeza?");

	}
	if (result){
		$.ajax({
			type: "DELETE",
			url: url,
			dataType: "json",
			data: ajax_data
		}).done(function(data){
						
			var elements_split = ids.split(",");
			console.log("A la vuelta");
			console.log(elements_split); 

			for (var i=0, n=elements_split.length;i<n;i++) {
				var element_box = $("[id=delete_"+type+"_checkbox][value="+elements_split[i]+"]").parents(".element_list_box");
				if (element_box.attr("value")=="activities"){
					var data_info = element_box.attr("data-info");
					$("a[class=show_element_in_lp][data-info='"+data_info+"']").parent("li").remove();
				}
				element_box.remove();
			}
			
			if (controller != "observations"){
				$(".vector_licenses").attr("value", data["licenses"]);	
			}
			
		});		
	}
});



$(document).on("click", "#select_all_checkbox", function(event){
	console.log("Click en el select all checkbox");
	var $this = $(this);
	var type = $this.attr("data-type");
	if($this[0].checked){
		console.log("Select all checked");
		checkboxes = document.getElementsByName('delete_'+type+'_checkbox');
		console.log(checkboxes.length);
  		for(var i=0, n=checkboxes.length;i<n;i++) {
    		checkboxes[i].checked = true;
  		}
	}else{
		console.log("Select all NO checked");
		checkboxes = document.getElementsByName('delete_'+type+'_checkbox');
		console.log(checkboxes.length);
  		for(var i=0, n=checkboxes.length;i<n;i++) {
    		checkboxes[i].checked = false;
  		}
	}
});
