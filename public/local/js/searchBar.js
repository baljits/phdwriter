

function hideImageSearch()
{
	$('#image_search').hide();
	$('#imageButton').removeClass("active");
	$('#article_search').show();
	$('#articleButton').addClass("active");
	$('.searchResultList').children().remove();
}

function hideArticleSearch()
{
	$('#article_search').hide();
	$('#articleButton').removeClass("active");
	$('#image_search').show();
	$('#imageButton').addClass("active");
	$('.searchResultList').children().remove();
}

$(document).ready(function() {
	$("#keyword").keyup(function(event){
		if(event.keyCode == 13){
			$("#paperSearchButton").click();
		}
	});
	$("#imageKeyword").keyup(function(event){
		if(event.keyCode == 13){
			$("#imageSearchButton").click();
		}
	});
});
