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

	// 'ssl': 'force',
	// 'letsencrypt': (process.env.NODE_ENV === 'production') && {
	// 	email: process.env.MAIL_USER,
	// 	domains: ['www.' + process.env.DOMAIN_NAME_SHORT, process.env.DOMAIN_NAME_SHORT],
	// 	register: true,
	// 	tos: true
	// },

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'session store': 'mongo',
	'adminui custom styles': 'public/styles/admin.less',
	'cookie secret': process.env.COOKIE_SECRET,
	'cloudinary config': process.env.CLOUDINARY_URL,
	'signin logo': ['../images/logo.svg', 200, 100]
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

exports.create = {
	PageAgenda: [{
		name: 'Agenda'
	}]
};

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	pages: ['page-accueils', 'page-agendas', 'page-articles', 'page-lesoins', 'page-leprojets', 'page-contacts'],
	news: 'posts',
	agenda: ['events', 'event-categories'],
	leLieu: ['professionals'],
	contact: 'enquiries',
	admin: 'users'
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();