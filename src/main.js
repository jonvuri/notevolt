var _ = require('lodash');

var notes = require('./notes');

var activeNote = null;
var noteListDiv;
var noteViewDiv;

var noteSet = {};
var noteList = [];

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
    noteDiv.appendChild(titleDiv);
    noteDiv.appendChild(previewDiv);
    
    return noteDiv;
}

var handleInit = function handleInit(err) {
    if (err) {
        console.log(err);
    }
};

var handleFilter = function handleFilter(filter) {
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
};

var init = function init() {
    //debugger;
    noteListDiv = document.querySelector('#notelistcol');
    noteViewDiv = document.querySelector('#noteviewcol');
    
    notes.init({
        init: handleInit,
        filter: handleFilter
    });
};

window.onload = function () {
    setTimeout(init, 5000);
};

