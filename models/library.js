var mongoose = require('mongoose')
,Schema = mongoose.Schema;

var User = require('./user.js');
var Chat = require('./chat.js');

var citationSchema = new Schema({
	title: String,
	authors: [String],
	pdfUrl: String,
	citationText: String,
	publicationDate: String
});

var imageSchema = new Schema({
	title: String,
	imageThumbUrl: String,
	imageUrl: String
});

var projectSchema = new Schema({
	title: String,
	creationDate: Date,
	collaborators: [Schema.Types.ObjectId],
	citations: [citationSchema],
	images: [imageSchema],
	chatHistory: [mongoose.model('Chat').schema]
});

module.exports = {
	Project: mongoose.model('Project', projectSchema),
	Citation: mongoose.model('Citation', citationSchema),
	Image: mongoose.model('Image', imageSchema)
};
// module.exports = mongoose.model('Citation', citationSchema);
// module.exports = mongoose.model('Image', imageSchema);