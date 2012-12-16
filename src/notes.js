var _ = require('lodash');
var config = require('./config');
var files = require('./files');
var filter = require('./filter');

var notes = {};

var allNotes = {},
    filteredNotes = [];

notes.init = function init(callbacks) {
    _.defaults(callbacks, {
        init: function () {},
        filter: function () {}
    });
    
    files.watch({
        init: function (err, initialNotes) {
            allNotes = initialNotes;
            callbacks.init(err, allNotes);
        },
        
        changed: function (key, note) {
            allNotes[key] = note;
            filter.fold(note, callbacks.filter);
        },
        
        removed: function (key) {
            delete allNotes[key];
            filter.remove(note, callbacks.filter);
        }
    });
};

module.exports = exports = notes;

