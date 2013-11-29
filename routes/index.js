/*
* GET home page.
*/
var Library = require('../models/library.js');
var User = require('../models/user.js');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports.index = function(req, res){
	Library.Project.find({'_id': { $in : req.user.projects}}, function(err, projects) {
		User.find({}, function(err, users)
		{
			collaborators = []
			for (var i=0; i<projects.length; i++) {
				collaborators[i] = []
				for (var j=0; j<users.length; j++) {
					console.log('Checking user ' + users[j].id + ' Against ' + projects[i].collaborators);
					if(projects[i].collaborators.indexOf(users[j].id) != -1)
					{
						console.log("Found!");
						collaborators[i].push(users[j].name);
					}
				};
			};
			console.log(collaborators);
			res.render('index', { title: 'PhDWriter', projects: projects, user: req.user.name, collaborators:collaborators});
		});
	});
};

exports.getDocument = function(req, res){
	console.log("Requesting for " + req.query.id);

	Library.Project.findOne({'_id':ObjectId(req.query.id)}, function(err, project) {

		console.log("Found project: " + project + " " + !project);
		// Checking for malformed URL's
		if(!project)
			res.redirect('/error');
		else{
			
			// Checking for authorizaton
			if(project.collaborators.indexOf(req.user._id) == -1)
				res.redirect('/error');
			else
				res.render('document', { title: 'PhDWriter', documentID: project.id, paperCitationUsed : project.citations, imagesUsed : project.images});	
		}
	});	
};

exports.getLibrary = function(req, res){
	var documentID = req.param("documentID");
	var currentUser = req.user;

	Library.Project.findOne({'_id':ObjectId(documentID)}, function(err, project) {

		if(!project)
			res.send({"error":'Invalid Project ID!'});
		else{
			// Checking for authorizaton
			if(project.collaborators.indexOf(currentUser._id) == -1)
				res.send({"error":'Unauthorized Resource!'});
			else
			{
				res.send({"error":"No error", 'paperCitationUsed' : project.citations, 'imagesUsed' : project.images});
			}
		}
	});	
};

exports.addProject = function(req, res){
	var currentUser = req.user;
	var title = req.body.title;
	var collaborators = req.body.collaborators.split(',');

	for(var i=0; i<collaborators.length; i++)
	{
		collaborators[i] = collaborators[i].trim();
	}
	collaborators.push(req.user.username);

	User.find({'username' : { $in : collaborators}}, function(err, users)
	{
		var collaboratorsArray = [];

		for(var i=0; i<users.length; i++)
			collaboratorsArray.push(users[i].id);

		console.log("Logged in user " + req.user);
		console.log("Collaborators " + collaboratorsArray);

		var newProject = new Library.Project({
			title: title
			, creationDate: new Date()
			, collaborators: collaboratorsArray
			, citations: []
			, images: []
			, chatHistory: []});

		newProject.save();
		
		for(var i=0; i<users.length; i++)
		{
			users[i].projects.push(newProject.id);
			users[i].save();
		}

		res.redirect('/');

	});
};

exports.renderError = function(req, res){
	res.render('error', {title: 'PhDWriter'});
};