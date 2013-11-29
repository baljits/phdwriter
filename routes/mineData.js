var http = require('follow-redirects').http;

/* the array which stores the array of 
all the research papers */

exports.imageListing = function(req, res)
{
	var imageListArray = new Array();
	
	var imageBody = '';
	var options = {
		headers: {'User-Agent': 'nodejs/0.10.22'},	/* field is required since the headers were getting stripped */
		host: 'openclipart.org',
		path:'/search/json/?query='+ req.param("keyword") +'&page=1&amount=20',
		port: 80,
		url: '/listImages',
		method: 'GET'
	};
	/* make request to get the search result 
	source code */
	var searchRequest = http.request(options, function(result) {
		result.on('data', function (chunk) {
			imageBody+=chunk;
		});

	/* wait(end event) till the entire source code of the 
	   search result page has been obtained.
	   Process the request.
	   */
	   result.on('end', function () {
		//	console.log(imageBody);

		var imageTitleStart = imageBody.indexOf("\"title\" : \"");
		while(imageTitleStart!=-1)
		{
			var imageTitleEnd = imageBody.indexOf("\",", imageTitleStart+11);
			var imageTitleString = imageBody.substring(imageTitleStart+11, imageTitleEnd);

			var imageLinkStart = imageBody.indexOf("\"detail_link\" : \"")+17;
			var imageLinkEnd = imageBody.indexOf("\",", imageLinkStart);
			var imageLinkString = imageBody.substring(imageLinkStart, imageLinkEnd);

			var thumb_png_start = imageBody.indexOf("\"png_thumb\" : \"")+15;
			var thumb_png_end = imageBody.indexOf("\",", thumb_png_start);
			var thumb_png_string = imageBody.substring(thumb_png_start, thumb_png_end);

			var full_png_start = imageBody.indexOf("\"png_full_lossy\" : \"")+20;
			var full_png_end = imageBody.indexOf("}", full_png_start)-2;
			var full_png_string = imageBody.substring(full_png_start, full_png_end);

			var currentImage = new Array();
			currentImage[0] = imageTitleString;
			currentImage[1] = imageLinkString;
			currentImage[2] = thumb_png_string;
			currentImage[3] = full_png_string;

			imageListArray.push(currentImage);

			imageBody = imageBody.substring(full_png_end);
			imageTitleStart = imageBody.indexOf("\"title\" : \"");

		}
		res.send({"imageList":JSON.stringify(imageListArray)});
	});

});   

searchRequest.on('error', function(e) {
	console.log('Problem with request: ' + e.message);
});

searchRequest.end();

};


var researchPaperArray = new Array();

exports.paperListing = function(req, res)
{
	var keyword = req.param("keyword");
	if(keyword.indexOf("+")!=-1)
		keyword = 'AND+' + keyword;
	
	var options = {
		headers: {'User-Agent': 'nodejs/0.10.22'},
		host: 'arxiv.org',
		path:'/find/all/1/all:+' + keyword +'/0/1/0/all/0/1',
		port: 80,
		url: '/listPapers',
		method: 'GET'
	};
	/* make request to get the search result 
	source code */
	var searchRequest = http.request(options, function(result) {
		getCitations(res, result);
	});   

	searchRequest.on('error', function(e) {
		console.log('Problem with request: ' + e.message);
	});

	searchRequest.end();
	
};

function checkResults(res,totalEntries)
{	
	/* check if all the results has been obtained.
	If not obtained, wait for 1 millisecond. The wait
	is to allow context switch between the waiting 
	thread and the thread making the request */
	if(researchPaperArray.length != totalEntries)
		setTimeout(function() {
			checkResults(res,totalEntries)},1000);
	else
	{
		/* once the required data is obtained, send
		it back to the client and reset the array*/
		var tempArray = researchPaperArray.slice(0);
		researchPaperArray = new Array();
		res.send({"paperArray":JSON.stringify(tempArray)});
	}
}


