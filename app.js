
/**
* Module dependencies.
*/

require('coffee-script');

var express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, http = require('http')
, path = require('path')
, connect = require('./node_modules/connect')
, sharejs = require('./node_modules/share');

/* Authentication Libraries */
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy
, authentication = require('./routes/authentication')
, bcrypt = require('bcrypt');

/* Database initialization */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/phdwriter');

/* Database Models */
var User = require('./models/user.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router); 
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// Setting up Passport authentication
passport.use(new LocalStrategy(
	function(username, password, done) {
		console.log("Authenticating: " + username + " " + password);
		User.findOne({ username: username }, function(err, user) {
			if (err) { return done(err); }
			if (!user) {
				console.log("Incorrect username.");
				return done(null, false, { message: 'Incorrect username.' });
			}
			bcrypt.compare(password, user.hash, function(err, isMatch) {
				if(err || !isMatch) 
				{
					console.log("Incorrect password");
					return done(null, false, { message: 'Incorrect password.' });
				}
				console.log("User authorized " + isMatch);
				return done(null, user);
			});
		});
	})
);

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

// Setting up routes ala URL's
app.get('/', authentication.isAuthenticated, routes.index);
app.get('/login', authentication.login);
app.get('/logout', authentication.logout);
app.post('/authenticate', passport.authenticate('local',  { successRedirect: '/',
	failureRedirect: '/login' }));
app.post('/register', authentication.register);
app.get('/users', user.list);

var options = {db: {type: 'none'}}; // See docs for options. {type: 'redis'} to enable persistance.

// Attach the sharejs REST and Socket.io interfaces to the server
sharejs.server.attach(app, options);

app.listen(8000, function(){
	console.log('Server running at http://127.0.0.1:8000/');
});