var fs = require('fs');

fs.createReadStream('./custom_keystone/**/*.*').pipe(fs.createWriteStream('./node_modules/keystone/'));