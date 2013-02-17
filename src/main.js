var notes = require('./notes');

var noteViewDiv = document.querySelector('#noteviewcol');
var noteListDiv = document.querySelector('#notelistcol');

var autocompletedNote = null;

var makeActiveNote = function makeActiveNote(note, div) {
    var activeNoteDiv = document.querySelector('.active-notelistitem');
    if (activeNoteDiv) {
        activeNoteDiv.classList.remove('active-notelistitem');
    }
    
    div.classList.add('active-notelistitem');
    
    noteViewDiv.innerHTML = '';
    noteViewDiv.appendChild(makeNoteView(note, function update() {
        titleDiv.textContent = note.title;
        previewDiv.textContent = note.contents.slice(0, 2048);
    }));
};

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
    previewDiv.textContent = note.contents.slice(0, 2048);
    
    var noteDiv = document.createElement('div');
    noteDiv.classList.add('notelistitem');
    noteDiv.appendChild(titleDiv);
    noteDiv.appendChild(previewDiv);
    
    noteDiv.addEventListener('click', function () {
        makeActiveNote(note, this);
    });
    
    return noteDiv;
};

var searchbox = document.querySelector('#searchbox');

searchbox.addEventListener('input', function (ev) {
    notes.filter(ev.target.value);
});

searchbox.addEventListener('keydown', function (ev) {
    if (ev.which === 13) { // Enter key
        if (autocompletedNote) {
            // Focus note view
        } else {
            // Create note
        }
    }
});

notes.init({
    init: function (err) {
        if (err) {
            console.log(err);
        }
    },
    filter: function (filter) {
        noteListDiv.innerHTML = '';
        noteViewDiv.innerHTML = '';
        
        autocompletedNote = null;
        
        filter.list.forEach(function (note) {
            var noteListItemDiv = makeNoteListItemDiv(note);
            
            if (note === filter.select) {
                autocompletedNote = note;
                makeActiveNote(note, noteListItemDiv);
                
                // Backspace is a problem
                var inputLength = searchbox.value.length;
                searchbox.value += note.title.slice(inputLength);
                setTimeout(function () {
                    searchbox.setSelectionRange(inputLength, inputLength + note.title.length);
                }, 0);
            }
            
            noteListDiv.appendChild(noteListItemDiv);
        });
    }
});
