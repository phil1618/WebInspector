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

var zerorpc      = require("zerorpc");

var MemoryStore = require('connect').session.MemoryStore;

//-----------------------------------------
//	Connection to the Python server
//-----------------------------------------

var pyClient = new zerorpc.Client();
pyClient.connect("tcp://localhost:4242");

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
//	Basic URL 
//-----------------------------------------

// Set the index page 
app.get('/', function (req, res) {
	res.sendfile('views/index.html', {root: __dirname });
});


// Set the index page 
app.post('/pytest', function (req, res) {
	var url = req.param('url', '');
	console.log('Received url : ' + url);
	pyClient.invoke('parseUrl', url, function(error, response, more) {
    console.log(response);
    res.send(response);
});

});
//-----------------------------------------
//	Operational methods
//-----------------------------------------

// Start the server
app.listen(8080);
console.log("Server ready to accept requests on port 8080");