var express = require("express");
var app = express();
var port = 3701;
var socket = require('socket.io');
var allUser = 0;
var usernameSocket = [];
// var update = require('./js/update');
const login = require('./js/login');
// const myModule = require('./js/hello');


var server = app.listen(port);
console.log("Listening on port " + port);
app.use(express.static('public'));

var io = socket(server);

io.on('connection', function (socket) {
	// socket.emit('message', { message: 'welcome to the chat' });
	// io.sockets.emit('message', { message: 'Welcome to the chat', handle: 'System' });
	// console.log('a user connected');
	// console.log(socket.id);
	// var rtUpdate = update.update("59db1a9520092a4a6d66334c",1,1,1,1);
	
	
	socket.on('disconnect', function(){
	  });
	socket.on('send', function (data) {
		// io.to('room1').emit('message', data);
        // io.sockets.emit('message', data);
		socket.emit('message',data);
		console.log(data.socketIdto);
		socket.broadcast.to(data.socketIdto).emit('messageto',data);
    });
	socket.on('login', function (data) {
		var retUsername = "";
		login.login(data.username, data.password, function(res) {
			retUsername = res;
			if(retUsername != null && retUsername != "")
			{
				login.insertSocketId(data.username, data.socketId);
			}
			socket.emit('login', {username: retUsername, socketId: data.socketId });
		});
    });
	socket.on('joinchat', function (data) {
		var retUsername = "";
		login.checkUseradmin(function(res) {
			retUsername = res;
			if(retUsername != null && retUsername != "")
			{
				// console.log(retUsername[0]);
				var min = retUsername[0].connectIds.length;
				var username = retUsername[0].username;
				var socketId = retUsername[0].socketId;
				retUsername.forEach(function(element) {
					if(element.connectIds.length<min)
					{
						username = element.username;
						min = element.connectIds.length;
						socketId = element.socketId;
					}
				});
				login.addConnectId(username,data.socketId); // Thêm 1 connectId mới
				socket.emit("joinchat",{socketIdto: socketId, username: data.username, chatto: username});
				socket.broadcast.to(socketId).emit("addConnect",data);
			}
		});
    });
	socket.on('typing',function(data){
		 //Cho tất cả
		// socket.broadcast.emit("typing",data);
		socket.broadcast.to('room1').emit("typing",data); // Cho những người trong room
		
	});
	socket.on('addUser',function(data){
		allUser += 1;
		var dataRes = {username: data.username, countUser: allUser, id: data.id };
		var datausernameSocket = {username: data.username,id: data.id};
		usernameSocket.push(datausernameSocket);
		io.sockets.emit('addUser', dataRes);
		io.sockets.emit('announce', allUser);
		update.update(); 
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
	// join room
	socket.on('create', function(room) {
		socket.join(room);
		console.log('join room '+room);
	});
});

