var notes = require('./notes');

var createNoteDiv = function createNoteDiv(note, index) {
    return '<div id="note' + index + '" class="note">' +
           '<div class="note-title">' + note.title + '</div>' +
           '<div class="note-preview">' + note.contents.slice(0,3000) + '</div>' +
           '</div>';
}

window.onload = function () {
    
}

