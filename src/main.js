var _ = require('lodash');

var notes = require('./notes');

var noteSet = {};
var noteList = [];
var activeNote = null;

var createNoteDiv = function createNoteDiv(note) {
    var noteDiv, titleDiv, previewDiv;
    
    titleDiv = document.createElement('div');
    titleDiv.classList.add('note-title');
    titleDiv.textContent = note.title;
    
    previewDiv = document.createElement('div');
    previewDiv.classList.add('note-preview');
    previewDiv.textContent = note.contents.slice(0, 4000);
    
    noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.appendChild(titleDiv);
    noteDiv.appendChild(previewDiv);
    
    return noteDiv;
};

var noteListDiv = document.querySelector('#notelistcol');
var noteViewDiv = document.querySelector('#noteviewcol');

document.querySelector('#searchbox').addEventListener('input',
    function handleKeyDown(ev) {
        notes.filter(ev.target.value);
    });

notes.init({
    init: function handleInit(err) {
        if (err) {
            console.log(err);
        }
    },
    filter: function handleFilter(filter) {
        var i, note, noteDiv;
        
        noteSet = filter.set;
        noteList = filter.list;
        
        // Only change the modified notes?
        
        noteListDiv.innerHTML = '';

        for (i = 0; i < noteList.length; i += 1) {
            note = noteList[i];
            noteDiv = createNoteDiv(note);
            
            if (activeNote && activeNote === note.key) {
                noteDiv.classList.add('active-note');
            }
            
            noteListDiv.appendChild(noteDiv);
        }
    }
});

