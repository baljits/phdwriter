

function hideImageSearch()
{
	$('#image_search').hide();
	$('#imageButton').removeClass("active");
	$('#article_search').show();
	$('#articleButton').addClass("active");
}

function hideArticleSearch()
{
	$('#article_search').hide();
	$('#articleButton').removeClass("active");
	$('#image_search').show();
	$('#imageButton').addClass("active");
}
