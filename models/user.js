var mongoose = require('mongoose')
,Schema = mongoose.Schema;

var userSchema = new Schema({
	created: Date,
	name: String,
	username: String,
	email: String,
	hash: String
});

module.exports = mongoose.model('User', userSchema);