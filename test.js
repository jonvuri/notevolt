var fs = require('fs');

fs.readdir('./notes', function (err, files) {
	console.log('err type: ' + typeof err);
	if (typeof files !== 'undefined') {
		files.forEach(function (file_path) { console.log(file_path); });
	} else {
		console.log('Directory does not exist!');
	}
});
