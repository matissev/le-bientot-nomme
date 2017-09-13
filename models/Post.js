var keystone = require('keystone');
var middleware = require('../routes/middleware');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	sortable: true,
	label: 'Articles',
	singular: 'Article',
	autokey: { path: 'slug', from: 'title', unique: true },
});

Post.add({
	title: { type: String, required: true, label: 'Titre' },
	description: { type: Types.Text, default: '', height: 50, label: 'Description', note: 'La description de l\'article doit faire au maximum 160 caractères (2 phrases courtes). Cette information ne sera pas visible sur le site mais reste très importante pour le référencement.' },
	state: { type: Types.Select, options: 'brouillon, publié, archivé', default: 'publié', index: true, label: 'État' },
	publishedDate: { type: Types.Date, index: true, default: Date.now(), dependsOn: { state: 'publié' }, label: 'Date de publication' },
	layout: { type: Types.Select, default: 'carré', options: 'carré, portrait, paysage', label: 'Format', note: 'Cette option permet de sélectionner l\'affichage des articles dans les pages « Accueil » et « Articles »', emptyOption: false },
	image: { type: Types.CloudinaryImage, label: 'Image' },
	imageDescription: { type: String, default: '', label: 'Description de l\'image', note: 'La description de l\'image doit faire au maximum 125 caractères. Cette information ne sera pas visible sur le site mais reste très importante pour le référencement.' },
	text: { type: Types.Html, wysiwyg: true, height: 400, label: 'Texte' },
	events: { type: Types.Relationship, ref: 'Event', many: true, label: 'Évènements liés' },
});

Post.schema.pre('remove', function(next) {
	if(!middleware.getAuthUser().canManagePosts) {
		next(new Error('Vous n\'avez pas les autorisations pour supprimer des articles.'));
	}
	next();
});

Post.schema.pre('validate', function(next) {
	if(!middleware.getAuthUser().canManagePosts) {
		next(new Error('Vous n\'avez pas les autorisations pour modifier les articles.'));
	}
	next();
});

Post.schema.pre('save', function(next) {
	var imageDescriptionOverflow = checkInputLength(this.imageDescription.length, 125);
	var postDescriptionOverflow = checkInputLength(this.description.length, 160);

	if (postDescriptionOverflow) {
		next(new Error('La description de l\'article dépasse de ' + postDescriptionOverflow + ' caractère(s)'));
	} else if(imageDescriptionOverflow) {
		next(new Error('La description de l\'image dépasse de ' + imageDescriptionOverflow + ' caractère(s)'));
	} else {
		next();
	}
});

function checkInputLength(stringLength, maxLength) {
	return stringLength >= maxLength ? stringLength - maxLength : null;
}

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();
