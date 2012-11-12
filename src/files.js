var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    mikeal_watch = require('watch');

var magic = require('./magic'),
    noteProto = require('./prototype'),
    config = require('./config');

var files = {};

files.watch = function watch(callbacks) {
    // Check if note directory exists?
    mikeal_watch.createMonitor(config.noteDirectory, function (monitor) {
       var filenames = _.keys(monitor.files),
           initcb = _.after(filenames.length, callbacks.init),
           notes = [];
    
       _.forEach(filenames, function (file) {
           fs.readFile(file, function (err, buffer) {
               var contents = magic.stringOrNull(buffer);
               if (contents !== null) {
                   notes.push(_.extend(noteProto, {
                       title: path.basename(file, '.txt'),
                       contents: contents
                   }));
               }
               initcb(notes);
           });
       });
       
       monitor.on('created', function (file, stat) {
           
       });
       
       monitor.on('changed', function (file, currStat, prevStat) {
           
       });
       
       monitor.on('removed', function (file, stat) {
           
       });
    });
};
        
files.update = function update(note) {
	
}

module.exports = exports = files;

