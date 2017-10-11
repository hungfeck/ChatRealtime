var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/chat';


module.exports = {
	// xulyArray : function(arr, callback) {
		// var resultArr = []; 
		// for (var i = arr.length-1; i >= 0; i--)
			// resultArr[i] = callback(arr[i]);
		// return resultArr;
	// }
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
	}
	// login:  function(username,password){ 
		// console.log("truoc khi ket noi");
		// MongoClient.connect(url, function (err, db) {
			// if (err) 
			// {
				// return callback(null);
				// console.log('Unable to connect to the mongoDB server. Error:', err);
			// } 
			// else 
			// {
				// console.log('Connection established to', url);
				// var collection = db.collection('user');
				// collection.find({username: username,password: password}).toArray
				// (
					// function (err, result) {
						// if (err) {
							// console.log(err);
						// } else if (result.length) {
							// retVal = result[0].socketId;
							// console.log("retlogin "+retVal);
							// return retVal
						// } else {
							// console.log('No document(s) found with defined "find" criteria!');
						// }
						// db.close();
					// }
				// );
				// db.close();
			// }
		// });
	// }
}