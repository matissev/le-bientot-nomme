var keystone = require('keystone');
var middleware = require('../routes/middleware');
var Types = keystone.Field.Types;

/**
 * PageLeprojet Model
 * =============
 */

var PageLeprojet = new keystone.List('PageLeprojet', {
	nocreate: true,
	nodelete: true,
	label: 'Le projet',
	singular: 'Le projet',
	plural: 'Le projet'
});

PageLeprojet.add({
	name: { type: String, hidden: true, default: 'Le projet', label: 'Nom' },
	intro: { type: Types.Textarea, default: '', note: 'Ce texte servira d\'intro à la page d\'PageLeprojet' }
});

PageLeprojet.schema.pre('validate', function(next) {
	var user = middleware.getAuthUser().name.first + ' ' + middleware.getAuthUser().name.last;

	// This allows the initialization of the database
	if (user === ' ') {
		next();
	}
	
	if(!middleware.getAuthUser().canManagePages) {
		next(new Error('Vous n\'avez pas les autorisations pour modifier les pages du site.'));
	}
	next();
});

PageLeprojet.defaultColumns = 'name';
PageLeprojet.register();
