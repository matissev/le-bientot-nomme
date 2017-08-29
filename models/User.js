var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User', {
	label: 'Utilisateurs',
	singular: 'Utilisateur'
});

User.add({
	name: { type: Types.Name, required: true, index: true, label: 'Nom' },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true, label: 'Mot de passe' },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Peu accéder à l\'interface administrateur', index: true },
	getsMessages: { type: Boolean, label: 'Reçoit les emails provenant du site', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
