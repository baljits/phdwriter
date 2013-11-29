function performSearch()
{
	var dropdownValue = $('.dropdown-toggle').html();

	if( dropdownValue.indexOf('Article') != -1)
	{
		// Article search
		requestPapers();
	}
	else
	{
		// Image Search
		imageResults();
	}
	if($('.searchColumn').attr('style').indexOf('display: none;') != -1)
		rightSlider();
}

function hideImageSearch()
{
	$('.dropdown-toggle').html('Articles<span class="caret"></span>')
}

function hideArticleSearch()
{
	$('.dropdown-toggle').html('Images<span class="caret"></span>')
}

$(document).ready(function() {
	$("#searchInput").keyup(function(event){
		if(event.keyCode == 13){
			$("#searchButton").click();
		}
	});
});
