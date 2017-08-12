
/* ================================================================================ */
/* REQUIRES == REQUIRES == REQUIRES == REQUIRES == REQUIRES == REQUIRES == REQUIRES */
/* ================================================================================ */

var gulp = require('gulp'),
	fs = require('fs'),

	server = require('browser-sync').create(),
	nodemon = require('gulp-nodemon'),
	watch = require('gulp-watch'),
	plumber = require('gulp-plumber'),
	notify = require('gulp-notify'),
	sequence = require('run-sequence'),
	run = require('gulp-run'),

	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),

	imagemin = require('gulp-imagemin');


/* ==================================================================================== */
/* HELPERS == HELPERS == HELPERS == HELPERS == HELPERS == HELPERS == HELPERS == HELPERS */
/* ==================================================================================== */

var paths = {
	js : 'public/js', /* No file type is specified because of _compile.json */
	images : 'public/images',
	public : [
		'public/styles/**/*.*',
		'public/fonts/**/*.*',
		'public/images/**/*.*',
		'public/favicon.ico',
		'templates/**/*.pug'
	]
}

var onError = function(err) {
	notify.onError({
		title: 'Compilation error',
		message: '<%= error.message %>',
		sound: 'Tink'
	})(err);
	
	this.emit('end');
};


/* ======================================================================================= */
/* DEV TASKS == DEV TASKS == DEV TASKS == DEV TASKS == DEV TASKS == DEV TASKS == DEV TASKS */
/* ======================================================================================= */

gulp.task('mongo', function(){
	return gulp.src('.')
		.pipe(run('rm -r node_modules/keystone/admin/bundles/js/* &'))
		.pipe(run('mongod --dbpath ./data/db/ &'))
		.pipe(run('nodemon keystone.js &'));
});

gulp.task('nodemon', function(){
	var started = false;

	var stream = nodemon({
		script: 'keystone.js',
		verbose: true,
		ignore: [
			"templates/*",
			"public/*",
			"data/*",
			"gulpfile.js",
			"bower_components/*",
			"README.md",
			"bower.json",
			"package.json",
			".gitignore",
			"Procfile"
		],
		env: { 'NODE_ENV': 'development' }
	}).on('start', function() {
	}).on('crash', function() {
		console.error('Application has crashed!\n');
		notify({
			title: 'Application has crashed!',
			message: 'Restarting server in 5 seconds',
			sound: 'Tink'
		});
		stream.emit('restart', 5); // restart the server in 5 seconds 
    });
});

gulp.task('browser-sync', function() {
	server.init({
		proxy: 'http://localhost:3000',
		port: '4000'
	});
})

gulp.task('public', function() {
	return watch(paths.public, function () {
		return gulp.src(paths.public)
			.pipe(server.reload({stream: true}));
	});
});

gulp.task('js', function(){
	watch([paths.js + '/**/*.*', '!' + paths.js + '/**/*.min.js'], {ignoreInitial: false}, function () {
		var scripts = JSON.parse(fs.readFileSync(paths.js + '/_compile.json', { encoding: 'utf8' }));
		return scripts.forEach(function(obj){
			return gulp.src(obj.src)
				.pipe(plumber({errorHandler: onError}))
				.pipe(sourcemaps.init())
				.pipe(concat(obj.name))
				.pipe(sourcemaps.write())
				.pipe(gulp.dest(paths.js))
				.pipe(server.reload({stream: true}));
		});
	});
});


/* ============================================================================================== */
/* DIST TASKS == DIST TASKS == DIST TASKS == DIST TASKS == DIST TASKS == DIST TASKS == DIST TASKS */
/* ============================================================================================== */

gulp.task('js-dist', function() {
	var scripts = JSON.parse(fs.readFileSync(paths.js + '/_compile.json', { encoding: 'utf8' }));

	return scripts.forEach(function(obj){
		return gulp.src(obj.src)
			.pipe(concat(obj.name))
			.pipe(uglify())
			.pipe(gulp.dest(paths.js));
	});
});

gulp.task('imagemin', function(){
	return gulp.src(paths.images + '/**/*.*')
		.pipe(imagemin({
			multipass: true,
			interlaced: true,
			optimizationLevel: 9,
			svgoPlugins: [
				{ removeViewBox: true },
				{ removeUselessStrokeAndFill: true },
				{ removeEmptyAttrs: true }
			]
		}))
		.pipe(gulp.dest(paths.images))
});

gulp.task('images-dist', ['imagemin'], function() {
	return gulp.src('.')
		.pipe(run('imageOptim -j -a -q -d ' + paths.images + '/'));
});

gulp.task('done', function() {
	return gulp.src('.')
		.pipe(run('open -a iterm'))
		.pipe(notify({
			title: 'Compilation completed',
			message: 'Your distribution folder is now ready',
			sound: 'Tink'
		}));
});


/* ==================================================================================== */
/* GLOBALS == GLOBALS == GLOBALS == GLOBALS == GLOBALS == GLOBALS == GLOBALS == GLOBALS */
/* ==================================================================================== */

gulp.task('default', function(callback) {
	sequence(
		'mongo',
		'nodemon',
		'browser-sync',
		['js', 'public'],
	callback);
});

gulp.task('dist', function(callback) {
	sequence(
		['js-dist', 'images-dist'],
		'done',
	callback);
});
