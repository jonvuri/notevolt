var path = require('path')

var note_prototype = {}

note_prototype.directory = null
note_prototype.extension = null

note_prototype.title = null
note_prototype.contents = null

note_prototype.timeModified = null

// Key <--> Note filename
note_prototype.getKey = function () {
    return path.join(this.directory, this.title + this.extension)
}

module.exports = exports = note_prototype
