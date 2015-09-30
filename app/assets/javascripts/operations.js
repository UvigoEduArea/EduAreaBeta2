$(document).on("change", "#select_all", function(){
	var $this = $(this);
	if(document.getElementById('select_all').checked){
		checkboxes = document.getElementsByClassName('check_box_evidences_download');
  		for(var i=0, n=checkboxes.length;i<n;i++) {
    		checkboxes[i].checked = true;
  		}
	}else{
		checkboxes = document.getElementsByClassName('check_box_evidences_download');
  		for(var i=0, n=checkboxes.length;i<n;i++) {
    		checkboxes[i].checked = false;
  		}
	}
});
