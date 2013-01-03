var _ = require('lodash');

var config = require('./config');

var filter = {};

var lastQuery = null,
    lastFilter = null,
    currentQuery = '',
    currentFilter = {
        set: {},
        list: []
    };

var test = function test(note, query) {
    return (note.title.indexOf(query) !== -1) || (note.contents.indexOf(query) !== -1);
};

var timeModifiedSort = function timeModifiedSort(note) {
    // Sort more recent times (higher number) towards the start of the array
    return -note.timeModified;
};

// Sort function intended for _.sort* functions, not Array.sort
var sort = timeModifiedSort;

var sendFilter = function (callback) {
    currentFilter.list = _.sortBy(currentFilter.set, sort);
    callback(currentFilter);
};

filter.all = function all(newQuery, allNotes, callback) {
    lastQuery = currentQuery;
    currentQuery = newQuery;

    lastFilter = currentFilter;
    currentFilter = {
        set: {},
        list: []
    };

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

    if (currentQuery === '') {
        currentFilter.set = allNotes;
    } else {
        _.each(allNotes, function (note, key) {
            if (test(note, currentQuery)) {
                currentFilter.set[key] = note;
            }
        });
    }

    lastQuery = null;
    lastFilter = null;
    
    sendFilter(callback);
};

filter.add = function add(note, callback) {
    if (test(note, currentQuery)) {
        currentFilter.set[note.getKey()] = note;
    }
    
    sendFilter(callback);
};

filter.remove = function remove(note, callback) {
    delete currentFilter.set[note.getKey()];
    
    sendFilter(callback);
};

exports = filter;
