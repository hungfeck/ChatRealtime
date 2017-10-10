var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/chat';
module.exports = {
	login: function(username,password){
		console.log("truoc khi ket noi");
		MongoClient.connect(url, function (err, db) {
			console.log("da connect");
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
							var retVal = result[0].username;
							console.log ("ret"+retVal);
							return retVal;
						} else {
							console.log('No document(s) found with defined "find" criteria!');
						}
						db.close();
					}
				);
			db.close();
		  }
		});
	}
}