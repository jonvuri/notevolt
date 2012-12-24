var crypto = require('crypto');

var note_prototype = {};

note_prototype.key = null;
note_prototype.title = null;
note_prototype.contents = null;
note_prototype.timeModified = null;
note_prototype.toString = function () {
	var md5 = crypto.createHash('md5');
	md5.update(this.title);
	md5.update(this.contents);
	return md5.digest();
}

module.exports = exports = note_prototype;
