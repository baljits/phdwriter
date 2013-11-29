/* A lot of the below code is based on the documentation found at http://passportjs.org */
var passport = require('passport');
var User = require('../models/user.js');
var bcrypt = require('bcrypt');

exports.login = function(req, res){
	res.render('login', { title: 'PhDWriter', error: '' });
};

exports.loginError = function(req, res){
	console.log("Login Error");
	res.render('login', { title: 'PhDWriter', error: 'Incorrect username or password!' });
};

exports.registrationError = function(req, res){
	res.render('login', { title: 'PhDWriter', error: 'Username already exists!' });
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
	var SALT_WORK_FACTOR = 10;
	var username = req.body.username;
	var fullname = req.body.fullname;
	var email = req.body.email;

	User.find({'username':username}, function(err, users){
		if(users.length == 0)
		{
			bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
				if(err) res.redirect('/loginError');

				bcrypt.hash(req.body.password, salt, function(err, passwordHash) {
					if(err) return next(err);

					var user = new User({created: new Date()
						, username: username
						, name: fullname
						, email: email
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
		}
		else
		{
			console.log("Username already exists!");
			res.redirect('/registrationError');
		}
	})
};

exports.isAuthenticated = function(req, res, actualFunction) {
	if(req.user) {
		actualFunction();
	}
	else
		res.redirect('/login');
}