function requestPapers()
{
	var keywordSearch = $('#keyword').val();
	var paperLists = "";
	console.log(keywordSearch);

	searchRequest = $.ajax({
		type: "GET",
		url: "/listPapers",
		data: {keyword:keywordSearch},
		cache: false
	}).done(function(res){
		console.log(res);alert("message received : " + res.paperArray);
	});
}