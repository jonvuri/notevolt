var _ = require('lodash');

var noteProto = require('./prototype'),
    config = require('./config');

var util = {};

util.trimNoteExtensions = 
util.makeNote = function makeNote(filePath, callback) {
	fs.readFile(path.join(config.noteDirectory, filePath), config.encoding, function (err, contents) {
		if (err) {
			throw err;
		}
		var note = _.extend(noteProto, {
            title: trimNoteExtensions(filePath),
            contents: contents
        });
		callback(note);
	});
}

module.exports = exports = util;

