var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    mkpath = require('mkpath'),
    m_watch = require('watch');

var magic = require('./magic'),
    noteProto = require('./prototype');

var files = {};

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
                    fs.stat(file, function (err, stats) {
                        if (err) {
                            callback(null);
                        } else {
                            callback(makeNote({
                                directory: path.dirname(file),
                                extension: path.extname(file),
                                title: path.basename(file),
                                contents: contents,
                                timeModified: stats.mtime
                            }));
                        }
                    });
                }
            });
        }
    });
};

files.watch = function watch(dir, callbacks) { 
    var changeIfNote = function (file) {
            readFileAsNote(file, function (note) {
                if (note) {
                    callbacks.changed(file, note);
                }
            });
        },
        
        changeIfNoteElseRemove = function (file) {
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
        if (err) {
            callbacks.init(err);
        } else {
            m_watch.createMonitor(dir, function (monitor) {
                var initialNotes = {}, files, init;
                
                files = _.keys(monitor.files);
                init = _.after(files.length, callbacks.init);

                files.forEach(function (file) {
                    readFileAsNote(file, function (note) {
                        if (note) {
                            initialNotes[file] = note;
                        }
                        init(null, initialNotes);
                    });
                }); 
                
                monitor.on('created', changeIfNote);
                monitor.on('changed', changeIfNoteElseRemove);
                monitor.on('removed', callbacks.removed);
            });
        }
    });
};

files.update = function update(note, callback) {
    var notepath = path.join(note.directory, note.title + note.extension);
    fs.writeFile(notepath, note.contents, callback);
};

module.exports = exports = files;
