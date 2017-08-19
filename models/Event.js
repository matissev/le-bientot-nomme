var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Enquiry Model
 * =============
 */

var Event = new keystone.List('Event', {
	map: {name: 'title'},
	label: 'Évènements',
	autokey: {path: 'slug', from: 'title', unique: true}
});

var eventImageGallery = new keystone.Storage({
  adapter: keystone.Storage.Adapters.FS,
  fs: {
    path: 'data/imgs'
  },
});

Event.add({
	title: { type: String, required: true, label: 'Titre' },
	category: { type: Types.Relationship, ref: 'EventCategory', required: true, initial: false, label: 'Catégorie' },
	price: { type: Types.Money, currency: 'fr', format: '0.00 €', label: 'Prix' },
	startDate: {type: Types.Datetime, default: Date.now, format: 'MMM YYYY HH:mm', required: true, label: 'Date et horaire' },
	description: {type: Types.Html, wysiwyg: true, label: 'Description'},
	image: { type: Types.CloudinaryImage, autoCleanup : true, label: 'Image' },
});

Event.register();
