var keystone = require('keystone');
var middleware = require('../routes/middleware');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User', {
	label: 'Utilisateurs',
	singular: 'Utilisateur'
});

User.add(
	{ name: { type: Types.Name, required: true, index: true, label: 'Nom' } },
	{ email: { type: Types.Email, initial: true, required: true, unique: true, index: true } },
	{ password: { type: Types.Password, initial: true, required: true, label: 'Mot de passe' } },
	'Administration',
	{ isAdmin: { type: Boolean, label: 'Peut accéder à l\'interface administrateur', index: true } },
	{ getsMessages: { type: Boolean, label: 'Reçoit les emails provenant du site', index: true } },
	{ canManageUsers: { type: Boolean, label: 'Peut ajouter/modifier/supprimer les administrateurs du site', index: true, dependsOn: { isAdmin: true } } },
	{ heading: 'Permissions', dependsOn: { isAdmin: true } },
	{ canManagePosts: { type: Boolean, label: 'Peut ajouter/modifier/supprimer des articles du blog', index: true, dependsOn: { isAdmin: true, canManageUsers: false } } },
	{ canManageEvents: { type: Boolean, label: 'Peut ajouter/modifier/supprimer des évènements de l\'agenda', index: true, dependsOn: { isAdmin: true, canManageUsers: false } } },
	{ canManageProfessionals: { type: Boolean, label: 'Peut ajouter/modifier/supprimer des professionnels de la page lieu', index: true, dependsOn: { isAdmin: true, canManageUsers: false } } },
	{ canManageEnquiries: { type: Boolean, label: 'Peut gérer/supprimer les demandes provenant du site (page contact)', index: true, dependsOn: { isAdmin: true, canManageUsers: false } } },
	{ canManagePages: { type: Boolean, label: 'Peut modifier les différentes pages du site', index: true, dependsOn: { isAdmin: true, canManageUsers: false } } }
);

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

User.schema.pre('remove', function(next) {
	var user = middleware.getAuthUser().name.first + ' ' + middleware.getAuthUser().name.last;
	if(!middleware.getAuthUser().canManageUsers) {
		next(new Error('Vous n\'avez pas les autorisations pour supprimer des utilisateurs.'));
	} else if (this.name.first + ' ' + this.name.last === 'Super Utilisateur') {
		next(new Error('Vous ne pouvez pas supprimer le super utilisateur.'));
	}
	next();
});

User.schema.pre('validate', function(next) {
	var user = middleware.getAuthUser().name.first + ' ' + middleware.getAuthUser().name.last;

	// This allows the initialization of the database
	if (user === ' ') {
		next();
	}

	if(!middleware.getAuthUser().canManageUsers) {
		next(new Error('Vous n\'avez pas les autorisations pour modifier les utilisateurs.'));
	} else if (this.name.first + ' ' + this.name.last === 'Super Utilisateur' && user !== 'Super Utilisateur') {
		next(new Error('Vous ne pouvez pas modifier le super utilisateur.'));
	}
	next();
});

User.schema.pre('save', function(next) {
	if(this.isAdmin && this.canManageUsers) {
		this.canManagePosts = true;
		this.canManageEvents = true;
		this.canManageProfessionals = true;
		this.canManageEnquiries = true;
		this.canManagePages = true;
	} else if (!this.isAdmin) {
		this.canManageUsers = false;
		this.canManagePosts = false;
		this.canManageEvents = false;
		this.canManageProfessionals = false;
		this.canManageEnquiries = false;
		this.canManagePages = false;
	}
	next();
});


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
