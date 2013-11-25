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

function imageResults()
{
	var imageKeyword = $('#imageKeyword').val();

	searchRequest = $.ajax({
		type: "GET",
		url: "/listImages",
		data: {keyword:imageKeyword},
		cache: false
	}).done(function(res){
		console.log(res.imageList);alert("message received : " + res.imageList);
	});

}