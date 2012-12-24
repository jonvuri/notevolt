var _ = require('lodash');

var config = require('./config');

var filter = {};

var query = '',
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

var sort = timeModifiedSort;

filter.all = function all(query, allNotes, callback) {
    var newFilterSet = {},
        newFilterList = [];
    
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

    _.each(allNotes, function (note, key) {
        if (note.test(query)) {
            newFilterSet[key] = note;
        }
    });
    
    newFilterList = _.sortBy(newFilterSet, sort);
    
    currentFilter.set = newFilterSet;
    currentFilter.list = newFilterList;
    
    callback(currentFilter);
};

filter.add = function add(note, callback) {
    var index;
    if (note.test(query)) {
        filterSet[note.key] = note;
        
        index = _.sortedIndex(filterList, note, sort);
        filterList.splice(index, 0, note);
    }
};

filter.remove = function remove(note, callback) {
    
};

module.exports = exports = filter;
