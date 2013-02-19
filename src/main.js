var notes = require('./notes');

var noteViewDiv = document.querySelector('#noteviewcol');
var noteListDiv = document.querySelector('#notelistcol');
var searchbox = document.querySelector('#searchbox');

var autocompletedNote = null;
var activeNoteView = null;
var focusedNoteKey = null;

var clearActiveNote = function clearActiveNote() {
    var activeNoteDiv = document.querySelector('.active-notelistitem');
    
    if (activeNoteDiv) {
        activeNoteDiv.classList.remove('active-notelistitem');
    }
    
    noteViewDiv.innerHTML = '';
};

var makeActiveNote = function makeActiveNote(note, div) {
    clearActiveNote();
    
    div.classList.add('active-notelistitem');
    
    activeNoteView = makeNoteView(note, function update() {
        div.querySelector('.notelist-title').textContent = note.title;
        div.querySelector('.notelist-preview').textContent = note.contents.slice(0, 2048);
    });
    
    noteViewDiv.appendChild(activeNoteView);
};

var makeNoteView = function makeNoteView(note, updateCallback) {
    if (!updateCallback) updateCallback = function () {};

    var noteView = document.createElement('textarea');
    noteView.classList.add('note-view');
    noteView.value = note.contents;
    
    noteView.addEventListener('focus', function () {
        focusedNoteKey = note.getKey();
    });

    noteView.addEventListener('blur', function () {
        focusedNoteKey = null;
        
        note.contents = noteView.value;
        notes.update(note, function (err) {
            if (err) {
                console.log(err);
            } else {
                updateCallback();
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
        activeNoteView.focus();
    });
    
    return noteDiv;
};

var filterCallback = function filterCallback(filter) {
    noteListDiv.innerHTML = '';
    
    if (focusedNoteKey == null) {
        clearActiveNote();
    }
    
    autocompletedNote = null;
    
    filter.list.forEach(function (note) {
        var noteListItemDiv = makeNoteListItemDiv(note);
        
        if (note === filter.select) {
            autocompletedNote = note;
            makeActiveNote(note, noteListItemDiv);
            
            // Fill in the rest of the search input with the remaining characters in the first
            // note title that has the current query as a prefix (a very basic autocomplete)
            var inputLength = searchbox.value.length;
            searchbox.value += note.title.slice(inputLength);
            searchbox.setSelectionRange(inputLength, inputLength + note.title.length);
            setTimeout(function () {
                // Have to do it again to work around a 3-year-old Chromium bug...
                searchbox.setSelectionRange(inputLength, inputLength + note.title.length);
            }, 0);
        } else if (focusedNoteKey === note.getKey()) {
            noteListItemDiv.classList.add('active-notelistitem');
        }
        
        noteListDiv.appendChild(noteListItemDiv);
    });
};

searchbox.addEventListener('input', function (ev) {
    notes.filter(ev.target.value);
});

searchbox.addEventListener('keydown', function (ev) {
    if (ev.which === 13) { // Enter key
        ev.preventDefault();
        if (ev.target.value !== '') {
            if (autocompletedNote) {
                activeNoteView.focus();
            } else {
                notes.create(ev.target.value, function (err, filter) {
                    if (err) {
                        // TODO: Display user error
                        console.log(err);
                    } else {
                        filterCallback(filter);
                        activeNoteView.focus();
                    }
                });
            }
        }
    }
});

notes.init({
    init: function (err) {
        if (err) {
            console.log(err);
        }
    },
    filter: filterCallback
});
