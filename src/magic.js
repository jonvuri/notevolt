var mmmagic = new (require('mmmagic').Magic);

var magic = {};

magic.stringOrNull = function stringOrNull(buffer, callback) {
    mmmagic.detect(buffer, function (err, magicStr) {
        if (err) {
            callback(null);
        } else if (magicStr.indexOf('UTF-8') !== -1 ||
                   magicStr.indexOf('ASCII') !== -1) {
            callback(buffer.toString('utf8'));
        } else if (magicStr.indexOf('Little-endian UTF-16') !== -1) {
            callback(buffer.toString('utf16le'));
        } else {
            callback(null);
        }
    });
};

module.exports = exports = magic;

