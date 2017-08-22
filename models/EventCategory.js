var keystone = require('keystone');

/**
 * EventCategory Model
 * ==================
 */

var EventCategory = new keystone.List('EventCategory', {
	autokey: {
		from: 'name',
		path: 'key',
		unique: true,
	},
	label: 'Catégories',
	singular: 'Catégorie'
});

EventCategory.add({
	name: { type: String, required: true },
});

EventCategory.relationship({ ref: 'Event', path: 'events', refPath: 'category' });

EventCategory.register();
