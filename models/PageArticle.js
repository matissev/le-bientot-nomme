var keystone = require('keystone');
var middleware = require('../routes/middleware');
var Types = keystone.Field.Types;

/**
 * PageArticle Model
 * =============
 */

var PageArticle = new keystone.List('PageArticle', {
	nocreate: true,
	nodelete: true,
	label: 'Articles',
	singular: 'Articles',
	plural: 'Articles'
});

PageArticle.add({
	name: { type: String, hidden: true, default: 'Articles', label: 'Nom' },
	heading: { type: String, default: '', label: 'Phrase d\'introduction' },
	intro: { type: Types.Textarea, default: '', note: 'Ce texte servira d\'intro à la page d\'PageArticle' }
});

PageArticle.schema.pre('validate', function(next) {
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

PageArticle.defaultColumns = 'name';
PageArticle.register();
