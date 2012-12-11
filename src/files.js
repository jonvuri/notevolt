var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    mkpath = require('mkpath'),
    m_watch = require('watch');

var magic = require('./magic'),
    noteProto = require('./prototype');

var files = {}; // Export

var makeNote = function makeNote(obj) {
    return _.extend(_.clone(noteProto, true), obj);
};

var readFileAsNote = function readFileAsNote(file, callback) {
    fs.readFile(file, function (err, buffer) {
        if (err) {
            callback(null);
        } else {
            magic.stringOrNull(buffer, function (contents) {
                if (!contents) {
                    callback(null);
                } else {
                    callback(makeNote({
                        title: path.basename(file, '.txt'),
                        contents: contents
                    }));
                }
            });
        }
    });
};
    

files.watch = function watch(dir, callbacks) { 
    var changeIfNote = function changeIfNote(file) {
            readFileAsNote(file, function (note) {
                if (note) {
                    callbacks.changed(file, note);
                }
            });
        },
        
        changeIfNoteElseRemove = function changeIfNoteElseRemove(file) {
            readFileAsNote(file, function (note) {
                if (note) {
                    callbacks.changed(file, note);
                } else {
                    callbacks.removed(file);
                }
            });
        };
    
    _.defaults(callbacks, {
        init: function () {},
        changed: function () {},
        removed: function () {}
    });
    
    mkpath(dir, function (err) {
        callbacks.init(err);
        
        m_watch.createMonitor(dir, function (monitor) {
            _.keys(monitor.files).forEach(changeIfNote);
            
            monitor.on('created', changeIfNote);
            monitor.on('changed', changeIfNoteElseRemove);
            monitor.on('removed', callbacks.removed);
        });
    });
};

files.update = function update(note) {
	
};

module.exports = exports = files;

