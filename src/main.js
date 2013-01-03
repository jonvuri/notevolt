var notes = require('./notes');

var noteDivs = {};
var activeNoteKey = null;
var noteListDiv = document.querySelector('#notelistcol');
var noteViewDiv = document.querySelector('#noteviewcol');

var makeNoteView = function makeNoteView(note) {
    var noteView = document.createElement('textarea');
    
    noteView.classList.add('note-view');
    noteView.value = note.contents;
    noteView.addEventListener('blur', function () {
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
    var titleDiv = document.createElement('div');
    titleDiv.classList.add('note-title');
    titleDiv.textContent = note.title;
    
    var previewDiv = document.createElement('div');
    previewDiv.classList.add('note-preview');
    previewDiv.textContent = note.contents.slice(0, 4096);
    
    var noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.appendChild(titleDiv);
    noteDiv.appendChild(previewDiv);
    noteDiv.addEventListener('click', function () {
        changeActiveNote(note);
    });
    
    return noteDiv;
};

document.querySelector('#searchbox').addEventListener('input', function (ev) {
    notes.filter(ev.target.value);
});

notes.init({
    init: function (err) {
        if (err) {
            console.log(err);
        }
    },
    filter: function (filter) {
        noteListDiv.innerHTML = '';
        noteDivs = {};

        filter.list.forEach(function (note) {
            var noteKey = note.getKey();
            var noteDiv = makeNoteDiv(note);

            if (activeNoteKey === noteKey) {
                noteDiv.classList.add('active-note');
            }

            noteListDiv.appendChild(noteDiv);
            noteDivs[noteKey] = noteDiv;
        });
    }
});
