var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/chat';
module.exports = {
	update: function(id,username,password,socketId,status){
	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} 
		else 
		{
			console.log('Connection established to', url);
			var collection = db.collection('user');
			var user = [];
			var o_id = new mongodb.ObjectID(id);
			console.log(111);
			collection.find({_id: o_id}).toArray
				(
					function (err, result) {
						if (err) {
							console.log(err);
						} else if (result.length) {
							user = result;
							console.log(user);
							return result[0].username;
						} else {
							console.log('no document(s) found with defined "find" criteria!');
						}
					}
				);
			// Update user
			
			// collection.update({chatname: 'room1'}, {$set: {content: 'wtf1111', test: 'hii'}}, function (err, numUpdated) {
			// if (err) {
			// console.log(err);
			// } else if (numUpdated) {
			// console.log('Updated Successfully');
			// console.log(numUpdated);
			// } else {
			// console.log('No document found with defined "find" criteria!');
			// }
			// //Close connection
			// db.close();
			// });
		
		
		
		}
	});
}

}