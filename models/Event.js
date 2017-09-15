var keystone = require('keystone');
var middleware = require('../routes/middleware');
var Types = keystone.Field.Types;

/**
 * Event Model
 * =============
 */

var Event = new keystone.List('Event', {
	map: {name: 'title'},
	label: 'Évènements',
	singular: 'Évènement',
	autokey: {path: 'slug', from: 'title', unique: true}
});

Event.add({
	title: { type: String, required: true, label: 'Titre' },
	description: { type: Types.Text, default: '', height: 50, label: 'Description de l\'évènement', note: 'La description de l\'évènement doit faire au maximum 160 caractères (2 phrases courtes). Cette information ne sera pas visible sur le site mais reste très importante pour le référencement.' },
	image: { type: Types.CloudinaryImage, autoCleanup : true, label: 'Image' },
	imageDescription: { type: String, default: '', label: 'Description de l\'image', note: 'La description de l\'image doit faire au maximum 125 caractères. Cette information ne sera pas visible sur le site mais reste très importante pour le référencement.' },
	category: { type: Types.Relationship, ref: 'EventCategory', required: true, initial: true, label: 'Catégorie' },
	price: { type: String, label: 'Prix', default: '', note:'Si ce champs est laissé vide, l\'évènement sera affiché comme étant GRATUIT.' },
	status: { type: Types.Select, default: 'Places disponibles', options: 'Places disponibles, Complet', label: 'Disponibilité'},
	startDate: {type: Types.DatetimeFr, default: Date.now, required: true, label: 'Date & heure de début' },
	endDate: { type: Types.DatetimeFr, default: Date.now, required:true, label: 'Heure de fin' },
	text: {type: Types.Text, wysiwyg: true, height: 200, label: 'Texte' }
});

Event.schema.pre('remove', function(next) {
	if(!middleware.getAuthUser().canManageEvents) {
		next(new Error('Vous n\'avez pas les autorisations pour supprimer des évènements.'));
	}
	next();
});

Event.schema.pre('validate', function(next) {
	if(!middleware.getAuthUser().canManageEvents) {
		next(new Error('Vous n\'avez pas les autorisations pour modifier les évènements.'));
	}
	next();
});

Event.schema.pre('save', function(next) {
	var eventDescriptionOverflow = checkInputLength(this.description.length, 160);
	var imageDescriptionOverflow = checkInputLength(this.imageDescription.length, 125);
	var priceError = false;

	if (validatePrice(this.price)) {
		this.price = formatPrice(this.price);
	} else {
		priceError = true;
	}

	this.endDate = new Date(
		this.startDate.getFullYear(),
		this.startDate.getMonth(),
		this.startDate.getDate(),
		this.endDate.getHours(),
		this.endDate.getMinutes(),
		0
	);

	if (eventDescriptionOverflow) {
		next(new Error('La description de l\'évènement dépasse de ' + eventDescriptionOverflow + ' caractère(s)'));
	} else if(imageDescriptionOverflow) {
		next(new Error('La description de l\'image dépasse de ' + imageDescriptionOverflow + ' caractère(s)'));
	} else if(priceError) {
		next(new Error('Le prix est invalide'));
	} else {
		next();
	}
});

function checkInputLength(stringLength, maxLength) {
	return stringLength >= maxLength ? stringLength - maxLength : null;
}

function validatePrice(priceString) {
	var priceRegex = /^\s*[0-9]+([,|.][0-9]{1,2})?\s*(€|\s)*$/g;
	var empty = /^\s*$/;
	return priceRegex.test(priceString) || empty.test(priceString);
}

function formatPrice(priceString) {
	var priceFormat = /[0-9]+([,|.][0-9][0-9]?)*/g;
	var empty = /^\s*$/;

	if (empty.test(priceString)) {
		return '';
	} else {
		return priceString.match(priceFormat)[0].replace(/\./, ',').replace(/[0-9],[0-9](?![0-9])/, '$&0');
	}
}

Event.register();
