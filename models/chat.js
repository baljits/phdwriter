var mongoose = require('mongoose')
,Schema = mongoose.Schema;

var chatSchema = new Schema({
	sourceUser: Schema.Types.ObjectId,
	text: String,
	timestamp: Date
});

module.exports = mongoose.model('Chat', chatSchema);