var getCitations = function(res, result) {

	var pageBody = "";

	result.setEncoding('utf8');
	/* get all the source code requests */
	result.on('data', function (chunk) {
		pageBody+=chunk;
	});

	/* wait(end event) till the entire source code of the 
	search result page has been obtained.
	Process the request.
	*/
	result.on('end', function () {

		/* get number of results being displayed on the page */
		var totalEntriesStart = pageBody.indexOf("through ")+8;
		var totalEntriesEnd = pageBody.indexOf(" (", totalEntriesStart);
			var totalEntries = parseInt(pageBody.substring(totalEntriesStart, totalEntriesEnd));

			console.log("Search returned " + totalEntries + " Entries");
			if(isNaN(totalEntries))
			{
				console.log("Printing....");
				res.send({"paperArray":JSON.stringify([])});
					
			}
			checkResults(res,totalEntries);

			var results = 0;
		/*from the html source code page; get the link
		for the abstract page of every research paper	
			*/
		var absStart = pageBody.indexOf("<span class=\"list-identifier\">");

		while(absStart!=-1)
		{

			var absEnd = pageBody.indexOf(" title", absStart+39);
			var absString = pageBody.substring(absStart+39, absEnd-1);
				/*  
					make a request to get the source code of the
					abstract page of every research paper
					*/	

					var citationRequest = {
						host : 'arxiv.org',
						path : absString,
						port: 80,
						method: 'GET',
						headers: {'User-Agent': 'nodejs/0.10.22'}
					}
					/*	This will be executed multiple times since it 
						depends on the number of research papers
						found as search results */
						var abstractPageRequest = http.request(citationRequest, function(result) {

							var citationBody = "";

							result.setEncoding('utf8');
							/*get the entire chunk of source code */
							result.on('data', function (chunk) {
								citationBody+=chunk; 
							});
							/* wait till the entire request is complete */

							result.on('end', function () {

								/* get the title of the research paper */
								var titleStart = citationBody.indexOf("<meta name=\"citation_title\" content=\"");

								if(titleStart!=-1)
								{

									/* get the index where the title ends */
									var titleEnd = citationBody.indexOf("/>", titleStart+36);
									/* extract the title */
									var titleString = citationBody.substring(titleStart+37, titleEnd-2);
									console.log("Title : "+titleString);
								/* array to store the list of authors
								   for a research paper 
								   	*/
								   var authorArray = new Array();
								   var numAuthors = 0;
								   var finalAuthorArray = new Array();

								/* to extract the date; get the start and end
								index of the date */
								var dateStart = citationBody.indexOf("<meta name=\"citation_date\" content=\"", titleEnd);
								var dateEnd = citationBody.indexOf("/>",dateStart);

								var dateString = citationBody.substring(dateStart+36,dateEnd-2);

								console.log("Date : " + dateString);

								var authorStart = citationBody.indexOf("<meta name=\"citation_author\" content=\"", titleEnd);

								/* extract multiple authors */
								while(authorStart!=-1)
								{	
									/* get the end index of the author meta-tag */
									var authorEnd = citationBody.indexOf("/>",authorStart);

									var authorString = citationBody.substring(authorStart+38, authorEnd-2);
									/* store the authors in a string */
									console.log("Author : "+authorString);

									authorArray[numAuthors++] = authorString;
									/* shift the source code string; since the author
									one detail have been extracted */
									citationBody = citationBody.substring(authorEnd);
									/* get the starting index of the next author meta-tag */
									authorStart = citationBody.indexOf("<meta name=\"citation_author\" content=\"");
								}		
								/* extract url using the starting and the ending index */
								var urlStart = citationBody.indexOf("<meta name=\"citation_pdf_url\" content=\"");
								var urlEnd = citationBody.indexOf("/>",urlStart);

								var urlString = citationBody.substring(urlStart+39, urlEnd-2);

								console.log("URL : " +urlString + ' ' + urlStart + ' ' + urlEnd);

								var citation = "";

								for(var p = 0; p < authorArray.length; p++)
								{
									var commaCheck = authorArray[p].indexOf(',');

									if(commaCheck != 0)
									{
										finalAuthorArray[p] = authorArray[p];
									}
									if(commaCheck != -1)
									{
										var secondpart = authorArray[p].substring(commaCheck+1, authorArray[p].length);
										var firstpart = authorArray[p].substring(0, commaCheck);

										authorArray[p] = firstpart + ' ';

										for(var q = 0; q < secondpart.length; q++)
										{
											if(secondpart[q] == ' ')
											{
												if(q != secondpart.length)
												{
													authorArray[p] += secondpart[q+1];
													authorArray[p] += '. ';
												}
											}
										}
										authorArray[p] = authorArray[p].substring(0,authorArray[p].length-1);
										authorArray[p] += ', '

										finalAuthorArray[p] = secondpart + ' ' + firstpart;
									}

									citation += authorArray[p];
								}
								citation = citation.substring(0, citation.length-2);

								dateString = dateString.substring(0, 4);

								citation += " (" + dateString + "). " + titleString + '.';
								citation += " Retrieved from " + urlString;

								console.log("Citation: " + citation);
								console.log("\n");

								/* create a new array for every research paper
								   search result 
								   */
								   currentResearchPaper = new Array();
								   currentResearchPaper[0] = titleString;
								   currentResearchPaper[1] = finalAuthorArray;
								   currentResearchPaper[2] = dateString;
								   currentResearchPaper[3] = urlString;
								   currentResearchPaper[4] = citation;
								/* push the entire current research paper array
								   to the actual array which stores the research
								   paper arrays 
								   */
								   researchPaperArray.push(currentResearchPaper);

								}
							});
});
/* required to end the request */
abstractPageRequest.end();
/* need to shift the string to skip what
has already been extracted */
pageBody = pageBody.substring(absEnd);
absStart = pageBody.indexOf("<span class=\"list-identifier\">");
}
});
}