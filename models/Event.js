var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Enquiry Model
 * =============
 */

var Event = new keystone.List('Event', {
	map: {name: 'title'},
	singular: 'Évènement',
	plural: 'Évènements',
	autokey: {path: 'slug', from: 'title', unique: true}
});

var eventImageGallery = new keystone.Storage({
  adapter: keystone.Storage.Adapters.FS,
  fs: {
    path: 'data/imgs'
  },
});

Event.add({
	title: {type: String, required: true},
	category: { type: Types.Relationship, ref: 'EventCategory', required: true, initial: false },
	price: { type: Types.Money, currency: 'fr', format: '0.00 €' },
	startDate: {type: Types.Datetime, default: Date.now, format: 'MMM YYYY HH:mm', required: true },
	description: {type: Types.Html, wysiwyg: true},
	image: { type: Types.CloudinaryImage, autoCleanup : true },
});

Event.register();
