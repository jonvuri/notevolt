var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var note_prototype = require('./note_prototype');
var config = require('./config');

var note_files = {};

function _trimNoteExtensions(filePath) {
    if (filePath.indexOf('.txt', filePath.length - 4) !== -1) {
        filePath = filePath.slice(0, 4);
    }
	return filePath;
}

function _makeNote(file_path, callback) {
	fs.readFile(path.join(config.note_directory, file_path), config.encoding, function (err, contents) {
		if (err) {
			throw err;
		}
		var note = _.extend(note_prototype, {
            title: _trimNoteExtensions(file_path),
            contents: contents
        });
		callback(note);
	});
}

note_files.getList = function (callback) {
	fs.readdir(config.note_directory, function (err, files) {
		if (err) {
			throw err;
		}
		var	notes = [],
            tick = _.after(files.length, function () { callback(notes); });
        files.forEach(function (file) {
            _makeNote(file, function (n) {
                notes.push(n);
                tick();
            });
        });
	});
}

note_files.update = function (note) {
	
}

note_files.onchange = (function () {
	var callbacks = null;
	return function (callback) {
		if (callbacks !== null) {
			callbacks.push(callback);
		} else {
			callbacks = [callback];
			_watch_note_directory();
		}
	};
})();

module.exports = exports = note_files;

