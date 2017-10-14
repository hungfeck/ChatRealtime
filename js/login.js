var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/chat';


var user = module.exports = {
	login:  function(username,password, callback){
		MongoClient.connect(url, function (err, db) {
			if (err) 
			{
				return callback(null);
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} 
			else 
			{
				console.log('Connection established to', url);
				var collection = db.collection('user');
				collection.find({username: username,password: password}).toArray
				(
					function (err, result) {
						if (err) {
							console.log(err);
							return callback(null);
						} else if (result.length) {
							retVal = result[0].username;
							console.log("retlogin "+retVal);
							return callback(retVal);
						} else {
							console.log('No document(s) found with defined "find" criteria!');
							return callback(null);
						}
						db.close();
					}
				);
				db.close();
			}
		});
	},
	insertSocketId: function(username, socketId){
		MongoClient.connect(url, function (err, db) {
			if (err) 
			{
				return callback(null);
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} 
			else 
			{
				console.log('Connection established to', url);
				var collection = db.collection('user');
				collection.update({username: username}, {$set: {socketId: socketId, status: "1"}}, function (err, numUpdated) {
					if (err) {
					console.log(err);
					} else if (numUpdated) {
						console.log('Updated Successfully document(s).'+ numUpdated);
					} else {
						console.log('No document found with defined "find" criteria!');
					}
					//Close connection
					db.close();
					});
				db.close();
			}
		});
	},
	checkUseradmin: function(callback){
		MongoClient.connect(url, function (err, db) {
			if (err) 
			{
				return callback(null);
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} 
			else 
			{
				console.log('Connection established to', url);
				var collection = db.collection('user');
				collection.find({status: "1"}).toArray
				(
					function (err, result) {
						if (err) {
							console.log(err);
							return callback(null);
						} else if (result.length) {
							return callback(result);
						} else {
							console.log('No document(s) found with defined "find" criteria!');
							return callback(null);
						}
						db.close();
					}
				);
				db.close();
			}
		});
	},
	addConnectId: function(username,connectId){
		MongoClient.connect(url, function (err, db) {
			if (err) 
			{
				return callback(null);
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} 
			else 
			{
				console.log('Connection established to', url);
				var collection = db.collection('user');
				collection.update({"username": username}, {$addToSet  : {"connectIds" : {"connectId":connectId}}}, function (err, numUpdated) {
					if (err) {
					console.log(err);
					} else if (numUpdated) {
						console.log('addConnectId');
					} else {
						console.log('No document found with defined "find" criteria!');
					}
					//Close connection
					db.close();
					});
				db.close();
			}
		});
	},
	udsttsuser: function(socketId){
		MongoClient.connect(url, function (err, db) {
			if (err) 
			{
				return callback(null);
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} 
			else 
			{
				console.log('Connection established to', url);
				var collection = db.collection('user');
				collection.update({"socketId": socketId}, {$set: {"status": "0"}}, function (err, numUpdated) {
					if (err) {
					console.log(err);
					} else if (numUpdated) {
						console.log('Update thanh cong');
					} else {
						console.log('No document found with defined "find" criteria!');
					}
					//Close connection
					db.close();
					});
				db.close();
			}
		});
	},
	removeConnectId: function(socketId){
		MongoClient.connect(url, function (err, db) {
			if (err) 
			{
				return callback(null);
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} 
			else 
			{
				console.log('Connection established to', url);
				var collection = db.collection('user');
				collection.update({"connectIds.connectId": socketId}, {$pull: {"connectIds": {connectId:socketId}}}, function (err, numUpdated) {
					if (err) {
					console.log(err);
					} else if (numUpdated) {
						console.log('numUpdated');
					} else {
						console.log('No document found with defined "find" criteria!');
					}
					//Close connection
					db.close();
					});
				db.close();
			}
		});
	},
	getUserByConnectId:  function(connectId, callback){
		MongoClient.connect(url, function (err, db) {
			if (err) 
			{
				return callback(null);
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} 
			else 
			{
				console.log('Connection established to', url);
				var collection = db.collection('user');
				collection.find({"connectIds.connectId": connectId}).toArray
				(
					function (err, result) {
						if (err) {
							console.log(err);
							return callback(null);
						} else if (result.length) {
							return callback(result);
						} else {
							console.log('No document(s) found with defined "find" criteria!');
							return callback(null);
						}
						db.close();
					}
				);
				db.close();
			}
		});
	},
	disconnect: function(socketId, callback)
	{
		MongoClient.connect(url, function (err, db) {
			if (err) 
			{
				console.log('Unable to connect to the mongoDB server. Error:', err);
				return callback(null);
			} 
			else 
			{
				console.log('Connection established to', url);
				var collection = db.collection('user');
				collection.find({socketId: socketId}).toArray
				(
					function (err, result) {
						if (err) {
							console.log(err);
							return callback(null);
						} else if (result.length) {
							user.udsttsuser(socketId);
							return callback("1");
						} else {
							console.log('khong tim thay useradmin');
							// user.removeConnectId(socketId);
							user.getUserByConnectId(socketId, function(res){
								user.removeConnectId(socketId);
								return callback(res);
							});
						}
						db.close();
					}
				);
				db.close();
			}
		});
	}
}