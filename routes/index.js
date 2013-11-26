/*
* GET home page.
*/
var Project = require('../models/project.js');
var User = require('../models/user.js');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

exports.index = function(req, res){
	Project.find({}, function(err, projects) {
		// User.findOne({'_id':ObjectId(projects[i].collaborators[j])}, function(err, user){
		// 			collaborators[i].push(user);
		// 		});
		res.render('index', { title: 'PhDWriter', projects: projects});
	});
	
};

exports.getDocument = function(req, res){
	res.render('document', { title: 'PhDWriter', documentID: req.query.id});
	
};

exports.addProject = function(req, res){
	var currentUser = req.user;
	var title = req.body.title;
	var collaborators = req.body.collaborators;

	console.log("Logged in user " + req.user);
	
	var newProject = new Project({
		title: title
		, creationDate: new Date()
		, collaborators: [currentUser.id]
		, citations: []
		, images: []
		, chatHistory: []});

	newProject.save();
	res.redirect('/');
}
