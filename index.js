var express = require("express");
var app = express();
var port = 3701;
var socket = require('socket.io');
var allUser = 0;
var usernameSocket = [];


var server = app.listen(port);
console.log("Listening on port " + port);
app.use(express.static('public'));

var io = socket(server);
io.on('connection', function (socket) {
	// socket.emit('message', { message: 'welcome to the chat' });
	// io.sockets.emit('message', { message: 'Welcome to the chat', handle: 'System' });
	// console.log('a user connected');
	// console.log(socket.id);
	socket.on('disconnect', function(){
	  });
	socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
	socket.on('typing',function(data){
		socket.broadcast.emit("typing",data);
	});
	socket.on('addUser',function(data){
		allUser += 1;
		var dataRes = {username: data.username, countUser: allUser, id: data.id };
		var datausernameSocket = {username: data.username,id: data.id};
		usernameSocket.push(datausernameSocket);
		io.sockets.emit('addUser', dataRes);
		io.sockets.emit('announce', allUser);
	});
	socket.on('sendtohungfeck',function(data){
		// sending to individual socketid
		var socketId = "";
		usernameSocket.forEach(function(entry) {
			if(entry.username == "hungfeck")
			{
				socketId = entry.id;
				console.log(socketId);
			}
		});
		socket.broadcast.to(socketId).emit("sendtohungfeck",data);
	});
});

