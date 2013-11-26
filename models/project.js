var mongoose = require('mongoose')
,Schema = mongoose.Schema;

var User = require('./user.js');
var Chat = require('./chat.js');

var projectSchema = new Schema({
	title: String,
	creationDate: Date,
	collaborators: [Schema.Types.ObjectId],
	citations: [String],
	images: [String],
	chatHistory: [Chat]
});

module.exports = mongoose.model('Project', projectSchema);