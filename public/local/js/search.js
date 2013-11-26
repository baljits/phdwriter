function requestPapers()
{
	var keywordSearch = $('#keyword').val();
	keywordSearch = $.trim(keywordSearch);
	var paperLists = "";
	console.log(keywordSearch);

	searchRequest = $.ajax({
		type: "POST",
		url: "/listPapers",
		data: {keyword:keywordSearch},
		cache: false
	}).done(function(res){
		console.log(res);alert("message received : " + res.paperArray);

		var researchPaperList = JSON.parse(res.paperArray);
		var index = 0;
		for(index = 0; index<researchPaperList.length; index++)
		{
			$('.paperListing').append('<a class="list-group-item">\
				<h6 class="list-group-item-heading">'+researchPaperList[index][0]+'</h6>\
				<p class="list-group-item-text">'+researchPaperList[index][1]+'</p></a>');
			//onclick=\"alert(\\\"hello\\\");viewModal(\\\"'++'\\\");"
			$('.paperListing').children(':last-child').click({url: researchPaperList[index][3]}, viewModal);
		}
	});
}

function viewModal(event)
{
	console.log("Event " + event.data.url);
	$('#openPDF').children().remove();
	//$('#myModal').append('<iframe src="http://arxiv.org/pdf/1307.7440" width="800px" height="600px"></iframe>');

	$('#openPDF').append('<iframe src="'+event.data.url+'" width="600px" height="600px""></iframe>');
	//$('#myModal').modal('toggle')
	$("#openPDF").dialog();
	$("#openPDF").removeAttr("style");
	//$("#openPDF").addAttr("style=\"position: absolute; height: auto; width: 600px; top: 0px; left: 525.5px; display: block;\"");


	$(".ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-draggable.ui-resizable").removeAttr("style");
	$(".ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-draggable.ui-resizable").css({"position": "absolute", "height": "auto", "top": "105px", "left": "300px", "display": "block"});
	$(".ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-draggable.ui-resizable").value("hello");
}

function imageResults()
{
	var imageKeyword = $('#imageKeyword').val();
	imageKeyword = $.trim(imageKeyword);
	searchRequest = $.ajax({
		type: "POST",
		url: "/listImages",
		data: {keyword:imageKeyword},
		cache: false
	}).done(function(res){
		console.log(res.imageList);alert("message received : " + res.imageList);
	});

}