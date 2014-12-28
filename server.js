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
var io 			 = require('socket.io');

var zerorpc      = require("zerorpc");

var MemoryStore = require('connect').session.MemoryStore;

//-----------------------------------------
//	Connection to the Python server
//	NOTE : need to take latest code from https://github.com/dotcloud/zerorpc-node
//	in order for heartbeat check working. Note that after two unsuccessful heartbeat checks
//	the remote python server is considered as lost. In order to parse big html doc (such as amazon,...)
//	a long long heartbeat interval is required : it lets time to the python server to do its job 
//	(here at most 60 sec) and lets him a chance to responds.
//-----------------------------------------

var pyClient = new zerorpc.Client({heartbeatInterval: 30000});
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
//app.use(bodyParser.json({type: 'application/vnd.api+json'}));

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

// Trigger the Python server to fetch basic info from a given URL
app.post('/python/htmlparser', function (req, res) {
	var url = req.param('url', '');
	console.log('[+] metaparser received url : ' + url);
	pyClient.invoke('parseHtml', url, function(error, response, more) {
    	if(!error){
			res.send(response);
		} else {
			res.send(error);
		}
	});
});
//-----------------------------------------
//	Socket connections
//-----------------------------------------
var sio = io.listen(server);

sio.sockets.on('connection', function(socket){
	console.log('user connected');

	socket.on('disconnect', function () {
    sio.sockets.emit('user disconnected');
  });
});

// Start the server
server.listen(8080);
console.log("Server ready to accept requests on port 8080");