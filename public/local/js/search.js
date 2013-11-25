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
	});
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