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
	name: { type: String, noedit: true, default: 'Le projet', label: 'Nom' },
	description: { type: Types.Text, default: '', height: 50, label: 'Description', note: 'La description de l\'article doit faire au maximum 160 caractères (2 phrases courtes). Cette information ne sera pas visible sur le site mais reste très importante pour le référencement.' },
	intro: { type: Types.Textarea, default: '', note: 'Ce texte servira d\'intro à la page du projet' }
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

	var descriptionOverflow = checkInputLength(this.description.length, 160);
	
	if (descriptionOverflow) {
		next(new Error('La description dépasse de ' + descriptionOverflow + ' caractère(s)'));
	}

	next();
});

function checkInputLength(stringLength, maxLength) {
	return stringLength >= maxLength ? stringLength - maxLength : null;
}

PageLeprojet.defaultColumns = 'name';
PageLeprojet.register();
