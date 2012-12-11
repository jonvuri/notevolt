var note_magic = require('../src/note_magic');

var assert = require('assert');
var _ = require('lodash');

var utf16le_buffer = new Buffer([0xFF, 0xFE, 0x34, 0x6C]);
var utf8_buffer = new Buffer([0xE6, 0xB0, 0xB4]);
