var _ = require('underscore');
var config = require('./config');
var note_files = require('./note_files');

var notes = {};

var note_list = null;

// Returns full note based on title
notes.get = function (title) {

}

// Updates or creates a note (asynchronously propagates to files)
notes.update = function (note) {

}

// Called with a single parameter note_summary_list whenever there is a change due to filtering and/or note
// files changing; note_summary_list is like note_list, but with truncated bodies
notes.onchange = function () {
	console.debug('Warning: notes.onchange not set');
}

module.exports = exports = notes;

