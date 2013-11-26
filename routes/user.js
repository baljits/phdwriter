var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var User = require('../models/user.js');
/*
* GET users listing.
*/

exports.list = function(req, res){
	User.find({}, function(err, projects) {
		console.log(projects);
		res.render('index', { title: 'PhDWriter', projects: projects});
	});
};

exports.getUsername = function(req, res) {
	console.log("Searching for " + req.param('userID') + ' ' + ObjectId(req.param('userID')));
	User.findOne({'_id':ObjectId(req.param('userID'))}, function(err, user){
		console.log("Got : " +user);
		res.send({"username":user.username});
	});
};