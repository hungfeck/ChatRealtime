var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/chat';

module.exports = {
	addLogChat: function(from, to, content)
	{
		MongoClient.connect(url, function (err, db) {
			if (err) 
			{
				return callback(null);
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} 
			else 
			{
				console.log('Connection established to', url);
				var collection = db.collection('logchat');
				collection.insert({"from": from, "to": to, "content": content, "commentDate": new Date()}, function (err, numUpdated) {
					if (err) {
					console.log(err);
					} else if (numUpdated) {
						console.log('add a LogChat');
					} else {
						console.log('No document found with defined "find" criteria!');
					}
					db.close();
					});
				db.close();
			}
		});
	},
	getLogChat: function(socketId, callback)
	{
		console.log("get log chat"+socketId);
		MongoClient.connect(url, function (err, db) {
			if (err) 
			{
				return callback(null);
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} 
			else 
			{
				console.log('Connection established to', url);
				var collection = db.collection('logchat');
				collection.find({ $or: [ { from: socketId }, { to: socketId } ] }).toArray
				(
					function (err, result) {
						if (err) {
							console.log(err);
							return callback(null);
						} else if (result.length) {
							console.log("log chat "+result);
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
}