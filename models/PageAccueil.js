var keystone = require('keystone');
var middleware = require('../routes/middleware');
var Types = keystone.Field.Types;

/**
 * PageAccueil Model
 * =============
 */

var PageAccueil = new keystone.List('PageAccueil', {
	nocreate: true,
	nodelete: true,
	label: 'Accueil',
	singular: 'Accueil',
	plural: 'Accueil'
});

PageAccueil.add({
	name: { type: String, hidden: true, default: 'Accueil', label: 'Nom' },
	heading: { type: String, default: '', label: 'Phrase d\'introduction' },
	intro: { type: Types.Textarea, default: '', note: 'Ce texte servira d\'intro à la page d\'accueil' }
});

PageAccueil.schema.pre('validate', function(next) {
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

PageAccueil.defaultColumns = 'name';
PageAccueil.register();
