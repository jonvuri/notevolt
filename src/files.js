var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    mkpath = require('mkpath'),
    watch = require('watch');

var config = require('./config'),
    magic = require('./magic'),
    noteProto = require('./prototype');

var files = {};

var setupWatch = function setupWatch(dir, callbacks) { 
    watch.createMonitor(dir, function (monitor) {
        var filenames = _.keys(monitor.files),
            readFileAsNote = function readFileAsNote(file, callback) {
                fs.readFile(file, function (err, buffer) {
                    var contents;
                    if (err) {
                        callback(null);
                    }
                    contents = magic.stringOrNull(buffer);
                    if (contents) {
                        callback(_.extend(_.clone(noteProto, true), {
                            title: path.basename(file, '.txt'),
                            contents: contents
                        }));
                    } else {
                        callback(null);
                    }
                });
            };

        filenames.forEach((function () {
            var notes = {},
                initcb = _.after(filenames.length, callbacks.init);
            return function (file) {
                readFileAsNote(file, function (note) {
                    if (note) {
                        notes[file] = note;
                    }
                    initcb(notes);
                });
            };
        })()); // TODO: Reverse wrap / curry

        monitor.on('created', function (file) {
            readFileAsNote(file, function (note) {
                if (note) {
                    callbacks.created(file, note);
                }
            });
        });

        monitor.on('changed', function (file) {
            readFileAsNote(file, function (note) {
                callbacks.changed(file, note);
            });
        });

        monitor.on('removed', callbacks.removed);
    });
}

files.watch = function watch(callbacks) {
    _.defaults(callbacks, {
        init: function () {},
        created: function () {},
        changed: function () {},
        removed: function () {}
    });
    
    mkpath(config.noteDirectory, function (err) {
        // TODO: Error handling
        if (err) throw err;
        fs.exists(config.noteDirectory, function (exists) {
            if (exists) {
                setupWatch(config.noteDirectory, callbacks);
            } else {
                // TODO: Error handling
                throw new Error('Note directory does not exist');
            }
        });
    });
};
        
files.update = function update(note) {
	
}

module.exports = exports = files;

