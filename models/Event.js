var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Event Model
 * =============
 */

var Event = new keystone.List('Event', {
	map: {name: 'title'},
	label: 'Évènements',
	autokey: {path: 'slug', from: 'title', unique: true}
});

Event.add({
	title: { type: String, required: true, label: 'Titre' },
	category: { type: Types.Relationship, ref: 'EventCategory', required: true, initial: true, label: 'Catégorie' },
	price: { type: Types.Money, currency: 'fr', format: '0.00 €', label: 'Prix' },
	startDate: {type: Types.Datetime, default: Date.now, format: 'MMM YYYY HH:mm', required: true, label: 'Date & heure de début' },
	endDate: { type: Types.Datetime, default: Date.now, format: 'MMM YYYY HH:mm', required:true, label: 'Heure de fin' },
	brief: { type: Types.Text, wysiwyg: true, height: 100, label: 'Résumé' },
	description: {type: Types.Html, wysiwyg: true, height: 200, label: 'Description'},
	image: { type: Types.CloudinaryImage, autoCleanup : true, label: 'Image' }
});

Event.register();
