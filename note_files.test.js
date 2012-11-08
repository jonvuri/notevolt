var assert = require('assert');
var _ = require('underscore');
var note_files = require('./note_files');

var mocknote1_title = 'mocknote1';
var mocknote1_body = 'notecontents1\n';

var mocknote2_title = 'mocknote2';
var mocknote2_body = 'notecontents2\n';

note_files.get_list(function (list) {
	assert(_.find(list, function (note) {
		return note.title === mocknote1_title && note.body === mocknote1_body;
	}), 'Expected to find mocknote1');
});

process.on('exit', function () {
	console.log('All note_files tests passed!');
});