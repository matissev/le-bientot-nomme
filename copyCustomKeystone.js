var fs = require('fs');
var glob = require("glob");
 
// options is optional 
glob('./custom_keystone/**/*.*', function (er, files) {
	files.forEach(function(file) {
		var output = file.replace('./custom_keystone', './node_modules/keystone');
		fs.createReadStream(file).pipe(fs.createWriteStream(output));
	});
});