var assert = require('assert');
var _ = require('underscore');
var note_files = require('./note_files');

var mocknote1_title = 'mocknote1';
var mocknote1_contents = 'notecontents1\n';

var mocknote2_title = 'mocknote2';
var mocknote2_contents = 'notecontents2\n';

note_files.get_list(function (list) {
	assert(_.find(list, function (note) {
		return note.title === mocknote1_title && note.contents === mocknote1_contents;
	}), 'Expected to find mocknote1');

	assert(_.find(list, function (note) {
		return note.title === mocknote2_title && note.contents === mocknote2_contents;
	}), 'Expected to find mocknote2');
});

process.on('exit', function () {
	console.log('All note_files tests passed!');
});
