function rightSlider()
{
	$('#rightToggle').toggle('blind', {direction: right});
	
	if($("#buttonrightspan").attr('class') == 'glyphicon glyphicon-chevron-left')
	{
		$('#buttonright').animate({marginLeft: "0px"});
		$('#btntxt2').text("");
		$('#buttonrightspan').attr('class', 'glyphicon glyphicon-chevron-right');
		$('#keyword').focus();
		$('.right').animate({opacity: 0.3});
		$('#rightColumn').animate({ backgroundColor: '#C0C0C0'});
	}
	else
	{
		$('#buttonright').animate({marginLeft: "200px"});
		$('#btntxt2').text(" Search");
		$('#buttonrightspan').attr('class', 'glyphicon glyphicon-chevron-left');
		$('#rightColumn').animate({ backgroundColor: 'transparent'}, function(){
			$('.right').animate({opacity: 1});
        });	
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
		$('#editor').animate({opacity: 0.3});
		$('#leftColumn').animate({ backgroundColor: '#C0C0C0'});
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
	var tempString = "";

	var spaceIndex = keywordSearch.indexOf(" "); 
	while(spaceIndex!= -1)
	{
		tempString = tempString + keywordSearch.substring(0, spaceIndex);
		tempString = tempString + "+";
		keywordSearch = keywordSearch.substring(spaceIndex+1);
		spaceIndex = keywordSearch.indexOf(" ");
		//console.log(spaceIndex);
	}
	tempString = tempString + keywordSearch.substring(0);
	keywordSearch = tempString;
	var paperLists = "";
	//console.log("Keyword : " +keywordSearch);

	searchRequest = $.ajax({
		type: "POST",
		url: "/listPapers",
		data: {keyword:keywordSearch},
		cache: false
	}).done(function(res){
		//console.log(res);alert("message received : " + res.paperArray);

		var researchPaperList = JSON.parse(res.paperArray);
		var index = 0;
		
		$('.searchResultList').children().remove();

		for(index = 0; index<researchPaperList.length; index++)
		{
			$('.searchResultList').append('<a class="list-group-item">\
				<h6 class="list-group-item-heading">'+researchPaperList[index][0]+'</h6>\
				<p class="list-group-item-text">'+researchPaperList[index][1]+'</p></a>');
			//onclick=\"alert(\\\"hello\\\");viewModal(\\\"'++'\\\");"

//			$('.searchResultList').children(':last-child').click({url: researchPaperList[index][3]}, viewModal);
			$('.searchResultList').append('<button type="button" class="btn btn-success btn-sm viewButton">View</button>');
			$('.searchResultList').children(':last-child').click({url: researchPaperList[index][3], type:"paper"}, viewModal);
			$('.searchResultList').append('<button type="button" class="btn btn-primary btn-sm citeButton">Cite</button>');
			$('.searchResultList').children(':last-child').click({paperCitation: researchPaperList[index][4], title: researchPaperList[index][0], author: researchPaperList[index][1], url:researchPaperList[index][3], date:researchPaperList[index][2]}, citation);
		}
	});
}


function imageResults()
{
	var imageKeyword = $('#imageKeyword').val();
	imageKeyword = $.trim(imageKeyword);

	var tempString = "";

	var spaceIndex = imageKeyword.indexOf(" "); 
	while(spaceIndex!= -1)
	{
		tempString = tempString + imageKeyword.substring(0, spaceIndex);
		tempString = tempString + "+";
		imageKeyword = imageKeyword.substring(spaceIndex+1);
		spaceIndex = imageKeyword.indexOf(" ");
		//console.log(spaceIndex);
	}
	tempString = tempString + imageKeyword.substring(0);
	imageKeyword = tempString;

	searchRequest = $.ajax({
		type: "POST",
		url: "/listImages",
		data: {keyword:imageKeyword},
		cache: false
	}).done(function(res){
		var imageSearchList = JSON.parse(res.imageList);
		var index = 0;
		$('.searchResultList').children().remove();
		for(index = 0; index<imageSearchList.length; index++)
		{

			$('.searchResultList').append('<div class="list-group-item">\
				<img class=\"thumbnail\" src=\"'+imageSearchList[index][2]+'\"></img>\
				</div>');

			$('.searchResultList').append('<button type="button" class="btn btn-primary btn-sm citeButton">Add</button>');
			$('.searchResultList').children(':last-child').click({title:imageSearchList[index][0], thumbUrl:imageSearchList[index][2], fullUrl: imageSearchList[index][3]}, imageAdd);

		}
	});

}

function renderModal(url, type)
{
	$('#openPDF').children().remove();
	//$('#myModal').append('<iframe src="http://arxiv.org/pdf/1307.7440" width="800px" height="600px"></iframe>');

	if(type=="paper")
		$('#openPDF').append('<iframe src="'+url+'" width="500px" height="600px""></iframe>');
	else
		$('#openPDF').append('<img src="'+url+'" width="500px" height="600px""></img>');
	//$('#myModal').modal('toggle')
	$("#openPDF").dialog();
	$("#openPDF").removeAttr("style");
	//$("#openPDF").addAttr("style=\"position: absolute; height: auto; width: 600px; top: 0px; left: 525.5px; display: block;\"");

	$(".ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-draggable.ui-resizable").removeAttr("style");
	$(".ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-draggable.ui-resizable").css({"height": "auto", "width": "520px", "top": "105px", "left": "300px", "display": "block"});
	$(".ui-dialog-titlebar-close").html('<span class="glyphicon glyphicon-remove"></span>');
	$(".ui-dialog-titlebar-close").css({'padding-bottom': '20px','padding-left': '2px','padding-right': '17px'});
}
function viewModal(event)
{
	console.log("Event " + event.data.url);
	renderModal(event.data.url, event.data.type);
	
}

function imageAdd(event)
{
	$.ajax({
		type:'POST',
		url:'/addImageLib',
		data:{documentID : documentID, title:event.data.title, imageThumb:event.data.thumbUrl, imageFull: event.data.fullUrl}
	}).done(function(res){console.log("Stored all images")});

}

function citation(event)
{
	var paperCitation = event.data.paperCitation;

	$.ajax({
		type:'POST',
		url:'/addPaperLib',
		data:{documentID : documentID, title:event.data.title, url:event.data.url, authorList: event.data.author, date: event.data.date, citation:event.data.paperCitation }
	}).done(function(res){console.log("Stored everything")});

	//console.log(event.data.date + " " + event.data.title);
}
