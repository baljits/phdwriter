/* A lot of the below code is based on the documentation found at http://passportjs.org */
var passport = require('passport');
var User = require('../models/user.js');
var bcrypt = require('bcrypt');

exports.login = function(req, res){
	res.render('login', { title: 'PhDWriter' });
};

exports.logout = function(req, res){
	req.session.destroy(function(error) {
		res.redirect('/login');
	});
};

exports.authenticate = function(req, res){
	console.log("Authenticated: " + req.body.username);
	res.redirect('/');
}

exports.register = function(req, res){
	// Default value suggested by bcrypt for salt_work
	SALT_WORK_FACTOR = 10;

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) res.redirect('/login');

		bcrypt.hash(req.body.password, salt, function(err, passwordHash) {
			if(err) return next(err);

			var user = new User({created: new Date()
				, username: req.body.username 
				, name: req.body.fullname
				, email: req.body.email
				, hash: passwordHash
				,projects: []});

			console.log("Adding user " + req.body.username);
			user.save(function(err) {
				if(err) {
					done(err);
				} else {
					console.log("Added user " + this.username);
					res.redirect('/login');
				}
			});
		});
	});
};

exports.isAuthenticated = function(req, res, actualFunction) {
	if(req.user) {
		actualFunction();
	}
	else
		res.redirect('/login');
}