var Library = require('../models/library.js');
var User = require('../models/user.js');
var Chat = require('../models/chat.js')
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

/*
* GET Chat history.
*/
exports.getChatHistory = function(req, res){
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
				res.send({"error":"No error", 'chatHistory':project.chatHistory});
			}
		}
	});	
};

/*
* GET Chat history.
*/
exports.addChatMessage = function(req, res){
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
				var newChatMessage = new Chat({
					sourceUser: currentUser._id
					,sourceName: currentUser.name.substring(0, currentUser.name.indexOf(' '))
					, text: chatMessage
					, timestamp: new Date()
				});

				//newChatMessage.save();

				console.log("Saved the new message");

				project.chatHistory.push(newChatMessage);
				project.save();

				res.send({"username":currentUser.name.substring(0, currentUser.name.indexOf(' ')) , "message":chatMessage});
			}
		}
	});	
};

