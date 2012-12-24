var notes = require('./notes');

var activeNote = null;
var noteListDiv;
var noteViewDiv;

var createNoteDiv = function createNoteDiv(note) {
    var noteDiv, titleDiv, previewDiv;
    
    titleDiv = document.createElement('div');
    titleDiv.classList.add('note-title');
    titleDiv.textContent = note.title;
    //titleDiv.append(document.createTextNode(note.title));
    
    previewDiv = document.createElement('div');
    previewDiv.classList.add('note-preview');
    previewDiv.textContent = note.contents.slice(0, 4000);
    //previewDiv.append(document.createTextNode(note.contents.slice(0, 4000)));
    
    noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.append(titleDiv);
    noteDiv.append(previewDiv);
    
    return noteDiv;
}

var changed = function changed(filter) {
    var i, note, noteDiv;
    
    noteListDiv.innerHTML = '';
    
    for (i = 0; i < filter.length; i+= 1) {
        note = notes.get(filter[i]);
        noteDiv = createNoteDiv(note);
        
        if (activeNote && activeNote === note.name) {
            noteDiv.classList.add('active-note');
        }
        
        noteListDiv.appendChild(noteDiv);
    }
}

window.onload = function () {
    
}
