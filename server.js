//-----------------------------------------
//	Module/middleware and config loading
//-----------------------------------------

var http         = require('http');
var express      = require('express');
var bodyParser   = require('body-parser');
var mongoose     = require('mongoose');
var getRawBody   = require('raw-body');
var cookieParser = require('cookie-parser');
var session      = require('express-session');

var MemoryStore = require('connect').session.MemoryStore;

//-----------------------------------------
//	Server creation using ExpressJS
//-----------------------------------------

var app = express();

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

// Body-parser implementation
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json({limit: '1mb'}));

// Parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// Cookie-parser implementation
app.use(cookieParser());


// Session implementation
app.use(session({
 	secret: 'WebInspectorSecretKey', 
  	store: new MemoryStore(),
  	resave: true,
  	saveUninitialized: true
}));

var server = http.createServer(app);

//-----------------------------------------
//	Basic account management
//-----------------------------------------

// Set the index page which contains the app booting script 
// src "URL"
app.get('/', function (req, res) {
	res.send('Hello world !');
});

// Start the server
app.listen(8080);
console.log("Server ready to accept requests on port 8080");