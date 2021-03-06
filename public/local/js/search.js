function rightSlider()
{
	if($('.searchColumn').attr('style') == undefined)
		$('.searchColumn').attr('style', '');
	
	if($('.searchColumn').attr('style').indexOf('display: none;') != -1)
	{
		$('.searchColumn').toggle('slide',{direction: 'right'})
		$('.right').animate({opacity: 0.3});
	}
	else
	{
		$('.searchColumn').toggle('slide',{direction: 'right'})
		$('.right').animate({opacity: 1});
	}
}

function leftSlider()
{
	if($('.libraryColumn').attr('style') == undefined)
		$('.libraryColumn').attr('style', '');
	
	if($('.libraryColumn').attr('style').indexOf('display: none;') != -1)
	{
		$('.libraryColumn').toggle('slide');
		$('#editor').animate({opacity: 0.3});
	}
	else
	{
		$('.libraryColumn').toggle('slide');
		$('#editor').animate({opacity: 1});
	}
}

function citationAdd(citationString, citationTitle, citationUrl)
{
	var charspace = 50;
	var newCitation = "&nbsp;";
	var nextIndex = 0;
	var sizeOfword = 0;
	var buffer = 0;

	for(var i=0; i<citationString.length; i++)
	{
		nextIndex = citationString.indexOf(" ", i);
		if(nextIndex != -1)
		{
			sizeOfword = nextIndex - i;
			if((buffer + sizeOfword) <= charspace)
			{
				buffer = buffer + sizeOfword;
			}
			else
			{
				newCitation += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
				buffer = sizeOfword;			
			}
			
			newCitation += citationString.substring(i, nextIndex+1);	
			i = nextIndex;
		}
		else
		{
			sizeOfword = citationString.length - i;
			if((buffer + sizeOfword) > charspace)
			{
				newCitation += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
			}
			newCitation += citationString.substring(i, citationString.length);				
			i = citationString.length + 1;
		}
	}

	if(!($('#references').is(':visible')))
	{
		$('#preview').append('<div id="references"><h3>References</h3></div>');
	}
	$('#references').append('<div>' + newCitation + '</div><br/>');
	$('.researchList').append('<div class="researchPaper" id="paper"><li><a onclick="renderModal(\'' + citationUrl + '\', \'paper\')">' + citationTitle + '</a></li></div>');			
}

function referenceLoad(citationString)
{
	var charspace = 50;
	var newCitation = "&nbsp;";
	var nextIndex = 0;
	var sizeOfword = 0;
	var buffer = 0;

	for(var i=0; i<citationString.length; i++)
	{
		nextIndex = citationString.indexOf(" ", i);
		if(nextIndex != -1)
		{
			sizeOfword = nextIndex - i;
			if((buffer + sizeOfword) <= charspace)
			{
				buffer = buffer + sizeOfword;
			}
			else
			{
				newCitation += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
				buffer = sizeOfword;			
			}
			
			newCitation += citationString.substring(i, nextIndex+1);	
			i = nextIndex;
		}
		else
		{
			sizeOfword = citationString.length - i;
			if((buffer + sizeOfword) > charspace)
			{
				newCitation += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
			}
			newCitation += citationString.substring(i, citationString.length);				
			i = citationString.length + 1;
		}
	}

	$('#references').append('<div>' + newCitation + '</div><br/>');
}

function requestPapers()
{
	var keywordSearch = $('#searchInput').val();
	keywordSearch = $.trim(keywordSearch);
	var tempString = "";
	$('.searchResultList').children().remove();
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

	$('.progress').show();

	searchRequest = $.ajax({
		type: "POST",
		url: "/listPapers",
		data: {_csrf: csrfToken, keyword:keywordSearch},
		cache: false
	}).done(function(res){

		$('.progress').hide();
		var researchPaperList = JSON.parse(res.paperArray);
		var index = 0;
		
		if(researchPaperList.length == 0)
		{
			$('.searchResultList').append('<a class="list-group-item">\
				<h6 class="list-group-item-heading">No results</h6>\
				<p class="list-group-item-text">Try another query</p></a>');
		}

		for(index = 0; index<researchPaperList.length; index++)
		{
			$('.searchResultList').append('<a class="list-group-item">\
				<h6 class="list-group-item-heading">'+researchPaperList[index][0]+'</h6>\
				<p class="list-group-item-text">'+researchPaperList[index][1]+'</p></a>');

			$('.searchResultList').append('<button type="button" class="btn btn-success btn-sm viewButton">View</button>');
			$('.searchResultList').children(':last-child').click({url: researchPaperList[index][3], type:"paper"}, viewModal);
			$('.searchResultList').append('<button type="button" class="btn btn-primary btn-sm citeButton">Cite</button>');
			$('.searchResultList').children(':last-child').click({paperCitation: researchPaperList[index][4], title: researchPaperList[index][0], author: researchPaperList[index][1], url:researchPaperList[index][3], date:researchPaperList[index][2]}, citation);
		}
	});
}

