var _ = require('lodash');

var config = require('./config');

var filter = {};

var currentTerms = Object.create(null),
    currentFilter = {
        set: Object.create(null),
        list: [],
        select: null
    };

// Lowercased (So case-insensitive) contains test on note title and contents
var test = function test(note, query) {
    query = query.toLocaleLowerCase();
    return (note.title.toLocaleLowerCase().indexOf(query) !== -1)
        || (note.contents.toLocaleLowerCase().indexOf(query) !== -1);
};

var timeModifiedSort = function timeModifiedSort(note) {
    // Sort more recent times (higher number) towards the start of the array
    return -note.timeModified;
};

// Sort function intended for _.sort* functions, not Array.sort
var sortFunc = timeModifiedSort;

var splitQuery = function splitQuery(query) {
    var i,
        terms = [],
        quoteSplit = query.split('"'),
        spaceSplit = function spaceSplit(s) {
            var j, split = s.split(/\s+/);
            for (j = 0; j < split.length; j += 1) {
                if (split[j] !== '') {
                    terms.push(split[j]);
                }
            }
        };
    
    if (quoteSplit.length > 2) {
        for (i = 0; i < quoteSplit.length - 1; i += 1) {
            if (i % 2 === 0) { // Even terms - outside quotes
                spaceSplit(quoteSplit[i]);
            } else if (quoteSplit[i] !== '') { // Odd terms - inside quotes (but must not be empty)
                terms.push(quoteSplit[i]);
            }
        }
        spaceSplit(quoteSplit[quoteSplit.length - 1]); // Last index won't be inside quotes, whether odd or even
    } else if (quoteSplit.length === 2) { // Only one quote
        spaceSplit(query.replace('"', ''));
    } else {
        spaceSplit(query);
    }
    
    return terms;
};

filter.all = function all(query, allNotes, callback) {
    var newTerms = Object.create(null),
        newFilter = {};
    
    _.each(splitQuery(query), function (term) {
        if (!newTerms[term]) {
            newTerms[term] =
                currentTerms[term] // Reuse previously computed (and kept up-to-date) filter for this term, if any
                || _.reduce(allNotes, function (termSet, note, key) {
                        if (test(note, term)) {
                            termSet[key] = note;
                        }
                        return termSet;
                    }, Object.create(null));
        }
    });
    
    newFilter.set = _.pick(allNotes, function (note, key) {
        return _.every(newTerms, key);
    });
    
    newFilter.list = _.sortBy(newFilter.set, sortFunc);
    
    _.each(newFilter.list, function (note) {
        if (query === note.title.toLocaleLowerCase().substring(0, query.length)) {
            newFilter.select = note;
            return false;
        }
    });

    currentTerms = newTerms;
    currentFilter = newFilter;

    callback(currentFilter);
};

filter.add = function add(note, callback) {
    var added = false,
        key = note.getKey();

    _.each(currentTerms, function (termSet, term) {
        if (test(note, term)) {
            termSet[key] = note;
            if (!added) {
                added = true;
                currentFilter.set[key] = note;
                currentFilter.list.splice(_.sortedIndex(currentFilter.list, note, sortFunc), 0, note);
            }
        }
    });
    
    if (added) {
        callback(currentFilter);
    }
};

filter.remove = function remove(note, callback) {
    var removed = false,
        key = note.getKey();
    
    _.each(currentTerms, function (termSet) {
        delete termSet[key];
    });
    
    delete currentFilter.set[key];
    
    _.each(currentFilter.list, function (listNote, index) {
        if (listNote === note) {
            currentFilter.list.splice(index, 1);
            removed = true;
            return false;
        }
    });

    if (removed) {
        callback(currentFilter);
    }
};

module.exports = exports = filter;
