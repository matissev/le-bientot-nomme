var keystone = require('keystone');
var middleware = require('../routes/middleware');

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

EventCategory.schema.pre('remove', function(next) {
	if(!middleware.getAuthUser().canManageEvents) {
		next(new Error('Vous n\'avez pas les autorisations pour supprimer des catégories d\'évènements.'));
	}
	next();
});

EventCategory.schema.pre('validate', function(next) {
	if(!middleware.getAuthUser().canManageEvents) {
		next(new Error('Vous n\'avez pas les autorisations pour modifier les catégories d\'évènements.'));
	}
	next();
});

EventCategory.relationship({ ref: 'Event', path: 'events', refPath: 'category' });

EventCategory.register();