function imageResults()
{
	var imageKeyword = $('#searchInput').val();
	imageKeyword = $.trim(imageKeyword);

	var tempString = "";

	var spaceIndex = imageKeyword.indexOf(" "); 
	$('.searchResultList').children().remove();
	while(spaceIndex!= -1)
	{
		tempString = tempString + imageKeyword.substring(0, spaceIndex);
		tempString = tempString + "+";
		imageKeyword = imageKeyword.substring(spaceIndex+1);
		spaceIndex = imageKeyword.indexOf(" ");
	}
	tempString = tempString + imageKeyword.substring(0);
	imageKeyword = tempString;

	$('.progress').show();
	searchRequest = $.ajax({
		type: "POST",
		url: "/listImages",
		data: {_csrf: csrfToken, keyword:imageKeyword},
		cache: false
	}).done(function(res){
		var imageSearchList = JSON.parse(res.imageList);
		var index = 0;
		$('.progress').hide();

		if(imageSearchList.length == 0)
		{
			$('.searchResultList').append('<a class="list-group-item">\
				<h6 class="list-group-item-heading">No results</h6>\
				<p class="list-group-item-text">Try another query</p></a>');
		}

		for(index = 0; index<imageSearchList.length; index++)
		{

			$('.searchResultList').append('<div class="list-group-item">\
				<img class=\"thumbnail\" src=\"'+imageSearchList[index][2]+'\"></img>\
				</div>');

			$('.searchResultList').append('<button type="button" class="btn btn-primary btn-sm addButton">Add</button>');
			$('.searchResultList').children(':last-child').click({title:imageSearchList[index][0], thumbUrl:imageSearchList[index][2], fullUrl: imageSearchList[index][3]}, imageAdd);

		}
	});

}

function renderModal(url, type)
{
	var title = url.substring(url.lastIndexOf('/')+1);
	$('#openPDF').children().remove();

	if(type=="paper")
	{
		$('#openPDF').append('<iframe src="'+url+'" width="500px" height="600px""></iframe>');
		title += ".pdf";
	}
	else
		$('#openPDF').append('<img src="'+url+'" width="500px" height="600px""></img>');
	$("#openPDF").dialog();
	$("#openPDF").removeAttr("style");

	$(".ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-draggable.ui-resizable").removeAttr("style");
	$(".ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-draggable.ui-resizable").css({"position":"absolute","height": "auto", "width": "520px", "top": "105px", "left": "30%", "display": "block"});
	$(".ui-dialog-titlebar-close").html('<span class="glyphicon glyphicon-remove"></span>');
	$(".ui-dialog-titlebar-close").css({'padding-bottom': '20px','padding-left': '2px','padding-right': '17px'});
	$('.ui-dialog-title').html(title);
}
function viewModal(event)
{
	console.log("Event " + event.data.url);
	renderModal(event.data.url, event.data.type);
	
}

function imageLibraryAdd(imageTitle, imageUrl)
{
	$('.imageList').append('<div class="image"><li><a onclick="renderModal(\'' + imageUrl + '\', \'img\')">' + imageTitle + '</a></li></div>'); 	
	var fileName = imageUrl.substring(imageUrl.lastIndexOf('/')+1);
	imagesCited[fileName] = imageUrl;
}

function imageAdd(event)
{
	$.ajax({
		type:'POST',
		url:'/addImageLib',
		data:{_csrf: csrfToken,documentID : documentID, title:event.data.title, imageThumb:event.data.thumbUrl, imageFull: event.data.fullUrl}
	}).done(function(res){
		imageLibraryAdd(event.data.title, event.data.thumbUrl);
	});

}

function citation(event)
{
	var paperCitation = event.data.paperCitation;

	$.ajax({
		type:'POST',
		url:'/addPaperLib',
		data:{_csrf: csrfToken,documentID : documentID, title:event.data.title, url:event.data.url, authorList: event.data.author, date: event.data.date, citation:event.data.paperCitation }
	}).done(function(res){
		$('h6:contains(' + event.data.title + ')').parent().next().css('margin-left', '124px')
		$('h6:contains(' + event.data.title + ')').parent().next().next().text("Cited");
		$('h6:contains(' + event.data.title + ')').parent().next().next().prop('disabled', 'true');				
		citationAdd(paperCitation, event.data.title, event.data.url);
	});
}


function getNewLibrary()
{
	var getChatHistoryRequest = $.ajax({
		type: "POST",
		url: "/getLibrary",
		data: {_csrf: csrfToken, documentID:documentID},
	}).done(function(res){
		//console.log(res.chatHistory + ' ' + res.error);
		//$("#chatHistory").children().remove();
		if(res.error == 'No error')
		{
			imagesCited = new Object();
			$(".image").remove();
			for(var i=0; i<res.imagesUsed.length; i++)
			{
				var currentURL = res.imagesUsed[i].imageThumbUrl;
				var fileName = currentURL.substring(currentURL.lastIndexOf('/')+1);
				imagesCited[fileName] = currentURL;

				$('.imageList').append('<div class="image">\
					<li><a onclick="renderModal(\''+res.imagesUsed[i].imageThumbUrl+'\', \'img\')">' + res.imagesUsed[i].title + '</a></li>\
					</div> ');
			}

			$(".researchPaper").remove();
			$("#references >div").remove()
			$("#references >br").remove()
			for(var i=0; i<res.paperCitationUsed.length; i++)
			{
				referenceLoad(res.paperCitationUsed[i].citationText);
				$('.researchList').append('<div class="researchPaper" id="paper">\
					<li><a onclick="renderModal(\''+res.paperCitationUsed[i].pdfUrl+'\', \'paper\')">' + res.paperCitationUsed[i].title + '</a></li>\
					</div> ');
			}
		}
		setTimeout(getNewLibrary, 1000);
	});
}

$(document).ready(function() {
	setTimeout(getNewLibrary, 1000);
});