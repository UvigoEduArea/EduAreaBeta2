var channel;
$(document).ready(function(){
	var client = new Faye.Client('http://edu-area.com:9292/faye');
	FayeChannelId(client);
});

function FayeChannelId(client){
	$.ajax({
		type: "GET",
		url: "/"+$("#locale").val()+"/getChannel",
		dataType: "json"
	}).done(function(data){
		channel = data["channel"];
		var subscription = client.subscribe(channel, function(message){
			clientSubscription(message);
		});
		
	}).fail(function(){
		console.log("Ha fallado FAYE");
	});
}

function clientSubscription(message){
	//message contiene un array con las keywords recibidas de santiago en formato JSON
	console.log("me doy un paseo por aqui");
	console.log(message);
	if(message["keywords"] != undefined){
		$(message["keywords"]).each(function(){
			console.log($(this)[0].id);
			$(".keywords_container").append('<div id="keyword_'+$(this)[0].id.toString()+'" class="keyword_box"><img class="delete_keyword" src="/images/icons/Black/cancel-circle.svg"><span>'+$(this)[0].keyword.toString()+'</span></div>');
		});
		message = "";
	}
	
	if(message["row"] != undefined){
		$("#content_popup br").before(message["row"]);
		$(".entrada #select_account img").last().attr("type", $(".type").attr("value"));
		if($(".is_student").attr("value") == "true"){
			$(".entrada #select_account").last().addClass("student");			
		}
	} 
	
	if(message["popup"] != undefined){
		load_data_in_popup(message["popup"]);
		active_scrollbars_popup();
	}
}
