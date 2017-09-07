/**
 * This script automatically creates a default Admin user when an
 * empty database is used for the first time. You can use this
 * technique to insert data into any List you have defined.
 *
 * Alternatively, you can export a custom function for the update:
 * module.exports = function(done) { ... }
 */

require('dotenv').config();

exports.create = {
	User: [{
		name: 'Super Utilisateur',
		email: process.env.SUPERUSER_EMAIL,
		password: process.env.SUPERUSER_PASSWORD,
		isAdmin: true,
		getsMessages: false,
		canManageUsers: true,
		canManagePosts: true,
		canManageEvents: true,
		canManageProfessionals: true,
		canManageEnquiries: true,
		canManagePages: true
	}],
	PageAccueil: [{
		name: 'Accueil'
	}],
	PageContact: [{
		name: 'Contact'
	}],
	PageLesoin: [{
		name: 'Le soin'
	}],
	PageLeprojet: [{
		name: 'Le projet'
	}],
	PageArticle: [{
		name: 'Articles'
	}]
};

/*

// This is the long-hand version of the functionality above:

var keystone = require('keystone');
var async = require('async');
var User = keystone.list('User');

var admins = [
	{ email: 'user@keystonejs.com', password: 'admin', name: { first: 'Admin', last: 'User' } }
];

function createAdmin (admin, done) {

	var newAdmin = new User.model(admin);

	newAdmin.isAdmin = true;
	newAdmin.save(function (err) {
		if (err) {
			console.error('Error adding admin ' + admin.email + ' to the database:');
			console.error(err);
		} else {
			console.log('Added admin ' + admin.email + ' to the database.');
		}
		done(err);
	});

}

exports = module.exports = function (done) {
	async.forEach(admins, createAdmin, done);
};

*/
