var gulp = require('gulp');
	watch = require('gulp-watch'),
	exec = require('child_process').exec,
	server = require('browser-sync').create();

var paths = ['./public/**/*.*', './templates/**/*.pug', './models/**/*.js','./routes/**/*.js', 'keystone.js'];



function runCommand(command) {
  return function (cb) {
    exec(command, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  }
}
gulp.task('mongo', runCommand('mongod --dbpath ./data/db/')); //Running mongo

gulp.task('keystone', runCommand('node keystone.js')); //https://stackoverflow.com/a/28048696/46810
  // del.sync(['node_modules/keystone/admin/bundles/js/**', '!node_modules/keystone/admin/bundles/js']);



gulp.task('browser-sync', function(){
	server.init({
		proxy: 'http://localhost:3000',
		port: '4000'
	});
});



gulp.task('watch', function() {
    return watch(paths, function () {
    	gulp.src(paths)
        	.pipe(server.stream(paths));
    });
});


gulp.task('default', ['mongo', 'keystone', 'browser-sync', 'watch']);