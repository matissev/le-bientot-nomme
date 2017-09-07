var keystone = require('keystone');
var middleware = require('../routes/middleware');
var Types = keystone.Field.Types;

/**
 * PageLesoin Model
 * =============
 */

var PageLesoin = new keystone.List('PageLesoin', {
	nocreate: true,
	nodelete: true,
	label: 'Le soin',
	singular: 'Le soin',
	plural: 'Le soin'
});

PageLesoin.add({
	name: { type: String, hidden: true, default: 'Le soin', label: 'Nom' },
	intro: { type: Types.Textarea, default: '', note: 'Ce texte servira d\'intro à la page d\'PageLesoin' }
});

PageLesoin.schema.pre('validate', function(next) {
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

PageLesoin.defaultColumns = 'name';
PageLesoin.register();
