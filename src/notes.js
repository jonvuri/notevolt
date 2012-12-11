var _ = require('lodash');
var config = require('./config');
var files = require('./files');

var notes = {};

var allNotes = {},
    filteredNotes = {},
    filterTerms = [],
    callbacks;

var handleInit = function 

var handleNoteChange = function handleNoteChange(key, note) {
    // Set note property in allNotes
    // Filter single note
    // Fire filter changed to main.js
};

var handleNoteRemoved = function handleNoteRemoved(key) {
    // Delete note property in allNotes and filteredNotes
    // Fire filter changed to main.js
}























var allNotes,
    filter,
    callbacks;

var sendChanged = function sendChanged() {
    callbacks.changed(filter);
};

var changeNote = function changeNote(file, note) {
    allNotes[file] = note;
    // Check if changed note applies to current filter
};

var removeNote = function removeNote(file) {
    delete allNotes[file];
    delete filter[file];
};

// Returns full note based on title
notes.get = function (title) {

};

// Updates or creates a note (asynchronously propagates to files)
notes.update = function (note) {

};

// Initiates filter on note list
// notes.changed will fire when done
notes.filter = function (string) {
    
};

notes.load = function (notesCallbacks) {
    var watchCallbacks = {};
    
    callbacks = _.defaults(notesCallbacks, {
        changed: function () {}
    });
    
    callbacks.init = function init(notes) {
        filter = allNotes = notes;
        sendChanged();
    }
    watchCallbacks.created = changeNote;
    watchCallbacks.changed = changeNote;
    watchCallbacks.removed = removeNote;

    files.watch(watchCallbacks);
}

module.exports = exports = notes;

