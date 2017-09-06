// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': process.env.WEBSITE_NAME,
	'brand': process.env.WEBSITE_NAME,
	
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'pug',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'adminui custom styles': 'public/styles/admin.less',
	'cookie secret': process.env.COOKIE_SECRET,
	'cloudinary config': process.env.CLOUDINARY_URL
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	moment: require('moment'),
	env: keystone.get('env'),
	process: process,
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	news: 'posts',
	agenda: ['events', 'event-categories'],
	leLieu: ['professionals'],
	contact: 'enquiries',
	admin: 'users'
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();