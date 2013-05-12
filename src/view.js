var _ = require('lodash')

var notes = require('./notes')
var pieces = require('./viewpieces')(document)

var noteViewDiv = document.querySelector('#noteviewcol')
var noteListDiv = document.querySelector('#notelistcol')
var searchbox = document.querySelector('#searchbox')

var activeNoteProto = {
    key: null,
    view: null,
    listItem: null,
    autocompleted: false,
    focused: false
}

var activeNote = null

var clearActiveNote = function clearActiveNote() {
    if (activeNote) {
        if (activeNote.listItem)
            activeNote.listItem.classList.remove('.active-notelistitem')
        if (activeNote.view)
            noteViewDiv.innerHTML = ''
    }
    
    activeNote = null
}

var makeActiveNote = function makeActiveNote(note, listItem) {
    clearActiveNote()
    
    activeNote = _.clone(activeNoteProto)
    
    activeNote.key = note.getKey()
    
    activeNote.listItem = listItem
    activeNote.listItem.classList.add('active-notelistitem')
    
    var updateCallback = function update() {
        listItem.querySelector('.notelist-title').textContent = note.title
        listItem.querySelector('.notelist-preview').textContent = note.contents.slice(0, 2048)
    }
    
    activeNote.view = pieces.makeNoteView(
        note,
        function focus() {
            activeNote.focused = true
        },
        function blur() {
            activeNote.focused = false
            
            note.contents = view.value
            notes.update(note, function (err) {
                if (err)
                    console.log(err)
                else
                    updateCallback()
            })
        },
        function input() {
            note.contents = view.value
            updateCallback()
        }
    )
    
    noteViewDiv.appendChild(activeNote.view)
}

var focusActiveNote = function focusActiveNote() {
    activeNote.view.focus()
    activeNote.focused = true
}

var filterCallback = function filterCallback(filter) {
    var activeNoteInFilter = false

    noteListDiv.innerHTML = ''
    
    filter.list.forEach(function (note) {
        var listItem = pieces.makeNoteListItem(
            note,
            function click() {
                makeActiveNote(note, listItem)
                focusActiveNote()
            }
        )
        
        if (note === filter.select) {
            makeActiveNote(note, listItem)
            activeNote.autocompleted = true
            activeNoteInFilter = true
            
            // Fill in the rest of the search input with the remaining characters in the first
            // note title that has the current query as a prefix (a very basic autocomplete)
            var inputLength = searchbox.value.length
            searchbox.value += note.title.slice(inputLength)
            searchbox.setSelectionRange(inputLength, inputLength + note.title.length)
            setTimeout(function () {
                // Have to do it again to work around a 3-year-old Chromium bug...
                searchbox.setSelectionRange(inputLength, inputLength + note.title.length)
            }, 0)
        } else if (activeNote && activeNote.key === note.getKey()) {
            listItem.classList.add('active-notelistitem')
            activeNoteInFilter = true
        }
        
        noteListDiv.appendChild(listItem)
    })
    
    if (!activeNoteInFilter)
        clearActiveNote()
}

searchbox.addEventListener('input', function (ev) {
    notes.filter(ev.target.value)
})

searchbox.addEventListener('keydown', function (ev) {
    if (ev.which === 13) { // Enter key
        ev.preventDefault()
        if (ev.target.value !== '')
            if (noteAutocompleted)
                focusActiveNote()
            else
                notes.create(ev.target.value, function (err, filter) {
                    if (err) {
                        console.log(err)
                    } else {
                        filterCallback(filter)
                        focusActiveNote()
                    }
                })
    }
})

notes.init({
    init: function (err) {
        if (err)
            console.log(err)
    },
    filter: filterCallback
})
