var _ = require('lodash');

var config = require('./config'),
    files = require('./files'),
    filter = require('./filter'),
    noteProto = require('./prototype');

var notes = {};

var allNotes = {},
    callbacks;

notes.filter = function (query) {
    return filter.all(query, allNotes, callbacks.filter);
};

notes.init = function init(cbs) {
    callbacks = _.defaults(cbs, {
        init: function () {},
        filter: function () {}
    });
    
    files.watch(config.noteDirectory, {
        init: function (err, initialNotes) {
            allNotes = initialNotes;
            callbacks.init(err);
            notes.filter('');
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

notes.create = function create(title, callback) {
    var note = _.extend(_.clone(noteProto, true), {
        directory: config.noteDirectory,
        extension: '.txt',
        title: title,
        contents: '',
        timeModified: Date.now()
    });
    return files.update(note, function (err) {
        if (err) {
            console.log(err);
            callback.apply(null, arguments);
        } else {
            allNotes[note.getKey()] = note;
            filter.add(note, function (filter) {
                callback(err, filter);
            });
        }
    });
};

notes.update = function update(note, callback) {
    return files.update(note, function (err) {
        if (err) {
            console.log(err);
        } else {
            delete allNotes[note.getKey()];
        }
        callback.apply(null, arguments);
    });
};

module.exports = exports = notes;
