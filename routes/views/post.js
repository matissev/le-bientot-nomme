var keystone = require('keystone'),
	Post = keystone.list('Post'),
	PageContact = keystone.list('PageContact');

var monthsNames = [
	'janvier',
	'février',
	'mars',
	'avril',
	'mai',
	'juin',
	'juillet',
	'août',
	'septembre',
	'octobre',
	'novembre',
	'décembre'
];

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'post';

	locals.filters = {
		post: req.params.post,
	};
	locals.data = {
		post: [],
		contact: []
	};

	// Load the current post
	view.on('init', function (next) {
		Post.model.findOne({
			state: 'publié',
			slug: locals.filters.post,
		}).populate('events').exec(function (err, post) {
			locals.data.post = post;
			next(err);
		});
	});

	view.on('init', function (next) {
		PageContact.model.find().exec(function(err, content) {
			locals.data.contact = content[0];
			next(err);
		});
	});

	// Render the view
	view.render('post');
};
