var _ = require('lodash');
var config = require('./config');
var files = require('./files');

var notes = {};

var noteSet,
    filter,
    callbacks;

var updateChangedNote = function updateChangedNote(file, note) {
    noteSet[file] = note;
    refilter();
}

var refilter = function refilter() {
}

// Returns full note based on title
notes.get = function (title) {

}

// Updates or creates a note (asynchronously propagates to files)
notes.update = function (note) {

}

// Initiates filter on note list
// notes.changed will fire when done
notes.filter = function (string) {
    
}

notes.load = function (notesCallbacks) {
    var watchCallbacks = {};
    
    callbacks = _.defaults(notesCallbacks, {
        changed: function () {}
    });
    
    callbacks.init = function init(notes) {
        noteSet = notes;
        callbacks.changed(noteSet);
    }
    watchCallbacks.created = updateChangedNote;
    watchCallbacks.changed = updateChangedNote;
    watchCallbacks.removed = updateChangedNote;

    files.watch(watchCallbacks);
}

module.exports = exports = notes;

