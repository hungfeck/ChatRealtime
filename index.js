var express = require("express");
var app = express();
var port = 3701;
var socket = require('socket.io');
var allUser = 0;
var usernameSocket = [];
// var update = require('./js/update');
const login11 = require('./js/login');
// const myModule = require('./js/hello');


var server = app.listen(port);
console.log("Listening on port " + port);
app.use(express.static('public'));

var io = socket(server);
function test(a, callback){
	return callback;
}

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/chat';
function login(username,password){
		console.log("truoc khi ket noi");
		ret = 
		MongoClient.connect(url, function (err, db) {
			if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
			} else {
			console.log('Connection established to', url);
				var collection = db.collection('user');
				collection.find({username: username,password: password}).toArray
				(
					function (err, result) {
						if (err) {
							console.log(err);
						} else if (result.length) {
							retVal = result[0].socketId;
							console.log ("retlogin "+retVal);
							
						} else {
							console.log('No document(s) found with defined "find" criteria!');
						}
						db.close();
					}
				);
			db.close();
			}
		});
		console.log("await"+  ret);
		return ret;
	}

io.on('connection', function (socket) {
	// socket.emit('message', { message: 'welcome to the chat' });
	// io.sockets.emit('message', { message: 'Welcome to the chat', handle: 'System' });
	// console.log('a user connected');
	// console.log(socket.id);
	// var rtUpdate = update.update("59db1a9520092a4a6d66334c",1,1,1,1);
	var ret =  login("h", "h");
		console.log("ret" +ret);
	
	socket.on('disconnect', function(){
	  });
	// socket.on('send', function (data) {
        // io.sockets.emit('message', data);
    // });
	socket.on('send', function (data) {
		io.to('room1').emit('message', data);
        // io.sockets.emit('message', data);
    });
	socket.on('login', function (data) {
		// let val = myModule.hello(); // val is "Hello" 
		// console.log(val);
		var ttt = 1;
		var ret = login.login(data.username, data.password,function(ttt){
			// socket.emit('login', {username: , socketId: data.socketId });
			console.log("aaa"+ttt);
		});
		console.log("after"+ ret);
		// var socketId = data.socketId;
		// console.log(socketId);
		// socket.emit('login', {username: String(rtLogin), socketId: data.socketId });
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

