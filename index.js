var express = require("express");
var app = express();
var port = 3701;
var socket = require('socket.io');
var allUser = 0;

//Template
// app.set('views', __dirname + '/template');
// app.set('view engine', "jade");
// app.engine('jade', require('jade').__express);
// app.get("/", function(req, res){
    // res.render("index");
// })

var server = app.listen(port);
console.log("Listening on port " + port);
app.use(express.static('public'));

var io = socket(server);
io.on('connection', function (socket) {
	// socket.emit('message', { message: 'welcome to the chat' });
	// io.sockets.emit('message', { message: 'Welcome to the chat', handle: 'System' });
	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
	  });
	socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
	socket.on('typing',function(data){
		socket.broadcast.emit("typing",data);
	});
	socket.on('addUser',function(data){
		allUser += 1;
		var dataRes = {username: data, countUser: allUser};
		io.sockets.emit('addUser', dataRes);
	});
});
