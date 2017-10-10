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
	login:  function(username,password,callback){
		console.log("truoc khi ket noi");
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
							// return retVal;
						} else {
							console.log('No document(s) found with defined "find" criteria!');
						}
						db.close();
					}
				);
			db.close();
			}
		});
		console.log("close connect");
		return callback(retVal,"socketId");
	}
}