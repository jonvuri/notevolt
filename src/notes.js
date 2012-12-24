var _ = require('lodash');

var config = require('./config'),
    files = require('./files'),
    filter = require('./filter');

var notes = {};

var allNotes = {},
    callbacks;

notes.init = function init(cbs) {
    callbacks = _.defaults(cbs, {
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
            filter.add(note, callbacks.filter);
        },
        
        removed: function (key) {
            delete allNotes[key];
            filter.remove(note, callbacks.filter);
        }
    });
};

notes.filter = function filter(query) {
    return filter.all(query, allNotes, callbacks.filter);
};

module.exports = exports = notes;
