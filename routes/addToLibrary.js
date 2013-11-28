var Library = require('../models/library.js');
var User = require('../models/user.js');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports.addingPaper = function(req, res){
	var paperTitle = req.param("title");
	var paperUrl = req.param("url");
	var paperDate = req.param("date");
	var authorList = req.param("authorList");
	var paperCitation = req.param("citation");
	
	console.log("Citation : "+paperCitation);
	var documentID = req.param("documentID");
	var currentUser = req.user;
	
	Library.Project.findOne({'_id':ObjectId(documentID)}, function(err, project) {
		console.log("Found project: " + project + " " + !project);
		// Checking for malformed URL's
		if(!project)
			res.send({"error":'Invalid Project ID!'});
		else{
			// Checking for authorizaton
			if(project.collaborators.indexOf(currentUser._id) == -1)
				res.send({"error":'Unauthorized Reseource!'});
			else
			{
				var newPaperCitation = new Library.Citation({
					title: paperTitle
					, authors: authorList
					, pdfUrl: paperUrl
					, citationText: paperCitation
					, publicationDate: paperDate
				});

				
				project.citations.push(newPaperCitation);
				console.log("Saved the new message");
				project.save();

				res.send({'title':paperTitle, 'url':paperUrl, 'authorList':authorList, 'publicationDate':paperDate, 'citation':paperCitation});
			}
		}
	});	
};


exports.addingImage = function(req, res){
	var imageTitle = req.param("title");
	var thumbImgUrl = req.param("imageThumb");
	var fullImgUrl = req.param("imageFull");

	var documentID = req.param("documentID");
	var currentUser = req.user;
	var chatMessage = req.param("message");

	Library.Project.findOne({'_id':ObjectId(documentID)}, function(err, project) {
		console.log("Found project: " + project + " " + !project);
		// Checking for malformed URL's
		if(!project)
			res.send({"error":'Invalid Project ID!'});
		else{
			// Checking for authorizaton
			if(project.collaborators.indexOf(currentUser._id) == -1)
				res.send({"error":'Unauthorized Reseource!'});
			else
			{
				var image = new Library.Image({
					title: imageTitle
					, imageThumbUrl: thumbImgUrl
					, imageUrl: fullImgUrl
				});

				
				project.images.push(image);
				console.log("Saved the new message");
				project.save();

				res.send({'title':imageTitle, 'thumbImg':thumbImgUrl, 'fullImg':fullImgUrl});
			}
		}
	});	
};
