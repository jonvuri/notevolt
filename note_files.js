var fs = require('fs');
var path = require('path');
var config = require('./config');

var note_files = {};

function make_note(file_path, callback) {
	fs.readFile(path.join(config.note_directory, file_path), config.encoding, function (err, contents) {
		if (err) {
			throw err;
		}
		callback({
			title: file_path.indexOf('.txt', file_path.length - 4) !== -1 ? file_path.slice(0, -4) : file_path,
			body: contents.toString()
		});
	});
}

note_files.get_list = function (callback) {
	fs.readdir(config.note_directory, function (err, files) {
		var files_left = files.length,
			notes = [];

		if (err) {
			throw err;
		}

		files.forEach(function (file) {
			make_note(file, function (note) {
				notes.push(note);
				--files_left;
				if (files_left === 0) {
					callback(notes);
				}
			});
		});
	});
}

// Updates or creates a note
note_files.update = function (note) {
	
}

// Expected to be set to a function with a parameter 'note'
// to be called when a note's file changes
//note_files.onChange

module.exports = exports = note_files;

