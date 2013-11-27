/*
* GET home page.
*/
var Project = require('../models/project.js');
var User = require('../models/user.js');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports.index = function(req, res){
	Project.find({'_id': { $in : req.user.projects}}, function(err, projects) {
		// User.findOne({'_id':ObjectId(projects[i].collaborators[j])}, function(err, user){
		// 			collaborators[i].push(user);
		// 		});
	res.render('index', { title: 'PhDWriter', projects: projects, user: req.user.name});
});
	
};

exports.getDocument = function(req, res){
	console.log("Requesting for " + req.query.id);
	Project.findOne({'_id':ObjectId(req.query.id)}, function(err, project) {
		console.log("Found project: " + project + " " + !project);
		// Checking for malformed URL's
		if(!project)
			res.redirect('/error');
		else{
			// Checking for authorizaton
			if(project.collaborators.indexOf(req.user._id) == -1)
				res.redirect('/error');
			else
				res.render('document', { title: 'PhDWriter', documentID: project.id});	
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

		var newProject = new Project({
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