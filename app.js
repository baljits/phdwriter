
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

var researchPaperListing = require('./routes/paperList');

var researchPaperCiting = require('./routes/citeList');

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
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/listPapers', researchPaperListing.paperListing);
// app.get('/citePapers', researchPaperListing.paperListing);

var options = {db: {type: 'none'}}; // See docs for options. {type: 'redis'} to enable persistance.

// Attach the sharejs REST and Socket.io interfaces to the server
sharejs.server.attach(app, options);

app.listen(8000, function(){
    console.log('Server running at http://127.0.0.1:8000/');
});