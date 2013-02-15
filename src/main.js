var notes = require('./notes');

var activeNote = null;
var noteViewDiv = document.querySelector('#noteviewcol');
var noteListDiv = document.querySelector('#notelistcol');

var makeNoteView = function makeNoteView(note, updateCallback) {
    if (!updateCallback) updateCallback = function () {};

    var noteView = document.createElement('textarea');
    noteView.classList.add('note-view');
    noteView.value = note.contents;
    
    noteView.addEventListener('blur', function () {
        note.contents = noteView.value;
        notes.update(note, function (err) {
            if (err) {
                console.log(err);
            }
        });
    });
    
    noteView.addEventListener('input', function () {
        note.contents = noteView.value;
        updateCallback();
    });
    
    return noteView;
};

var makeNoteListItemDiv = function makeNoteListItemDiv(note) {
    var titleDiv = document.createElement('div');
    titleDiv.classList.add('notelist-title');
    titleDiv.textContent = note.title;
    
    var previewDiv = document.createElement('div');
    previewDiv.classList.add('notelist-preview');
    previewDiv.textContent = note.contents.slice(0, 4096);
    
    var noteDiv = document.createElement('div');
    noteDiv.classList.add('notelistitem');
    noteDiv.appendChild(titleDiv);
    noteDiv.appendChild(previewDiv);
    
    noteDiv.addEventListener('click', function () {
        if (note !== activeNote) {
            activeNote = note;

            var activeNoteDiv = document.querySelector('.active-notelistitem');
            if (activeNoteDiv) {
                activeNoteDiv.classList.remove('active-notelistitem');
            }
            
            this.classList.add('active-notelistitem');
            
            noteViewDiv.innerHTML = '';
            noteViewDiv.appendChild(makeNoteView(note, function update() {
                titleDiv.textContent = note.title;
                previewDiv.textContent = note.contents.slice(0, 4096);
            }));
        }
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
        var activeNotePresent = false;
        
        noteListDiv.innerHTML = '';
        
        filter.list.forEach(function (note) {
            var noteListItemDiv = makeNoteListItemDiv(note);
            
            if (note === activeNote) {
                activeNotePresent = true;
                noteListItemDiv.classList.add('active-notelistitem');
            }
            
            noteListDiv.appendChild(noteListItemDiv);
        });
        
        if (!activeNotePresent) {
            noteViewDiv.innerHTML = '';
        }
    }
});
