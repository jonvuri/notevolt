var _ = require('lodash')

var config = require('./config')

var filter = {}

var currentQuery = '',
    currentTerms = {}, // Set of sets of notes that match each term (The term is the key for the outer set)
    currentFilter // Properties: set (hash of currently filtered notes), list (array of same), select (note to be autocompleted)

// Lowercased (So case-insensitive) contains test on note title and contents
var test = function test(note, query) {
    query = query.toLocaleLowerCase()
    return (note.title.toLocaleLowerCase().indexOf(query) !== -1)
        || (note.contents.toLocaleLowerCase().indexOf(query) !== -1)
}

var timeModifiedSort = function timeModifiedSort(note) {
    // Sort more recent times (higher number) towards the start of the array
    return -note.timeModified
}

// Sort function intended for _.sort* functions, not Array.sort
var sortFunc = timeModifiedSort

var splitQuery = function splitQuery(query) {
    var i,
        terms = [],
        quoteSplit = query.split('"'),
        spaceSplit = function spaceSplit(s) {
            var j, split = s.split(/\s+/)
            for (j = 0; j < split.length; j += 1)
                if (split[j] !== '')
                    terms.push(split[j])
        }
    
    if (quoteSplit.length > 2) {
        for (i = 0; i < quoteSplit.length - 1; i += 1)
            if (i % 2 === 0) // Even terms - outside quotes
                spaceSplit(quoteSplit[i])
            else if (quoteSplit[i] !== '') // Odd terms - inside quotes (but must not be empty)
                terms.push(quoteSplit[i])
        spaceSplit(quoteSplit[quoteSplit.length - 1]) // Last index won't be inside quotes, whether odd or even
    } else if (quoteSplit.length === 2) { // Only one quote
        spaceSplit(query.replace('"', ''))
    } else {
        spaceSplit(query)
    }
    
    return terms
}

var computeAutoComplete = function computeAutoComplete(filter, query) {
    var lowerQuery = query.toLocaleLowerCase()
    
    _.each(filter.list, function (note) {
        var lowerTitle = note.title.toLocaleLowerCase()

        if (lowerQuery === lowerTitle.substring(0, lowerQuery.length)) {
            filter.select = note
            return false
        }
    })
}

filter.all = function all(query, allNotes, callback) {
    var terms = {},
        filter = {}
    
    _.each(splitQuery(query), function (term) {
        var testTerm = function (note) {
            return test(note, term)
        }
        
        if (!terms[term])
            terms[term] = currentTerms[term] || _.pick(allNotes, testTerm)
    })
    
    filter.set = _.pick(allNotes, function (note, key) { return _.every(terms, key) })
    
    filter.list = _.sortBy(filter.set, sortFunc)
    
    // TODO: Find what NV does to determine whether or not to autocomplete
    if (query !== '' && query.length > currentQuery.length)
        computeAutoComplete(filter, query)
    
    currentQuery = query
    currentTerms = terms
    currentFilter = filter

    callback(currentFilter)
}

filter.add = function add(note, callback) {
    var key = note.getKey()

    // No matter what, we want to refresh its index in the list (or just leave it out)
    _.each(currentFilter.list, function (listNote, index) {
        if (listNote.getKey() === key) {
            currentFilter.list.splice(index, 1)
            return false
        }
    })
    
    var match = true
    
    _.each(currentTerms, function (termSet, term) {
        if (test(note, term))
            termSet[key] = note
        else
            match = false
    })
    
    if (match) {
        currentFilter.set[key] = note
        currentFilter.list.splice(_.sortedIndex(currentFilter.list, note, sortFunc), 0, note)
        
        // Recompute autocomplete
        if (currentQuery !== '')
            computeAutoComplete(currentFilter, currentQuery)
    } else {
        delete currentFilter.set[key]
        // It's already out of the list
    }
    
    callback(currentFilter)
}

filter.remove = function remove(note, callback) {
    var removed = false,
        key = note.getKey()
    
    _.each(currentTerms, function (termSet) { delete termSet[key] })
    
    delete currentFilter.set[key]
    
    _.each(currentFilter.list, function (listNote, index) {
        if (listNote === note) {
            currentFilter.list.splice(index, 1)
            removed = true
            return false
        }
    })

    if (removed)
        callback(currentFilter)
}

module.exports = exports = filter
