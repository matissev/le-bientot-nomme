var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Utilisateur Model
 * ==========
 */
var Utilisateur = new keystone.List('Utilisateur');

Utilisateur.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
Utilisateur.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});


/**
 * Relationships
 */
Utilisateur.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */
Utilisateur.defaultColumns = 'name, email, isAdmin';
Utilisateur.register();
