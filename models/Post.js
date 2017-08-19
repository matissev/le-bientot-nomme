var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	sortable: true,
	autokey: { path: 'slug', from: 'title', unique: true },
});

Post.add({
	title: { type: String, required: true, label: 'Titre' },
	state: { type: Types.Select, options: 'brouillon, publié, archivé', default: 'publié', index: true, label: 'État' },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'publié' } },
	image: { type: Types.CloudinaryImage, label: 'Image' },
	brief: { type: Types.Html, wysiwyg: true, height: 150, label: 'Résumé' },
	text: { type: Types.Html, wysiwyg: true, height: 400, label: 'Description' },
	events: { type: Types.Relationship, ref: 'Event', many: true, label: 'Évènements liés' },
});

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();
