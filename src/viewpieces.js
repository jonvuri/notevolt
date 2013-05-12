module.exports = exports = function (doc) {
	var viewpieces = {}
	
	viewpieces.makeNoteView = function makeNoteView(note, focus, blur, input) {
		var noteView = doc.createElement('textarea')
		noteView.classList.add('note-view')
		noteView.value = note.contents
		noteView.addEventListener('focus', focus)
		noteView.addEventListener('blur', blur)
		noteView.addEventListener('input', input)
		return noteView
	}
	
	viewpieces.makeNoteListItem = function makeNoteListItem(note, click) {
		var title = doc.createElement('div')
		title.classList.add('notelist-title')
		title.textContent = note.title
		
		var preview = doc.createElement('div')
		preview.classList.add('notelist-preview')
		preview.textContent = note.contents.slice(0, 2048)
		
		var noteListItem = doc.createElement('div')
		noteListItem.classList.add('notelistitem')
		noteListItem.appendChild(title)
		noteListItem.appendChild(preview)
		
		noteListItem.addEventListener('click', click)
		
		return noteListItem
	}
	
	return viewpieces
}