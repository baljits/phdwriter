function rightSlider()
{
	$('#rightToggle').toggle('blind', {direction: right});
	
	if($("#buttonrightspan").attr('class') == 'glyphicon glyphicon-chevron-left')
	{
		$('#buttonright').animate({marginLeft: "0px"});
		$('#btntxt2').text("");
		$('#buttonrightspan').attr('class', 'glyphicon glyphicon-chevron-right');
		$('#keyword').focus();
		$('#rightColumn').animate({ backgroundColor: '#C0C0C0'});
		$('.right').css("opacity", "1");
	}
	else
	{
		$('#buttonright').animate({marginLeft: "200px"});
		$('#btntxt2').text(" Search");
		$('#buttonrightspan').attr('class', 'glyphicon glyphicon-chevron-left');
		$('#rightColumn').css("background-color", "transparent");
		$('.right').css("opacity", "1");
	}
}

function leftSlider()
{
	$('.libraryColumn').toggle('slide');
	
	if($("#buttonleftspan").attr('class') == 'glyphicon glyphicon-chevron-right')
	{
		$('#buttonleft').animate({marginLeft: "210px"});
		$('#btntxt1').text("");
		$("#buttonleftspan").attr('class', 'glyphicon glyphicon-chevron-left');
		//$('#editor').css("opacity", "0.3");
		$('#editor').animate({opacity: 0.3});
		$('#leftColumn').animate({ backgroundColor: '#C0C0C0'}, function(){
        });
	}
	else
	{
		$('#buttonleft').animate({marginLeft: "0px"});
		$('#btntxt1').text("Project ");
		$("#buttonleftspan").attr('class', 'glyphicon glyphicon-chevron-right');
		$('#leftColumn').animate({ backgroundColor: '#FFFFFF'}, function(){
			$('#editor').animate({opacity: 1});
        });
	}
}

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
			$('.paperListing').append('<button type="button" class="btn btn-success btn-sm viewButton">View</button>');
			$('.paperListing').children(':last-child').click({url: researchPaperList[index][3]}, viewModal);
			$('.paperListing').append('<button type="button" class="btn btn-primary btn-sm citeButton">Cite</button>');
			$('.paperListing').children(':last-child').click({paperCitation: researchPaperList[index][4]}, citation);
		}
	});
}

function viewModal(event)
{
	console.log("Event " + event.data.url);
	$('#openPDF').children().remove();
	//$('#myModal').append('<iframe src="http://arxiv.org/pdf/1307.7440" width="800px" height="600px"></iframe>');

	$('#openPDF').append('<iframe src="'+event.data.url+'" width="500px" height="600px""></iframe>');
	//$('#myModal').modal('toggle')
	$("#openPDF").dialog();
	$("#openPDF").removeAttr("style");
	//$("#openPDF").addAttr("style=\"position: absolute; height: auto; width: 600px; top: 0px; left: 525.5px; display: block;\"");

	$(".ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-draggable.ui-resizable").removeAttr("style");
	$(".ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-draggable.ui-resizable").css({"height": "auto", "width": "520px", "top": "105px", "left": "300px", "display": "block"});
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

function citation(event)
{
	var paperCitation = event.data.paperCitation;
}