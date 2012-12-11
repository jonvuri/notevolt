var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;

// Unit under test
var files = require('../src/files');


var testNoteDir = './test-note-dir';
var note_filename = 'note';
var note_contents = 'le blarg';
var notANote_filename = 'not_a_note';
var notANote_contents = 0;

module.exports = {
    after: function () {
        require('child_process').exec('rm -rf ' + testNoteDir);
    },
    
    // After this test, testNoteDir should exist
    'should watch new directory that does not exist': function (done) {
        fs.exists(testNoteDir, function (exists) {
            if (exists) {
                done(new Error('Object already exists at path: ' + testNoteDir));
            } else {
                files.watch(testNoteDir, { init: done });
            }
        });
    },
    
    // Expected running time: 1 sec
    'should not respond to new file that is not a note': function (done) {
        files.watch(testNoteDir, {
            init: function (err) {
                var notepath = path.join(testNoteDir, notANote_filename);
                if (err) {
                    done(err);
                } else {
                    fs.writeFile(notepath, notANote_contents, done);
                }
            },
            changed: function () {
                done(new Error('changed callback should not have fired'));
            }
        });
    },

    'should respond to new file that is a note': function (done) {
        files.watch(testNoteDir, {
            init: function (err) {
                if (err) {
                    done(err);
                } else {
                    fs.writeFile(
                        path.join(testNoteDir, note_filename),
                        note_contents,
                        function (err) {
                            if (err) done(err);
                        });
                }
            },
            changed: function () {
                done(null);
            }
        });
    }
};
