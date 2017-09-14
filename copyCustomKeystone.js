var path = require('path');
var fs = require('fs');
var glob = require("glob");
 
// options is optional 
glob('./custom_keystone/**/*.*', function (er, files) {
	files.forEach(function(file) {
		var output = file.replace('./custom_keystone', './node_modules/keystone');
		ensureDirectoryExistence(output);
		fs.createReadStream(file).pipe(fs.createWriteStream(output));
	});
});

function ensureDirectoryExistence(filePath) {
	var dirname = path.dirname(filePath);
	if (fs.existsSync(dirname)) {
		return true;
	}
	ensureDirectoryExistence(dirname);
	fs.mkdirSync(dirname);
}