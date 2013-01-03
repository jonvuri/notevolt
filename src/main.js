var _ = require('lodash');

var notes = require('./notes');

var noteSet = {};
var noteList = [];
var noteDivs = {};
var activeNoteKey = null;
var noteListDiv = document.querySelector('#notelistcol');
var noteViewDiv = document.querySelector('#noteviewcol');

var makeNoteView = function makeNoteView(note) {
    var noteView = document.createElement('textarea');
    
    noteView.classList.add('note-view');
    noteView.value = note.contents;
    noteView.addEventListener('blur', function handleBlur() {
        note.contents = noteView.value;
        activeNoteKey = note.getKey();
        notes.update(note, function (err) {
            if (err) {
                console.log(err);
            }
        });
    });
    
    return noteView;
};

var changeActiveNote = function changeActiveNote(note) {
    if (activeNoteKey) {
        noteDivs[activeNoteKey].classList.remove('active-note');
    }
    debugger;
    activeNoteKey = note.getKey();
    noteDivs[activeNoteKey].classList.add('active-note');
    
    noteViewDiv.innerHTML = '';
    noteViewDiv.appendChild(makeNoteView(note));
};

var makeNoteDiv = function makeNoteDiv(note) {
    var noteDiv, titleDiv, previewDiv;
    
    titleDiv = document.createElement('div');
    titleDiv.classList.add('note-title');
    titleDiv.textContent = note.title;
    
    previewDiv = document.createElement('div');
    previewDiv.classList.add('note-preview');
    previewDiv.textContent = note.contents.slice(0, 4096);
    
    noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.appendChild(titleDiv);
    noteDiv.appendChild(previewDiv);
    noteDiv.addEventListener('click', function handleClick() {
        changeActiveNote(note);
    });
    
    return noteDiv;
};

document.querySelector('#searchbox').addEventListener('input',
    function handleInput(ev) {
        notes.filter(ev.target.value);
    });

notes.init({
    init: function handleInit(err) {
        if (err) {
            console.log(err);
        }
    },
    filter: function handleFilter(filter) {
        var i, noteDiv;
        
        noteSet = filter.set;
        noteList = filter.list;
        
        // Only change the modified notes?
        
        noteListDiv.innerHTML = '';
        noteDivs = {};

        for (i = 0; i < noteList.length; i += 1) {
            noteDiv = makeNoteDiv(noteList[i]);
            
            if (activeNoteKey === noteList[i].getKey()) {
                noteDiv.classList.add('active-note');
            }
            
            noteListDiv.appendChild(noteDiv);
            noteDivs[noteList[i].getKey()] = noteDiv;
        }
    }
});

