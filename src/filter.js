var _ = require('lodash');

var config = require('./config');

var filter = {};

var currentQuery = '',
    currentFilter = {
        set: {},
        list: []
    };

var test = function test(note, query) {
    return note.indexOf(query) !== -1;
};

var timeModifiedSort = function timeModifiedSort(note) {
    // Sort more recent times (higher number) towards the start of the array
    return -note.timeModified;
};

// Sort function intended for _.sort* functions, not Array.sort
var sort = timeModifiedSort;

filter.all = function all(newQuery, allNotes, callback) {
    var newFilterSet = {},
        oldQuery = currentQuery;
    
    currentQuery = newQuery;

    // Set global query to new query
    // Check if existing query is prefix of new query
    // Split query on words
    // Add notes for words in both prefix and query
    // For remaining words, start iterations to indexOf in all notes
    // 
    // In each iteration:
    //  If query does not equal global query, exit and do not set set/list
    //  
    // Sort set into list
    // Set global set and global list, call callback

    if (newQuery === '') {
        newFilterSet = allNotes;
    } else {
        _.each(allNotes, function (note, key) {
            if (note.test(query)) {
                newFilterSet[key] = note;
            }
        });
    }
    
    currentFilter.set = newFilterSet;
    currentFilter.list = _.sortBy(newFilterSet, sort);
    
    callback(currentFilter);
};

filter.add = function add(note, callback) {
    var index;
    
    // Guard for if all filter is currently running?
    
    if (note.test(currentQuery)) {
        currentFilter.set[note.key] = note;
        
        index = _.sortedIndex(currentFilter.list, note, sort);
        currentFilter.list.splice(index, 0, note);
    }
};

filter.remove = function remove(note, callback) {
    var index;
    
    // Guard for if all filter is currently running?
    
    delete currentFilter.set[note.key];
    
    index = currentFilter.list.indexOf(note);
    if (index !== -1) {
        currentFilter.list.splice(index, 1);
    }
};

module.exports = exports = filter;
